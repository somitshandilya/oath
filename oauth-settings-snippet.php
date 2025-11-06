<?php

/**
 * OAuth 2.0 Configuration for Drupal 11
 * 
 * Add this configuration to web/sites/default/settings.php
 * Adjust paths as needed for your installation
 */

// OAuth2 Server Configuration
$settings['simple_oauth.settings'] = [
  // Path to the public key (relative to Drupal root)
  'public_key' => '../keys/public.key',
  
  // Path to the private key (relative to Drupal root)
  'private_key' => '../keys/private.key',
];

// CORS Configuration (if needed for OAuth endpoints)
$settings['cors.default_credentials'] = TRUE;
$settings['cors.default_origins'] = [
  'http://localhost:3000',
  'http://localhost:8000',
  'http://localhost:8080',
  // Add your frontend URLs here
];

// Optional: Configure token expiration times (in seconds)
// Default is 1 hour (3600 seconds) for access tokens
// $settings['simple_oauth.access_token_expiration'] = 3600;

// Optional: Configure refresh token expiration (in seconds)
// Default is 1 week (604800 seconds)
// $settings['simple_oauth.refresh_token_expiration'] = 604800;

// Optional: Enable HTTPS requirement for OAuth endpoints
// Set to FALSE for development only
// $settings['simple_oauth.require_https'] = FALSE;

// Optional: Configure allowed grant types
// $settings['simple_oauth.grant_types'] = [
//   'authorization_code',
//   'client_credentials',
//   'refresh_token',
// ];
