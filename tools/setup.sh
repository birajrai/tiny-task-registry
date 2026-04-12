#!/bin/bash

# Tiny-Task Registry Setup Script 🚀
# This script initializes the repository for professional development.

set -e

echo "🏗️ Initializing Tiny-Task Registry Development Environment..."

# 1. Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js (LTS recommended) and try again."
    exit 1
fi

# 2. Install Dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Initialize Git Hooks
echo "🪝 Initializing Git Hooks (Husky)..."
npx husky install

# 4. Generate Initial Catalog
echo "📂 Generating initial catalog..."
npm run build

# 5. Run Initial Validation
echo "🔍 Running initial validation check..."
npm run validate

echo -e "\n✨ Setup Complete! You are ready to contribute to the Tiny-Task Registry."
echo "👉 Start by consulting the Prompt Architect: registry/general/prompt-architect/SKILL.md"
