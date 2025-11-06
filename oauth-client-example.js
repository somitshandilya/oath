/**
 * OAuth 2.0 Client Example for Drupal 11
 * 
 * This example demonstrates how to authenticate with Drupal using OAuth 2.0
 * and make authenticated API requests.
 * 
 * Prerequisites:
 * - Node.js installed
 * - npm packages: axios, express, dotenv
 * 
 * Installation:
 * npm install axios express dotenv
 */

const axios = require('axios');
const express = require('express');
const session = require('express-session');
require('dotenv').config();

// Configuration
const DRUPAL_URL = process.env.DRUPAL_URL || 'http://localhost/oath';
const CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'your_client_id';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || 'your_client_secret';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';

const app = express();

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

/**
 * Step 1: Redirect user to Drupal authorization endpoint
 */
app.get('/login', (req, res) => {
  const authorizationUrl = new URL(`${DRUPAL_URL}/oauth/authorize`);
  authorizationUrl.searchParams.append('client_id', CLIENT_ID);
  authorizationUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authorizationUrl.searchParams.append('response_type', 'code');
  authorizationUrl.searchParams.append('scope', 'openid profile email');
  
  res.redirect(authorizationUrl.toString());
});

/**
 * Step 2: Handle callback from Drupal
 */
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.status(400).send(`Authorization error: ${error}`);
  }
  
  if (!code) {
    return res.status(400).send('No authorization code received');
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(`${DRUPAL_URL}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store tokens in session
    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;
    req.session.expiresIn = tokenResponse.data.expires_in;
    
    console.log('✓ Successfully obtained access token');
    console.log(`Token expires in: ${tokenResponse.data.expires_in} seconds`);
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).send('Failed to exchange authorization code for token');
  }
});

/**
 * Step 3: Make authenticated API requests
 */
app.get('/profile', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/login');
  }
  
  try {
    const userResponse = await axios.get(`${DRUPAL_URL}/jsonapi/user/user/me`, {
      headers: {
        'Authorization': `Bearer ${req.session.accessToken}`,
        'Accept': 'application/vnd.api+json',
      },
    });
    
    const user = userResponse.data.data;
    res.json({
      message: 'Successfully retrieved user profile',
      user: {
        id: user.id,
        name: user.attributes.name,
        email: user.attributes.mail,
      },
    });
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        await refreshAccessToken(req);
        return res.redirect('/profile');
      } catch (refreshError) {
        return res.redirect('/login');
      }
    }
    
    console.error('API request error:', error.response?.data || error.message);
    res.status(500).send('Failed to retrieve user profile');
  }
});

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(req) {
  if (!req.session.refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const tokenResponse = await axios.post(`${DRUPAL_URL}/oauth/token`, {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: req.session.refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;
    req.session.expiresIn = tokenResponse.data.expires_in;
    
    console.log('✓ Successfully refreshed access token');
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Logout - revoke token
 */
app.get('/logout', async (req, res) => {
  if (req.session.accessToken) {
    try {
      await axios.post(`${DRUPAL_URL}/oauth/revoke`, {
        token: req.session.accessToken,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('✓ Successfully revoked access token');
    } catch (error) {
      console.error('Token revocation error:', error.response?.data || error.message);
    }
  }
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/');
  });
});

/**
 * Home page
 */
app.get('/', (req, res) => {
  if (req.session.accessToken) {
    res.send(`
      <h1>OAuth 2.0 Client Example</h1>
      <p>You are logged in!</p>
      <ul>
        <li><a href="/profile">View Profile</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    `);
  } else {
    res.send(`
      <h1>OAuth 2.0 Client Example</h1>
      <p>Not logged in</p>
      <a href="/login">Login with Drupal</a>
    `);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OAuth Client running on http://localhost:${PORT}`);
  console.log(`Drupal URL: ${DRUPAL_URL}`);
  console.log(`Client ID: ${CLIENT_ID}`);
});
