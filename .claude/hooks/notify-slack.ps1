param(
    [string]$EventType = "Complete"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $scriptDir "notify-slack.log"

function Write-LogEvent {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "$timestamp | $Message" -Encoding UTF8
}

function Format-MaskedUrl {
    param([string]$Text)
    # Webhook URL 패턴 (https://hooks.slack.com/services/...) 마지막 세그먼트를 마스킹
    return $Text -replace '(https://hooks\.slack\.com/services/[^/]+/[^/]+/)[^\s]+', '${1}***'
}

try {
    Write-LogEvent "EXEC: EventType=$EventType | WebhookSet=$(if ($env:SLACK_WEBHOOK_URL) { 'Yes' } else { 'No' })"

    $webhookUrl = $env:SLACK_WEBHOOK_URL
    if (-not $webhookUrl) {
        Write-LogEvent "SKIP: SLACK_WEBHOOK_URL not set (environment variable)"
        exit 0
    }

    # UTF-8 stdin을 올바르게 읽기 (콘솔 코드페이지 CP949와 무관하게 스트림을 UTF-8로 디코딩)
    # [Console]::InputEncoding 세터는 리다이렉트 환경에서 무시될 수 있으므로, StreamReader를 직접 생성
    $stdin = [Console]::OpenStandardInput()
    $reader = New-Object System.IO.StreamReader($stdin, [System.Text.Encoding]::UTF8)
    $inputData = $reader.ReadToEnd()

    if ([string]::IsNullOrWhiteSpace($inputData)) {
        Write-LogEvent "SKIP: No input data (empty stdin)"
        exit 0
    }

    try {
        $hookData = $inputData | ConvertFrom-Json
    } catch {
        Write-LogEvent "ERROR: JSON parsing failed - $(Format-MaskedUrl $_.Exception.Message)"
        exit 0
    }

    # 실제 훅 이벤트 타입 판별 (Notification vs Stop)
    $actualEventType = $hookData.hook_event_name

    if ($actualEventType -eq "Stop") {
        # Stop 이벤트 처리 (message 필드 없음)

        # stop_hook_active가 true이면 중복 알림 방지
        if ($hookData.stop_hook_active -eq $true) {
            Write-LogEvent "SKIP: stop_hook_active=true (duplicate prevention)"
            exit 0
        }

        $emoji = "✅"
        $status = "작업 완료"
        $projectName = Split-Path -Leaf $hookData.cwd
        $timestamp = Get-Date -Format "HH:mm:ss"

        # agent_type이 있으면 포함, 없으면 기본 메시지
        if ($hookData.agent_type) {
            $detail = "Agent: $($hookData.agent_type)"
        } else {
            $detail = "Claude 작업 완료"
        }
    } elseif ($actualEventType -eq "Notification") {
        # Notification 이벤트 처리
        # notification_type이 permission_prompt일 때만 권한 요청으로 표시
        if ($hookData.notification_type -eq "permission_prompt") {
            $emoji = "🔒"
            $status = "권한 요청"
        } else {
            # 다른 notification_type (idle_prompt, agent_completed 등)은 무시하거나 다르게 처리
            Write-LogEvent "INFO: Skipping non-permission notification (type=$($hookData.notification_type))"
            exit 0
        }

        $projectName = Split-Path -Leaf $hookData.cwd
        $timestamp = Get-Date -Format "HH:mm:ss"
        $detail = if ($hookData.message) { $hookData.message } else { "권한 승인 필요" }
    } else {
        Write-LogEvent "SKIP: Unknown hook_event_name=$actualEventType"
        exit 0
    }

    $payload = @{
        text = "$emoji *$status* [$projectName] $timestamp`n$detail"
    }

    $json = $payload | ConvertTo-Json -Compress
    # Windows PowerShell 5.1은 -Body의 문자열을 시스템 기본 인코딩(CP949)으로 변환하므로,
    # UTF-8 바이트 배열을 직접 전달하고 Content-Type에 charset을 명시해 charset 미지정 폴백을 방지
    $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $null = Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType "application/json; charset=utf-8" -Body $utf8Bytes -TimeoutSec 5 -ErrorAction Stop
    Write-LogEvent "OK: Message sent to Slack (EventType=$actualEventType)"
} catch {
    $maskedMessage = Format-MaskedUrl $_.Exception.Message
    Write-LogEvent "ERROR: Failed to send to Slack - $maskedMessage"
    exit 0
}

exit 0
