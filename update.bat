@pushd "%~dp0"
git add .
git commit -m "Update content"
git push origin main
@pause
exit