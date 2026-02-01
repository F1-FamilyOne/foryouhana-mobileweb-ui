# foryouhana-mobileweb-ui
하나은행 아이앞으로 모바일 웹 프론트엔드. Next.js 16(App Router)과 React 19를 기반으로 자녀 증여/투자 흐름, 타임라인, 홈 대시보드 UI를 제공합니다.

## 기술 스택
- Next.js 16 / React 19 / TypeScript
- Tailwind CSS v4 + PostCSS
- Prisma(MySQL) with server actions, seed 데이터 포함
- Biome(포맷팅 & 린트), Storybook 10

## 시스템 아키텍처
```
[Next.js App Router (React 19)]
        ↓ Server Actions (actions/*)
    Prisma Client (lib/prisma)
        ↓
   MySQL 8 (docker-compose:3310)
```
- 라우트는 `app/*`의 서버 컴포넌트가 담당하고, 데이터 변경은 server action → Prisma → MySQL 순으로 반영됩니다.
- 캐시 무효화는 `revalidatePath`를 사용(`actions/timeline.ts` 등).

## 주요 디렉터리
- `app/` — 페이지 라우팅(App Router). `app/main/[childId]/timeline`에서 타임라인, `app/main/[childId]/home`에서 홈 대시보드, `app/register`에서 가입/가이드 흐름을 구성.
- `components/` — UI 컴포넌트 및 도메인 컴포넌트. `components/timeline/*`은 타임라인 카드/요약/모달을 담당하고, `components/ui/*`는 공통 버튼·탭·모달 등을 제공.
- `actions/` — 서버 액션(Prisma). 예: `actions/timeline.ts`의 `saveTimelineMessage`는 타임라인 메모 저장 후 `revalidatePath`로 목록을 즉시 갱신.
- `prisma/` — `schema.prisma`, 마이그레이션, `seed.ts`(샘플 계좌·타임라인·알림 데이터).
- `constants/`, `hooks/`, `lib/` — 공통 상수, React 훅, Prisma 클라이언트(`lib/prisma`) 및 유틸.

## 데이터/도메인 스키마 요약 (`prisma/schema.prisma`)
- `user`: 부모·자녀 프로필, 투자 성향, 목표 금액, 권한 관계(`read_auth`)를 포함.
- `account`: 펀드/연금/입출금 계좌, 부모-자식(연금 하위계좌) 구조, 수익률 및 상태(`account_status`) 관리.
- `fund`: 펀드/ETF/신탁 메타데이터, 수수료·수익률, 적립 방식(`fund_saving_type`).
- `history`: 계좌 간 자금 이동 내역(증여·투자·해지 등).
- `timeline`: 자녀별 이벤트 로그 + `memo` 필드(타임라인 메모).
- `auto_transfer`: 자동이체 설정(원천/목표 계좌, 주기, 금액).
- `read_auth`: 부모가 볼 수 있는 자녀 권한 매핑.

## 파일 구조(요약)
```
app/
  layout.tsx
  EntryClient.tsx
  main/[childId]/
    home/page.tsx
    timeline/page.tsx
    planEdit/*        # 플랜 편집 UI
    product-list/*    # 상품 리스트/상세
    my-product/*      # 보유 상품/입출금
  register/*          # 가입/검증 흐름
  onboarding/*        # 온보딩 & 챗봇
components/
  timeline/*          # 타임라인 카드·모달
  cmm/*               # 공통 UI
  ui/*                # 버튼/탭/모달 등
actions/              # 서버 액션 (Prisma)
prisma/
  schema.prisma
  seed.ts
  migrations/
stories/              # Storybook 스토리
```

## 핵심 기능 개요
- **타임라인**: `app/main/[childId]/timeline/page.tsx`에서 자녀별 타임라인을 서버에서 조회하여 카드 리스트로 렌더링. 
- **투자/계좌 데이터**: `prisma/seed.ts`가 부모/자녀(김부모, 김첫째 2018생, 김둘째 2000생), 계좌, 자동이체, 히스토리, 펀드 정보를 생성. 포트폴리오·플랜 편집 UI는 `app/main/[childId]/planEdit/*`에 배치.
- **홈/대시보드**: `app/main/[childId]/home`에서 자녀 프로필 토글, 잔액·수익률, 추천 상품 등을 표시.
- **Storybook**: UI 컴포넌트 단위 테스트/프리뷰를 위해 `stories/`와 `.storybook/` 설정 제공.

## 로컬 개발 가이드
1) **의존성 설치**: `pnpm install`  
2) **환경 변수**: `.env`에 MySQL 연결 정보 설정  
   - `DATABASE_URL=mysql://USER:PASSWORD@localhost:3310/DATABASE_NAME`
   - `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`는 `docker-compose.yaml`의 `localdb` 서비스와 동일하게 맞춥니다.
3) **DB 실행**: `docker compose up -d localdb` (포트 3310 노출, 데이터는 `./mysql` 볼륨에 보존)
4) **Prisma 동기화/시드**:  
   - 스키마 반영: `pnpm db:push` (또는 이미 존재하는 마이그레이션이 필요하면 `pnpm db:mig`)  
   - 샘플 데이터: `pnpm db:seed`
5) **개발 서버**: `pnpm dev` → http://localhost:3000  
6) **스토리북**: `pnpm storybook` → http://localhost:6006  
7) **품질 도구**: `pnpm lint`(Biome 체크), `pnpm format`(자동 포맷)

## 참고 메모
- 타임라인/알림 등 서버 연동은 모두 Prisma 서버 액션을 사용하므로 로컬 DB가 반드시 떠 있어야 합니다.
- Tailwind v4를 사용하므로 PostCSS 설정(`postcss.config.mjs`)과 `app/globals.css`가 함께 필요합니다.
- `prisma/migrations`가 비어 있어도 `db:push`로 스키마를 즉시 동기화할 수 있습니다(필요 시 이후 마이그레이션 생성).

## 기여 크레딧
- 팀명/서비스: F1 · 아이앞으로 (권순범, 김선우, 신호림, 유민영, 유지예, 유하임, 이승빈, 이정수)
