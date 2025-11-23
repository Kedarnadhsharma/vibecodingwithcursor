# Fix Node Modules Permissions

Your `node_modules` directory has files owned by `root`, which is preventing proper installation. Here's how to fix it:

## Option 1: Fix Permissions (Recommended)

Run this command in your terminal:

\`\`\`bash
cd /Users/ktadikon/projects/vibecoding-cursor
sudo chown -R ktadikon:staff node_modules
sudo rm -rf node_modules yarn.lock
yarn install
\`\`\`

## Option 2: Quick Fix

If Option 1 doesn't work, try:

\`\`\`bash
cd /Users/ktadikon/projects/vibecoding-cursor
sudo rm -rf node_modules yarn.lock .next
yarn install
\`\`\`

## After Installing

Start the server:

\`\`\`bash
yarn dev -H localhost
\`\`\`

Or if that doesn't work:

\`\`\`bash
./node_modules/.bin/next dev -H localhost
\`\`\`

## Why This Happened

Some packages were installed with `sudo`, giving them root ownership. This prevents normal deletion and reinstallation.

## Prevent This in the Future

Never use `sudo` with yarn/npm commands unless absolutely necessary.

