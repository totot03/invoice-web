# 🚀 Claude Code → Slack 모바일 알림 빠른 시작 (최종 수정 버전)

## ⚠️ 이전 알림이 안 온 근본 원인 (고쳐짐)

**원인 분석:**
1. **[치명적] PowerShell stdin 파싱 버그** → `$input | Out-String` 은 PowerShell **파이프라인** 자동변수인데, Claude Code 훅은 자식 프로세스의 **OS stdin 핸들**에 JSON을 직접 흘려보냄. 이 둘은 다른 메커니즘이라 `$input`이 절대 채워지지 않아 스크립트가 매번 "빈 payload" 경로로 빠짐 → 알림이 절대 안 옴. ✅ **이번에 `[Console]::In.ReadToEnd()`로 수정**
2. **`SLACK_WEBHOOK_URL` 환경 변수 미설정** → 환경 변수가 없으면 스크립트가 안전하게 종료되어 에러 없이 알림만 안 옴 (이건 정상 동작)
3. **경로 치환 불확실성** → `%CLAUDE_PROJECT_DIR%` (Windows cmd.exe 문법)은 Claude Code에서 지원 안 됨. ✅ **이번에 문서에서 `${CLAUDE_PROJECT_DIR}` 공식 문법으로 수정, 실제 설정은 이미 절대경로 사용 중**

**2026-08-04 수정사항:**
- ✅ `notify-slack.ps1` → stdin 읽기 방식을 `[Console]::In.ReadToEnd()`로 교체 (근본 원인 해결)
- ✅ `notify-slack.ps1` → 실제 호스 이벤트 타입(`hook_event_name`, `notification_type`) 기반 분기로 정확한 처리
- ✅ `notify-slack.ps1` → `stop_hook_active` 플래그 확인해 중복 알림 방지
- ✅ `notify-slack.ps1` → 에러 로그에서 Webhook URL 토큰 마스킹 (보안)
- ✅ `notify-slack.ps1` → Slack 호출 타임아웃 5초 설정 (무한 블로킹 방지)
- ✅ `.gitignore` → `.claude/hooks/*.log` 추가 (로그 파일이 커밋되지 않도록)
- ✅ `.claude/hooks/README.md` → 환경변수 문법 및 보안 정보 업데이트

---

## 🎯 3분 안에 알림 받기

### 1️⃣ Slack Webhook 생성

https://api.slack.com/apps 에서:
1. **"Create New App"** → **"From scratch"**
2. 앱 이름 입력 (예: `Claude Code Notifier`)
3. 워크스페이스 선택
4. 좌측 메뉴 **"Incoming Webhooks"** → 토글 **On**
5. **"Add New Webhook to Workspace"** → 채널 선택 (DM 채널 가능)
6. **Webhook URL 복사**
   ```
   https://hooks.slack.com/services/T000000000/B000000000/XXXXXXXXXXXXXXXXXXXX
   ```

### 2️⃣ PowerShell에서 환경 변수 설정

**⚠️ 반드시 관리자 권한 PowerShell에서 실행하세요!**

```powershell
[Environment]::SetEnvironmentVariable("SLACK_WEBHOOK_URL", "https://hooks.slack.com/services/...", "User")
```

**위 URL을 실제 발급받은 Webhook URL로 바꾼 후 실행하세요.**

확인:
```powershell
$env:SLACK_WEBHOOK_URL
# 위에서 설정한 URL이 출력되면 OK
```

**⚠️ 중요: 새 PowerShell 창을 열어야 적용됩니다!**

### 3️⃣ 수동 테스트 (새 PowerShell 창에서)

```powershell
cd "D:\claude\claude-nextjs-starterkit"

# 권한 요청 시뮬레이션
'{"message":"테스트","cwd":"D:\\project"}' | powershell -NoProfile -File .\.claude\hooks\notify-slack.ps1 PermissionRequest
```

**Slack 채널(또는 DM)에 메시지가 도착하면 성공!** 🎉

### 4️⃣ Claude Code 재시작

기존 세션을 종료하고 새로 시작합니다. (Hooks는 세션 시작 시 로드됨)

### 5️⃣ 모바일 Slack 알림 활성화

Slack 앱(모바일)에서:
- 알림받을 채널 → ⋮ → 알림 설정
- **"모든 새 메시지"** 선택
- **푸시 알림 활성화** 확인

---

## 🔍 문제 진단: 로그 파일 확인

**알림이 여전히 안 오면** `.claude/hooks/notify-slack.log` 파일을 확인하세요:

```powershell
cd "D:\claude\claude-nextjs-starterkit"
Get-Content .\.claude\hooks\notify-slack.log -Tail 10
```

**로그 예시:**
```
2026-08-03 18:30:45 | EXEC: EventType=PermissionRequest | WebhookSet=Yes
2026-08-03 18:30:46 | OK: Message sent to Slack (EventType=PermissionRequest)
```

### 진단 키워드:
| 로그 | 의미 | 해결책 |
|-----|------|--------|
| `WebhookSet=No` | `SLACK_WEBHOOK_URL` 환경 변수가 없음 | **2️⃣ 환경 변수 설정 다시 수행** |
| `SKIP: SLACK_WEBHOOK_URL not set` | 위와 동일 | **2️⃣ 환경 변수 설정 다시 수행** |
| `ERROR: Failed to send` | 네트워크 실패 또는 Webhook URL 무효 | Webhook URL이 유효한지 확인 (Slack 앱 설정 다시 확인) |
| `OK: Message sent to Slack` | ✅ 성공! | Slack 채널 알림 설정 확인 (5️⃣ 참고) |

---

## 📱 실제 동작 흐름

### 권한 요청 시:
```
Claude Code가 권한 승인 요청
  ↓
Notification hook 발동
  ↓
notify-slack.ps1 실행 (로그 기록)
  ↓
🔒 "권한 요청 [프로젝트] 시간" 메시지
  ↓
Slack 채널 + 📱 모바일 푸시 알림
```

### 작업 완료 시:
```
Claude 응답 턴 종료
  ↓
Stop hook 발동
  ↓
notify-slack.ps1 실행 (로그 기록)
  ↓
✅ "작업 완료 [프로젝트] 시간" 메시지
  ↓
Slack 채널 + 📱 모바일 푸시 알림
```

---

## ✅ 체크리스트

- [ ] Slack 앱 생성 & Webhook URL 발급
- [ ] PowerShell 관리자 창에서 환경 변수 설정 (`SetEnvironmentVariable`)
- [ ] **새 PowerShell 창 열기** (중요!)
- [ ] `$env:SLACK_WEBHOOK_URL` 확인 (URL 출력됨)
- [ ] 수동 테스트 성공 (Slack에 메시지 도착)
- [ ] Claude Code 재시작
- [ ] 모바일 Slack 앱 알림 활성화
- [ ] 실제 권한 요청/작업 완료 시 알림 수신 확인

**모든 항목 완료 = 설정 완료!** 🎉

---

## 📚 추가 도움

- **상세 설정 가이드**: `.claude/hooks/SETUP_GUIDE.md`
- **로그 파일 위치**: `.claude/hooks/notify-slack.log`
- **스크립트 파일**: `.claude/hooks/notify-slack.ps1`
