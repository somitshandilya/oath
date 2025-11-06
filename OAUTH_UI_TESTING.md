# OAuth 2.0 Testing Guide - UI Only

This guide shows how to test OAuth 2.0 functionality using only the Drupal web interface.

## Test 1: Verify OAuth Module is Enabled

**Steps:**
1. Go to **Manage > Extend** (`/admin/modules`)
2. Search for "simple oauth"
3. Look for "Simple OAuth (OAuth2 Server)"
4. Verify the checkbox is checked (enabled)

**Expected Result:**
- Module appears in the list
- Checkbox is checked
- No error messages

---

## Test 2: Verify OAuth Configuration

**Steps:**
1. Go to **Manage > Configuration > Development > OAuth2 Server**
2. Look at the form fields
3. Verify:
   - **Public Key Path**: `../keys/public.key`
   - **Private Key Path**: `../keys/private.key`

**Expected Result:**
- Both paths are filled in correctly
- No error messages about missing keys
- Green success message visible

---

## Test 3: Verify OAuth Client Exists

**Steps:**
1. Go to **Manage > Structure > OAuth2 Clients** (`/admin/structure/oauth2_client`)
2. Look at the table of clients

**Expected Result:**
- At least one OAuth client is listed
- Client shows:
  - Name/Label
  - Client ID
  - Edit and Delete buttons

---

## Test 4: View OAuth Client Details

**Steps:**
1. Go to **Manage > Structure > OAuth2 Clients**
2. Click on a client name
3. View the client details page

**Expected Result:**
- Page shows:
  - Client Label
  - Client ID
  - Redirect URIs
  - Grant Types
  - Created date

---

## Test 5: Test Authorization Endpoint (Full Flow)

**Steps:**

### Part A: Start Authorization
1. Open a new browser tab
2. Navigate to:
   ```
   http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
   ```
   Replace `YOUR_CLIENT_ID` with actual Client ID

3. You should see the Drupal login page

### Part B: Log In
1. Enter your Drupal username
2. Enter your password
3. Click **Log in**

### Part C: Grant Permission
1. You should see a consent screen
2. It shows the application name and requested permissions
3. Click **Authorize** button

### Part D: Receive Authorization Code
1. You should be redirected to:
   ```
   http://localhost:3000/callback?code=AUTHORIZATION_CODE&state=...
   ```
2. The URL contains an authorization code

**Expected Result:**
- Successfully redirected to callback URL
- Authorization code present in URL
- No error messages

---

## Test 6: Test with Invalid Client ID

**Steps:**
1. Navigate to:
   ```
   http://localhost/oath/oauth/authorize?client_id=INVALID_ID&redirect_uri=http://localhost:3000/callback&response_type=code
   ```

**Expected Result:**
- Error message displayed
- Not redirected to callback URL
- Error indicates invalid client

---

## Test 7: Test with Invalid Redirect URI

**Steps:**
1. Navigate to:
   ```
   http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://evil.com/callback&response_type=code
   ```

**Expected Result:**
- Error message displayed
- Redirect URI doesn't match configured URI
- User not redirected to evil.com

---

## Test 8: Check OAuth Logs

**Steps:**
1. Go to **Manage > Reports > Recent log messages** (`/admin/reports/dblog`)
2. Find the "Type" dropdown filter
3. Select "Simple OAuth"
4. Click **Filter**

**Expected Result:**
- Log entries related to OAuth appear
- Shows:
  - Authorization attempts
  - Token generation
  - Any errors

---

## Test 9: Check System Status

**Steps:**
1. Go to **Manage > Reports > Status report** (`/admin/reports/status`)
2. Look for "Simple OAuth" in the list
3. Check the status

**Expected Result:**
- Simple OAuth shows as "Enabled"
- Green checkmark visible
- No warnings about missing keys

---

## Test 10: Create Additional OAuth Client

**Steps:**
1. Go to **Manage > Structure > OAuth2 Clients**
2. Click **Add OAuth2 Client**
3. Fill in:
   - **Label**: `Test Client 2`
   - **Redirect URI**: `http://localhost:8000/callback`
   - **Grant Types**: Check Authorization Code
4. Click **Save**

**Expected Result:**
- New client created successfully
- Client ID and Secret generated
- Client appears in the list

---

## Test 11: Edit OAuth Client

**Steps:**
1. Go to **Manage > Structure > OAuth2 Clients**
2. Click on a client name
3. Modify the **Label** (e.g., add " - Updated")
4. Click **Save**

**Expected Result:**
- Client updated successfully
- Changes reflected in the list
- No error messages

---

## Test 12: Delete OAuth Client

**Steps:**
1. Go to **Manage > Structure > OAuth2 Clients**
2. Click the **Delete** button for a client
3. Confirm the deletion

**Expected Result:**
- Client removed from the list
- Confirmation message shown
- Client no longer appears in OAuth Clients page

---

## Test 13: Test with Different User

**Steps:**
1. Create a new user:
   - Go to **Manage > People**
   - Click **Add user**
   - Fill in username, email, password
   - Click **Create new account**

2. Log out (click your username > Log out)

3. Log in as the new user

4. Test authorization endpoint again:
   ```
   http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code
   ```

**Expected Result:**
- Authorization works with different user
- New user can grant permission
- Authorization code generated

---

## Test 14: Test REST API with OAuth

**Steps:**

### Part A: Enable REST
1. Go to **Manage > Extend**
2. Search for "REST UI"
3. Check the box and click **Install**

### Part B: Configure REST
1. Go to **Manage > Configuration > Web services > REST**
2. Find a resource (e.g., "User")
3. Click **Enable**
4. Select "OAuth2" as authentication method
5. Click **Save**

### Part C: Test API Access
1. Complete the OAuth authorization flow (Test 5)
2. Get the access token (from the callback URL)
3. In a new browser tab, navigate to:
   ```
   http://localhost/oath/jsonapi/user/user/me?access_token=YOUR_ACCESS_TOKEN
   ```

**Expected Result:**
- User data returned in JSON format
- No authentication errors
- Data displayed correctly

---

## Test 15: Test CORS Configuration

**Steps:**

### Part A: Configure CORS
1. Go to **Manage > Configuration > Development > CORS**
2. Click **Add CORS rule**
3. Fill in:
   - **Path Pattern**: `.*`
   - **Allowed Origins**: `http://localhost:3000`
   - **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
4. Click **Save**

### Part B: Test CORS
1. Open browser developer tools (F12)
2. Go to **Console** tab
3. Make a request from a different origin:
   ```javascript
   fetch('http://localhost/oath/oauth/token', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: 'grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET'
   }).then(r => r.json()).then(console.log)
   ```

**Expected Result:**
- Request succeeds
- CORS headers present in response
- Token returned

---

## Test 16: Monitor Performance

**Steps:**
1. Go to **Manage > Configuration > Development > Performance**
2. Note the current cache settings
3. Perform OAuth authorization flow (Test 5)
4. Check **Manage > Reports > Recent log messages**
5. Look for performance metrics

**Expected Result:**
- Authorization completes in reasonable time (< 2 seconds)
- No performance warnings in logs

---

## Test 17: Test Token Expiration

**Steps:**
1. Complete OAuth authorization flow (Test 5)
2. Get the access token
3. Wait for token to expire (default: 1 hour)
4. Try to use the token:
   ```
   http://localhost/oath/jsonapi/user/user/me?access_token=EXPIRED_TOKEN
   ```

**Expected Result:**
- Request fails with 401 Unauthorized
- Error message indicates token expired

---

## Test 18: Clear Cache and Retest

**Steps:**
1. Go to **Manage > Configuration > Development > Performance**
2. Click **Clear all caches**
3. Repeat Test 5 (authorization endpoint)

**Expected Result:**
- Cache cleared successfully
- OAuth still works after cache clear
- No errors

---

## Test 19: Check Module Dependencies

**Steps:**
1. Go to **Manage > Extend**
2. Search for "simple oauth"
3. Click on the module name to see details
4. Check "Dependencies" section

**Expected Result:**
- All dependencies are enabled
- No missing dependencies
- Module can function properly

---

## Test 20: Verify Security Settings

**Steps:**
1. Go to **Manage > Configuration > Development > OAuth2 Server**
2. Check if HTTPS is enforced
3. Verify token expiration settings
4. Check allowed grant types

**Expected Result:**
- Settings are appropriate for your environment
- Security best practices followed
- No warnings

---

## Testing Checklist

- [ ] OAuth module enabled
- [ ] Configuration saved correctly
- [ ] OAuth client created
- [ ] Client ID and Secret obtained
- [ ] Authorization endpoint works
- [ ] Valid authorization code received
- [ ] Invalid client ID rejected
- [ ] Invalid redirect URI rejected
- [ ] Logs show OAuth events
- [ ] Status report shows no errors
- [ ] Additional client created
- [ ] Client edited successfully
- [ ] Client deleted successfully
- [ ] Different user can authorize
- [ ] REST API enabled
- [ ] API accessible with token
- [ ] CORS configured (if needed)
- [ ] Performance acceptable
- [ ] Cache cleared without issues
- [ ] Security settings verified

---

## Troubleshooting During Testing

### Test Fails: "Module not found"
- Go to **Manage > Extend**
- Search for "oauth"
- Verify Simple OAuth appears in list

### Test Fails: "Configuration page not found"
- Clear cache: **Manage > Configuration > Development > Performance**
- Try accessing configuration page again

### Test Fails: "Keys not found"
- Go to **Manage > Configuration > Development > OAuth2 Server**
- Verify key paths are correct
- Check that `keys/` directory exists

### Test Fails: "Authorization endpoint error"
- Verify Client ID is correct
- Check redirect URI matches exactly
- Ensure you're logged in
- Check logs for error details

### Test Fails: "API request returns 401"
- Verify access token is valid
- Check token hasn't expired
- Verify REST resource is enabled
- Check OAuth2 is selected as auth method

---

## Test Results Template

| Test # | Test Name | Expected | Result | Status |
|--------|-----------|----------|--------|--------|
| 1 | Module Enabled | Enabled | | |
| 2 | Configuration | Keys configured | | |
| 3 | Client Exists | Client in list | | |
| 4 | Client Details | Details visible | | |
| 5 | Authorization Flow | Auth code received | | |
| 6 | Invalid Client ID | Error shown | | |
| 7 | Invalid Redirect URI | Error shown | | |
| 8 | Logs | OAuth events logged | | |
| 9 | Status Report | No errors | | |
| 10 | Create Client | New client created | | |
| 11 | Edit Client | Client updated | | |
| 12 | Delete Client | Client removed | | |
| 13 | Different User | Auth works | | |
| 14 | REST API | API accessible | | |
| 15 | CORS | CORS headers present | | |
| 16 | Performance | < 2 seconds | | |
| 17 | Token Expiration | 401 after expiry | | |
| 18 | Cache Clear | Works after clear | | |
| 19 | Dependencies | All enabled | | |
| 20 | Security | Settings verified | | |

---

**Version**: 1.0  
**Testing Method**: Web UI Only  
**Drupal Version**: 11  
**Module**: Simple OAuth 6.0+
