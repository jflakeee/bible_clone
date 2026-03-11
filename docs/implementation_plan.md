# 한국어 성경 앱 종합 구현 계획서

> **프로젝트명:** 한국어 성경 앱 (Bible App)
> **작성일:** 2026-03-10
> **기술 스택:** Next.js / React Native / NestJS / Python FastAPI / PostgreSQL / Meilisearch / Supabase

---

## 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [Phase별 구현 순서와 의존성](#2-phase별-구현-순서와-의존성)
3. [각 Phase의 마일스톤 정의](#3-각-phase의-마일스톤-정의)
4. [기술 의존성 및 설치 목록](#4-기술-의존성-및-설치-목록)
5. [환경 설정](#5-환경-설정-개발스테이징프로덕션)
6. [CI/CD 파이프라인 설계](#6-cicd-파이프라인-설계)
7. [데이터 마이그레이션 전략](#7-데이터-마이그레이션-전략)
8. [기능별 상세 구현 계획 체크리스트](#8-기능별-상세-구현-계획-체크리스트)

---

## 1. 프로젝트 구조

### 1.1 모노레포 디렉토리 구조

```
bible-app/
├── apps/
│   ├── web/                          # Next.js 웹 애플리케이션
│   │   ├── public/
│   │   │   ├── fonts/                # 나눔명조 등 한글 폰트
│   │   │   ├── icons/
│   │   │   └── manifest.json         # PWA 매니페스트
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── (auth)/           # 인증 관련 라우트 그룹
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (bible)/          # 성경 뷰어 라우트 그룹
│   │   │   │   │   ├── [version]/
│   │   │   │   │   │   ├── [book]/
│   │   │   │   │   │   │   └── [chapter]/
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── compare/      # 번역 비교 뷰
│   │   │   │   │   └── search/       # 검색 페이지
│   │   │   │   ├── (study)/          # 학습 도구 라우트 그룹
│   │   │   │   │   ├── vocabulary/   # 단어장
│   │   │   │   │   ├── strongs/      # Strong's 번호 사전
│   │   │   │   │   └── map/          # 성경 지도
│   │   │   │   ├── api/              # Next.js API Routes (BFF)
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── bible/
│   │   │   │   │   ├── BibleViewer.tsx
│   │   │   │   │   ├── VerseDisplay.tsx
│   │   │   │   │   ├── ChapterNavigation.tsx
│   │   │   │   │   ├── VersionSelector.tsx
│   │   │   │   │   ├── CompareView.tsx
│   │   │   │   │   └── StrongsPopover.tsx
│   │   │   │   ├── search/
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── SearchResults.tsx
│   │   │   │   │   └── SearchFilters.tsx
│   │   │   │   ├── study/
│   │   │   │   │   ├── VocabularyCard.tsx
│   │   │   │   │   ├── MapViewer.tsx
│   │   │   │   │   └── OriginalTextView.tsx
│   │   │   │   ├── audio/
│   │   │   │   │   ├── AudioPlayer.tsx
│   │   │   │   │   └── PronunciationButton.tsx
│   │   │   │   ├── ui/               # 공통 UI 컴포넌트
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Tooltip.tsx
│   │   │   │   │   └── Loading.tsx
│   │   │   │   └── layout/
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       └── Footer.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBible.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useStrongs.ts
│   │   │   │   ├── useAudio.ts
│   │   │   │   └── useOffline.ts
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts     # 백엔드 API 클라이언트
│   │   │   │   ├── supabase.ts       # Supabase 클라이언트
│   │   │   │   └── utils.ts
│   │   │   ├── stores/               # Zustand 상태 관리
│   │   │   │   ├── bibleStore.ts
│   │   │   │   ├── searchStore.ts
│   │   │   │   └── userStore.ts
│   │   │   ├── styles/
│   │   │   │   └── globals.css       # Tailwind CSS
│   │   │   └── types/
│   │   │       ├── bible.ts
│   │   │       ├── search.ts
│   │   │       └── user.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── mobile/                       # React Native 앱
│       ├── src/
│       │   ├── screens/
│       │   │   ├── HomeScreen.tsx
│       │   │   ├── BibleScreen.tsx
│       │   │   ├── SearchScreen.tsx
│       │   │   ├── CompareScreen.tsx
│       │   │   └── StudyScreen.tsx
│       │   ├── components/           # (웹과 유사한 구조)
│       │   ├── navigation/
│       │   │   └── AppNavigator.tsx
│       │   ├── hooks/
│       │   ├── stores/
│       │   ├── services/
│       │   │   ├── offline-db.ts     # SQLite 오프라인 DB
│       │   │   └── sync.ts           # 온/오프라인 동기화
│       │   └── types/
│       ├── app.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                       # 웹/모바일 공유 코드
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   │   ├── books.ts          # 성경 66권 메타데이터
│   │   │   │   └── strongs.ts        # Strong's 번호 상수
│   │   │   ├── types/                # 공유 타입 정의
│   │   │   │   ├── bible.ts
│   │   │   │   ├── strongs.ts
│   │   │   │   └── api.ts
│   │   │   ├── utils/
│   │   │   │   ├── bible-ref.ts      # 성경 참조 파싱 (창 1:1 등)
│   │   │   │   ├── korean.ts         # 한글 처리 유틸
│   │   │   │   └── transliteration.ts
│   │   │   └── validators/
│   │   │       └── schemas.ts        # Zod 스키마
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                           # 공유 UI 컴포넌트 라이브러리
│       ├── src/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   └── index.ts
│       └── package.json
│
├── services/
│   ├── api/                          # NestJS 백엔드 API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── bible/
│   │   │   │   │   ├── bible.module.ts
│   │   │   │   │   ├── bible.controller.ts
│   │   │   │   │   ├── bible.service.ts
│   │   │   │   │   ├── bible.repository.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── get-verse.dto.ts
│   │   │   │   │       └── compare-versions.dto.ts
│   │   │   │   ├── search/
│   │   │   │   │   ├── search.module.ts
│   │   │   │   │   ├── search.controller.ts
│   │   │   │   │   ├── search.service.ts
│   │   │   │   │   └── meilisearch.provider.ts
│   │   │   │   ├── strongs/
│   │   │   │   │   ├── strongs.module.ts
│   │   │   │   │   ├── strongs.controller.ts
│   │   │   │   │   └── strongs.service.ts
│   │   │   │   ├── vocabulary/
│   │   │   │   │   ├── vocabulary.module.ts
│   │   │   │   │   ├── vocabulary.controller.ts
│   │   │   │   │   └── vocabulary.service.ts
│   │   │   │   ├── map/
│   │   │   │   │   ├── map.module.ts
│   │   │   │   │   ├── map.controller.ts
│   │   │   │   │   └── map.service.ts
│   │   │   │   ├── audio/
│   │   │   │   │   ├── audio.module.ts
│   │   │   │   │   ├── audio.controller.ts
│   │   │   │   │   └── audio.service.ts
│   │   │   │   └── auth/
│   │   │   │       ├── auth.module.ts
│   │   │   │       ├── auth.guard.ts
│   │   │   │       └── supabase-auth.strategy.ts
│   │   │   ├── common/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── decorators/
│   │   │   │   └── pipes/
│   │   │   ├── database/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── verse.entity.ts
│   │   │   │   │   ├── book.entity.ts
│   │   │   │   │   ├── version.entity.ts
│   │   │   │   │   ├── strongs-entry.entity.ts
│   │   │   │   │   ├── vocabulary.entity.ts
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── migrations/
│   │   │   │   └── seeds/
│   │   │   │       ├── bible-data.seed.ts
│   │   │   │       └── strongs-data.seed.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── nest-cli.json
│   │   └── tsconfig.json
│   │
│   └── ai/                           # Python FastAPI AI 서비스
│       ├── app/
│       │   ├── main.py
│       │   ├── routers/
│       │   │   ├── tts.py            # AI 낭독 (TTS)
│       │   │   ├── sermon.py         # 설교 검색
│       │   │   └── embedding.py      # 벡터 임베딩
│       │   ├── services/
│       │   │   ├── tts_service.py
│       │   │   ├── sermon_search.py
│       │   │   └── embedding_service.py
│       │   ├── models/
│       │   │   └── schemas.py
│       │   └── config.py
│       ├── requirements.txt
│       ├── Dockerfile
│       └── tests/
│
├── data/                             # 데이터 수집 및 변환 스크립트
│   ├── scripts/
│   │   ├── fetch_bible_helloao.py    # bible.helloao.org 데이터 수집
│   │   ├── fetch_stepbible.py        # STEPBible 데이터 수집
│   │   ├── fetch_strongs.py          # openscriptures/strongs 수집
│   │   ├── fetch_bible_brain.py      # Bible Brain API 오디오 수집
│   │   ├── fetch_openbible_geo.py    # OpenBible 지리 데이터 수집
│   │   ├── transform_korean.py       # 개역한글 변환
│   │   ├── build_search_index.py     # Meilisearch 인덱스 빌드
│   │   └── generate_sqlite.py        # 오프라인용 SQLite 생성
│   ├── raw/                          # 원본 데이터 (gitignore)
│   ├── processed/                    # 가공된 데이터
│   └── README.md
│
├── infra/                            # 인프라 설정
│   ├── docker/
│   │   ├── docker-compose.yml        # 로컬 개발 환경
│   │   ├── docker-compose.prod.yml
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.ai
│   │   └── Dockerfile.meilisearch
│   ├── supabase/
│   │   ├── config.toml
│   │   └── migrations/
│   ├── vercel/
│   │   └── vercel.json
│   └── scripts/
│       ├── setup-dev.sh
│       └── deploy.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI 파이프라인
│       ├── cd-web.yml                # 웹 배포
│       ├── cd-api.yml                # API 배포
│       └── cd-ai.yml                 # AI 서비스 배포
│
├── turbo.json                        # Turborepo 설정
├── package.json                      # 루트 package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

### 1.2 주요 설계 원칙

| 원칙 | 설명 |
|------|------|
| **모노레포** | Turborepo + pnpm 워크스페이스로 코드 공유 극대화 |
| **모듈 분리** | NestJS 모듈 단위로 기능 분리, 독립 배포 가능 |
| **오프라인 우선** | SQLite 기반 오프라인 데이터로 네트워크 없이도 성경 읽기 가능 |
| **한글 최적화** | 한글 형태소 분석, 초성 검색, 한글 폰트 최적화 |
| **점진적 로딩** | 성경 데이터는 장(chapter) 단위로 로딩, 전체 다운로드 불필요 |

---

## 2. Phase별 구현 순서와 의존성

### 2.1 의존성 다이어그램

```
[인프라 셋업] ──┬── [DB 스키마 설계] ──┬── [데이터 수집/변환] ── [Meilisearch 인덱싱]
               │                      │
               │                      ├── [NestJS API 기본 구조] ── [성경 API] ── [검색 API]
               │                      │                                │
               │                      │                     [Supabase Auth 연동]
               │                      │
               └── [Next.js 프로젝트 셋업] ── [성경 뷰어 UI] ── [번역 비교 UI] ── [검색 UI]
                                                    │
                                              [Strong's UI]

Phase 1 완료 ──┬── [원문 데이터 추가] ── [히브리어/그리스어 뷰어]
               ├── [단어장 기능] (DB + API + UI)
               ├── [발음 재생] (Bible Brain API + 오디오 플레이어)
               └── [지도 기능] (OpenBible Geo + Leaflet)

Phase 2 완료 ──┬── [AI TTS 서비스] (FastAPI + TTS 모델)
               ├── [다국어 지원] (i18n 프레임워크)
               ├── [설교 검색] (벡터 임베딩 + pgvector)
               └── [고유명사 강조] (NER/사전 기반)
```

### 2.2 Phase별 구현 순서

#### Phase 0: 기반 작업 (모든 Phase의 전제 조건)

| 순서 | 작업 | 의존성 | 예상 기간 |
|------|------|--------|----------|
| 0-1 | 모노레포 셋업 (Turborepo + pnpm) | 없음 | 1일 |
| 0-2 | Docker 개발 환경 구성 | 0-1 | 1일 |
| 0-3 | Supabase 프로젝트 생성 및 DB 초기화 | 없음 | 0.5일 |
| 0-4 | PostgreSQL 스키마 설계 및 마이그레이션 | 0-3 | 2일 |
| 0-5 | 무료 데이터 수집 스크립트 작성 | 없음 | 3일 |
| 0-6 | 데이터 변환 및 DB 시딩 | 0-4, 0-5 | 2일 |
| 0-7 | Meilisearch 인스턴스 셋업 및 인덱싱 | 0-6 | 1일 |
| 0-8 | Supabase Auth 설정 | 0-3 | 0.5일 |

#### Phase 1: MVP (성경 뷰어 + 비교 + Strong's + 검색)

| 순서 | 작업 | 의존성 | 예상 기간 |
|------|------|--------|----------|
| 1-1 | NestJS 프로젝트 기본 구조 | 0-1 | 1일 |
| 1-2 | 성경 텍스트 API (구절 조회, 장 조회) | 1-1, 0-6 | 3일 |
| 1-3 | 번역 비교 API | 1-2 | 1일 |
| 1-4 | Strong's 번호 조회 API | 1-1, 0-6 | 2일 |
| 1-5 | 검색 API (Meilisearch 연동) | 1-1, 0-7 | 2일 |
| 1-6 | Next.js 프로젝트 기본 구조 및 레이아웃 | 0-1 | 2일 |
| 1-7 | 성경 뷰어 UI (개역한글/KJV/WEB) | 1-6, 1-2 | 5일 |
| 1-8 | 번역 비교 UI | 1-7, 1-3 | 2일 |
| 1-9 | Strong's 팝오버 UI | 1-7, 1-4 | 3일 |
| 1-10 | 검색 UI | 1-6, 1-5 | 3일 |
| 1-11 | 인증 UI (로그인/회원가입) | 1-6, 0-8 | 2일 |
| 1-12 | PWA 설정 및 오프라인 기본 지원 | 1-7 | 2일 |
| 1-13 | E2E 테스트 및 QA | 1-7~1-12 | 3일 |

#### Phase 2: 원문 + 학습 도구

| 순서 | 작업 | 의존성 | 예상 기간 |
|------|------|--------|----------|
| 2-1 | 히브리어/그리스어 원문 데이터 수집 (STEPBible) | Phase 1 완료 | 3일 |
| 2-2 | 원문 텍스트 API | 2-1 | 2일 |
| 2-3 | 원문 뷰어 UI (히브리어 RTL 지원) | 2-2 | 4일 |
| 2-4 | 단어장 DB 스키마 및 API | Phase 1 완료 | 3일 |
| 2-5 | 단어장 UI (추가/복습/퀴즈) | 2-4 | 4일 |
| 2-6 | Bible Brain API 연동 (발음 오디오) | Phase 1 완료 | 2일 |
| 2-7 | 오디오 플레이어 UI | 2-6 | 3일 |
| 2-8 | 지리 데이터 수집 (OpenBible Geocoding) | Phase 1 완료 | 2일 |
| 2-9 | 지도 API | 2-8 | 2일 |
| 2-10 | 지도 UI (Leaflet + OpenStreetMap) | 2-9 | 4일 |
| 2-11 | SQLite 오프라인 DB 생성 스크립트 | 2-1 | 2일 |
| 2-12 | React Native 앱 기본 구조 | Phase 1 완료 | 3일 |
| 2-13 | E2E 테스트 및 QA | 2-3~2-12 | 3일 |

#### Phase 3: AI + 다국어 + 고급 기능

| 순서 | 작업 | 의존성 | 예상 기간 |
|------|------|--------|----------|
| 3-1 | FastAPI AI 서비스 기본 구조 | Phase 2 완료 | 2일 |
| 3-2 | AI 낭독 (TTS) 서비스 | 3-1 | 5일 |
| 3-3 | AI 낭독 UI | 3-2 | 3일 |
| 3-4 | 다국어(i18n) 프레임워크 적용 | Phase 2 완료 | 3일 |
| 3-5 | 추가 언어 데이터 수집 및 적용 | 3-4 | 3일 |
| 3-6 | pgvector 벡터 임베딩 파이프라인 | 3-1 | 4일 |
| 3-7 | 설교 검색 API | 3-6 | 3일 |
| 3-8 | 설교 검색 UI | 3-7 | 3일 |
| 3-9 | 고유명사 사전 구축 | Phase 2 완료 | 3일 |
| 3-10 | 고유명사 강조 렌더링 | 3-9 | 2일 |
| 3-11 | 성능 최적화 및 최종 QA | 3-2~3-10 | 5일 |

---

## 3. 각 Phase의 마일스톤 정의

### Phase 0: 기반 작업

| 마일스톤 | 완료 기준 | 검증 방법 |
|----------|----------|----------|
| **M0.1 - 개발 환경 구축 완료** | 모노레포 클론 후 `pnpm install && docker-compose up`으로 전체 환경 실행 가능 | 신규 개발자가 README만 보고 15분 내 환경 구축 가능 |
| **M0.2 - DB 스키마 확정** | 모든 엔티티 마이그레이션 완료, ERD 문서화 | 마이그레이션 스크립트 정상 실행 확인 |
| **M0.3 - 성경 데이터 적재 완료** | 개역한글, KJV, WEB 전권(66권) PostgreSQL 적재 | `SELECT COUNT(*) FROM verses` 결과가 각 번역본 31,000건 이상 |
| **M0.4 - Strong's 데이터 적재 완료** | 히브리어 8,674개 + 그리스어 5,624개 항목 적재 | Strong's 번호로 단어 조회 시 정의, 발음, 용례 반환 |
| **M0.5 - 검색 인덱스 구축 완료** | Meilisearch에 모든 구절 인덱싱 완료 | "사랑" 검색 시 200ms 이내 결과 반환 |

### Phase 1: MVP

| 마일스톤 | 완료 기준 | 검증 방법 |
|----------|----------|----------|
| **M1.1 - 성경 뷰어 작동** | 개역한글/KJV/WEB 선택하여 임의의 장 열람 가능 | 창세기~요한계시록 전 장 렌더링 확인, 모바일 반응형 확인 |
| **M1.2 - 번역 비교 기능** | 2개 이상 번역을 병렬 또는 절별로 비교 가능 | 요한복음 3:16을 개역한글+KJV+WEB 동시 표시 확인 |
| **M1.3 - Strong's 연동** | 영어 번역(KJV)의 단어 클릭 시 Strong's 번호, 원어, 뜻 표시 | 임의의 KJV 구절에서 명사/동사 클릭 시 팝오버 정상 표시 |
| **M1.4 - 검색 기능** | 한글/영어 키워드로 전체 성경 검색, 결과 하이라이트 | "사랑" 검색 시 500건 이상 결과, 1초 이내 응답 |
| **M1.5 - 인증 및 PWA** | 이메일/소셜 로그인 작동, 오프라인 기본 캐싱 | Supabase Auth 토큰 발급 확인, 비행기 모드에서 캐시된 장 열람 가능 |
| **M1.6 - MVP 배포 완료** | Vercel에 웹앱 배포, API는 Supabase Edge Functions 또는 외부 호스팅 | 프로덕션 URL에서 전체 기능 작동 확인 |

### Phase 2: 원문 + 학습 도구

| 마일스톤 | 완료 기준 | 검증 방법 |
|----------|----------|----------|
| **M2.1 - 히/헬 원문 표시** | 구약 히브리어, 신약 그리스어 원문 절별 표시, 한글 번역과 대조 가능 | 창세기 1:1 히브리어 원문 + 개역한글 동시 표시, RTL 렌더링 정상 |
| **M2.2 - 단어장 기능** | Strong's 단어를 단어장에 추가/삭제/복습 가능 | 사용자가 10개 단어 추가 후 퀴즈 모드에서 복습 가능 |
| **M2.3 - 발음 재생** | 히브리어/그리스어 단어 및 성경 구절 오디오 재생 | Bible Brain API에서 오디오 스트리밍, 구절 단위 재생 확인 |
| **M2.4 - 성경 지도** | 성경 속 장소를 지도 위에 표시, 클릭 시 관련 구절 표시 | 예루살렘, 바빌론 등 주요 장소 30개 이상 핀 표시 확인 |
| **M2.5 - 모바일 앱 기본** | React Native 앱에서 성경 뷰어 + 오프라인 읽기 가능 | iOS/Android 시뮬레이터에서 성경 읽기, 오프라인 모드 확인 |

### Phase 3: AI + 고급 기능

| 마일스톤 | 완료 기준 | 검증 방법 |
|----------|----------|----------|
| **M3.1 - AI 낭독** | 한국어/영어 TTS로 성경 구절 및 장 단위 낭독 | 시편 23편 한국어 낭독, 자연스러운 음성 품질 확인 |
| **M3.2 - 다국어 지원** | 최소 3개 언어(한/영/중 또는 한/영/일) UI 전환 | 언어 전환 시 모든 UI 텍스트 번역 확인 |
| **M3.3 - 설교 검색** | 벡터 유사도 기반으로 구절 관련 설교 검색 | 요한복음 3:16 입력 시 관련 설교 5건 이상 반환 |
| **M3.4 - 고유명사 강조** | 인물/지명/사건 등 고유명사 자동 강조, 클릭 시 상세 정보 | 창세기에서 "아브라함" 강조 표시, 클릭 시 인물 정보 표시 |
| **M3.5 - 프로덕션 최적화** | Lighthouse 점수 90+, Core Web Vitals 통과 | LCP < 2.5s, FID < 100ms, CLS < 0.1 |

---

## 4. 기술 의존성 및 설치 목록

### 4.1 런타임 및 패키지 매니저

| 도구 | 버전 | 용도 |
|------|------|------|
| Node.js | >= 20.x LTS | 웹/백엔드 런타임 |
| pnpm | >= 9.x | 패키지 매니저 (모노레포) |
| Python | >= 3.11 | AI 서비스 런타임 |
| Docker | >= 24.x | 컨테이너 런타임 |
| Docker Compose | >= 2.x | 로컬 개발 환경 |

### 4.2 프론트엔드 (Next.js 웹)

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "typescript": "^5.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",
    "zustand": "^5.x",
    "tailwindcss": "^4.x",
    "@tanstack/react-query": "^5.x",
    "next-intl": "^3.x",
    "leaflet": "^1.9.x",
    "react-leaflet": "^4.x",
    "zod": "^3.x",
    "lucide-react": "latest",
    "next-pwa": "^5.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/node": "^20.x",
    "@types/leaflet": "^1.x",
    "eslint": "^9.x",
    "prettier": "^3.x",
    "@playwright/test": "^1.x",
    "vitest": "^2.x"
  }
}
```

### 4.3 모바일 (React Native)

```json
{
  "dependencies": {
    "react-native": "^0.76.x",
    "expo": "^52.x",
    "@react-navigation/native": "^7.x",
    "@react-navigation/bottom-tabs": "^7.x",
    "expo-sqlite": "^15.x",
    "@supabase/supabase-js": "^2.x",
    "react-native-maps": "^1.x",
    "expo-av": "^15.x",
    "zustand": "^5.x",
    "@tanstack/react-query": "^5.x"
  }
}
```

### 4.4 백엔드 (NestJS)

```json
{
  "dependencies": {
    "@nestjs/core": "^11.x",
    "@nestjs/common": "^11.x",
    "@nestjs/platform-express": "^11.x",
    "@nestjs/typeorm": "^11.x",
    "@nestjs/config": "^4.x",
    "@nestjs/swagger": "^8.x",
    "typeorm": "^0.3.x",
    "pg": "^8.x",
    "meilisearch": "^0.42.x",
    "@supabase/supabase-js": "^2.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "helmet": "^8.x",
    "compression": "^1.x"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.x",
    "jest": "^29.x",
    "supertest": "^7.x"
  }
}
```

### 4.5 AI 서비스 (Python FastAPI)

```
# requirements.txt
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.0
sqlalchemy>=2.0
psycopg2-binary>=2.9
pgvector>=0.3.0
sentence-transformers>=3.0
TTS>=0.22.0            # Coqui TTS (또는 대안)
openai>=1.50            # OpenAI TTS API (대안)
numpy>=1.26
httpx>=0.27
python-dotenv>=1.0
pytest>=8.0
```

### 4.6 인프라 서비스

| 서비스 | 버전/티어 | 용도 |
|--------|----------|------|
| PostgreSQL | 15.x (Supabase 제공) | 주 데이터베이스 |
| pgvector | 0.7.x (Supabase 확장) | 벡터 유사도 검색 |
| Meilisearch | 1.11.x | 전문 검색 엔진 |
| Supabase | Free 티어 | Auth, DB 호스팅, Storage |
| Vercel | Free/Pro | 웹 프론트엔드 호스팅 |
| Redis (선택) | 7.x | 캐싱 (필요 시) |

### 4.7 무료 데이터 소스

| 데이터 소스 | URL | 제공 데이터 | 라이선스 |
|------------|-----|------------|---------|
| bible.helloao.org | https://bible.helloao.org | 다국어 성경 텍스트 (개역한글 포함) | 공개 도메인/자유 이용 |
| STEPBible | https://github.com/STEPBible/STEPBible-Data | 히/헬 원문, 형태소 분석, 번역 매핑 | CC BY 4.0 |
| openscriptures/strongs | https://github.com/openscriptures/strongs | Strong's 사전 데이터 (히/헬) | 공개 도메인 |
| Bible Brain API | https://www.faithcomesbyhearing.com/bible-brain | 오디오 성경, 텍스트 | API 키 필요 (무료) |
| OpenBible Geocoding | https://www.openbible.info/geo/ | 성경 장소 위도/경도 | CC BY 4.0 |
| Leaflet + OSM | https://leafletjs.com | 지도 렌더링 + 타일 | BSD-2 / ODbL |

---

## 5. 환경 설정 (개발/스테이징/프로덕션)

### 5.1 환경 변수 (.env)

```bash
# ========================================
# 공통
# ========================================
NODE_ENV=development                    # development | staging | production
APP_NAME=bible-app
LOG_LEVEL=debug                         # debug | info | warn | error

# ========================================
# Supabase
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # 서버 전용 (절대 클라이언트 노출 금지)

# ========================================
# PostgreSQL (직접 연결 시)
# ========================================
DATABASE_URL=postgresql://user:pass@localhost:5432/bible_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ========================================
# Meilisearch
# ========================================
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey123

# ========================================
# Bible Brain API
# ========================================
BIBLE_BRAIN_API_KEY=your_api_key_here

# ========================================
# AI 서비스
# ========================================
AI_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=sk-...                   # TTS 대안용 (선택)

# ========================================
# Vercel
# ========================================
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
```

### 5.2 환경별 설정 차이

| 항목 | 개발 (local) | 스테이징 (staging) | 프로덕션 (production) |
|------|-------------|-------------------|---------------------|
| **DB** | Docker PostgreSQL (localhost:5432) | Supabase 스테이징 프로젝트 | Supabase 프로덕션 프로젝트 |
| **Meilisearch** | Docker (localhost:7700) | 전용 VM 또는 Meilisearch Cloud | Meilisearch Cloud |
| **인증** | Supabase 로컬 에뮬레이터 | Supabase 스테이징 | Supabase 프로덕션 |
| **AI 서비스** | Docker (localhost:8000) | 스테이징 서버 | GPU 서버 또는 Cloud Run |
| **웹 호스팅** | localhost:3000 | Vercel Preview | Vercel Production |
| **로그 레벨** | debug | info | warn |
| **CORS** | localhost:* 허용 | 스테이징 도메인만 | 프로덕션 도메인만 |
| **캐싱** | 비활성 | 단기 (5분) | 장기 (1시간+) |
| **소스맵** | 활성 | 활성 | 비활성 (Sentry 업로드) |
| **에러 추적** | 콘솔 출력 | Sentry (스테이징) | Sentry (프로덕션) |

### 5.3 Docker Compose (개발 환경)

```yaml
# infra/docker/docker-compose.yml
version: '3.9'
services:
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: bible_db
      POSTGRES_USER: bible_user
      POSTGRES_PASSWORD: bible_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  meilisearch:
    image: getmeili/meilisearch:v1.11
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: masterKey123
      MEILI_ENV: development
    volumes:
      - meilisearch_data:/meili_data

  ai-service:
    build:
      context: ../../services/ai
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://bible_user:bible_pass@postgres:5432/bible_db
    depends_on:
      - postgres

volumes:
  postgres_data:
  meilisearch_data:
```

---

## 6. CI/CD 파이프라인 설계

### 6.1 파이프라인 개요

```
                   ┌─────────┐
                   │  Push /  │
                   │   PR     │
                   └────┬────┘
                        │
                   ┌────▼────┐
                   │  Lint   │
                   │  + Type │
                   │  Check  │
                   └────┬────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
         ┌────▼───┐ ┌───▼───┐ ┌──▼────┐
         │ 단위   │ │ 통합  │ │ E2E  │
         │ 테스트  │ │ 테스트 │ │ 테스트 │
         └────┬───┘ └───┬───┘ └──┬────┘
              │         │        │
              └─────────┼────────┘
                        │
                   ┌────▼────┐
                   │  빌드   │
                   └────┬────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
      ┌────▼───┐  ┌─────▼────┐ ┌────▼────┐
      │  Web   │  │   API    │ │   AI    │
      │ 배포   │  │  배포     │ │  배포    │
      │(Vercel)│  │(Supabase │ │(Cloud   │
      │        │  │ /Railway)│ │  Run)   │
      └────────┘  └──────────┘ └─────────┘
```

### 6.2 GitHub Actions 워크플로우

#### CI 파이프라인 (모든 PR/Push)

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  unit-test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    strategy:
      matrix:
        package: [web, api, shared]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter ${{ matrix.package }} test

  integration-test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_DB: bible_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter api test:integration

  e2e-test:
    runs-on: ubuntu-latest
    needs: [unit-test, integration-test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm --filter web e2e

  python-test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r services/ai/requirements.txt
      - run: cd services/ai && pytest
```

#### CD 파이프라인 (main 병합 시)

```yaml
# .github/workflows/cd-web.yml
name: Deploy Web
on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.3 브랜치 전략

| 브랜치 | 용도 | 배포 대상 |
|--------|------|----------|
| `main` | 프로덕션 릴리스 | Vercel Production |
| `develop` | 개발 통합 | Vercel Preview |
| `feature/*` | 기능 개발 | PR Preview |
| `hotfix/*` | 긴급 버그 수정 | main으로 직접 병합 |
| `release/v*` | 릴리스 준비 | 스테이징 환경 |

---

## 7. 데이터 마이그레이션 전략

### 7.1 데이터베이스 스키마 (핵심 테이블)

```sql
-- 성경 번역본 정보
CREATE TABLE versions (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(10) UNIQUE NOT NULL,  -- 'KRV', 'KJV', 'WEB'
    name        VARCHAR(100) NOT NULL,         -- '개역한글', 'King James Version'
    language    VARCHAR(10) NOT NULL,          -- 'ko', 'en'
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 성경 책 정보
CREATE TABLE books (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(10) NOT NULL,      -- 'GEN', 'EXO', ...
    name_ko         VARCHAR(20) NOT NULL,      -- '창세기', '출애굽기'
    name_en         VARCHAR(30) NOT NULL,      -- 'Genesis', 'Exodus'
    testament       VARCHAR(2) NOT NULL,       -- 'OT', 'NT'
    book_order      SMALLINT NOT NULL,         -- 1~66
    chapter_count   SMALLINT NOT NULL,
    UNIQUE(code)
);

-- 성경 구절
CREATE TABLE verses (
    id          BIGSERIAL PRIMARY KEY,
    version_id  INT REFERENCES versions(id),
    book_id     INT REFERENCES books(id),
    chapter     SMALLINT NOT NULL,
    verse       SMALLINT NOT NULL,
    text        TEXT NOT NULL,
    UNIQUE(version_id, book_id, chapter, verse)
);

-- 검색 최적화 인덱스
CREATE INDEX idx_verses_lookup ON verses(version_id, book_id, chapter);
CREATE INDEX idx_verses_text_gin ON verses USING gin(to_tsvector('simple', text));

-- Strong's 사전
CREATE TABLE strongs_entries (
    id              SERIAL PRIMARY KEY,
    strongs_number  VARCHAR(10) UNIQUE NOT NULL, -- 'H1', 'G3588'
    language        VARCHAR(2) NOT NULL,          -- 'he', 'el'
    original_word   TEXT NOT NULL,                -- 원어 단어
    transliteration VARCHAR(100),                 -- 음역
    pronunciation   VARCHAR(100),                 -- 발음 기호
    definition_en   TEXT NOT NULL,                -- 영어 정의
    definition_ko   TEXT,                         -- 한국어 정의
    usage_count     INT DEFAULT 0,               -- 성경 내 사용 횟수
    part_of_speech  VARCHAR(20)                  -- 품사
);

-- 구절-Strong's 매핑
CREATE TABLE verse_strongs (
    id              BIGSERIAL PRIMARY KEY,
    verse_id        BIGINT REFERENCES verses(id),
    strongs_number  VARCHAR(10) REFERENCES strongs_entries(strongs_number),
    word_position   SMALLINT NOT NULL,           -- 구절 내 단어 위치
    original_word   TEXT,                        -- 해당 위치의 원어
    translated_word TEXT                         -- 번역된 단어
);

-- 사용자 단어장
CREATE TABLE vocabulary (
    id              SERIAL PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id),
    strongs_number  VARCHAR(10) REFERENCES strongs_entries(strongs_number),
    notes           TEXT,
    mastery_level   SMALLINT DEFAULT 0,          -- 0~5 숙달도
    next_review_at  TIMESTAMPTZ,                 -- 다음 복습 시간 (SRS)
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, strongs_number)
);

-- 성경 지리 데이터
CREATE TABLE locations (
    id          SERIAL PRIMARY KEY,
    name_en     VARCHAR(100) NOT NULL,
    name_ko     VARCHAR(50),
    name_he     VARCHAR(100),                   -- 히브리어 지명
    latitude    DECIMAL(10, 7) NOT NULL,
    longitude   DECIMAL(10, 7) NOT NULL,
    description TEXT,
    period      VARCHAR(50)                     -- 시대 구분
);

-- 장소-구절 매핑
CREATE TABLE location_verses (
    location_id INT REFERENCES locations(id),
    verse_id    BIGINT REFERENCES verses(id),
    PRIMARY KEY (location_id, verse_id)
);

-- 고유명사 사전
CREATE TABLE proper_nouns (
    id              SERIAL PRIMARY KEY,
    name_ko         VARCHAR(50) NOT NULL,
    name_en         VARCHAR(50),
    name_original   VARCHAR(100),               -- 원어
    category        VARCHAR(20) NOT NULL,        -- 'person', 'place', 'event'
    description     TEXT,
    strongs_number  VARCHAR(10)
);

-- 설교 데이터 (Phase 3)
CREATE TABLE sermons (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT NOT NULL,
    author      VARCHAR(100),
    source_url  TEXT,
    embedding   vector(384),                    -- pgvector 벡터 컬럼
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sermons_embedding ON sermons USING ivfflat (embedding vector_cosine_ops);
```

### 7.2 데이터 수집 및 적재 파이프라인

```
단계 1: 원본 데이터 수집
───────────────────────
bible.helloao.org ──── GET /api/ko/KRV ──────┐
                  ──── GET /api/en/KJV ──────┤
                  ──── GET /api/en/WEB ──────┤
                                             ├──→ data/raw/
STEPBible GitHub ──── git clone ─────────────┤
openscriptures   ──── git clone ─────────────┤
OpenBible Geo    ──── download CSV ──────────┘

단계 2: 데이터 정규화 및 변환
───────────────────────────
data/raw/ ──→ Python 스크립트 ──→ data/processed/
  - JSON/XML → 통일된 JSON 포맷
  - 인코딩 정규화 (UTF-8)
  - 성경 참조 코드 표준화 (OSIS)
  - Strong's 번호 매핑 검증

단계 3: DB 적재
──────────────
data/processed/ ──→ TypeORM Seed ──→ PostgreSQL
  - 트랜잭션 단위: 책(book) 단위
  - 중복 체크: UPSERT 사용
  - 진행률 표시 및 로깅

단계 4: 검색 인덱스 구축
──────────────────────
PostgreSQL ──→ Meilisearch Indexer ──→ Meilisearch
  - 인덱스: bible_verses
  - 검색 가능 속성: text, book_name
  - 필터링 속성: version, book, testament
  - 한글 토크나이저 설정

단계 5: 오프라인 DB 생성
──────────────────────
PostgreSQL ──→ SQLite Generator ──→ bible_offline.sqlite
  - 개역한글 전권 + Strong's 기본 데이터
  - 파일 크기 목표: < 50MB
  - 앱 번들에 포함 또는 최초 실행 시 다운로드
```

### 7.3 마이그레이션 원칙

| 원칙 | 설명 |
|------|------|
| **버전 관리** | 모든 스키마 변경은 TypeORM 마이그레이션 파일로 관리 |
| **롤백 가능** | 각 마이그레이션에 `up()`, `down()` 모두 구현 |
| **데이터 불변** | 성경 원문 데이터는 수정 금지, 새 버전은 새 레코드로 추가 |
| **시드 분리** | 기초 데이터(성경 텍스트)와 사용자 데이터 시드 분리 |
| **증분 업데이트** | 전체 재적재 대신 변경분만 업데이트 지원 |
| **백업 우선** | 프로덕션 마이그레이션 전 반드시 스냅샷 생성 |

### 7.4 마이그레이션 실행 순서

```bash
# Phase 0: 초기 스키마
pnpm --filter api migration:run     # 테이블 생성
pnpm --filter api seed:versions     # 번역본 정보 삽입
pnpm --filter api seed:books        # 66권 책 정보 삽입
pnpm --filter api seed:verses       # 성경 구절 삽입 (개역한글, KJV, WEB)
pnpm --filter api seed:strongs      # Strong's 사전 삽입

# Phase 1: 검색 인덱스
python data/scripts/build_search_index.py

# Phase 2: 추가 데이터
pnpm --filter api seed:locations    # 지리 데이터 삽입
pnpm --filter api seed:original     # 히/헬 원문 삽입
python data/scripts/generate_sqlite.py

# Phase 3: AI 데이터
python data/scripts/build_embeddings.py  # 벡터 임베딩 생성
pnpm --filter api seed:proper-nouns      # 고유명사 사전 삽입
```

---

## 8. 기능별 상세 구현 계획 체크리스트

---

### Phase 1: MVP

---

#### 8.1 성경 뷰어 (개역한글 + KJV + WEB)

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 10일

##### 프론트엔드

- [ ] Next.js App Router 기본 구조 설정 (`/[version]/[book]/[chapter]`)
- [ ] `BibleViewer` 컴포넌트 구현
  - [ ] 구절 텍스트 렌더링 (절 번호 + 본문)
  - [ ] 구절 클릭 시 선택/하이라이트 기능
  - [ ] 구절 길게 누르기(모바일) → 복사/공유 메뉴
- [ ] `VersionSelector` 컴포넌트 구현
  - [ ] 드롭다운으로 번역본 선택 (개역한글/KJV/WEB)
  - [ ] 선택 시 URL 변경 및 데이터 재로딩
- [ ] `ChapterNavigation` 컴포넌트 구현
  - [ ] 이전/다음 장 버튼
  - [ ] 책 목록 사이드바 (구약 39권 + 신약 27권)
  - [ ] 장 번호 그리드 선택기
  - [ ] 키보드 단축키 (← → 장 이동)
- [ ] 한글 타이포그래피 최적화
  - [ ] 나눔명조/본명조 웹폰트 적용
  - [ ] 글자 크기 조절 기능 (14px ~ 24px)
  - [ ] 줄 간격 조절 기능
  - [ ] 다크모드 지원
- [ ] `useBible` 커스텀 훅 구현
  - [ ] React Query 기반 데이터 페칭
  - [ ] 클라이언트 캐싱 (이전/다음 장 프리페치)
  - [ ] 로딩/에러 상태 처리
- [ ] 반응형 레이아웃 구현
  - [ ] 모바일 (< 768px): 단일 컬럼, 하단 네비게이션
  - [ ] 태블릿 (768px ~ 1024px): 사이드바 토글
  - [ ] 데스크톱 (> 1024px): 사이드바 항상 표시

##### 백엔드

- [ ] NestJS 프로젝트 초기 설정 (TypeORM, Swagger, 환경 변수)
- [ ] `BibleModule` 모듈 생성
- [ ] `BibleController` 엔드포인트 구현
  - [ ] `GET /api/bible/versions` - 사용 가능한 번역본 목록
  - [ ] `GET /api/bible/books` - 성경 책 목록 (한글/영문명 포함)
  - [ ] `GET /api/bible/:version/:book/:chapter` - 특정 장의 모든 구절
  - [ ] `GET /api/bible/:version/:book/:chapter/:verse` - 특정 구절
- [ ] `BibleService` 비즈니스 로직
  - [ ] 구절 조회 및 캐싱 (Redis 또는 인메모리)
  - [ ] 한글 책 이름 ↔ 코드 변환 ("창세기" → "GEN")
  - [ ] 약어 지원 ("창" → "창세기", "요" → "요한복음")
- [ ] 응답 DTO 정의 및 Swagger 문서화
- [ ] 단위 테스트 작성 (커버리지 80% 이상)

##### 데이터베이스

- [ ] `versions` 테이블 마이그레이션 및 시드 (개역한글, KJV, WEB)
- [ ] `books` 테이블 마이그레이션 및 시드 (66권)
- [ ] `verses` 테이블 마이그레이션 및 인덱스 생성
- [ ] bible.helloao.org에서 개역한글 데이터 수집 스크립트 작성
- [ ] KJV/WEB 데이터 수집 및 적재
- [ ] 데이터 무결성 검증 (각 번역본 장/절 수 확인)

---

#### 8.2 번역 비교

> **예상 난이도:** ★★☆☆☆ (쉬움)
> **예상 기간:** 3일

##### 프론트엔드

- [ ] `CompareView` 컴포넌트 구현
  - [ ] 병렬 모드: 2~3개 번역본을 컬럼으로 나란히 표시
  - [ ] 인터리브 모드: 같은 절을 번역본별로 연달아 표시
  - [ ] 모드 전환 토글 버튼
- [ ] 비교할 번역본 선택 UI (체크박스)
- [ ] 절 번호 기준 동기 스크롤 (병렬 모드)
- [ ] 차이 하이라이트 (선택적, 영어 번역 간 diff)
- [ ] 공유 URL 생성 (`/compare?versions=KRV,KJV&book=JHN&chapter=3`)

##### 백엔드

- [ ] `GET /api/bible/compare` 엔드포인트
  - [ ] 쿼리 파라미터: `versions` (쉼표 구분), `book`, `chapter`, `verse` (선택)
  - [ ] 여러 번역본 구절을 한 번의 쿼리로 조회
- [ ] 응답 포맷: `{ verses: [{ verse: 1, translations: { KRV: "...", KJV: "..." } }] }`
- [ ] 단위 테스트 작성

##### 데이터베이스

- [ ] 비교 조회 최적화 쿼리 작성 (JOIN 또는 서브쿼리)
- [ ] 복합 인덱스 검토: `(book_id, chapter, verse, version_id)`

---

#### 8.3 Strong's 단어 뜻

> **예상 난이도:** ★★★★☆ (어려움)
> **예상 기간:** 5일

##### 프론트엔드

- [ ] `StrongsPopover` 컴포넌트 구현
  - [ ] KJV 구절의 단어 클릭 시 팝오버 표시
  - [ ] 표시 내용: Strong's 번호, 원어(히/헬), 음역, 발음, 뜻
  - [ ] 해당 단어의 성경 내 사용 횟수 표시
  - [ ] "단어장에 추가" 버튼 (Phase 2 연동)
  - [ ] 팝오버 외부 클릭 시 닫기
- [ ] KJV 구절 텍스트에 Strong's 매핑된 단어 표시
  - [ ] Strong's 번호가 있는 단어에 밑줄/색상 표시
  - [ ] 호버 시 간략한 툴팁
- [ ] `useStrongs` 커스텀 훅
  - [ ] Strong's 번호로 상세 정보 조회
  - [ ] 캐싱 (이미 조회한 단어 재사용)
- [ ] Strong's 사전 전용 페이지 (`/strongs/H1234`)
  - [ ] 상세 정의, 용례 목록
  - [ ] 관련 단어 (같은 어근)

##### 백엔드

- [ ] `StrongsModule` 모듈 생성
- [ ] `StrongsController` 엔드포인트
  - [ ] `GET /api/strongs/:number` - Strong's 번호로 상세 조회
  - [ ] `GET /api/strongs/search?q=love` - 영어 정의로 검색
  - [ ] `GET /api/strongs/:number/verses` - 해당 단어가 사용된 구절 목록
- [ ] `StrongsService` 구현
  - [ ] openscriptures/strongs 데이터 파싱 로직
  - [ ] 한국어 정의 매핑 (가능한 범위)
- [ ] 단위 테스트 작성

##### 데이터베이스

- [ ] `strongs_entries` 테이블 마이그레이션
- [ ] `verse_strongs` 매핑 테이블 마이그레이션
- [ ] openscriptures/strongs GitHub 데이터 수집 스크립트
  - [ ] XML 파싱 → JSON 변환
  - [ ] 히브리어 8,674항목 + 그리스어 5,624항목 적재
- [ ] STEPBible 데이터에서 구절-Strong's 매핑 추출
- [ ] 매핑 데이터 무결성 검증

---

#### 8.4 검색

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 5일

##### 프론트엔드

- [ ] `SearchBar` 컴포넌트 구현
  - [ ] 입력 즉시 검색 (디바운스 300ms)
  - [ ] 자동완성 / 검색 제안
  - [ ] 최근 검색어 표시
  - [ ] 한글 초성 검색 지원 ("ㅅㄹ" → "사랑")
- [ ] `SearchResults` 컴포넌트 구현
  - [ ] 검색 결과 목록 (책명 + 장:절 + 본문 스니펫)
  - [ ] 검색어 하이라이트
  - [ ] 무한 스크롤 또는 페이지네이션
  - [ ] 결과 클릭 시 성경 뷰어로 이동
- [ ] `SearchFilters` 컴포넌트 구현
  - [ ] 번역본 필터 (개역한글/KJV/WEB)
  - [ ] 구약/신약 필터
  - [ ] 특정 책 필터
- [ ] `useSearch` 커스텀 훅
  - [ ] Meilisearch 연동 (API 경유)
  - [ ] 검색 상태 관리 (로딩, 결과, 에러)
  - [ ] 검색 히스토리 로컬 저장

##### 백엔드

- [ ] `SearchModule` 모듈 생성
- [ ] `MeilisearchProvider` - Meilisearch 클라이언트 초기화
- [ ] `SearchController` 엔드포인트
  - [ ] `GET /api/search?q=사랑&version=KRV&book=JHN` - 전문 검색
  - [ ] `GET /api/search/suggest?q=사` - 자동완성 제안
- [ ] `SearchService` 구현
  - [ ] Meilisearch 쿼리 빌드 (필터, 정렬, 페이지네이션)
  - [ ] 한글 검색 최적화 (형태소 분석 고려)
  - [ ] 검색 결과 포맷팅 (하이라이트 마크업)
- [ ] Meilisearch 인덱스 설정
  - [ ] `bible_verses` 인덱스 생성
  - [ ] 검색 가능 속성: `text`, `book_name_ko`, `book_name_en`
  - [ ] 필터 속성: `version_code`, `testament`, `book_code`
  - [ ] 정렬 속성: `book_order`, `chapter`, `verse`
  - [ ] 한글 토크나이저 구성
- [ ] 단위 테스트 및 검색 품질 테스트

##### 데이터베이스

- [ ] Meilisearch 인덱스 빌드 스크립트 (`build_search_index.py`)
  - [ ] PostgreSQL에서 모든 구절 추출
  - [ ] Meilisearch 문서 포맷으로 변환
  - [ ] 배치 인덱싱 (1,000건 단위)
- [ ] 인덱스 업데이트 전략 수립 (새 번역본 추가 시)

---

### Phase 2: 원문 + 학습 도구

---

#### 8.5 히브리어/그리스어 원문

> **예상 난이도:** ★★★★★ (매우 어려움)
> **예상 기간:** 7일

##### 프론트엔드

- [ ] `OriginalTextView` 컴포넌트 구현
  - [ ] 히브리어 RTL (오른쪽에서 왼쪽) 텍스트 렌더링
  - [ ] 그리스어 텍스트 렌더링
  - [ ] 원문 + 한글 번역 대조 뷰 (위아래 또는 좌우)
  - [ ] 단어별 분해 표시 (형태소 분석 결과)
- [ ] 원어 단어 클릭 시 상세 정보 팝오버
  - [ ] 기본형 (lemma)
  - [ ] 형태소 분석 (품사, 시제, 인칭 등)
  - [ ] Strong's 번호 연결
  - [ ] 한국어 뜻
- [ ] 히브리어/그리스어 유니코드 폰트 설정
  - [ ] SBL Hebrew, SBL Greek 폰트 로딩
  - [ ] 폰트 fallback 체인
- [ ] 원문 읽기 모드 토글 (원문만 / 대조 / 인터리니어)

##### 백엔드

- [ ] 원문 텍스트 API 엔드포인트
  - [ ] `GET /api/bible/original/:testament/:book/:chapter` - 원문 조회
  - [ ] `GET /api/bible/original/:testament/:book/:chapter/:verse/morphology` - 형태소 분석
- [ ] STEPBible 데이터 파싱 서비스
  - [ ] OSHB (Open Scriptures Hebrew Bible) 데이터 처리
  - [ ] SBLGNT (SBL Greek New Testament) 데이터 처리
  - [ ] 형태소 분석 코드 → 한국어 문법 용어 변환

##### 데이터베이스

- [ ] 원문 구절 테이블 추가 (`original_verses`)
- [ ] 형태소 분석 테이블 추가 (`morphology`)
- [ ] STEPBible GitHub 데이터 수집 및 파싱 스크립트
  - [ ] OSHB 데이터 수집 (히브리어 구약)
  - [ ] SBLGNT 데이터 수집 (그리스어 신약)
  - [ ] 형태소 태그 파싱 및 저장
- [ ] 원문-번역 절 단위 매핑 검증

---

#### 8.6 단어장

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 7일

##### 프론트엔드

- [ ] `VocabularyCard` 컴포넌트
  - [ ] 카드 앞면: 원어 단어 + 발음
  - [ ] 카드 뒷면: 한국어/영어 뜻 + 용례
  - [ ] 카드 뒤집기 애니메이션
- [ ] 단어장 목록 페이지 (`/vocabulary`)
  - [ ] 추가한 단어 목록 (최신순/알파벳순/숙달도순)
  - [ ] 단어 검색/필터
  - [ ] 단어 삭제 기능
- [ ] 복습 모드 (`/vocabulary/review`)
  - [ ] 간격 반복 학습 (SRS: Spaced Repetition System)
  - [ ] "알겠음" / "모르겠음" 버튼으로 숙달도 업데이트
  - [ ] 오늘 복습할 단어 수 표시
- [ ] 퀴즈 모드 (`/vocabulary/quiz`)
  - [ ] 원어 → 뜻 맞추기 (객관식)
  - [ ] 뜻 → 원어 맞추기
  - [ ] 결과 요약 표시
- [ ] Strong's 팝오버에 "단어장 추가" 버튼 연동

##### 백엔드

- [ ] `VocabularyModule` 모듈 생성
- [ ] `VocabularyController` 엔드포인트
  - [ ] `POST /api/vocabulary` - 단어 추가
  - [ ] `GET /api/vocabulary` - 내 단어장 목록 (페이지네이션)
  - [ ] `DELETE /api/vocabulary/:id` - 단어 삭제
  - [ ] `PATCH /api/vocabulary/:id/review` - 복습 결과 업데이트 (숙달도)
  - [ ] `GET /api/vocabulary/review` - 오늘 복습할 단어 목록
  - [ ] `GET /api/vocabulary/quiz` - 퀴즈 문제 생성
- [ ] SRS 알고리즘 구현 (SM-2 기반)
  - [ ] 숙달도에 따른 다음 복습 간격 계산
  - [ ] `next_review_at` 자동 업데이트
- [ ] 인증 가드 적용 (로그인 필수)

##### 데이터베이스

- [ ] `vocabulary` 테이블 마이그레이션
- [ ] 사용자별 인덱스: `(user_id, strongs_number)`
- [ ] 복습 대상 조회 인덱스: `(user_id, next_review_at)`

---

#### 8.7 발음 재생

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 5일

##### 프론트엔드

- [ ] `AudioPlayer` 컴포넌트
  - [ ] 재생/일시정지/정지 버튼
  - [ ] 진행 바 (현재 위치 표시)
  - [ ] 재생 속도 조절 (0.5x ~ 2.0x)
  - [ ] 구절 단위 자동 스크롤 (오디오와 동기화)
  - [ ] 반복 재생 모드 (한 구절 / 한 장)
- [ ] `PronunciationButton` 컴포넌트
  - [ ] 단어 옆 스피커 아이콘
  - [ ] 클릭 시 단어 발음 재생
- [ ] 미니 플레이어 (하단 고정, 페이지 이동 시에도 유지)
- [ ] 오프라인 오디오 다운로드 (선택)

##### 백엔드

- [ ] `AudioModule` 모듈 생성
- [ ] `AudioController` 엔드포인트
  - [ ] `GET /api/audio/:version/:book/:chapter` - 장 단위 오디오 URL
  - [ ] `GET /api/audio/pronunciation/:strongs` - 단어 발음 오디오
- [ ] Bible Brain API 연동 서비스
  - [ ] API 키 인증
  - [ ] 오디오 파일 URL 조회 (한국어, 영어)
  - [ ] 오디오 메타데이터 캐싱 (절별 타임스탬프)
- [ ] 오디오 스트리밍 프록시 (CORS 우회용, 필요 시)

##### 데이터베이스

- [ ] `audio_metadata` 테이블 (오디오 URL 캐시)
- [ ] Bible Brain API 응답 캐싱 전략

---

#### 8.8 성경 지도

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 6일

##### 프론트엔드

- [ ] `MapViewer` 컴포넌트 (Leaflet + React-Leaflet)
  - [ ] OpenStreetMap 타일 레이어
  - [ ] 고대 중동 지역 기본 뷰 (위도 31, 경도 35 중심)
  - [ ] 성경 장소 마커 표시
  - [ ] 마커 클릭 시 팝업 (장소명, 설명, 관련 구절 링크)
  - [ ] 마커 클러스터링 (확대 수준에 따라)
- [ ] 지도 필터 기능
  - [ ] 시대별 필터 (족장 시대, 출애굽, 왕정, 신약 등)
  - [ ] 인물별 필터 (아브라함의 여정, 바울의 선교 여행 등)
  - [ ] 책별 필터
- [ ] 성경 뷰어 연동
  - [ ] 구절의 장소명 클릭 시 지도로 이동
  - [ ] 지도에서 장소 클릭 시 관련 구절 목록
- [ ] 여정 경로 표시 (폴리라인)
  - [ ] 출애굽 경로
  - [ ] 바울의 선교 여행 경로
  - [ ] 예수님의 사역 경로

##### 백엔드

- [ ] `MapModule` 모듈 생성
- [ ] `MapController` 엔드포인트
  - [ ] `GET /api/map/locations` - 전체 장소 목록 (필터 지원)
  - [ ] `GET /api/map/locations/:id` - 장소 상세 정보
  - [ ] `GET /api/map/locations/:id/verses` - 장소 관련 구절
  - [ ] `GET /api/map/routes/:routeId` - 여정 경로 데이터
- [ ] OpenBible Geocoding 데이터 파싱

##### 데이터베이스

- [ ] `locations` 테이블 마이그레이션
- [ ] `location_verses` 매핑 테이블 마이그레이션
- [ ] `routes` 테이블 (여정 경로)
- [ ] OpenBible Geocoding 데이터 수집 및 적재 스크립트
- [ ] 장소-구절 매핑 데이터 구축 (수동 + 자동)
- [ ] 위도/경도 공간 인덱스 (PostGIS 또는 기본 인덱스)

---

### Phase 3: AI + 고급 기능

---

#### 8.9 AI 낭독

> **예상 난이도:** ★★★★★ (매우 어려움)
> **예상 기간:** 8일

##### 프론트엔드

- [ ] AI 낭독 전용 플레이어 UI
  - [ ] 음성 선택 (남성/여성, 톤)
  - [ ] 속도/피치 조절 슬라이더
  - [ ] 장 단위 연속 재생
  - [ ] 구절 하이라이트 동기화
  - [ ] 백그라운드 재생 지원
- [ ] 낭독 설정 저장 (선호 음성, 속도)
- [ ] 생성된 오디오 캐싱 (IndexedDB)

##### 백엔드 (FastAPI AI 서비스)

- [ ] FastAPI 프로젝트 기본 구조 설정
- [ ] TTS 라우터 (`/api/ai/tts`)
  - [ ] `POST /api/ai/tts/generate` - TTS 오디오 생성
    - [ ] 입력: 텍스트, 언어, 음성 설정
    - [ ] 출력: 오디오 스트림 (MP3/OGG)
  - [ ] `GET /api/ai/tts/voices` - 사용 가능한 음성 목록
- [ ] TTS 서비스 구현
  - [ ] Coqui TTS 또는 Edge TTS 모델 통합
  - [ ] 한국어 TTS 모델 선택 및 미세 조정
  - [ ] 영어 TTS 지원
  - [ ] 오디오 후처리 (노이즈 제거, 정규화)
- [ ] 오디오 캐싱 (생성된 오디오 파일 저장)
  - [ ] Supabase Storage 또는 S3 업로드
  - [ ] 캐시 키: `{version}_{book}_{chapter}_{voice}`
- [ ] 요청 큐잉 (장 단위 생성은 시간 소요)
- [ ] NestJS API Gateway에서 AI 서비스 프록시

##### 인프라

- [ ] GPU 서버 프로비저닝 (TTS 모델 추론용)
  - [ ] Google Cloud Run GPU 또는 Lambda GPU
  - [ ] 또는 경량 모델 사용 시 CPU 서버 가능
- [ ] TTS 모델 아티팩트 관리 (모델 파일 저장/배포)

---

#### 8.10 다국어 지원

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 6일

##### 프론트엔드

- [ ] `next-intl` 프레임워크 설정
  - [ ] 기본 언어: 한국어 (ko)
  - [ ] 지원 언어: 영어 (en), 중국어 (zh) 또는 일본어 (ja)
  - [ ] URL 기반 로케일 라우팅 (`/ko/...`, `/en/...`)
- [ ] 번역 파일 구성
  - [ ] `messages/ko.json` - 한국어 UI 텍스트
  - [ ] `messages/en.json` - 영어 UI 텍스트
  - [ ] `messages/zh.json` - 중국어 UI 텍스트
- [ ] 모든 하드코딩된 한국어 텍스트를 번역 키로 교체
- [ ] 언어 선택 UI (헤더 드롭다운)
- [ ] 언어별 날짜/숫자 포맷팅
- [ ] 언어별 폰트 최적화
- [ ] RTL 레이아웃 지원 기반 (아랍어 등 향후 확장 대비)

##### 백엔드

- [ ] API 응답 다국어 지원
  - [ ] `Accept-Language` 헤더 처리
  - [ ] 에러 메시지 다국어
  - [ ] 책 이름 다국어 반환
- [ ] 추가 성경 번역본 데이터 수집 (중국어/일본어)
  - [ ] bible.helloao.org에서 해당 언어 데이터 수집

##### 데이터베이스

- [ ] 다국어 책 이름 테이블 확장 또는 별도 테이블
- [ ] 추가 번역본 `versions` 레코드 삽입
- [ ] 추가 번역본 `verses` 데이터 적재

---

#### 8.11 설교 검색

> **예상 난이도:** ★★★★★ (매우 어려움)
> **예상 기간:** 7일

##### 프론트엔드

- [ ] 설교 검색 UI (`/study/sermons`)
  - [ ] 성경 구절 입력 → 관련 설교 검색
  - [ ] 키워드 기반 설교 검색
  - [ ] 검색 결과 카드 (제목, 저자, 요약, 유사도 점수)
  - [ ] 설교 전문 보기
- [ ] 성경 뷰어 연동
  - [ ] 구절 선택 후 "관련 설교 찾기" 버튼
  - [ ] 사이드 패널에서 관련 설교 표시

##### 백엔드 (FastAPI AI 서비스)

- [ ] 벡터 임베딩 라우터 (`/api/ai/embedding`)
  - [ ] `POST /api/ai/embedding/encode` - 텍스트 → 벡터 변환
  - [ ] `POST /api/ai/sermon/search` - 구절/키워드로 설교 검색
- [ ] 임베딩 서비스 구현
  - [ ] Sentence-Transformers 한국어 모델 (`ko-sroberta-multitask` 등)
  - [ ] 텍스트 → 384차원 벡터 변환
  - [ ] 배치 인코딩 지원
- [ ] 설교 검색 서비스 구현
  - [ ] pgvector 코사인 유사도 검색
  - [ ] 입력 구절을 벡터로 변환 → DB에서 유사 설교 검색
  - [ ] 결과 재순위화 (Reranking)
- [ ] NestJS 설교 관련 엔드포인트 (프록시)
  - [ ] `POST /api/sermons/search`
  - [ ] `GET /api/sermons/:id`

##### 데이터베이스

- [ ] `sermons` 테이블 마이그레이션 (pgvector 컬럼 포함)
- [ ] pgvector 확장 활성화 (`CREATE EXTENSION vector;`)
- [ ] IVFFlat 인덱스 생성 (코사인 유사도)
- [ ] 설교 데이터 수집 (공개 도메인 설교)
  - [ ] 데이터 소스 선정 및 크롤링 스크립트
  - [ ] 텍스트 정제 및 벡터 임베딩 생성
  - [ ] 배치 적재 스크립트 (`build_embeddings.py`)

---

#### 8.12 고유명사 강조

> **예상 난이도:** ★★★☆☆ (중간)
> **예상 기간:** 5일

##### 프론트엔드

- [ ] 고유명사 강조 렌더링
  - [ ] 인물: 파란색 밑줄
  - [ ] 지명: 초록색 밑줄
  - [ ] 사건: 주황색 밑줄
  - [ ] 강조 on/off 토글
- [ ] 고유명사 클릭 시 정보 패널
  - [ ] 카테고리 (인물/지명/사건)
  - [ ] 원어(히/헬) 이름
  - [ ] 간략 설명
  - [ ] 관련 구절 링크
  - [ ] 지명인 경우 지도 바로가기
- [ ] 고유명사 목록 페이지 (사전)
  - [ ] 가나다순/카테고리별 정렬
  - [ ] 검색 기능

##### 백엔드

- [ ] 고유명사 API 엔드포인트
  - [ ] `GET /api/proper-nouns` - 전체 목록 (페이지네이션)
  - [ ] `GET /api/proper-nouns/:id` - 상세 정보
  - [ ] `GET /api/proper-nouns/by-verse/:verseId` - 구절 내 고유명사
- [ ] 고유명사 감지 서비스
  - [ ] 사전 기반 매칭 (빠르고 정확)
  - [ ] 구절 텍스트에서 고유명사 위치(offset) 반환
- [ ] 고유명사 사전 데이터 구축
  - [ ] STEPBible 인물/지명 데이터 활용
  - [ ] 한글 성경 고유명사 목록 정리

##### 데이터베이스

- [ ] `proper_nouns` 테이블 마이그레이션
- [ ] `verse_proper_nouns` 매핑 테이블
- [ ] 고유명사 사전 데이터 적재
  - [ ] 인물 약 3,000명
  - [ ] 지명 약 1,500곳
  - [ ] 주요 사건 약 200개
- [ ] 한글 이름 ↔ 원어 매핑

---

## 부록

### A. 성능 목표

| 지표 | 목표치 | 측정 방법 |
|------|--------|----------|
| 장 로딩 시간 | < 500ms | Lighthouse, 실측 |
| 검색 응답 시간 | < 300ms | Meilisearch 대시보드 |
| 첫 화면 렌더링 (LCP) | < 2.5s | Core Web Vitals |
| 번들 크기 (초기) | < 200KB (gzipped) | webpack-bundle-analyzer |
| 오프라인 DB 크기 | < 50MB | SQLite 파일 크기 |
| API 동시 접속 | 1,000 RPS | k6 부하 테스트 |

### B. 보안 체크리스트

- [ ] Supabase RLS (Row Level Security) 정책 설정
- [ ] API Rate Limiting 적용 (IP당, 사용자당)
- [ ] SQL Injection 방지 (TypeORM 파라미터 바인딩)
- [ ] XSS 방지 (React 기본 이스케이핑 + DOMPurify)
- [ ] CORS 정책 설정 (허용 도메인 명시)
- [ ] 환경 변수 암호화 (Vercel/Supabase Secret)
- [ ] API 키 노출 방지 (`NEXT_PUBLIC_` 접두사 주의)
- [ ] HTTPS 강제 (Vercel 기본 제공)
- [ ] 의존성 취약점 스캔 (GitHub Dependabot)

### C. 모니터링 및 로깅

- [ ] Vercel Analytics 설정 (웹 성능 모니터링)
- [ ] Sentry 에러 추적 설정 (프론트엔드 + 백엔드)
- [ ] 구조화된 로깅 (JSON 포맷, 요청 ID 추적)
- [ ] Supabase 대시보드 DB 모니터링
- [ ] Meilisearch 대시보드 검색 품질 모니터링
- [ ] 사용자 행동 분석 (선택적: Plausible 등 프라이버시 친화적 도구)

### D. 접근성 (a11y)

- [ ] WCAG 2.1 AA 준수
- [ ] 스크린 리더 호환 (ARIA 레이블)
- [ ] 키보드 내비게이션 (Tab, Enter, Esc)
- [ ] 색상 대비 비율 4.5:1 이상
- [ ] 폰트 크기 최소 16px (모바일)
- [ ] 히브리어 RTL 접근성 확인
