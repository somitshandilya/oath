#!/bin/bash

# OAuth 2.0 Setup Script for Drupal 11
# This script automates the OAuth setup process

set -e

echo "========================================="
echo "Drupal 11 OAuth 2.0 Setup Script"
echo "========================================="
echo ""

# Step 1: Enable Simple OAuth Module
echo "[1/4] Enabling Simple OAuth module..."
drush pm:enable simple_oauth -y
echo "✓ Simple OAuth module enabled"
echo ""

# Step 2: Configure OAuth Settings
echo "[2/4] Configuring OAuth settings..."
drush config:set simple_oauth.settings public_key '../keys/public.key' -y
drush config:set simple_oauth.settings private_key '../keys/private.key' -y
echo "✓ OAuth settings configured"
echo ""

# Step 3: Clear cache
echo "[3/4] Clearing Drupal cache..."
drush cache:rebuild
echo "✓ Cache cleared"
echo ""

# Step 4: Display next steps
echo "[4/4] Setup complete!"
echo ""
echo "========================================="
echo "Next Steps:"
echo "========================================="
echo ""
echo "1. Create an OAuth Client:"
echo "   drush entity:create oauth2_client --label='My App' --redirect_uris='http://localhost:3000/callback'"
echo ""
echo "2. View OAuth Clients:"
echo "   drush entity:list oauth2_client"
echo ""
echo "3. Access OAuth endpoints:"
echo "   - Authorization: http://localhost/oath/oauth/authorize"
echo "   - Token: http://localhost/oath/oauth/token"
echo "   - Revoke: http://localhost/oath/oauth/revoke"
echo ""
echo "4. For more details, see OAUTH_SETUP.md"
echo ""
echo "========================================="
