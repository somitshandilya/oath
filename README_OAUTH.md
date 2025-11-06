# Drupal 11 OAuth 2.0 Setup - Complete Guide

This directory contains everything you need to set up and use OAuth 2.0 authentication in Drupal 11.

## 📁 Files Included

### Documentation - UI Only (Recommended)
- **OAUTH_UI_SETUP.md** - Complete UI-only setup guide (no command line needed)
- **OAUTH_UI_VISUAL_GUIDE.md** - Step-by-step visual guide with detailed instructions
- **OAUTH_UI_TESTING.md** - Complete testing guide using only the web interface
- **README_OAUTH.md** - This file

### Documentation - Command Line
- **OAUTH_SETUP.md** - Comprehensive setup guide with step-by-step instructions
- **OAUTH_QUICK_REFERENCE.md** - Quick reference for common commands and flows
- **OAUTH_TESTING.md** - Complete testing guide with examples

### Setup Scripts
- **setup-oauth.sh** - Bash script for automated setup (Linux/Mac)
- **setup-oauth.ps1** - PowerShell script for automated setup (Windows)

### Configuration
- **oauth-settings-snippet.php** - PHP configuration to add to settings.php
- **.env.example** - Environment variables template for Node.js client

### Examples
- **oauth-client-example.js** - Complete Node.js OAuth client example

### Keys
- **keys/private.key** - RSA private key (already generated)
- **keys/public.key** - RSA public key (already generated)

## 🚀 Quick Start

### Option 1: UI Only Setup (No Command Line - Recommended)

**Follow these guides in order:**

1. **OAUTH_UI_SETUP.md** - Complete setup using only the web interface
2. **OAUTH_UI_VISUAL_GUIDE.md** - Detailed visual step-by-step instructions
3. **OAUTH_UI_TESTING.md** - Test your setup using the web interface

**Quick steps:**
1. Go to **Manage > Extend** and enable "Simple OAuth"
2. Go to **Manage > Configuration > Development > OAuth2 Server** and configure key paths
3. Go to **Manage > Structure > OAuth2 Clients** and create a new client
4. Test the authorization endpoint in your browser

### Option 2: Automated Setup (Command Line)

**Windows (PowerShell):**
```powershell
.\setup-oauth.ps1
```

**Linux/Mac (Bash):**
```bash
bash setup-oauth.sh
```

### Option 3: Manual Setup (Command Line)

1. Enable the module:
   ```bash
   drush pm:enable simple_oauth
   ```

2. Configure OAuth settings:
   ```bash
   drush config:set simple_oauth.settings public_key '../keys/public.key'
   drush config:set simple_oauth.settings private_key '../keys/private.key'
   ```

3. Clear cache:
   ```bash
   drush cache:rebuild
   ```

4. Create an OAuth client:
   ```bash
   drush entity:create oauth2_client --label="My App" --redirect_uris="http://localhost:3000/callback"
   ```

## 📋 What is OAuth 2.0?

OAuth 2.0 is an open standard for authorization that allows users to grant third-party applications access to their resources without sharing passwords.

### Key Benefits
- **Security**: Users don't share passwords with third-party apps
- **Flexibility**: Users can revoke access at any time
- **Scalability**: Supports multiple authentication flows
- **Standards-based**: Industry standard protocol

## 🔄 OAuth Flows Supported

### 1. Authorization Code Flow (Recommended for Web Apps)
- User logs in to Drupal
- User grants permission to application
- Application receives authorization code
- Application exchanges code for access token
- Application uses token to access resources

### 2. Client Credentials Flow (Server-to-Server)
- Application directly authenticates with Drupal
- No user interaction required
- Application receives access token
- Application uses token to access resources

### 3. Refresh Token Flow
- Application uses refresh token to get new access token
- Useful when access token expires
- Maintains user session without re-authentication

## 🔑 OAuth Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/oauth/authorize` | GET | Get authorization code |
| `/oauth/token` | POST | Exchange code for token |
| `/oauth/revoke` | POST | Revoke access token |

## 📚 Documentation Structure

### For UI-Only Setup (Recommended)
Start with **OAUTH_UI_SETUP.md** for:
- Step-by-step web interface instructions
- No command line required
- Screenshots and form descriptions
- Security best practices

### For Visual Step-by-Step
Use **OAUTH_UI_VISUAL_GUIDE.md** for:
- Detailed visual instructions
- Menu navigation paths
- Form field descriptions
- Troubleshooting via UI
- Quick reference links

### For UI Testing
Follow **OAUTH_UI_TESTING.md** for:
- 20 comprehensive test cases
- Browser-based verification
- Log monitoring
- Performance testing
- Testing checklist

### For Command Line Setup
Start with **OAUTH_SETUP.md** for:
- Prerequisites
- Step-by-step installation
- OAuth client creation
- API endpoint configuration
- Security best practices

### For Quick Reference (Command Line)
Use **OAUTH_QUICK_REFERENCE.md** for:
- Common commands
- OAuth flows
- Endpoint examples
- Troubleshooting tips

### For Command Line Testing
Follow **OAUTH_TESTING.md** for:
- Verification steps
- Test cases
- cURL examples
- Postman setup
- Performance testing

## 🛠️ Common Tasks

### Create OAuth Client
```bash
drush entity:create oauth2_client \
  --label="My Application" \
  --redirect_uris="http://localhost:3000/callback"
```

### List OAuth Clients
```bash
drush entity:list oauth2_client
```

### Get Access Token
```bash
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

### Make API Request
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost/oath/jsonapi/user/user/me
```

## 🔐 Security Considerations

1. **Keep Private Key Secure**
   - Never commit to version control
   - Restrict file permissions
   - Use environment variables for paths

2. **Use HTTPS in Production**
   - All OAuth endpoints must use HTTPS
   - Prevents token interception
   - Required for security

3. **Validate Redirect URIs**
   - Only allow trusted callback URLs
   - Prevents authorization code interception
   - Check exact match (including protocol and port)

4. **Manage Client Secrets**
   - Generate strong, random secrets
   - Rotate periodically
   - Never expose in logs or error messages

5. **Set Token Expiration**
   - Access tokens: 1 hour (default)
   - Refresh tokens: 1 week (default)
   - Adjust based on security requirements

## 🧪 Testing Your Setup

Quick verification:
```bash
# 1. Check module is enabled
drush pm:list | grep oauth

# 2. Verify configuration
drush config:get simple_oauth.settings

# 3. List clients
drush entity:list oauth2_client

# 4. Test token endpoint
curl -X POST http://localhost/oath/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=TEST" \
  -d "client_secret=TEST"
```

For comprehensive testing, see **OAUTH_TESTING.md**.

## 🌐 Using with Client Applications

### Node.js Example
See **oauth-client-example.js** for a complete example:
```bash
npm install axios express dotenv
cp .env.example .env
# Edit .env with your credentials
node oauth-client-example.js
```

### Other Languages
OAuth 2.0 is language-agnostic. Use any OAuth library:
- **Python**: requests-oauthlib
- **PHP**: league/oauth2-client
- **JavaScript**: oauth.io
- **Java**: Spring Security OAuth

## 📖 Additional Resources

- [Simple OAuth Module](https://www.drupal.org/project/simple_oauth)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [Drupal REST API Guide](https://www.drupal.org/docs/drupal-apis/rest-api)
- [JSON:API Specification](https://jsonapi.org/)

## 🐛 Troubleshooting

### Keys Not Found
```bash
# Verify keys exist
ls -la keys/

# Check configuration
drush config:get simple_oauth.settings
```

### CORS Errors
Add to `settings.php`:
```php
$settings['cors.default_credentials'] = TRUE;
```

### Token Validation Fails
- Verify RSA keys are valid
- Check key paths in configuration
- Ensure keys have correct permissions

### Invalid Client Credentials
```bash
# Verify client exists
drush entity:load oauth2_client CLIENT_ID

# Check client secret
drush entity:load oauth2_client CLIENT_ID --format=json
```

## 📞 Support

For issues or questions:
1. Check **OAUTH_QUICK_REFERENCE.md** for common solutions
2. Review **OAUTH_TESTING.md** for verification steps
3. Check Drupal logs: `drush watchdog:show`
4. Visit [Drupal.org](https://www.drupal.org) for community support

## ✅ Checklist

- [ ] Simple OAuth module enabled
- [ ] RSA keys generated and configured
- [ ] OAuth client created
- [ ] Redirect URIs configured
- [ ] Token endpoints tested
- [ ] API requests working
- [ ] HTTPS configured (production)
- [ ] Security settings reviewed
- [ ] Client applications configured
- [ ] Monitoring and logging set up

## 📝 Next Steps

1. **Development**: Test OAuth flows locally
2. **Integration**: Connect client applications
3. **Testing**: Run comprehensive tests (see OAUTH_TESTING.md)
4. **Staging**: Deploy to staging environment
5. **Production**: Deploy with HTTPS and security hardening
6. **Monitoring**: Set up logging and alerts
7. **Maintenance**: Regular key rotation and updates

---

**Version**: 1.0  
**Last Updated**: 2024  
**Drupal Version**: 11  
**Module**: Simple OAuth 6.0+
