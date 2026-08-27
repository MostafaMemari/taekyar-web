$ErrorActionPreference = "Stop"
Start-Process -FilePath "npx.cmd" -ArgumentList "next", "start", "-p", "3125" -WindowStyle Hidden
Start-Sleep -Seconds 7
try {
  $h = Invoke-WebRequest -Uri "http://localhost:3125/blog/dollyo-chagki-common-mistakes" -UseBasicParsing
  $cssPath = ($h.Content | Select-String -Pattern '/_next/static/chunks/[^"\s]+\.css').Matches[0].Value
  $css = (Invoke-WebRequest -Uri "http://localhost:3125$cssPath" -UseBasicParsing).Content
  $attr = 'data-scroll-behavior="smooth"'
  Write-Output ("attribute on html: " + $h.Content.Contains($attr))
  Write-Output ("html smooth rule in css: " + ($css.Replace(" ", "") -match [regex]::Escape("scroll-behavior:smooth")))
  Write-Output ("reduced-motion override present: " + ($css -match "prefers-reduced-motion"))
} finally {
  $listener = Get-NetTCPConnection -LocalPort 3125 -State Listen -ErrorAction SilentlyContinue
  if ($listener) { Stop-Process -Id $listener.OwningProcess -Force }
}
