$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer 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"
}

$body = @{
    model = "google/gemini-3.1-flash-image-preview"
    messages = @(
        @{
            role = "user"
            content = "Generate a photorealistic image of a cutting-edge battery laboratory in Belgium, scientists working on next-generation lithium battery technology, modern clean lab environment. Return only the image."
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "https://openrouter.ai/api/v1/chat/completions" -Method Post -Headers $headers -Body $body
    $content = $response.choices[0].message.content
    Write-Output "=== IMAGE RESPONSE ==="
    Write-Output ($content.Substring(0, [Math]::Min(500, $content.Length)))
    Write-Output "=== FINISH REASON ==="
    Write-Output $response.choices[0].finish_reason
    
    # Append to article
    $appendText = "`n`n---`n`n## Afbeelding generatie`n`n- **Model:** google/gemini-3.1-flash-image-preview`n- **Status:** Response ontvangen`n- **Finish reason:** $($response.choices[0].finish_reason)`n- **Response preview:** $($content.Substring(0, [Math]::Min(200, $content.Length)))"
    Add-Content -Path "C:\Users\Annie\.openclaw\workspace\projects\nieuwsland\test-articles\gemini-flash-lite-preview-article.md" -Value $appendText
    Write-Output "=== APPENDED ==="
} catch {
    Write-Output "ERROR: $_"
    $appendText = "`n`n---`n`n## Afbeelding generatie`n`n- **Model:** google/gemini-3.1-flash-image-preview`n- **Status:** MISLUKT`n- **Error:** $_"
    Add-Content -Path "C:\Users\Annie\.openclaw\workspace\projects\nieuwsland\test-articles\gemini-flash-lite-preview-article.md" -Value $appendText
}
