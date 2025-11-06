# OAuth 2.0 Quick Reference Guide

## Quick Start Commands

### 1. Enable OAuth Module
```bash
drush pm:enable simple_oauth
```

### 2. Configure OAuth Keys
```bash
drush config:set simple_oauth.settings public_key '../keys/public.key'
drush config:set simple_oauth.settings private_key '../keys/private.key'
```

### 3. Clear Cache
```bash
drush cache:rebuild
```

## OAuth Client Management

### Create a New OAuth Client
```bash
drush entity:create oauth2_client \
  --label="My Application" \
  --redirect_uris="http://localhost:3000/callback"
```

### List All OAuth Clients
```bash
drush entity:list oauth2_client
```

### View Specific OAuth Client
```bash
drush entity:load oauth2_client CLIENT_ID
```

### Delete OAuth Client
```bash
drush entity:delete oauth2_client CLIENT_ID
```

## OAuth Endpoints

### Authorization Endpoint
```
GET /oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE
```

### Token Endpoint
```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=AUTH_CODE&redirect_uri=REDIRECT_URI
```

### Revoke Endpoint
```
POST /oauth/revoke
Content-Type: application/x-www-form-urlencoded

token=ACCESS_TOKEN
```

## Common OAuth Flows

### Authorization Code Flow (Web Apps)

**Step 1: Get Authorization Code**
```bash
# Redirect user to this URL
https://your-drupal-site/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
```

**Step 2: Exchange Code for Token**
```bash
curl -X POST https://your-drupal-site/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=http://localhost:3000/callback"
```

**Step 3: Use Access Token**
```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  https://your-drupal-site/jsonapi/user/user
```

### Client Credentials Flow (Server-to-Server)

```bash
curl -X POST https://your-drupal-site/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=openid"
```

### Refresh Token Flow

```bash
curl -X POST https://your-drupal-site/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=REFRESH_TOKEN"
```

## User Management for OAuth

### Create OAuth User
```bash
drush user:create oauth_user --mail="user@example.com" --password="password123"
```

### Assign Role to User
```bash
drush user:role:add editor oauth_user
```

### List Users
```bash
drush user:list
```

## Troubleshooting Commands

### Check OAuth Module Status
```bash
drush pm:list | grep oauth
```

### View OAuth Configuration
```bash
drush config:get simple_oauth.settings
```

### Verify Keys Exist
```bash
# Linux/Mac
ls -la keys/

# Windows PowerShell
Get-Item keys/
```

### Test Token Endpoint
```bash
curl -v -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=TEST&client_secret=TEST"
```

### Check Drupal Logs
```bash
drush watchdog:show
```

## Scopes

Common OAuth scopes:
- `openid` - OpenID Connect scope
- `profile` - User profile information
- `email` - User email address
- `offline_access` - Refresh token access

## Common Issues & Solutions

### Issue: "Keys not found"
**Solution**: Verify key paths in OAuth settings
```bash
drush config:get simple_oauth.settings
```

### Issue: "CORS error"
**Solution**: Add to settings.php:
```php
$settings['cors.default_credentials'] = TRUE;
```

### Issue: "Invalid client credentials"
**Solution**: Verify client ID and secret match in database
```bash
drush entity:load oauth2_client CLIENT_ID
```

### Issue: "Redirect URI mismatch"
**Solution**: Ensure redirect URI in request matches configured URI exactly

## Security Checklist

- [ ] Private key is not in version control
- [ ] Using HTTPS in production
- [ ] Client secrets are strong and unique
- [ ] Redirect URIs are validated
- [ ] Token expiration times are set appropriately
- [ ] CORS is properly configured
- [ ] Only necessary scopes are requested
- [ ] Logs are monitored for suspicious activity
