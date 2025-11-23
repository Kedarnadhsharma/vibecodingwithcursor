# Google SSO Setup Guide

This guide will walk you through setting up Google Single Sign-On (SSO) for your Next.js application using NextAuth.js.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `vibecoding-app` (or your preferred name)
5. Click **"Create"**

## Step 2: Enable Google+ API

1. In your Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**

### Fill in the required fields:

- **App name:** `VibeCoding App` (or your app name)
- **User support email:** Your email address
- **App logo:** (Optional) Upload your app logo
- **Application home page:** `http://localhost:3000` (for development)
- **Authorized domains:** (Leave empty for localhost development)
- **Developer contact information:** Your email address

4. Click **"Save and Continue"**

### Scopes:

5. On the Scopes screen, click **"Add or Remove Scopes"**
6. Select these scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
   - `openid`
7. Click **"Update"** then **"Save and Continue"**

### Test Users (for External apps):

8. Add test users by entering email addresses of people who can test your app
9. Click **"Save and Continue"**
10. Review the summary and click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**

### Configure the OAuth client:

- **Name:** `VibeCoding Web Client` (or your preferred name)

- **Authorized JavaScript origins:**
  - `http://localhost:3000` (for development)
  - Add your production URL later: `https://yourdomain.com`

- **Authorized redirect URIs:**
  - `http://localhost:3000/api/auth/callback/google`
  - Add your production URL later: `https://yourdomain.com/api/auth/callback/google`

4. Click **"Create"**

## Step 5: Save Your Credentials

You'll see a dialog with your **Client ID** and **Client Secret**.

**IMPORTANT:** Copy these values now - you'll need them for your `.env.local` file!

- **Client ID:** Something like `123456789-abcdefghijk.apps.googleusercontent.com`
- **Client Secret:** Something like `GOCSPX-abcdefghijklmnop`

## Step 6: Configure Environment Variables

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Add these variables:

\`\`\`env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
\`\`\`

### Generate NEXTAUTH_SECRET:

Run this command in your terminal:
\`\`\`bash
openssl rand -base64 32
\`\`\`

Copy the output and use it as your `NEXTAUTH_SECRET`

## Step 7: Restart Your Development Server

After adding the environment variables:

\`\`\`bash
# Stop the current server (Ctrl+C)
# Then restart
yarn dev -H localhost
\`\`\`

## Step 8: Test the Google Sign-In

1. Open your browser and go to `http://localhost:3000`
2. You should see a **"Sign in with Google"** button in the header
3. Click it and sign in with a Google account
4. If you set up test users, use one of those email addresses
5. After authentication, you should see your email and a **"Sign Out"** button

## For Production Deployment

When deploying to production:

1. **Update Google Cloud Console:**
   - Add your production domain to **Authorized JavaScript origins**
   - Add `https://yourdomain.com/api/auth/callback/google` to **Authorized redirect URIs**

2. **Update Environment Variables:**
   \`\`\`env
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=same-as-development
   GOOGLE_CLIENT_SECRET=same-as-development
   NEXTAUTH_SECRET=same-random-secret
   \`\`\`

3. **OAuth Consent Screen:**
   - Consider verifying your app if you want to remove the "unverified app" warning
   - Go through Google's verification process if needed

## Troubleshooting

### Common Issues:

1. **"Redirect URI mismatch"**
   - Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
   
2. **"Access blocked: This app's request is invalid"**
   - Check that you've enabled the Google+ API
   - Verify your OAuth consent screen is configured properly

3. **Environment variables not loading**
   - Make sure `.env.local` is in the root directory
   - Restart your dev server after adding env vars
   - Don't commit `.env.local` to git (it should be in `.gitignore`)

4. **"Error: options.clientId is required"**
   - Your GOOGLE_CLIENT_ID environment variable is not set correctly
   - Double-check the `.env.local` file

## Security Best Practices

1. **Never commit** your `.env.local` file to version control
2. **Use different credentials** for development and production
3. **Rotate secrets** regularly
4. **Limit OAuth scopes** to only what you need
5. **Monitor** Google Cloud Console for suspicious activity

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Google Provider Docs](https://next-auth.js.org/providers/google)

---

## Quick Reference

**Environment Variables Needed:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

**Google Console URLs:**
- Project Console: https://console.cloud.google.com/
- OAuth Consent: https://console.cloud.google.com/apis/credentials/consent
- Credentials: https://console.cloud.google.com/apis/credentials

**Redirect URI Format:**
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

