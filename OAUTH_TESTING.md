# OAuth 2.0 Testing Guide for Drupal 11

This guide provides step-by-step instructions for testing OAuth 2.0 functionality.

## Prerequisites

- Drupal 11 with Simple OAuth module enabled
- OAuth client created with credentials
- cURL or Postman installed
- Text editor for storing credentials

## Test 1: Verify OAuth Module is Enabled

```bash
drush pm:list | grep oauth
```

Expected output should show `simple_oauth` as enabled.

## Test 2: Verify OAuth Configuration

```bash
drush config:get simple_oauth.settings
```

Expected output should show paths to public and private keys.

## Test 3: List OAuth Clients

```bash
drush entity:list oauth2_client
```

This will display all configured OAuth clients with their IDs.

## Test 4: Create a Test OAuth Client

```bash
drush entity:create oauth2_client \
  --label="Test Client" \
  --redirect_uris="http://localhost:3000/callback"
```

Save the generated Client ID and Client Secret.

## Test 5: Test Authorization Endpoint

### Using Browser

Navigate to:
```
http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
```

Expected behavior:
1. Redirected to Drupal login page (if not logged in)
2. After login, shown consent screen
3. After granting permission, redirected to callback URL with authorization code

### Using cURL

```bash
curl -v "http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid"
```

## Test 6: Test Token Endpoint (Authorization Code Flow)

First, get an authorization code from Test 5.

```bash
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=YOUR_AUTH_CODE" \
  -d "redirect_uri=http://localhost:3000/callback"
```

Expected response:
```json
{
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Test 7: Test Client Credentials Flow

```bash
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=openid"
```

Expected response: Same as Test 6 (access token)

## Test 8: Use Access Token to Call API

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/vnd.api+json" \
  http://localhost/oath/jsonapi/user/user/me
```

Expected response: Current user information in JSON:API format

## Test 9: Test Refresh Token

```bash
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

Expected response: New access token and refresh token

## Test 10: Test Token Revocation

```bash
curl -X POST http://localhost/oath/oauth/revoke \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=YOUR_ACCESS_TOKEN"
```

Expected response: HTTP 200 (empty body)

Verify token is revoked by trying to use it:
```bash
curl -H "Authorization: Bearer YOUR_REVOKED_TOKEN" \
  http://localhost/oath/jsonapi/user/user/me
```

Expected: HTTP 401 Unauthorized

## Test 11: Test Invalid Credentials

```bash
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=INVALID_ID" \
  -d "client_secret=INVALID_SECRET"
```

Expected response: HTTP 401 with error message

## Test 12: Test Invalid Redirect URI

```bash
curl -v "http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://evil.com/callback&response_type=code"
```

Expected: Error (redirect URI doesn't match configured URI)

## Test 13: Test Expired Token

1. Get an access token
2. Wait for it to expire (default: 1 hour)
3. Try to use it:

```bash
curl -H "Authorization: Bearer EXPIRED_TOKEN" \
  http://localhost/oath/jsonapi/user/user/me
```

Expected: HTTP 401 Unauthorized

## Test 14: Test CORS (if applicable)

```bash
curl -X OPTIONS http://localhost/oath/oauth/token \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Check response headers for CORS headers.

## Test 15: Test with Postman

1. Open Postman
2. Create new request
3. Go to "Authorization" tab
4. Select "OAuth 2.0"
5. Configure:
   - Grant Type: Authorization Code
   - Callback URL: http://localhost:3000/callback
   - Auth URL: http://localhost/oath/oauth/authorize
   - Access Token URL: http://localhost/oath/oauth/token
   - Client ID: YOUR_CLIENT_ID
   - Client Secret: YOUR_CLIENT_SECRET
   - Scope: openid profile email
6. Click "Get New Access Token"
7. Use token to make API requests

## Troubleshooting Tests

### Test: Check Drupal Logs

```bash
drush watchdog:show --limit=20
```

### Test: Verify Keys

```bash
# Check if keys exist and are readable
ls -la keys/

# Verify key format
file keys/private.key
file keys/public.key
```

### Test: Check Module Dependencies

```bash
drush pm:list | grep -E "oauth|rest|serialization"
```

All should be enabled.

### Test: Verify Database

Check if OAuth clients table exists:
```bash
drush sql:query "SHOW TABLES LIKE '%oauth%';"
```

## Performance Tests

### Test: Token Generation Performance

```bash
time curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

Expected: < 500ms

### Test: API Request Performance

```bash
time curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost/oath/jsonapi/user/user/me
```

Expected: < 200ms

## Security Tests

### Test: Verify HTTPS Requirement (Production)

In production, all OAuth endpoints should use HTTPS:
```bash
curl -v http://localhost/oath/oauth/token
```

Should redirect to HTTPS or return error.

### Test: Verify Client Secret is Not Exposed

```bash
curl http://localhost/oath/jsonapi/oauth2_client
```

Should not return client secrets in response.

### Test: Verify Token is Not Logged

```bash
drush watchdog:show --limit=50 | grep -i token
```

Should not show full tokens in logs.

## Automated Testing Script

Create `test-oauth.sh`:

```bash
#!/bin/bash

CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
DRUPAL_URL="http://localhost/oath"

echo "Testing OAuth 2.0 endpoints..."

# Test 1: Client Credentials
echo "1. Testing Client Credentials Flow..."
RESPONSE=$(curl -s -X POST $DRUPAL_URL/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET")

ACCESS_TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "✗ Failed to get access token"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "✓ Got access token: ${ACCESS_TOKEN:0:20}..."

# Test 2: Use Token
echo "2. Testing API with token..."
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
  $DRUPAL_URL/jsonapi/user/user/me | grep -q "data" && echo "✓ API request successful" || echo "✗ API request failed"

# Test 3: Revoke Token
echo "3. Testing token revocation..."
curl -s -X POST $DRUPAL_URL/oauth/revoke \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=$ACCESS_TOKEN" > /dev/null && echo "✓ Token revoked" || echo "✗ Revocation failed"

echo "All tests completed!"
```

Run with:
```bash
chmod +x test-oauth.sh
./test-oauth.sh
```

## Test Results Template

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Module Enabled | simple_oauth enabled | | |
| Configuration | Keys configured | | |
| Client List | Clients displayed | | |
| Authorization | Redirect with code | | |
| Token Exchange | Access token received | | |
| API Request | User data returned | | |
| Token Refresh | New token received | | |
| Token Revoke | 200 OK | | |
| Invalid Creds | 401 Error | | |
| Expired Token | 401 Error | | |

## Next Steps

After successful testing:
1. Document your OAuth client credentials securely
2. Configure your client applications
3. Set up monitoring and logging
4. Plan for token rotation
5. Test in staging environment
6. Deploy to production with HTTPS
