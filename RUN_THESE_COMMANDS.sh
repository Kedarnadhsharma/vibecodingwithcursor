#!/bin/bash

# Fix Node Modules and Start Server
# Run this script: chmod +x RUN_THESE_COMMANDS.sh && ./RUN_THESE_COMMANDS.sh

cd /Users/ktadikon/projects/vibecoding-cursor

echo "🔧 Fixing permissions..."
sudo chown -R ktadikon:staff node_modules

echo "🗑️  Removing corrupted node_modules..."
sudo rm -rf node_modules yarn.lock .next

echo "📦 Installing fresh dependencies..."
yarn install

echo "🚀 Starting development server..."
yarn dev -H localhost

