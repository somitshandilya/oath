# OAuth 2.0 Setup Guide for Drupal 11

This guide walks through setting up OAuth 2.0 in Drupal 11 using the `simple_oauth` module.

## Prerequisites

- Drupal 11 installed
- `simple_oauth` module installed (already in composer.json)
- RSA keys generated (already in `/keys` directory)
- Database access

## Step 1: Enable the Simple OAuth Module

Run the following Drush command:

```bash
drush pm:enable simple_oauth
```

Or enable via UI:
1. Go to **Admin > Extend**
2. Search for "Simple OAuth"
3. Check the box next to "Simple OAuth (OAuth2 Server)"
4. Click **Install**

## Step 2: Configure OAuth Settings

### Via Drush:

```bash
drush config:set simple_oauth.settings public_key '../keys/public.key'
drush config:set simple_oauth.settings private_key '../keys/private.key'
```

### Via UI:

1. Go to **Admin > Configuration > Development > OAuth2 Server**
2. Set the following:
   - **Public Key Path**: `../keys/public.key`
   - **Private Key Path**: `../keys/private.key`
3. Click **Save**

## Step 3: Create OAuth Clients

OAuth clients represent applications that will authenticate with your Drupal site.

### Via Drush:

```bash
drush entity:create oauth2_client --label="My App" --redirect_uris="http://localhost:3000/callback"
```

### Via UI:

1. Go to **Admin > Structure > OAuth2 Clients**
2. Click **Add OAuth2 Client**
3. Fill in:
   - **Label**: Your application name
   - **Redirect URIs**: The callback URL(s) for your app (e.g., `http://localhost:3000/callback`)
   - **Grant Types**: Select appropriate types (Authorization Code, Implicit, etc.)
4. Click **Save**

The system will generate:
- **Client ID**: Use this in your app
- **Client Secret**: Keep this secure (only shown once)

## Step 4: Create OAuth Users/Roles

Create users with appropriate roles that will use OAuth:

```bash
drush user:create oauth_user --mail="oauth@example.com" --password="password123"
drush user:role:add editor oauth_user
```

## Step 5: Configure API Endpoints

Simple OAuth exposes the following endpoints:

- **Authorization Endpoint**: `/oauth/authorize`
- **Token Endpoint**: `/oauth/token`
- **Revoke Endpoint**: `/oauth/revoke`

### Enable REST API (if needed):

```bash
drush pm:enable restui
```

Then configure REST resources at **Admin > Configuration > Web services > REST**

## Step 6: Test OAuth Flow

### Authorization Code Flow (Recommended for web apps):

1. Redirect user to:
```
http://your-drupal-site/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
```

2. User logs in and grants permission
3. Redirected back with authorization code
4. Exchange code for token via POST to `/oauth/token`:

```bash
curl -X POST http://your-drupal-site/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=AUTH_CODE&redirect_uri=http://localhost:3000/callback"
```

### Client Credentials Flow (For server-to-server):

```bash
curl -X POST http://your-drupal-site/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&scope=openid"
```

## Step 7: Use Access Token

Include the access token in API requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://your-drupal-site/jsonapi/user/user
```

## Key Configuration Files

- **Settings**: `web/sites/default/settings.php` (OAuth key paths)
- **Module**: `web/modules/contrib/simple_oauth/`
- **Keys**: `keys/` directory (private.key, public.key)

## Troubleshooting

### Keys not found error:
- Ensure `keys/` directory exists and is readable
- Verify paths in OAuth settings are correct

### CORS issues:
- Configure CORS in `web/sites/default/settings.php`:
```php
$settings['cors.default_credentials'] = TRUE;
```

### Token validation fails:
- Verify RSA keys are valid
- Check key paths in OAuth configuration
- Ensure keys have correct permissions (readable by web server)

## Security Best Practices

1. **Keep private key secure** - Never expose in version control
2. **Use HTTPS** - Always use HTTPS in production
3. **Rotate keys periodically** - Regenerate RSA keys annually
4. **Validate redirect URIs** - Only allow trusted callback URLs
5. **Use strong client secrets** - Generate cryptographically secure secrets
6. **Scope limitation** - Request only necessary scopes
7. **Token expiration** - Set appropriate token lifetimes

## Additional Resources

- [Simple OAuth Module Documentation](https://www.drupal.org/project/simple_oauth)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [Drupal REST API Guide](https://www.drupal.org/docs/drupal-apis/rest-api)
