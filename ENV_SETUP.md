# Environment Variables Setup

Add these variables to your `.env.local` file:

\`\`\`env
# Existing Variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key

# NEW: Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here

# NEW: NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
\`\`\`

## Generate NEXTAUTH_SECRET

Run this command in your terminal:
\`\`\`bash
openssl rand -base64 32
\`\`\`

Copy the output and paste it as the value for `NEXTAUTH_SECRET`.

## Example:

\`\`\`env
NEXTAUTH_SECRET=abc123XYZ456def789GHI012jkl345MNO=
\`\`\`

After adding these variables, **restart your development server** for changes to take effect.

