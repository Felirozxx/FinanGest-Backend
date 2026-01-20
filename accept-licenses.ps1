$process = Start-Process -FilePath "C:\flutter\bin\flutter.bat" -ArgumentList "doctor","--android-licenses" -NoNewWindow -PassThru -RedirectStandardInput "input.txt"
$process.WaitForExit()
