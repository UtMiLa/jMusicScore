param($installPath, $toolsPath, $package, $project)

. (Join-Path $toolsPath 'bin_tools.ps1')

$cmd = '.bin\git.cmd'
Set-BuildAction $cmd 'None'
Update-BinPaths $cmd