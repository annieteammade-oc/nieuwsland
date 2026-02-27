$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer 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"
}

$body = @{
    model = "google/gemini-2.5-flash-lite-preview-09-2025"
    messages = @(
        @{
            role = "user"
            content = "Schrijf een professioneel Nederlands nieuwsartikel van 400-600 woorden over: Belgische startup ontwikkelt revolutionaire batterij die 10x sneller oplaadt. Schrijf in nieuwsstijl met titel, inleiding, quotes van fictieve experts, en conclusie. Geef alleen het artikel in markdown format."
        }
    )
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Method Post -Headers $headers -Body $body
$article = $response.choices[0].message.content
$article | Out-File -FilePath "C:\Users\Annie\.openclaw\workspace\projects\nieuwsland\test-articles\gemini-flash-lite-preview-article.md" -Encoding utf8
Write-Output "=== DONE ==="
Write-Output $article.Substring(0, [Math]::Min(500, $article.Length))
