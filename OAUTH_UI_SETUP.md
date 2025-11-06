# OAuth 2.0 Setup Guide - UI Only (No Command Line)

This guide walks through setting up OAuth 2.0 in Drupal 11 using only the web interface.

## Prerequisites

- Drupal 11 installed and accessible
- Admin account with full permissions
- RSA keys already generated (in `/keys` directory)
- Simple OAuth module already installed (via Composer)

## Step 1: Enable Simple OAuth Module via UI

1. Log in to Drupal as an administrator
2. Go to **Manage > Extend** (or navigate to `/admin/modules`)
3. Search for "Simple OAuth" in the search box
4. Find the module named **"Simple OAuth (OAuth2 Server)"**
5. Check the checkbox next to it
6. Scroll down and click **Install**
7. Wait for the installation to complete
8. You should see a success message

## Step 2: Configure OAuth Settings via UI

1. Go to **Manage > Configuration > Development > OAuth2 Server**
   - Alternative path: `/admin/config/services/oauth2_server/settings`
2. You should see the OAuth2 Server configuration form
3. Fill in the following fields:

   **Public Key Path:**
   ```
   ../keys/public.key
   ```

   **Private Key Path:**
   ```
   ../keys/private.key
   ```

4. Click **Save configuration**
5. You should see a success message: "The configuration options have been saved."

## Step 3: Create an OAuth Client via UI

1. Go to **Manage > Structure > OAuth2 Clients**
   - Alternative path: `/admin/structure/oauth2_client`
2. Click **Add OAuth2 Client** button
3. Fill in the form:

   **Label** (required):
   ```
   My Test Application
   ```

   **Redirect URIs** (required):
   ```
   http://localhost:3000/callback
   ```
   
   *Note: Add one URI per line. You can add multiple URIs if needed.*

   **Grant Types** (select all that apply):
   - ☑ Authorization Code
   - ☑ Client Credentials
   - ☑ Refresh Token

4. Click **Save**
5. You will be redirected to the client details page
6. **Important:** Copy and save the following information:
   - **Client ID** - You'll see this on the page
   - **Client Secret** - This is shown only once, copy it now!

   Save these securely (e.g., in a password manager or secure document).

## Step 4: Verify OAuth Module is Working

1. Go to **Manage > Reports > Status report**
   - Alternative path: `/admin/reports/status`
2. Look for "Simple OAuth" in the list
3. It should show as "Enabled" with a green checkmark
4. If there are any warnings about keys, verify the paths in Step 2

## Step 5: Test OAuth Endpoints via Browser

### Test Authorization Endpoint

1. Open a new browser tab
2. Navigate to:
   ```
   http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
   ```
   
   Replace `YOUR_CLIENT_ID` with the Client ID from Step 3.

3. You should see:
   - Drupal login page (if not logged in)
   - After login: A consent screen asking to grant permission
   - After granting: Redirect to callback URL with authorization code

## Step 6: Create Test Users (Optional)

If you want to test OAuth with different users:

1. Go to **Manage > People**
   - Alternative path: `/admin/people`
2. Click **Add user**
3. Fill in the form:
   - **Username**: `oauth_test_user`
   - **Email**: `oauth@example.com`
   - **Password**: Set a secure password
   - **Status**: ☑ Active
4. Click **Create new account**
5. Optionally assign roles to the user by:
   - Clicking the user name
   - Going to the **Roles** section
   - Checking desired roles (e.g., Editor, Contributor)
   - Clicking **Save**

## Step 7: Enable REST API (Optional)

If you want to make API requests with OAuth tokens:

1. Go to **Manage > Extend**
2. Search for "REST UI"
3. Check **REST UI** module
4. Click **Install**
5. Go to **Manage > Configuration > Web services > REST**
   - Alternative path: `/admin/config/services/rest`
6. Enable REST resources as needed:
   - Click **Enable** on resources you want to expose
   - Configure authentication methods (OAuth2 should be available)
   - Click **Save**

## Step 8: Configure CORS (If Needed)

If your OAuth client is on a different domain:

1. Go to **Manage > Configuration > Development > CORS**
   - Alternative path: `/admin/config/services/cors`
2. Add your client domain to allowed origins:
   - **Allowed Origins**: `http://localhost:3000`
   - **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
   - **Allowed Headers**: `Content-Type, Authorization`
3. Click **Save**

## Step 9: View OAuth Clients List

1. Go to **Manage > Structure > OAuth2 Clients**
2. You should see a table with all created OAuth clients
3. For each client, you can:
   - **Edit**: Click the client name to modify settings
   - **Delete**: Click the delete button to remove the client
   - **View Details**: Click on the client to see full information

## Step 10: Monitor OAuth Activity

### View Logs

1. Go to **Manage > Reports > Recent log messages**
   - Alternative path: `/admin/reports/dblog`
2. Filter by type "Simple OAuth" to see OAuth-related events
3. Look for:
   - Token generation events
   - Authorization events
   - Error messages

### Check System Status

1. Go to **Manage > Reports > Status report**
2. Look for any warnings or errors related to OAuth
3. Verify that all required modules are enabled

## Troubleshooting via UI

### Issue: "Simple OAuth" module not found in Extend

**Solution:**
1. Go to **Manage > Extend**
2. Look for "Simple OAuth" - it should be under "OAuth"
3. If not visible, the module may not be installed via Composer
4. Check that `drupal/simple_oauth` is in `composer.json`

### Issue: OAuth2 Server configuration page not found

**Solution:**
1. Verify Simple OAuth module is enabled (Step 1)
2. Clear cache: Go to **Manage > Configuration > Development > Performance**
   - Click **Clear all caches**
3. Try accessing the configuration page again

### Issue: "Keys not found" error

**Solution:**
1. Go to **Manage > Configuration > Development > OAuth2 Server**
2. Verify the paths are correct:
   - Public Key: `../keys/public.key`
   - Private Key: `../keys/private.key`
3. Check that files exist in the `keys/` directory
4. Ensure the web server has read permissions on the key files

### Issue: Cannot create OAuth client

**Solution:**
1. Verify you have admin permissions
2. Go to **Manage > People** and check your user role
3. Ensure you have "Administer OAuth2 Clients" permission
4. Clear cache if needed

### Issue: Authorization endpoint returns error

**Solution:**
1. Verify the Client ID is correct
2. Check that redirect URI matches exactly (including protocol and port)
3. Ensure the user is logged in
4. Check **Manage > Reports > Recent log messages** for error details

## Using OAuth Tokens with Drupal API

### Step 1: Get an Access Token

After completing the authorization flow in Step 5, you'll receive an authorization code. To exchange it for a token:

1. Open a terminal or use a tool like Postman
2. Make a POST request to: `http://localhost/oath/oauth/token`
3. Include these parameters:
   - `grant_type`: `authorization_code`
   - `client_id`: Your Client ID
   - `client_secret`: Your Client Secret
   - `code`: The authorization code
   - `redirect_uri`: Your redirect URI

### Step 2: Make API Requests

1. Go to **Manage > Configuration > Web services > REST**
2. Enable the resources you want to access
3. Use the access token in requests:
   - Add header: `Authorization: Bearer YOUR_ACCESS_TOKEN`
   - Example: Access user data at `/jsonapi/user/user/me`

## Security Checklist

- [ ] Private key is not accessible from the web
- [ ] Client secrets are stored securely
- [ ] Only necessary redirect URIs are configured
- [ ] CORS is properly configured (if needed)
- [ ] Only necessary REST resources are enabled
- [ ] Users have appropriate roles and permissions
- [ ] HTTPS is used in production
- [ ] Logs are monitored for suspicious activity

## Common OAuth Clients to Create

### For Web Application
- **Label**: Web App
- **Redirect URI**: `http://localhost:3000/callback`
- **Grant Types**: Authorization Code, Refresh Token

### For Mobile Application
- **Label**: Mobile App
- **Redirect URI**: `myapp://oauth/callback`
- **Grant Types**: Authorization Code, Refresh Token

### For Server-to-Server Integration
- **Label**: Backend Service
- **Redirect URI**: `http://backend-service/callback`
- **Grant Types**: Client Credentials

## Next Steps

1. **Test OAuth Flow**: Follow Step 5 to test the authorization endpoint
2. **Create Client Application**: Set up your web/mobile app to use OAuth
3. **Monitor Activity**: Check logs regularly for OAuth events
4. **Secure Credentials**: Store Client ID and Secret securely
5. **Plan Token Rotation**: Set up a schedule for rotating client secrets

## Additional Resources

- [Drupal Admin Interface Guide](https://www.drupal.org/docs/user_guide/en/index.html)
- [Simple OAuth Module Documentation](https://www.drupal.org/project/simple_oauth)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)

## UI Navigation Quick Links

| Task | Path |
|------|------|
| Enable Modules | `/admin/modules` |
| OAuth Settings | `/admin/config/services/oauth2_server/settings` |
| OAuth Clients | `/admin/structure/oauth2_client` |
| REST Configuration | `/admin/config/services/rest` |
| CORS Configuration | `/admin/config/services/cors` |
| People Management | `/admin/people` |
| Logs | `/admin/reports/dblog` |
| Status Report | `/admin/reports/status` |
| Performance/Cache | `/admin/config/development/performance` |

---

**Version**: 1.0  
**Setup Method**: Web UI Only  
**Drupal Version**: 11  
**Module**: Simple OAuth 6.0+
