# 성경책 앱 리서치 보고서

> 작성일: 2026-03-10

---

## 1. 성경 텍스트 API / 데이터 소스

### 무료 API 비교

| API | 번역본 수 | 인증 | 제한 | 상업 사용 |
|-----|-----------|------|------|-----------|
| **bible.helloao.org** | 1,000+ | 키 불필요 | 없음 | 무제한 (최추천) |
| **API.Bible** (scripture.api.bible) | 2,500+ (1,600개 언어) | API 키 | 비상업 | 별도 협의 |
| **Bible Brain** (Faith Comes By Hearing) | 1,477 텍스트 + 2,500 오디오 | API 키 | 1,000 hits/일 | 비상업 |
| **bible-api.com** | Public Domain만 | 키 불필요 | 없음 | 가능 |
| **wldeh/bible-api** (GitHub) | 200+ | 키 불필요 | 없음 | 가능 |
| **getBible v2** (GitHub) | 다국어 | 키 불필요 | 없음 | 오픈소스 |

### 한국어 성경 저작권

| 번역본 | 저작권 | 앱 사용 |
|--------|--------|---------|
| **개역한글 (KRV)** | YouVersion에서 무료 배포 | 자유 사용 가능 |
| **개역개정 (GAE)** | 대한성서공회 저작권 | 허가 필요 (bskorea.or.kr) |
| **표준새번역** | 대한성서공회 저작권 | 허가 필요 |
| **공동번역** | 대한성서공회 저작권 | 허가 필요 |

- 대한성서공회 저작권 FAQ: http://kbs.bskorea.or.kr/about/book/faq.aspx
- 사용료 안내: http://kbs.bskorea.or.kr/about/book/fee.aspx

### 영어 Public Domain 번역본 (제한 없음)

- KJV (King James Version)
- ASV (American Standard Version, 1901)
- WEB (World English Bible) — 현대 영어, Public Domain
- YLT (Young's Literal Translation)
- OEB (Open English Bible) — CC0
- Berean Standard Bible — 매우 관대한 라이선스

### 원어 텍스트 (무료/오픈소스)

| 데이터셋 | 내용 | 라이선스 |
|----------|------|----------|
| **STEPBible TAHOT** | 히브리어 구약 (Leningrad codex, 형태소+Strong's 태깅) | CC BY 4.0 |
| **STEPBible TAGNT** | 헬라어 신약 (NA27/28, TR, SBLGNT 등 포함) | CC BY 4.0 |
| **STEPBible TAGOT** | 헬라어 구약/LXX (Rahlfs 기반) | CC BY 4.0 |
| **OpenGNT** | 헬라어 신약 8층 인터리니어 (NA28과 61단어만 차이) | CC BY-SA 4.0 |
| **morphhb** (OpenScriptures) | Westminster Leningrad Codex + 형태소 | 오픈소스 |
| **Open Hebrew Bible** | BHS/WLC 정합 + ETCBC/Berean 연동 | 오픈소스 |
| **Berean Greek Bible** | 헬라어 신약 | 자유 사용 |

---

## 2. 사전 / 원어 데이터

### 히브리어 사전

| 리소스 | 내용 | 라이선스 |
|--------|------|----------|
| **STEPBible TFBDB** | BDB 사전 전체 + Extended Strong's 매핑 (TSV) | CC BY 4.0 |
| **OpenScriptures HebrewLexicon** | BDB XML + Strong's Hebrew XML + LexicalIndex | Public Domain |
| **openscriptures/strongs** | Strong's 히브리어+헬라어 사전 (JSON/XML) | Public Domain |

### 헬라어 사전

| 리소스 | 내용 | 라이선스 |
|--------|------|----------|
| **OpenGNT Lexicon** | Tyndale Brief Lexicon + 분석 사전 | CC BY-SA 4.0 |
| **Thayer's Greek Lexicon** | 5,000+ 항목, Strong's 번호 매핑 | Public Domain |
| **Kata Biblon** | 어형 변화표 + GNT/LXX 전체 형태 | 오픈소스 |

> **참고:** BDAG (학술 표준 헬라어 사전)는 상업 저작권으로 무료 사용 불가

### 영어 사전 API

| API | 가격 | 특징 |
|-----|------|------|
| **Free Dictionary API** (dictionaryapi.dev) | 완전 무료, 키 불필요 | 정의, 발음, 오디오, 유의어 |
| **Merriam-Webster API** | 무료 (비상업, 1,000쿼리/일) | 미국 영어 |
| **WordsAPI** (RapidAPI) | 프리미엄 $10/월 | 유의어, 반의어, 빈도 |
| **Cambridge Dictionary API** | 라이선스 협의 | 영국 영어 |

### 발음 오디오

- 히브리어/헬라어 전용 오디오 리소스는 부족 — TTS 생성 권장
- **KoineGreek.com** — 코이네 헬라어 역사적 발음 오디오
- **OpenGNT** — SBL 전사법 기반 발음 가이드 (텍스트)
- **Blue Letter Bible** — 인라인 발음 오디오 (API 없음)

---

## 3. TTS (음성 낭독) 서비스

### 가격 비교 (100만 글자 기준)

| 서비스 | Standard | Neural/고급 | 무료 티어 | 언어 수 |
|--------|----------|------------|-----------|---------|
| **Google Cloud TTS** | $4 | $16 (WaveNet), $30 (Chirp 3 HD) | 4M 글자/월 (Standard) | 75+ |
| **Azure TTS** | — | $16 (Neural), $100 (Long Audio) | F0 무료 티어 | 140+ |
| **Amazon Polly** | $4.80 | $16 (NTTS), $100 (Long-Form) | $200 크레딧 (신규) | 40+ |
| **ElevenLabs** | — | $5~$1,320/월 구독제 | 제한적 무료 | 70+ |

### 성경 전문 오디오 — Bible Brain API (핵심)

- **2,500+ 언어** 전문 성우 녹음 오디오
- 드라마화 오디오, 적응형 비트레이트 스트리밍
- Gospel Films 700개 언어
- **완전 무료** (비상업, API 키 필요)
- 문서: https://www.faithcomesbyhearing.com/bible-brain/developer-documentation

> **추천:** 1차 Bible Brain API (무료 녹음) → 미지원 언어는 Google Cloud TTS ($16/1M자)

---

## 4. 지도 서비스

### 지도 엔진 비교

| 서비스 | 가격 | 장점 |
|--------|------|------|
| **Leaflet.js + OSM** | 완전 무료 | 오픈소스, 커스텀 자유, 40KB |
| **Mapbox** | 50,000 로드/월 무료, $5/1K | 커스텀 스타일 우수, 고대 지도 스타일 가능 |
| **Google Maps API** | $7/1K 로드 ($200/월 크레딧) | 가장 상세, 위성 뷰 |

### 성경 지명 좌표 데이터

| 리소스 | 내용 | 라이선스 |
|--------|------|----------|
| **OpenBible Geocoding** | 1,275 지명 위경도, 87% 250m 정확도, 70+ 학술 출처 | CC BY 4.0 |
| **BibleAtlas.org** | OT/NT 전체 위치 지도 | 참고용 |
| **BYU Scripture Mapping** | 성경 구절별 위치 매핑 | 참고용 |
| **Pleiades** (pleiades.stoa.org) | 고대 지명 DB | 오픈소스 |

> **추천:** Leaflet.js + OSM (무료) + OpenBible Geocoding = 지도 기능 비용 $0

---

## 5. 경쟁 앱 분석

| 앱 | 사용자 규모 | 핵심 강점 | 약점 | 수익 모델 |
|----|-----------|-----------|------|-----------|
| **YouVersion** | 10억+ 설치, 1,400만 DAU | 3,500 번역, 800+ 읽기 계획, 완전 무료 | 원어 학습 없음 | 기부 (광고 없음) |
| **Blue Letter Bible** | 750만+ 웹/100만+ 앱 | Strong's 원어 사전, 8,000+ 주석, 교차참조 | UI 구식 | 기부 |
| **Logos** | 학술/목회자 대상 | AI 검색, 단어별 원어 태깅, 설교 빌더 | 매우 비쌈 | 라이브러리 구매+구독 |
| **대한성서공회 앱** | 한국 공식 | 개역개정, BHS/GNT 원문, 히/헬 사전, 동영상 | UI 단순 | 앱 내 구매 |
| **갓피플성경** | 한국 상위 | 58가지 커스텀, 오디오 연동, #태그 노트, 감사일기 | 원어 기능 부족 | 일회성 구매 |
| **Olive Tree** | 800만+ 다운로드 | Study Center 자동 리소스 표시, 오프라인 | 유료 콘텐츠 많음 | 콘텐츠 구매 |
| **BibleChat** | AI 특화 (시리즈A $14M) | AI Q&A 5회/일 무료, 300% 리텐션 | 전통 학습 부족 | 프리미엄 구독 |

### 시장 기회

> **한국어 + 원어(히/헬) + 다국어 비교 + AI 낭독**을 통합한 앱은 현재 존재하지 않음
> - YouVersion: 원어 없음 / Blue Letter Bible: 한국어 없음
> - 갓피플: 원어 없음 / 대한성서공회: AI 없음

---

## 6. 추천 기술 스택

| 영역 | 추천 | 대안 | 이유 |
|------|------|------|------|
| **웹 프론트엔드** | Next.js (TypeScript) | Nuxt.js | SSR/SEO, 구절 페이지 검색 최적화 |
| **모바일** | React Native | Flutter (95% 코드 재사용) | 웹과 코드 공유 (60~70%), JS 생태계 |
| **백엔드** | NestJS (TypeScript) | Go (Fiber) | 프론트와 동일 언어, 구조적 |
| **AI 서비스** | Python (FastAPI) | — | 설교 추천, 시맨틱 검색, NLP |
| **서버 DB** | PostgreSQL + pgvector | — | 전문 검색 (tsvector) + 벡터 시맨틱 검색 |
| **클라이언트 DB** | SQLite (WAL mode) | — | 오프라인 성경 읽기, 제로 설정 |
| **검색 엔진** | Meilisearch | Elasticsearch | 한국어 형태소 분석, 경량 |
| **인증** | NextAuth.js / Supabase Auth | — | 소셜 로그인 간편 |
| **배포** | Vercel + Supabase | AWS | 무료 티어, 빠른 시작 |

### DB 스키마 패턴

```
translations (id, abbreviation, title, language, license_info)
books (id, translation_id, book_number, name, abbreviation)
verses (id, book_id, chapter, verse_number, text)
cross_references (source_verse_id, target_verse_id, votes)
```

### 설교 검색/추천 접근법

1. **벡터 임베딩 시맨틱 검색** — pgvector + OpenAI 임베딩으로 의미 기반 검색
2. **자연어 Q&A** — "불안에 대해 성경은?" → 관련 구절 반환
3. **토픽 태깅** — 주제별 구절/설교 분류
4. **설교 트랜스크립션** — Whisper API → Elasticsearch 인덱싱
5. **협업 필터링** — 유사 사용자 기반 콘텐츠 추천

### 수익화 전략

| 전략 | 대상 | 비고 |
|------|------|------|
| 핵심 성경 읽기 | 완전 무료 | 사용자 확보 |
| 프리미엄 구독 | AI 검색, 설교 추천, 고급 원어 분석 | 월간/연간 |
| 콘텐츠 구매 | 주석서, 스터디 바이블 | 개별 판매 |
| 멀티디바이스 동기화 | 일회성 구매 | 갓피플 모델 |

---

## 7. 비용 $0으로 가능한 핵심 기능

| 기능 | 추천 소스 | 비용 |
|------|-----------|------|
| 성경 텍스트 API | bible.helloao.org | 무료 |
| 한국어 성경 | 개역한글 (KRV) | 무료 |
| 원어 텍스트 | STEPBible Data (TAHOT/TAGNT) | 무료 |
| Strong's 사전 | openscriptures/strongs (JSON) | 무료 |
| 히브리어 사전 | STEPBible TFBDB + OpenScriptures BDB | 무료 |
| 헬라어 사전 | OpenGNT Lexicon + Thayer's | 무료 |
| 영어 사전 | Free Dictionary API | 무료 |
| 오디오 낭독 | Bible Brain API | 무료 |
| 지도 | Leaflet.js + OSM | 무료 |
| 지명 좌표 | OpenBible Geocoding Data | 무료 |
| 교차 참조 | OpenBible.info (~340,000개) | 무료 |

---

## 8. 핵심 오픈소스 GitHub 레포

| GitHub 레포 | 내용 |
|-------------|------|
| `scrollmapper/bible_databases` | 성경 버전 + 교차참조 (SQL/SQLite/JSON) |
| `godlytalias/Bible-Database` | 다국어 성경 (XML/JSON/SQL/SQLite) |
| `STEPBible/STEPBible-Data` | 원어 형태소+사전 (TSV, CC BY 4.0) |
| `openscriptures/strongs` | Strong's 사전 (JSON/XML, Public Domain) |
| `openscriptures/HebrewLexicon` | BDB 히브리어 사전 (XML, Public Domain) |
| `eliranwong/OpenGNT` | 헬라어 신약 8층 인터리니어 |
| `eliranwong/OpenHebrewBible` | 히브리어 구약 통합 데이터 |
| `openbibleinfo/Bible-Geocoding-Data` | 1,275 지명 좌표 (CC BY 4.0) |
| `seven1m/open-bibles` | Public Domain 성경 (OSIS/USX XML) |
| `getbible/v2` | 다국어 성경 JSON |
| `biblenerd/awesome-bible-developer-resources` | API/데이터 종합 목록 |

---

## 9. MVP 우선순위 제안

### Phase 1 (MVP) — 핵심 기능
1. 성경 텍스트 뷰어 (개역한글 + KJV/WEB)
2. 영어 번역 비교 (2~3개)
3. Strong's 번호 기반 단어 뜻 보기
4. 기본 검색 기능

### Phase 2 — 학습 기능
5. 히브리어/헬라어 원문 보기
6. 단어장 (저장/정렬)
7. 단어 발음 재생
8. 지명 지도 연동

### Phase 3 — 프리미엄
9. AI 다국어 낭독 (Bible Brain + TTS)
10. 전세계 언어 번역
11. 설교 검색/추천 (시맨틱 검색)
12. 고유명사 강조 표시
13. 낭독 속도 조절
14. 클릭 내역 조회
