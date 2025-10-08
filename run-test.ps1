# ============================================================================
# Test Script with Detailed Logging and Violation Classification
# ============================================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CHAHUADEV SENTINEL - TEST WITH DETAILED LOGS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: สร้าง logs folder
Write-Host "[STEP 1] Creating logs directory..." -ForegroundColor Yellow

$logsDir = ".\logs"
if (Test-Path $logsDir) {
    Write-Host "  -> Cleaning existing logs directory..." -ForegroundColor Gray
    Remove-Item -Path $logsDir -Recurse -Force
}

New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
Write-Host "  [OK] Logs directory created: $logsDir" -ForegroundColor Green
Write-Host ""

# Step 2: รัน validation
Write-Host "[STEP 2] Running validation on src/ directory..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$rawLogFile = "$logsDir\raw-output-$timestamp.log"

Write-Host "  -> Executing: node cli.js --quiet src" -ForegroundColor Gray

$output = & node cli.js --quiet src 2>&1 | Out-String
$exitCode = $LASTEXITCODE

$output | Out-File -FilePath $rawLogFile -Encoding UTF8

Write-Host "  [OK] Validation completed with exit code: $exitCode" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Yellow" })
Write-Host "  [OK] Raw output saved" -ForegroundColor Green
Write-Host ""

# Step 3: แยกประเภทการละเมิด
Write-Host "[STEP 3] Classifying violations by rule..." -ForegroundColor Yellow

$rules = @{
    "NO_EMOJI" = "$logsDir\violations-NO_EMOJI.log"
    "NO_HARDCODE" = "$logsDir\violations-NO_HARDCODE.log"
    "NO_SILENT_FALLBACKS" = "$logsDir\violations-NO_SILENT_FALLBACKS.log"
    "NO_INTERNAL_CACHING" = "$logsDir\violations-NO_INTERNAL_CACHING.log"
    "NO_MOCKING" = "$logsDir\violations-NO_MOCKING.log"
}

$violationCounts = @{}

foreach ($rule in $rules.Keys) {
    Write-Host "  -> Processing $rule violations..." -ForegroundColor Gray
    
    $pattern = $rule
    $violationLines = @()
    $count = 0
    
    foreach ($line in $output -split "`n") {
        if ($line -match $pattern) {
            $violationLines += $line
            $count++
        }
    }
    
    # สร้าง header
    $header = "=" * 80
    $title = "$rule VIOLATIONS - Found $count instances"
    $timestampLine = "Timestamp: $timestamp"
    $sourceLine = "Source: src/ directory"
    $separator = "=" * 80
    
    # เขียนไฟล์
    $header | Out-File -FilePath $rules[$rule] -Encoding UTF8
    $title | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    $header | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    $timestampLine | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    $sourceLine | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    $separator | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    "" | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    
    if ($count -gt 0) {
        $violationLines | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    } else {
        "No violations found." | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
    }
    
    $violationCounts[$rule] = $count
    Write-Host "    [INFO] Found $count violations" -ForegroundColor $(if ($count -eq 0) { "Green" } else { "Red" })
}

Write-Host ""

# Step 4: แยก Errors
Write-Host "[STEP 4] Extracting errors..." -ForegroundColor Yellow

$errorLogFile = "$logsDir\errors-$timestamp.log"
$errorLines = @()
$errorCount = 0

foreach ($line in $output -split "`n") {
    if ($line -match "Error|ERROR|SyntaxError|TypeError|ReferenceError") {
        $errorLines += $line
        $errorCount++
    }
}

# สร้าง error log
$errorHeader = "=" * 80
"ERRORS DETECTED - Found $errorCount error lines" | Out-File -FilePath $errorLogFile -Encoding UTF8
$errorHeader | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
"Timestamp: $timestamp" | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
"Source: src/ directory" | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
$errorHeader | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
"" | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append

if ($errorCount -gt 0) {
    $errorLines | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
    Write-Host "  [WARN] Found $errorCount error lines" -ForegroundColor Red
} else {
    "No errors detected" | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
    Write-Host "  [OK] No errors detected" -ForegroundColor Green
}

Write-Host ""

# Step 5: สร้าง Summary
Write-Host "[STEP 5] Generating summary report..." -ForegroundColor Yellow

$summaryFile = "$logsDir\SUMMARY-$timestamp.log"
$totalViolations = ($violationCounts.Values | Measure-Object -Sum).Sum

# สร้าง summary content
$summaryLines = @()
$summaryLines += "=" * 80
$summaryLines += "              CHAHUADEV SENTINEL - TEST SUMMARY"
$summaryLines += "=" * 80
$summaryLines += "Timestamp: $timestamp"
$summaryLines += "Test Target: src/ directory"
$summaryLines += "Exit Code: $exitCode"
$summaryLines += "=" * 80
$summaryLines += ""
$summaryLines += "VIOLATION BREAKDOWN:"
$summaryLines += "-" * 20

foreach ($rule in $rules.Keys | Sort-Object) {
    $count = $violationCounts[$rule]
    $status = if ($count -eq 0) { "[PASS]" } else { "[FAIL]" }
    $summaryLines += "  $status | $rule : $count violations"
}

$summaryLines += ""
$summaryLines += "TOTAL VIOLATIONS: $totalViolations"
$summaryLines += ""
$summaryLines += "ERROR SUMMARY:"
$summaryLines += "-" * 14
$summaryLines += "  Total Error Lines: $errorCount"
$summaryStatus = if ($errorCount -eq 0) { "[CLEAN]" } else { "[NEEDS ATTENTION]" }
$summaryLines += "  Status: $summaryStatus"
$summaryLines += ""
$summaryLines += "FILES GENERATED:"
$summaryLines += "-" * 16
$summaryLines += "  1. Raw Output: raw-output-$timestamp.log"
$summaryLines += "  2. NO_EMOJI Violations: violations-NO_EMOJI.log"
$summaryLines += "  3. NO_HARDCODE Violations: violations-NO_HARDCODE.log"
$summaryLines += "  4. NO_SILENT_FALLBACKS Violations: violations-NO_SILENT_FALLBACKS.log"
$summaryLines += "  5. NO_INTERNAL_CACHING Violations: violations-NO_INTERNAL_CACHING.log"
$summaryLines += "  6. NO_MOCKING Violations: violations-NO_MOCKING.log"
$summaryLines += "  7. Errors: errors-$timestamp.log"
$summaryLines += "  8. Summary: SUMMARY-$timestamp.log"
$summaryLines += ""
$summaryLines += "=" * 80
$summaryLines += "                       END OF REPORT"
$summaryLines += "=" * 80

$summaryLines | Out-File -FilePath $summaryFile -Encoding UTF8

Write-Host "  [OK] Summary report generated" -ForegroundColor Green
Write-Host ""

# Step 6: แสดงผลสรุป
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "              TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($rule in $rules.Keys | Sort-Object) {
    $count = $violationCounts[$rule]
    $color = if ($count -eq 0) { "Green" } else { "Red" }
    $symbol = if ($count -eq 0) { "[OK]" } else { "[X]" }
    
    Write-Host "  $symbol $rule" -ForegroundColor $color -NoNewline
    Write-Host " : " -NoNewline
    Write-Host "$count violations" -ForegroundColor $color
}

Write-Host ""
Write-Host "  Total Violations: " -NoNewline
Write-Host "$totalViolations" -ForegroundColor $(if ($totalViolations -eq 0) { "Green" } else { "Red" })

Write-Host "  Total Errors: " -NoNewline
Write-Host "$errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })

Write-Host ""
Write-Host "  All logs saved to: " -NoNewline -ForegroundColor Yellow
Write-Host "$logsDir" -ForegroundColor Cyan

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 7: เปิด summary ถ้ามีปัญหา
if ($totalViolations -gt 0 -or $errorCount -gt 0) {
    Write-Host "[WARNING] Issues detected. Opening summary file..." -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    notepad $summaryFile
}

Write-Host "[OK] Test completed!" -ForegroundColor Green
