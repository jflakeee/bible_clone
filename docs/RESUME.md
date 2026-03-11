# 프로젝트 진행 현황 (RESUME)

> 최종 업데이트: 2026-03-10

---

## 프로젝트 개요

**프로젝트명:** 한국어 성경 앱 (Bible App)
**목표:** 한국어 + 원어(히브리어/헬라어) + 다국어 번역 비교 + AI 낭독을 통합한 성경 학습 앱

---

## 완료된 작업

### 1단계: 아이디어 검토 — 완료
- [x] `docs/idea_1.txt` 검토 — 15개 기능 항목 확인
- [x] 기능 분류 및 초기 검토 의견 작성

### 2단계: 리서치 — 완료
- [x] 성경 텍스트 API/데이터 소스 조사 (6개 API 비교)
- [x] 한국어 성경 저작권 조사 (개역한글 무료 확인)
- [x] 히브리어/헬라어 원어 데이터셋 조사 (STEPBible, OpenGNT 등)
- [x] 사전/원어 데이터 조사 (Strong's, BDB, Thayer's)
- [x] TTS 서비스 비교 (Google/Azure/Polly/ElevenLabs + Bible Brain)
- [x] 지도 서비스 비교 (Leaflet+OSM, Mapbox, Google Maps)
- [x] 경쟁 앱 분석 (YouVersion, Blue Letter Bible, Logos, 갓피플 등 7개)
- [x] 기술 스택 조사 및 추천
- [x] 결과 저장: `docs/research.md`

### 3단계: 기획 문서 작성 — 완료
- [x] 상세 설계 문서: `docs/design.md`
  - 시스템 아키텍처, 데이터 모델(15개 테이블), API 설계, UI 설계
  - 외부 서비스 연동, 인증/권한, 오프라인 지원, 성능, 보안
- [x] 브레인스토밍: `docs/brainstorming.md`
  - 추가 기능 23개, AI 활용 12개, 소셜 12개, 게이미피케이션 13개
  - 교육 14개, 접근성 14개, 차별화 20개
- [x] 종합 구현 계획: `docs/implementation_plan.md`
  - 모노레포 디렉토리 구조, Phase 0~3 마일스톤
  - 12개 기능별 상세 체크리스트, CI/CD, DB 스키마 DDL
- [x] 테스트 계획: `docs/test_plan.md`
  - 300+ 테스트 항목, 10개 영역 종합 전략
  - 성능 기준, 보안, 접근성, 데이터 무결성

### 4단계: 구조 적합성 검토 — 완료
- [x] 아이디어 ↔ 설계 커버리지: 15/15 (100%)
- [x] 아키텍처 적합성 평가: 9/10
- [x] MVP 간소화 제안 포함
- [x] 결과 저장: `docs/architecture_review.md`

---

## 생성된 문서 목록

| 파일 | 내용 | 상태 |
|------|------|------|
| `docs/idea_1.txt` | 원본 아이디어 | 기존 |
| `docs/workflow_plan.txt` | 워크플로우 계획 | 기존 |
| `docs/research.md` | 리서치 보고서 | 신규 |
| `docs/design.md` | 상세 설계 문서 | 신규 |
| `docs/brainstorming.md` | 추가 아이디어 브레인스토밍 | 신규 |
| `docs/implementation_plan.md` | 종합/상세 구현 계획 | 신규 |
| `docs/test_plan.md` | 종합/기능별 테스트 계획 | 신규 |
| `docs/architecture_review.md` | 구조 적합성 검토 | 신규 |
| `docs/RESUME.md` | 진행 현황 (이 문서) | 신규 |

---

### 5단계: 개발 환경 설정 (Phase 0) — 완료
- [x] Git 초기화 + .gitignore 설정
- [x] Next.js 16 + TypeScript + Tailwind CSS + App Router 프로젝트 생성
- [x] pnpm 패키지 매니저 설정
- [x] @supabase/supabase-js, zustand 설치
- [x] 프로젝트 디렉토리 구조 생성
- [x] 타입 정의 (src/types/bible.ts)
- [x] 성경 66권 한국어 상수 데이터 (src/lib/constants.ts)
- [x] Supabase 클라이언트 (src/lib/supabase.ts)
- [x] .env.example 생성
- [x] 빌드 검증 성공

### 6단계: Phase 1 MVP 구현 — 완료
- [x] **성경 텍스트 뷰어**
  - src/lib/bible-api.ts (bible.helloao.org 연동, 버전 매핑: krv→KorHKJV, kjv→engKJV, web→engWEB)
  - src/app/(bible)/[version]/[book]/[chapter]/page.tsx (서버 컴포넌트)
  - src/components/bible/BibleViewer.tsx (절 표시, 서체, 호버 하이라이팅)
  - src/components/bible/ChapterNavigation.tsx (이전/다음 장, 책 간 이동)
  - src/components/bible/VersionSelector.tsx (버전 전환 드롭다운)
  - src/app/page.tsx (홈 - 66권 그리드, 구약/신약 분류)
  - src/app/layout.tsx (Noto Serif KR 폰트, 반응형 헤더)
  - src/stores/bibleStore.ts (Zustand 상태 관리)
  - API Routes: /api/bible/[version]/[book]/[chapter], /api/bible/versions
- [x] **번역 비교 기능**
  - src/app/(bible)/compare/page.tsx (책/장/절 선택, 버전 토글)
  - src/components/bible/CompareView.tsx (데스크탑 테이블/모바일 카드)
  - API Route: /api/bible/compare (병렬 fetch)
- [x] **Strong's 사전**
  - src/lib/strongs-api.ts (openscriptures GitHub에서 히/헬 사전 fetch, 캐시)
  - src/components/bible/StrongsPopover.tsx (팝오버 카드, RTL 히브리어 지원)
  - src/hooks/useStrongs.ts (lookup/clear 훅)
  - src/app/(bible)/strongs/page.tsx (번호/키워드 검색 브라우저)
  - API Routes: /api/strongs/[number], /api/strongs/search
- [x] **검색 기능**
  - src/app/(bible)/search/page.tsx (검색 페이지)
  - src/components/search/SearchBar.tsx (300ms 디바운스)
  - src/components/search/SearchResults.tsx (하이라이트 매칭)
  - src/components/search/SearchFilters.tsx (버전/구약·신약 필터)
  - src/hooks/useSearch.ts (검색 훅)
  - API Route: /api/search (텍스트 매칭, 50건 제한)
- [x] **통합 빌드 성공** (Next.js 16.1.6, 11개 라우트)

---

### 7단계: Phase 2 학습 기능 — 완료
- [x] **히브리어/헬라어 원문 보기**
  - src/lib/original-text-api.ts (OpenGNT 헬라어 TSV 파싱, 히브리어 샘플)
  - src/components/study/OriginalTextView.tsx (인터리니어 레이아웃, RTL 지원)
  - src/app/(study)/original/page.tsx (책/장 선택, 한국어 대조)
  - API Route: /api/bible/original/[book]/[chapter]
- [x] **단어장 (저장/정렬/복습)**
  - src/types/vocabulary.ts (VocabularyItem, SortOption)
  - src/stores/vocabularyStore.ts (Zustand + localStorage 영속)
  - src/components/study/VocabularyCard.tsx (확장/축소, 노트, 복습)
  - src/components/study/AddToVocabularyButton.tsx (별 아이콘 토글)
  - src/components/study/VocabularyStats.tsx (통계 패널)
  - src/app/(study)/vocabulary/page.tsx (정렬/필터/검색)
- [x] **발음 재생 + 오디오 플레이어**
  - src/lib/audio-api.ts (Web Speech API 래퍼, 다국어)
  - src/components/audio/PronunciationButton.tsx (단어 발음)
  - src/components/audio/AudioPlayer.tsx (장 낭독, 속도 조절)
  - src/components/audio/AudioSettings.tsx (속도/음성/자동재생)
  - src/app/(study)/audio/page.tsx (전용 오디오 페이지, 절별 하이라이트)
- [x] **지명 지도 연동**
  - src/lib/map-data.ts (60개 성경 지명 좌표)
  - src/components/study/MapViewer.tsx (Leaflet + 커스텀 마커)
  - src/app/(study)/map/page.tsx (필터, 검색, 상세 패널)
  - API Route: /api/map/places
- [x] **통합 빌드 성공** (18개 라우트)

### 8단계: Phase 3 프리미엄 — 완료
- [x] **AI TTS 낭독 서비스**
  - src/lib/tts-service.ts (Browser/Google/BibleBrain 3종 TTS)
  - src/components/audio/EnhancedAudioPlayer.tsx (파형 시각화, 미니 플레이어)
  - src/components/audio/LanguageSelector.tsx (9개 언어 그리드/드롭다운)
  - src/stores/ttsStore.ts (TTS 설정 영속)
  - API Route: /api/tts (Google Cloud TTS 프록시)
- [x] **다국어 번역 지원**
  - src/lib/multilang-api.ts (bible.helloao.org 1000+ 번역본, 언어별 그룹)
  - src/lib/i18n.ts (ko/en UI 번역 30+ 항목)
  - src/components/bible/TranslationBrowser.tsx (언어 그룹, 즐겨찾기, RTL)
  - src/stores/languageStore.ts (로케일, 즐겨찾기, 최근 사용)
  - src/app/(bible)/multilang/page.tsx (최대 5개 번역 동시 비교)
  - API Route: /api/bible/translations
- [x] **설교 검색/추천**
  - src/types/sermon.ts (Sermon, SermonSearchResult)
  - src/lib/sermon-service.ts (40개 샘플 설교, 검색/추천 로직)
  - src/components/sermon/SermonCard.tsx (카드 + 리스트)
  - src/components/sermon/SermonSearch.tsx (키워드/절/태그 검색)
  - src/components/sermon/SermonRecommendation.tsx (임베디드 추천)
  - src/app/(study)/sermons/page.tsx, [id]/page.tsx (검색/상세)
  - API Routes: /api/sermons, /api/sermons/[id], /api/sermons/recommend
- [x] **고유명사 강조**
  - src/lib/proper-nouns.ts (200+ 고유명사, 6가지 타입)
  - src/components/bible/TextHighlighter.tsx (이탤릭/볼드/밑줄/색상)
  - src/components/bible/ProperNounTooltip.tsx (상세 팝오버)
  - src/stores/settingsStore.ts (하이라이트 ON/OFF, 스타일)
  - src/app/(study)/proper-nouns/page.tsx (브라우저, 타입별 필터)
  - API Route: /api/proper-nouns
- [x] **최종 통합 빌드 성공** (28개 라우트)

---

## 전체 구현 완료 요약

| Phase | 기능 수 | 라우트 수 | 상태 |
|-------|---------|----------|------|
| Phase 0 (기반) | - | - | 완료 |
| Phase 1 (MVP) | 4개 | 11개 | 완료 |
| Phase 2 (학습) | 4개 | 18개 | 완료 |
| Phase 3 (프리미엄) | 4개 | 28개 | 완료 |
| **합계** | **12개 기능** | **28개 라우트** | **전체 완료** |

---

### 9단계: 단위 테스트 작성 — 완료
- [x] **Jest 테스트 인프라 설정**
  - jest.config.ts, jest.setup.ts 생성
  - Jest 30, @testing-library/react 16, @testing-library/jest-dom 6 설치
  - package.json 스크립트 추가 (test, test:watch, test:coverage)
- [x] **API 라우트 테스트** (13개 파일)
  - bible, versions, translations, compare, original, search
  - strongs/[number], strongs/search, map/places, proper-nouns
  - sermons, sermons/[id], sermons/recommend, tts, bookmarks
  - api-utils
- [x] **컴포넌트 테스트** (32개 파일)
  - Bible: BibleViewer, ChapterNavigation, VersionSelector, CompareView
  - Bible: StrongsPopover, TextHighlighter, ProperNounTooltip, TranslationBrowser
  - Bible: BibleActionBar, BookmarkButton, VerseActionMenu
  - Search: SearchBar, SearchResults, SearchFilters
  - Study: VocabularyCard, AddToVocabularyButton, VocabularyStats
  - Audio: PronunciationButton, AudioSettings, EnhancedAudioPlayer, LanguageSelector
  - Sermon: SermonCard, SermonSearch
  - Home: BookGrid, DailyVerseCard, ReadingStats, RecentReads
  - Layout: Header, BottomNav
  - UI: Button, Loading, Modal, Tooltip
- [x] **훅 테스트** (8개 파일)
  - useSearch, useStrongs, useAudio, useVocabulary
  - useMap, useOriginalText, useProperNouns, useSermons
- [x] **라이브러리 테스트** (9개 파일)
  - bible-api, strongs-api, multilang-api, original-text-api
  - i18n, map-data, proper-nouns, sermon-service, tts-service
- [x] **스토어 테스트** (8개 파일)
  - bibleStore, vocabularyStore, languageStore, settingsStore, ttsStore
  - bookmarkStore, historyStore, readingHistoryStore
- [x] **테스트 결과:** 72개 스위트, 1,007개 테스트 전체 통과
- [x] **코드 커버리지:** Stmts 91.95%, Branch 83.95%, Funcs 91.23%, Lines 93.32%
- [x] **E2E 테스트:** Playwright 12개 파일 기존 작성 완료

---

## 핵심 결정사항

| 항목 | 결정 | 이유 |
|------|------|------|
| 한국어 성경 | 개역한글 (KRV) 우선 | 저작권 무료 |
| 성경 API | bible.helloao.org | 무제한 무료, 키 불필요 |
| 원어 데이터 | STEPBible + openscriptures/strongs | CC BY 4.0, Public Domain |
| 오디오 | Bible Brain API 우선 | 2,500+ 언어 무료 녹음 |
| 지도 | Leaflet.js + OpenBible Geocoding | 완전 무료 |
| MVP 스택 | Next.js + Supabase + Vercel | 비용 $0 시작 가능 |
