echo Copying files to example
copy options.css Example\options
copy options.html Example\options
copy node_modules\preact\dist\preact.min.js Example\options
echo Producing release
del Release.zip
"%ProgramW6432%\7-Zip\7z.exe" a -tzip -mx9 -bd Release.zip .\Example\options\*
