# Tiny-Task Registry Setup Script 🚀
# This script initializes the repository for professional development.

Write-Host "🏗️ Initializing Tiny-Task Registry Development Environment..." -ForegroundColor Cyan

# 1. Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js not found. Please install Node.js (LTS recommended) and try again."
    exit 1
}

# 2. Install Dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

# 3. Initialize Git Hooks
Write-Host "🪝 Initializing Git Hooks (Husky)..." -ForegroundColor Green
npx husky install

# 4. Generate Initial Catalog
Write-Host "📂 Generating initial catalog..." -ForegroundColor Green
npm run build

# 5. Run Initial Validation
Write-Host "🔍 Running initial validation check..." -ForegroundColor Green
npm run validate

Write-Host "`n✨ Setup Complete! You are ready to contribute to the Tiny-Task Registry." -ForegroundColor Yellow
Write-Host "👉 Start by consulting the Prompt Architect: registry/general/prompt-architect/SKILL.md" -ForegroundColor Cyan
