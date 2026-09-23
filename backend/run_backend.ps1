$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'Installing dependencies...'
npm install --silent
Write-Host 'Generating Prisma client...'
npx prisma generate --schema prisma/schema.prisma
Write-Host 'Building backend...'
npm run build
Write-Host 'Starting backend server...'
npm run dev 2>&1 | Tee-Object -FilePath "$PSScriptRoot\backend-start.log"
