# 개인 대시보드

혼자 쓰는 비공개 대시보드. 할일/메모/게시판(일기)/구글 캘린더 연동을 제공한다.
기획/설계 문서는 [docs/](docs/) 참고.

## 1. Supabase 프로젝트 준비
1. https://supabase.com 가입 → New Project 생성 (리전은 Northeast Asia/Seoul 권장)
2. 프로젝트 대시보드 > SQL Editor 에서 [supabase/schema.sql](supabase/schema.sql) 내용을 그대로 실행
3. 프로젝트 Settings > Data API 에서 `Project URL` 확인 → `SUPABASE_URL`
4. 프로젝트 Settings > API Keys 에서 `service_role` 키 확인 → `SUPABASE_SERVICE_ROLE_KEY` (절대 외부 노출 금지)

## 2. 로컬 환경변수 설정
```bash
cp .env.local.example .env.local
node scripts/hash-password.mjs "원하는비밀번호"   # 출력된 해시를 DASHBOARD_PASSWORD_HASH 에 붙여넣기
```
`SESSION_SECRET`은 32자 이상 임의 문자열로 채운다 (예: `openssl rand -base64 32`).

## 3. 로컬 실행
```bash
npm install
npm run dev
```
http://localhost:3000 접속 → 설정한 비밀번호로 로그인.

## 4. 구글 캘린더 연동 (선택)
1. Google Calendar > 설정 > 연동할 캘린더 선택 > "캘린더 통합" 섹션
2. "비공개 주소(iCal 형식)" URL 복사
3. `.env.local`(로컬) / Vercel 환경변수(배포)에 `GOOGLE_CALENDAR_ICS_URL`로 등록
4. 설정하지 않으면 일정 위젯/페이지는 자동으로 숨겨짐

## 5. 배포 (Vercel)
1. GitHub에 비공개 저장소 생성 후 이 프로젝트 push
2. https://vercel.com 에서 New Project > 방금 만든 저장소 선택
3. Vercel 프로젝트 Settings > Environment Variables 에 아래 값 등록
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SESSION_SECRET`
   - `DASHBOARD_PASSWORD_HASH`
   - `GOOGLE_CALENDAR_ICS_URL` (선택)
4. Deploy → 발급된 `*.vercel.app` 주소로 노트북/태블릿/폰 어디서든 접속

## 기술 스택
Next.js(App Router) · Supabase(Postgres + Storage) · iron-session · Vercel 무료 티어
