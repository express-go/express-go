rmdir /S /Q bin
dir src\*.ts /b /s > ts-files.txt
call tsc @ts-files.txt --outDir bin --module commonjs
del ts-files.txt
