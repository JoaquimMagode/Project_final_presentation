$src = Get-Content 'D:\GitHub\Project_final_presentation\App\frontend\pages\PatientDashboard.tsx' -Raw
$lines = $src -split "`n"
$depth = 0
for($i=0; $i -lt $lines.Count; $i++){
  $l = $lines[$i]
  $opens     = ([regex]::Matches($l, '<[A-Za-z]')).Count
  $closes    = ([regex]::Matches($l, '</')).Count
  $selfclose = ([regex]::Matches($l, '/>')).Count
  $depth += $opens - $closes - $selfclose
  if([Math]::Abs($depth) -gt 8){
    $preview = $l.Trim()
    if($preview.Length -gt 80){ $preview = $preview.Substring(0,80) }
    Write-Host "Line $($i+1) depth=$depth : $preview"
  }
}
Write-Host "Final depth: $depth"
