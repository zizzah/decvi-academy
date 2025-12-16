$files = @(
    "src/app/api/admin/analytics/dashboard/route.ts",
    "src/app/api/admin/cohorts/create/route.ts",
    "src/app/api/assignments/[id]/route.ts",
    "src/app/api/assignments/[id]/submit/route.ts",
    "src/app/api/assignments/route.ts",
    "src/app/api/attendance/check-in/route.ts",
    "src/app/api/auth/me/route.ts",
    "src/app/api/certificates/check-eligibility/route.ts",
    "src/app/api/classes/active/route.ts",
    "src/app/api/cohorts/route.ts",
    "src/app/api/conversations/[conversationId]/route.ts",
    "src/app/api/conversations/route.ts",
    "src/app/api/instructor/[id]/dashboard/route.ts",
    "src/app/api/instructor/assignments/[id]/results/[resultId]/route.ts",
    "src/app/api/instructor/assignments/[id]/route.ts",
    "src/app/api/instructor/assignments/route.ts",
    "src/app/api/instructor/classes/route.ts",
    "src/app/api/instructor/students/route.ts",
    "src/app/api/live-classes/[id]/enroll/route.ts",
    "src/app/api/live-classes/[id]/route.ts",
    "src/app/api/live-classes/[id]/start/route.ts",
    "src/app/api/live-classes/route.ts",
    "src/app/api/messages/[messageId]/react/route.ts",
    "src/app/api/projects/route.ts",
    "src/app/api/projects/submit/route.ts",
    "src/app/api/pusher/auth/route.ts",
    "src/app/api/recommendations/generate/route.ts",
    "src/app/api/students/[id]/progress/route.ts",
    "src/app/api/users/search/route.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -notmatch "export const dynamic = 'force-dynamic'") {
            $newContent = "export const dynamic = 'force-dynamic';`n" + $content
            Set-Content $file $newContent -NoNewline
            Write-Host "✓ Added to $file" -ForegroundColor Green
        } else {
            Write-Host "- Already exists in $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}