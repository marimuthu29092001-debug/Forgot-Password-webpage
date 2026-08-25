$git = "$env:LOCALAPPDATA\Programs\MinGit\cmd\git.exe"

# 1. Config User Identity
& $git config user.email "marimuthu@stackly.io"
& $git config user.name "MariMuthu"

# 2. Git Init
& $git init

# 3. Add All Files
& $git add .

# 4. Commit
& $git commit -m "first commit"

# 5. Branch Main
& $git branch -M main

# 6. Remote Origin
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/marimuthu29092001-debug/Forgot-Password-webpage.git

# 7. Push to GitHub
& $git push -u origin main
