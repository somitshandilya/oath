# OAuth 2.0 Setup Script for Drupal 11 (PowerShell)
# This script automates the OAuth setup process on Windows

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Drupal 11 OAuth 2.0 Setup Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Enable Simple OAuth Module
Write-Host "[1/4] Enabling Simple OAuth module..." -ForegroundColor Yellow
& drush pm:enable simple_oauth -y
Write-Host "✓ Simple OAuth module enabled" -ForegroundColor Green
Write-Host ""

# Step 2: Configure OAuth Settings
Write-Host "[2/4] Configuring OAuth settings..." -ForegroundColor Yellow
& drush config:set simple_oauth.settings public_key '../keys/public.key' -y
& drush config:set simple_oauth.settings private_key '../keys/private.key' -y
Write-Host "✓ OAuth settings configured" -ForegroundColor Green
Write-Host ""

# Step 3: Clear cache
Write-Host "[3/4] Clearing Drupal cache..." -ForegroundColor Yellow
& drush cache:rebuild
Write-Host "✓ Cache cleared" -ForegroundColor Green
Write-Host ""

# Step 4: Display next steps
Write-Host "[4/4] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create an OAuth Client:" -ForegroundColor White
Write-Host "   drush entity:create oauth2_client --label='My App' --redirect_uris='http://localhost:3000/callback'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. View OAuth Clients:" -ForegroundColor White
Write-Host "   drush entity:list oauth2_client" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access OAuth endpoints:" -ForegroundColor White
Write-Host "   - Authorization: http://localhost/oath/oauth/authorize" -ForegroundColor Gray
Write-Host "   - Token: http://localhost/oath/oauth/token" -ForegroundColor Gray
Write-Host "   - Revoke: http://localhost/oath/oauth/revoke" -ForegroundColor Gray
Write-Host ""
Write-Host "4. For more details, see OAUTH_SETUP.md" -ForegroundColor Gray
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
