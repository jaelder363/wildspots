# Wild Spots Deployment Script
# This script helps deploy the Wild Spots application

# Stop on error
$ErrorActionPreference = "Stop"

# Colors for output
$green = "\e[32m"
$yellow = "\e[33m"
$red = "\e[31m"
$reset = "\e[0m"

Write-Host "${green}🚀 Starting Wild Spots deployment...${reset}"

# Check for required tools
Write-Host "${yellow}🔍 Checking for required tools...${reset}"
$requiredTools = @("node", "npm", "git")

foreach ($tool in $requiredTools) {
    try {
        $version = & $tool --version 2>&1
        Write-Host "${green}✓ $tool $($version[0])${reset}"
    } catch {
        Write-Host "${red}✗ $tool is not installed. Please install it and try again.${reset}"
        exit 1
    }
}

# Install dependencies
Write-Host "${yellow}📦 Installing dependencies...${reset}"

# Client dependencies
Set-Location client
npm ci --production
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Build the Next.js app
Write-Host "${yellow}🏗️  Building Next.js app...${reset}"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Set-Location ..

# API dependencies
Set-Location api
npm ci --production
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Set-Location ..

# Create .env files if they don't exist
$clientEnv = ".env.local"
$apiEnv = "api/.env"

if (-not (Test-Path $clientEnv)) {
    Write-Host "${yellow}📝 Creating $clientEnv...${reset}"
    @"
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wildspots?schema=public"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth Providers (optional)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""

# Email (for password reset, etc.)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@wildspots.app"
"@ | Out-File -FilePath $clientEnv -Encoding utf8
}

if (-not (Test-Path $apiEnv)) {
    Write-Host "${yellow}📝 Creating $apiEnv...${reset}"
    @"
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wildspots?schema=public"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN=86400  # 24 hours

# CORS
CORS_ORIGIN="http://localhost:3000"

# File Upload (optional)
# UPLOAD_DIR="./uploads"
# MAX_FILE_SIZE=10485760  # 10MB
"@ | Out-File -FilePath $apiEnv -Encoding utf8
}

Write-Host "${green}✅ Environment files configured${reset}"

# Start the application
Write-Host "${green}🚀 Starting Wild Spots application...${reset}"
Write-Host "${yellow}🌐 Client: http://localhost:3000${reset}"
Write-Host "${yellow}📡 API: http://localhost:3001${reset}"

# Start the API in the background
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "api/src/server.js"
$apiProcess = $?

# Start the Next.js app
Set-Location client
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"
$clientProcess = $?

if ($apiProcess -and $clientProcess) {
    Write-Host "${green}🎉 Wild Spots is now running!${reset}"
    Write-Host "${yellow}Press Ctrl+C to stop the application${reset}"
    
    # Keep the script running until Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
    }
} else {
    Write-Host "${red}❌ Failed to start the application${reset}"
    exit 1
}
