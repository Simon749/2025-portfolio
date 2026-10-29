
$ErrorActionPreference = "Stop"

$apiPath = ".\api\chat.ts"
$brainPath = ".\src\lib\orbit-brain.ts"

$api = Get-Content $apiPath -Raw
$brain = Get-Content $brainPath -Raw

$contextMatch = [regex]::Match($brain, '(?s)export const BOT_CONTEXT\s*=\s*`(.*?)`;')
$promptMatch = [regex]::Match($brain, '(?s)export const SYSTEM_PROMPT\s*=\s*`(.*?)`;')

if (-not $contextMatch.Success -or -not $promptMatch.Success) {
    throw "Could not extract both prompts. No changes made."
}

if ($api -notmatch 'import\s*\{\s*SYSTEM_PROMPT\s*,\s*BOT_CONTEXT\s*\}\s*from\s*"\.\./src/lib/orbit-brain\.ts";') {
    throw "Expected import was not found. No changes made."
}

$context = 'const BOT_CONTEXT = `' + $contextMatch.Groups[1].Value + '`;'
$prompt = 'const SYSTEM_PROMPT = `' + $promptMatch.Groups[1].Value + '`;'

$api = [regex]::Replace(
    $api,
    '(?m)^import\s*\{\s*SYSTEM_PROMPT\s*,\s*BOT_CONTEXT\s*\}\s*from\s*"\.\./src/lib/orbit-brain\.ts";\s*\r?\n',
    '',
    1
)

$marker = 'import { GoogleGenAI } from "@google/genai";'
$replacement = $marker + "`r`n`r`n" + $context + "`r`n`r`n" + $prompt

if (-not $api.Contains($marker)) {
    throw "Google SDK import was not found. No changes made."
}

$api = $api.Replace($marker, $replacement)

Set-Content -Path $apiPath -Value $api -Encoding utf8 -NoNewline

Write-Host "Orbit prompts inserted into api/chat.ts" -ForegroundColor Green
