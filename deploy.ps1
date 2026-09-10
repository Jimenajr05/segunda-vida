# Publica la version actual del sitio en https://jimenajr05.github.io
# Uso:  ./deploy.ps1
$ErrorActionPreference = "Stop"
$repo = "https://github.com/Jimenajr05/Jimenajr05.github.io.git"

npm run build
Copy-Item dist/index.html dist/404.html -Force
New-Item dist/.nojekyll -ItemType File -Force | Out-Null

Push-Location dist
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="Jimenajr05" -c user.email="mariajimenajr14@gmail.com" commit -q -m "Deploy"
git push -f $repo gh-pages
Pop-Location
Remove-Item dist/.git -Recurse -Force

Write-Host "Listo. En ~1 min: https://jimenajr05.github.io"
