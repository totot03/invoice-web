# Claude Code Hooks → Slack 알림 설정 가이드

이 가이드는 Claude Code의 **권한 요청**과 **작업 완료** 이벤트를 Slack으로 받는 방법을 단계별로 설명합니다.

---

## 📋 준비 단계

### 1️⃣ Slack Webhook 설정

#### Slack 앱 생성
1. https://api.slack.com/apps 방문
2. **"Create New App"** → **"From scratch"** 선택
3. 앱 이름 입력 (예: `Claude Code Notifier`)
4. 알림을 받을 워크스페이스 선택 후 **Create App**

#### Incoming Webhook 활성화
1. 좌측 메뉴에서 **"Incoming Webhooks"** 클릭
2. 토글을 **On**으로 설정
3. **"Add New Webhook to Workspace"** 클릭
4. 알림을 받을 채널 선택 (또는 DM 채널) → **Allow**
5. 발급된 Webhook URL 복사
   ```
   https://hooks.slack.com/services/T<WORKSPACE_ID>/B<BOT_ID>/<TOKEN>
   ```
   > **형식**: `T`로 시작하는 Workspace ID, `B`로 시작하는 Bot ID, 그리고 토큰으로 구성됨

### 2️⃣ Windows 환경 변수 설정

PowerShell(관리자 권한)에서 다음 명령을 실행합니다:

```powershell
[Environment]::SetEnvironmentVariable("SLACK_WEBHOOK_URL", "https://hooks.slack.com/services/T<WORKSPACE_ID>/B<BOT_ID>/<TOKEN>", "User")
```

**`<WORKSPACE_ID>`, `<BOT_ID>`, `<TOKEN>` 부분을 위에서 복사한 실제 Webhook URL로 바꿔주세요.**
> 예시: 위의 1️⃣ 단계에서 복사한 전체 URL을 그대로 붙여넣으면 됩니다.

#### 설정 확인
```powershell
$env:SLACK_WEBHOOK_URL
```
Webhook URL이 출력되면 성공입니다. 새 PowerShell 창을 열어야 적용됩니다.

### 3️⃣ 모바일 Slack 앱 알림 설정

Slack 앱(모바일)에서:
1. 알림을 받을 채널 열기
2. 채널명 오른쪽 **⋮ (더보기)** → **알림 설정**
3. **"모든 새 메시지"** 또는 **"@mentions 및 DM"** 선택
4. **"푸시 알림 활성화"** 확인

---

## 🧪 테스트

### 수동 테스트 (Webhook URL 확인)

새 PowerShell 창에서:

```powershell
cd "D:\claude\claude-nextjs-starterkit"

# 권한 요청 시뮬레이션
'{"message":"테스트: 권한 요청","cwd":"D:\\test\\project"}' | powershell -NoProfile -File .\.claude\hooks\notify-slack.ps1 PermissionRequest

# 작업 완료 시뮬레이션
'{"message":"테스트: 작업 완료","cwd":"D:\\test\\project"}' | powershell -NoProfile -File .\.claude\hooks\notify-slack.ps1 Complete
```

Slack 채널(또는 DM)에 메시지가 도착하면 성공입니다.

### 실제 동작 테스트

1. **Claude Code 재시작** (Hooks는 세션 시작 시 로드됨)
   ```powershell
   # Claude Code CLI 종료 후 재시작
   ```

2. **권한 요청 이벤트 테스트**
   - 새 Bash 명령 실행 시도 (예: `! pwd`)
   - Claude Code가 권한 승인을 요청할 때 Slack에 🔒 **권한 요청** 알림 수신

3. **작업 완료 이벤트 테스트**
   - 임의의 작업 완료 후 (예: 간단한 파일 읽기)
   - Claude Code의 응답이 끝났을 때 Slack에 ✅ **작업 완료** 알림 수신

---

## 🔧 스크립트 구성

### 파일 구조
```
.claude/
├── hooks/
│   ├── notify-slack.ps1      # Slack 알림 스크립트
│   └── SETUP_GUIDE.md         # 이 파일
└── settings.local.json        # Hook 이벤트 등록 (자동 설정됨)
```

### Hook 이벤트

| 이벤트 | 발동 조건 | 메시지 포맷 |
|--------|---------|-----------|
| `Notification` | Claude가 권한 승인을 요청할 때 | 🔒 **권한 요청** |
| `Stop` | Claude의 응답 턴 완료 시 | ✅ **작업 완료** |

### Webhook 환경 변수

- **변수명**: `SLACK_WEBHOOK_URL`
- **범위**: 사용자 환경 변수 (모든 PowerShell 세션에서 사용 가능)
- **보안**: `.git ignore` 처리되어 커밋되지 않음

---

## ⚠️ 문제 해결

### Slack 알림이 오지 않을 때

1. **환경 변수 확인**
   ```powershell
   $env:SLACK_WEBHOOK_URL
   ```
   빈 줄이 나오면 → PowerShell 재시작 후 다시 확인

2. **Webhook URL 검증**
   ```powershell
   Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_URL -Method Post -ContentType "application/json" -Body '{"text":"테스트"}'
   ```
   성공하면 Slack 채널에 "테스트" 메시지 표시

3. **Claude Code 재시작**
   - Settings 파일 수정 후 Claude Code 세션 재시작 필요
   - Hooks는 세션 시작 시 로드됨

4. **모바일 알림 설정 확인**
   - Slack 앱 알림이 비활성화되어 있을 수 있음
   - 휴대폰의 "방해 금지" 모드 확인

### 스크립트 오류 로그

Hook 스크립트는 Fail-Safe로 설계되어 오류 발생 시 Claude 작업을 중단하지 않습니다.
상세 로그를 보려면:

```powershell
cd "D:\claude\claude-nextjs-starterkit"
'{"message":"디버그","cwd":"D:\\test"}' | powershell -NoProfile -File .\.claude\hooks\notify-slack.ps1 PermissionRequest -Verbose 4>&1
```

---

## 📱 모바일 Slack 앱 알림 팁

- **실시간 알림**: 채널 알림을 "모든 새 메시지"로 설정해야 푸시 알림이 즉시 옵니다
- **DM 채널**: 1대1 DM 채널을 선택하면 더 조용한 환경에서 알림 수신 가능
- **시간대 설정**: Slack 프로필 → 알림 → "조용한 시간" 설정으로 특정 시간에만 알림 끔

---

## ✅ 완료 확인 체크리스트

- [ ] Slack 앱 생성 및 Webhook URL 획득
- [ ] PowerShell 환경 변수 설정 (`SLACK_WEBHOOK_URL`)
- [ ] 수동 테스트 성공 (curl/Invoke-RestMethod)
- [ ] Claude Code 재시작
- [ ] 실제 권한 요청 이벤트에서 알림 수신 확인
- [ ] 작업 완료 이벤트에서 알림 수신 확인
- [ ] 모바일 Slack 앱에서 푸시 알림 수신 확인

완료되었다면 이제 Claude Code를 사용하며 모바일로 실시간 알림을 받을 수 있습니다! 🎉
