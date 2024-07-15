#! /bin/sh

# convert svg to png
inkscape -w 512 -h 512 public/logo.svg -o public/logo512.png

# create favicon
convert public/logo512.png -thumbnail 48x48 public/favicon.ico

# create sized icons
for dim in 48 72 96 144 168 192 256; do
	convert public/logo512.png -thumbnail "${dim}x${dim}" "public/logo${dim}.png"
done
