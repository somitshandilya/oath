# OAuth 2.0 UI Setup - Visual Step-by-Step Guide

This guide provides detailed visual instructions for setting up OAuth 2.0 using only the Drupal admin interface.

## Step 1: Log In to Drupal Admin

1. Open your browser
2. Navigate to: `http://localhost/oath/user/login`
3. Enter your admin username and password
4. Click **Log in**
5. You should see the Drupal admin dashboard

## Step 2: Navigate to Modules Page

**Path:** Top Menu > Manage > Extend

OR directly: `http://localhost/oath/admin/modules`

**What you'll see:**
- A list of all available modules
- Search box at the top
- Checkboxes next to each module
- Install button at the bottom

## Step 3: Find and Enable Simple OAuth

1. In the search box, type: `simple oauth`
2. The list will filter to show matching modules
3. Look for the module titled: **"Simple OAuth (OAuth2 Server)"**
4. Check the checkbox next to it
5. Scroll down to the bottom of the page
6. Click the **Install** button
7. Wait for the page to reload
8. You should see a green success message

**Expected Success Message:**
```
Module Simple OAuth has been enabled.
```

## Step 4: Configure OAuth Settings

**Path:** Top Menu > Manage > Configuration > Development > OAuth2 Server

OR directly: `http://localhost/oath/admin/config/services/oauth2_server/settings`

**What you'll see:**
- A form with fields for:
  - Public Key Path
  - Private Key Path
  - Other OAuth settings

**Fill in the form:**

1. **Public Key Path field:**
   - Click in the text box
   - Clear any existing content
   - Type: `../keys/public.key`

2. **Private Key Path field:**
   - Click in the text box
   - Clear any existing content
   - Type: `../keys/private.key`

3. **Save Configuration:**
   - Scroll to the bottom of the form
   - Click the blue **Save configuration** button
   - Wait for the page to reload

**Expected Success Message:**
```
The configuration options have been saved.
```

## Step 5: Create Your First OAuth Client

**Path:** Top Menu > Manage > Structure > OAuth2 Clients

OR directly: `http://localhost/oath/admin/structure/oauth2_client`

**What you'll see:**
- A table showing existing OAuth clients (if any)
- An **Add OAuth2 Client** button

**Create a new client:**

1. Click the **Add OAuth2 Client** button
2. You'll see a form with the following fields:

### Form Fields to Fill:

**Label** (Required)
- This is the name of your OAuth client
- Example: `My Test App`
- Click in the field and type the name

**Redirect URIs** (Required)
- These are the URLs where users will be redirected after login
- Example: `http://localhost:3000/callback`
- Click in the text area
- Type one URI per line
- You can add multiple URIs if needed

**Grant Types** (Select which flows to allow)
- Check the boxes for:
  - ☑ **Authorization Code** (for web apps)
  - ☑ **Client Credentials** (for server-to-server)
  - ☑ **Refresh Token** (to refresh expired tokens)

**Other Fields** (Optional):
- Leave other fields as default unless you have specific requirements

3. Click the **Save** button at the bottom

**What happens next:**
- The page will reload
- You'll see a success message
- You'll be shown the client details page

## Step 6: Save Your OAuth Credentials

**IMPORTANT:** On the client details page, you'll see:

1. **Client ID** - A unique identifier
   - Example: `550e8400-e29b-41d4-a716-446655440000`
   - Copy this and save it securely

2. **Client Secret** - A secret key (shown only once!)
   - Example: `aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0u`
   - **COPY THIS IMMEDIATELY** - It won't be shown again
   - Save it in a secure location (password manager, secure note, etc.)

**Save this information in a safe place:**
```
Client ID: [paste here]
Client Secret: [paste here]
Redirect URI: http://localhost:3000/callback
```

## Step 7: View All OAuth Clients

**Path:** Top Menu > Manage > Structure > OAuth2 Clients

**What you'll see:**
- A table with all your OAuth clients
- Each row shows:
  - Client name
  - Client ID
  - Edit button
  - Delete button

**To edit a client:**
1. Click on the client name or the edit button
2. Modify the settings
3. Click Save

**To delete a client:**
1. Click the delete button
2. Confirm the deletion

## Step 8: Enable REST API (Optional)

If you want to make API calls with OAuth tokens:

**Path:** Top Menu > Manage > Extend

1. Search for: `REST UI`
2. Check the box next to **REST UI**
3. Click **Install**

**Then configure REST resources:**

**Path:** Top Menu > Manage > Configuration > Web services > REST

1. You'll see a list of available REST resources
2. For each resource you want to enable:
   - Click **Enable**
   - Select authentication methods (OAuth2 should be available)
   - Click **Save**

## Step 9: Configure CORS (If Needed)

If your OAuth client is on a different domain/port:

**Path:** Top Menu > Manage > Configuration > Development > CORS

1. Click **Add CORS rule**
2. Fill in:
   - **Path Pattern**: `.*` (to allow all paths)
   - **Allowed Origins**: `http://localhost:3000`
   - **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS, PATCH`
   - **Allowed Headers**: `Content-Type, Authorization`
3. Click **Save**

## Step 10: Test OAuth Authorization Endpoint

**In your browser, navigate to:**

```
http://localhost/oath/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=openid%20profile%20email
```

Replace `YOUR_CLIENT_ID` with the actual Client ID from Step 6.

**What happens:**

1. If not logged in:
   - You'll see the Drupal login page
   - Log in with your credentials
   - Click **Log in**

2. After login:
   - You'll see a consent screen
   - It asks: "Do you want to authorize [App Name]?"
   - Click **Authorize** to grant permission

3. After authorization:
   - You'll be redirected to: `http://localhost:3000/callback?code=AUTHORIZATION_CODE`
   - The URL will contain an authorization code
   - This code can be exchanged for an access token

## Step 11: Check OAuth Module Status

**Path:** Top Menu > Manage > Reports > Status report

OR directly: `http://localhost/oath/admin/reports/status`

**What to look for:**
- Find "Simple OAuth" in the list
- It should show a green checkmark
- Status should say "Enabled"
- No warnings about missing keys

## Step 12: Monitor OAuth Activity

**Path:** Top Menu > Manage > Reports > Recent log messages

OR directly: `http://localhost/oath/admin/reports/dblog`

**To filter for OAuth events:**
1. Find the "Type" dropdown
2. Select "Simple OAuth"
3. Click **Filter**
4. You'll see OAuth-related events:
   - Token generation
   - Authorization attempts
   - Errors

## Step 13: Create Test Users

**Path:** Top Menu > Manage > People

OR directly: `http://localhost/oath/admin/people`

1. Click **Add user** button
2. Fill in the form:
   - **Username**: `oauth_test_user`
   - **Email**: `oauth@example.com`
   - **Password**: Enter a secure password
   - **Confirm password**: Re-enter the password
   - **Status**: Check the box to make user Active
3. Click **Create new account**

**To assign roles to the user:**
1. Click on the username you just created
2. Scroll to the **Roles** section
3. Check boxes for desired roles (e.g., Editor, Contributor)
4. Click **Save**

## Troubleshooting via UI

### Problem: Can't find Simple OAuth module

**Solution:**
1. Go to **Manage > Extend**
2. Search for just "oauth"
3. Look for modules starting with "Simple"
4. If still not found, check that `drupal/simple_oauth` is in `composer.json`

### Problem: "OAuth2 Server" configuration page not found

**Solution:**
1. Verify Simple OAuth is enabled:
   - Go to **Manage > Extend**
   - Search for "simple oauth"
   - Check if it's enabled
2. Clear cache:
   - Go to **Manage > Configuration > Development > Performance**
   - Click **Clear all caches**
3. Try accessing the configuration page again

### Problem: "Keys not found" error on OAuth page

**Solution:**
1. Go to **Manage > Configuration > Development > OAuth2 Server**
2. Verify the key paths:
   - Public Key: `../keys/public.key`
   - Private Key: `../keys/private.key`
3. Check that the `keys/` directory exists in your Drupal root
4. Ensure files `public.key` and `private.key` exist in that directory

### Problem: Authorization endpoint shows error

**Solution:**
1. Verify the Client ID is correct (copy from OAuth Clients page)
2. Check that redirect URI matches exactly:
   - Must include protocol (http:// or https://)
   - Must include port if not standard (3000, 8000, etc.)
   - Must match what's configured in the OAuth client
3. Ensure you're logged in to Drupal
4. Check logs: **Manage > Reports > Recent log messages**

### Problem: Can't see OAuth Clients page

**Solution:**
1. Verify you have admin permissions
2. Go to **Manage > People**
3. Click on your username
4. Check that you have the "Administrator" role
5. If not, ask another admin to assign it

## Quick Reference: Common Paths

| Task | Menu Path | Direct URL |
|------|-----------|-----------|
| Modules | Manage > Extend | `/admin/modules` |
| OAuth Settings | Manage > Configuration > Development > OAuth2 Server | `/admin/config/services/oauth2_server/settings` |
| OAuth Clients | Manage > Structure > OAuth2 Clients | `/admin/structure/oauth2_client` |
| REST Config | Manage > Configuration > Web services > REST | `/admin/config/services/rest` |
| CORS Config | Manage > Configuration > Development > CORS | `/admin/config/services/cors` |
| People | Manage > People | `/admin/people` |
| Logs | Manage > Reports > Recent log messages | `/admin/reports/dblog` |
| Status | Manage > Reports > Status report | `/admin/reports/status` |
| Cache | Manage > Configuration > Development > Performance | `/admin/config/development/performance` |

## Summary Checklist

- [ ] Logged in as admin
- [ ] Simple OAuth module enabled
- [ ] OAuth settings configured with key paths
- [ ] OAuth client created
- [ ] Client ID and Secret saved securely
- [ ] Authorization endpoint tested
- [ ] Received authorization code
- [ ] REST API enabled (if needed)
- [ ] CORS configured (if needed)
- [ ] Test users created (if needed)
- [ ] Logs monitored for errors

## Next Steps

1. **Test OAuth Flow**: Use the authorization endpoint to test the complete flow
2. **Create Client App**: Set up your web or mobile app to use OAuth
3. **Monitor Activity**: Regularly check logs for OAuth events
4. **Secure Credentials**: Store Client Secret in a password manager
5. **Plan Rotation**: Schedule regular client secret rotation

---

**Version**: 1.0  
**Setup Method**: Web UI Only  
**Drupal Version**: 11  
**Module**: Simple OAuth 6.0+
