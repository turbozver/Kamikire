@echo off
cd /d "%~dp0"

magick favicon.png -resize 16x16 icon16.png
magick favicon.png -resize 32x32 icon32.png
magick favicon.png -resize 48x48 icon48.png
magick favicon.png -resize 128x128 icon128.png

echo done
pause