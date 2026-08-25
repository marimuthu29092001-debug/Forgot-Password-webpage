$gitCmdDir = "$env:LOCALAPPDATA\Programs\MinGit\cmd"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentPath -notlike "*MinGit\cmd*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$gitCmdDir", "User")
}
$env:PATH = "$gitCmdDir;$env:PATH"

Write-Host "Git path set successfully." -ForegroundColor Green
& "$gitCmdDir\git.exe" --version

# Set default identity if not set
& "$gitCmdDir\git.exe" config user.email "marimuthu@stackly.io"
& "$gitCmdDir\git.exe" config user.name "MariMuthu"

# Initialize Git Repository
& "$gitCmdDir\git.exe" init

# Add all project files
& "$gitCmdDir\git.exe" add .

# Create Commit
& "$gitCmdDir\git.exe" commit -m "feat: complete Stackly authentication, forgot password flow, Firebase auth and EmailJS setup"

# Set branch to main
& "$gitCmdDir\git.exe" branch -M main

# Configure remote repository
& "$gitCmdDir\git.exe" remote remove origin 2>$null
& "$gitCmdDir\git.exe" remote add origin https://github.com/marimuthu29092001-debug/Forgot-Password-webpage.git

# Push to GitHub
& "$gitCmdDir\git.exe" push -u origin main
