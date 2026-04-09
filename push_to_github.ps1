# TakeWeb GitHub Push Script

Write-Host "Starting Git initialization..." -ForegroundColor Cyan

# 1. Initialize Git if not already done
if (!(Test-Path .git)) {
    git init
    Write-Host "Git initialized." -ForegroundColor Green
} else {
    Write-Host "Git already initialized." -ForegroundColor Yellow
}

# 2. Add all files
Write-Host "Staging files..." -ForegroundColor Cyan
git add .

# 3. Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "feat: complete rebranding and UI/UX enhancements"

# 4. Set branch to main
git branch -M main

# 5. Add remote origin
git remote remove origin 2>$null
git remote add origin https://github.com/TakeWebTech/Takeweb_website.git
Write-Host "Remote origin set to TakeWebTech/Takeweb_website" -ForegroundColor Green

# 6. Push to GitHub
Write-Host "Pushing to GitHub (main)..." -ForegroundColor Cyan
Write-Host "You may be prompted for credentials if they are not cached." -ForegroundColor Yellow
git push -u origin main

Write-Host "Done! Your code should now be live on GitHub." -ForegroundColor Green
