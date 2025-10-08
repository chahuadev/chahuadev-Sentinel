# ============================================================================
# Test Script with Detailed Logging and Violation Classification
# ============================================================================
# สร้างโดย: Chahuadev Sentinel
# วัตถุประสงค์: รัน validation และแยกประเภทการละเมิดออกเป็นไฟล์แยก
# ============================================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  CHAHUADEV SENTINEL - TEST WITH DETAILED LOGS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Step 1: สร้าง logs folder
# ============================================================================
Write-Host "[STEP 1] Creating logs directory..." -ForegroundColor Yellow

$logsDir = ".\logs"
if (Test-Path $logsDir) {
    Write-Host "  -> Cleaning existing logs directory..." -ForegroundColor Gray
    Remove-Item -Path $logsDir -Recurse -Force
}

New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
Write-Host "  ✓ Logs directory created: $logsDir" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Step 2: รัน validation และบันทึกผลลัพธ์
# ============================================================================
Write-Host "[STEP 2] Running validation on src/ directory..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$rawLogFile = "$logsDir\raw-output-$timestamp.log"

Write-Host "  -> Executing: node cli.js --quiet src" -ForegroundColor Gray
Write-Host "  -> Output will be saved to: $rawLogFile" -ForegroundColor Gray

# รันคำสั่งและเก็บ output
$output = & node cli.js --quiet src 2>&1 | Out-String
$exitCode = $LASTEXITCODE

# บันทึก raw output
$output | Out-File -FilePath $rawLogFile -Encoding UTF8

Write-Host "  ✓ Validation completed with exit code: $exitCode" -ForegroundColor $(if ($exitCode -eq 0) { "Green" } else { "Yellow" })
Write-Host "  ✓ Raw output saved to: $rawLogFile" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Step 3: แยกประเภทการละเมิดตาม 5 กฎ
# ============================================================================
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
    $matches = $output | Select-String -Pattern $pattern -AllMatches
    
    if ($matches) {
        $violationLines = @()
        $count = 0
        
        # แยกบรรทัดที่มีการละเมิด
        foreach ($line in $output -split "`n") {
            if ($line -match $pattern) {
                $violationLines += $line
                $count++
            }
        }
        
        # บันทึกลงไฟล์
        $header = @"
============================================================================
$rule VIOLATIONS - Found $count instances
============================================================================
Timestamp: $timestamp
Source: src/ directory
============================================================================

"@
        $header | Out-File -FilePath $rules[$rule] -Encoding UTF8
        $violationLines | Out-File -FilePath $rules[$rule] -Encoding UTF8 -Append
        
        $violationCounts[$rule] = $count
        Write-Host "    ✓ Found $count violations" -ForegroundColor $(if ($count -eq 0) { "Green" } else { "Red" })
    } else {
        "No violations found for $rule" | Out-File -FilePath $rules[$rule] -Encoding UTF8
        $violationCounts[$rule] = 0
        Write-Host "    ✓ No violations found" -ForegroundColor Green
    }
}

Write-Host ""

# ============================================================================
# Step 4: แยก Syntax Errors และ Runtime Errors
# ============================================================================
Write-Host "[STEP 4] Extracting errors..." -ForegroundColor Yellow

$errorLogFile = "$logsDir\errors-$timestamp.log"
$errorLines = @()
$errorCount = 0

foreach ($line in $output -split "`n") {
    if ($line -match "Error|ERROR|SyntaxError|TypeError|ReferenceError|⚠️|❌") {
        $errorLines += $line
        $errorCount++
    }
}

if ($errorCount -gt 0) {
    $errorHeader = @"
============================================================================
ERRORS DETECTED - Found $errorCount error lines
============================================================================
Timestamp: $timestamp
Source: src/ directory
============================================================================

"@
    $errorHeader | Out-File -FilePath $errorLogFile -Encoding UTF8
    $errorLines | Out-File -FilePath $errorLogFile -Encoding UTF8 -Append
    
    Write-Host "  ✓ Found $errorCount error lines" -ForegroundColor Red
    Write-Host "  ✓ Errors saved to: $errorLogFile" -ForegroundColor Green
} else {
    "No errors detected" | Out-File -FilePath $errorLogFile -Encoding UTF8
    Write-Host "  ✓ No errors detected" -ForegroundColor Green
}

Write-Host ""

# ============================================================================
# Step 5: สร้าง Summary Report
# ============================================================================
Write-Host "[STEP 5] Generating summary report..." -ForegroundColor Yellow

$summaryFile = "$logsDir\SUMMARY-$timestamp.log"

$summary = @"
============================================================================
                    CHAHUADEV SENTINEL - TEST SUMMARY
============================================================================
Timestamp: $timestamp
Test Target: src/ directory
Exit Code: $exitCode
============================================================================

VIOLATION BREAKDOWN:
--------------------
$(foreach ($rule in $rules.Keys | Sort-Object) {
    $count = $violationCounts[$rule]
    $status = if ($count -eq 0) { "[PASS]" } else { "[FAIL]" }
    "  $status | $rule : $count violations"
})

TOTAL VIOLATIONS: $(($violationCounts.Values | Measure-Object -Sum).Sum)

ERROR SUMMARY:
--------------
  Total Error Lines: $errorCount
  Status: $(if ($errorCount -eq 0) { "[CLEAN]" } else { "[NEEDS ATTENTION]" })

FILES GENERATED:
----------------
  1. Raw Output: raw-output-$timestamp.log
  2. NO_EMOJI Violations: violations-NO_EMOJI.log
  3. NO_HARDCODE Violations: violations-NO_HARDCODE.log
  4. NO_SILENT_FALLBACKS Violations: violations-NO_SILENT_FALLBACKS.log
  5. NO_INTERNAL_CACHING Violations: violations-NO_INTERNAL_CACHING.log
  6. NO_MOCKING Violations: violations-NO_MOCKING.log
  7. Errors: errors-$timestamp.log
  8. Summary: SUMMARY-$timestamp.log

============================================================================
                           END OF REPORT
============================================================================
"@

$summary | Out-File -FilePath $summaryFile -Encoding UTF8

Write-Host "  ✓ Summary report generated: $summaryFile" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Step 6: แสดงผลสรุป
# ============================================================================
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
$totalViolations = ($violationCounts.Values | Measure-Object -Sum).Sum
Write-Host "$totalViolations" -ForegroundColor $(if ($totalViolations -eq 0) { "Green" } else { "Red" })

Write-Host "  Total Errors: " -NoNewline
Write-Host "$errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })

Write-Host ""
Write-Host "  [Folder icon] All logs saved to: " -NoNewline -ForegroundColor Yellow
Write-Host "$logsDir" -ForegroundColor Cyan

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Step 7: เปิด summary ถ้ามี violations
# ============================================================================
if ($totalViolations -gt 0 -or $errorCount -gt 0) {
    Write-Host "[WARNING] Issues detected. Opening summary file..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    notepad $summaryFile
}

Write-Host "[OK] Test completed!" -ForegroundColor Green
