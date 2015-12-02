rmdir /S /Q bin
cd src
dir *.ts /b /s > ts-files.txt
tsc @ts-files.txt --outDir "../bin" --module commonjs
del ts-files.txt
cd ..