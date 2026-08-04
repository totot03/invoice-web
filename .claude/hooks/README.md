# Claude Code → Slack 모바일 알림 연동 ⚡

Claude Code에서 **권한 요청**과 **작업 완료** 이벤트를 실시간으로 모바일 Slack 앱에서 받을 수 있습니다.

## 🎯 구성 요소

| 파일 | 역할 |
|------|------|
| `notify-slack.ps1` | Slack Webhook으로 알림을 전송하는 PowerShell 스크립트 |
| `SETUP_GUIDE.md` | 단계별 설정 및 테스트 방법 |
| `README.md` | 이 파일 (개요 및 빠른 시작) |

## ⚡ 빠른 시작

### 1️⃣ Slack Webhook 준비 (5분)
- https://api.slack.com/apps 에서 **Incoming Webhook** 생성
- Webhook URL 복사: `https://hooks.slack.com/services/...`

### 2️⃣ 환경 변수 설정 (1분)
```powershell
[Environment]::SetEnvironmentVariable("SLACK_WEBHOOK_URL", "YOUR_WEBHOOK_URL", "User")
```
**`YOUR_WEBHOOK_URL`을 실제 URL로 바꿔주세요.**

### 3️⃣ Claude Code 재시작
- 기존 Claude Code 세션 종료 후 재시작
- Hooks는 세션 시작 시 로드됨

### ✅ 테스트
```powershell
'{"message":"테스트","cwd":"D:\\test"}' | powershell -NoProfile -File .\.claude\hooks\notify-slack.ps1 PermissionRequest
```
Slack에 메시지가 나타나면 성공!

## 🔔 알림 유형

| 이벤트 | 이모지 | 언제 발생 | Slack 예시 |
|--------|-------|---------|-----------|
| **권한 요청** | 🔒 | 도구 실행 권한 승인이 필요할 때 | 🔒 **권한 요청** [project-name] 14:30 |
| **작업 완료** | ✅ | Claude 응답 턴이 완료되었을 때 | ✅ **작업 완료** [project-name] 14:32 |

## 📁 파일 구조

```
.claude/
├── hooks/
│   ├── notify-slack.ps1      ← 핵심 스크립트 (Slack 메시지 전송)
│   ├── README.md             ← 이 파일 (개요)
│   ├── SETUP_GUIDE.md        ← 상세 설정 및 문제 해결
│   └── .env.example          ← (선택) 환경 변수 템플릿
└── settings.local.json       ← Hook 이벤트 등록 (자동)
```

## 🛠 설정 파일

### `.claude/settings.local.json` Hook 등록

**현재 이 프로젝트에 적용된 설정** (절대경로 방식):
```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell -NoProfile -File \"D:\\claude\\claude-nextjs-starterkit\\.claude\\hooks\\notify-slack.ps1\" PermissionRequest"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell -NoProfile -File \"D:\\claude\\claude-nextjs-starterkit\\.claude\\hooks\\notify-slack.ps1\" Complete"
          }
        ]
      }
    ]
  }
}
```

**이식 가능한 대안** (환경변수 치환, Claude Code 지원):
```json
{
  "command": "powershell -NoProfile -File \"${CLAUDE_PROJECT_DIR}\\.claude\\hooks\\notify-slack.ps1\" PermissionRequest"
}
```
⚠️ **Windows cmd.exe 문법** (`%CLAUDE_PROJECT_DIR%`)은 Claude Code 훅에서 지원되지 않습니다. **Linux/macOS에서는** `${CLAUDE_PROJECT_DIR}` 또는 shell form 사용 권장.

## 🔐 보안

- ✅ **Webhook URL은 환경 변수로 관리** → 파일(`.json`, 소스 코드, 커밋 히스토리)에 저장되지 않음
- ✅ **로그 파일 제외** → `.claude/hooks/*.log` 는 `.gitignore`에 등록되어 세션 ID 등 민감정보가 저장소에 누적되지 않음
- ✅ **Fail-Safe 설계** → 네트워크 오류/권한 부족 시에도 Claude 작업을 방해하지 않음
- ✅ **URL 마스킹** → 에러 로그에 Webhook URL 토큰이 남지 않도록 `***`으로 치환

## 📖 상세 가이드

더 자세한 설정, 테스트, 문제 해결 방법은 **`SETUP_GUIDE.md`**를 참고하세요.

---

**준비 완료?** → `SETUP_GUIDE.md` 의 "준비 단계"부터 시작하세요! 🚀
