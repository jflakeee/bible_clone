# 성경 앱 상세 설계 문서

> 최종 수정일: 2026-03-10

---

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [데이터 모델 설계](#2-데이터-모델-설계)
3. [API 설계](#3-api-설계)
4. [프론트엔드 화면 설계](#4-프론트엔드-화면-설계)
5. [외부 서비스 연동 설계](#5-외부-서비스-연동-설계)
6. [인증/권한 설계](#6-인증권한-설계)
7. [오프라인 지원 설계](#7-오프라인-지원-설계)
8. [성능 최적화 전략](#8-성능-최적화-전략)
9. [보안 고려사항](#9-보안-고려사항)

---

## 1. 시스템 아키텍처

### 1.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────┐
│                        클라이언트 계층                                │
│  ┌──────────────────────┐     ┌──────────────────────┐             │
│  │   Web (Next.js)      │     │  Mobile (React Native)│             │
│  │   - SSR/SSG          │     │  - iOS / Android      │             │
│  │   - TypeScript       │     │  - TypeScript         │             │
│  │   - Tailwind CSS     │     │  - Expo               │             │
│  └─────────┬────────────┘     └─────────┬────────────┘             │
│            │                            │                           │
│            └──────────┬─────────────────┘                           │
│                       │ HTTPS (REST / WebSocket)                    │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────────┐
│                   API 게이트웨이 / CDN                               │
│              ┌────────┴────────┐                                    │
│              │   Vercel Edge   │                                    │
│              │   (라우팅/캐시) │                                    │
│              └────────┬────────┘                                    │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────────┐
│                    백엔드 계층                                       │
│  ┌────────────────────┴───────────────────┐                        │
│  │         NestJS 메인 API 서버           │                        │
│  │  - 성경 데이터 CRUD                    │                        │
│  │  - 사용자 관리 / 인증                  │                        │
│  │  - 단어장 / 북마크                     │                        │
│  │  - 결제 (유료 기능)                    │                        │
│  │  - 설교 검색                           │                        │
│  │  - 클릭 이력 관리                      │                        │
│  └────────────────────┬───────────────────┘                        │
│                       │                                             │
│  ┌────────────────────┴───────────────────┐                        │
│  │       Python FastAPI (AI 서버)         │                        │
│  │  - AI 성경 낭독 (TTS)                  │                        │
│  │  - 설교 추천 (벡터 검색)               │                        │
│  │  - 번역 처리                           │                        │
│  │  - 자연어 질의 응답                    │                        │
│  └────────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────────┐
│                   데이터 계층                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ PostgreSQL   │  │ Meilisearch  │  │   Redis      │              │
│  │ + pgvector   │  │ (전문 검색)  │  │  (캐시/세션) │              │
│  │ (Supabase)   │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │ Supabase     │  │ Supabase     │                                │
│  │ Storage      │  │ Auth         │                                │
│  │ (음성/미디어)│  │ (OAuth)      │                                │
│  └──────────────┘  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────────┐
│                 외부 서비스 계층                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Bible API │ │Google    │ │Google    │ │Stripe    │              │
│  │(성경본문)│ │Maps API  │ │Cloud TTS │ │(결제)    │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                           │
│  │Dictionary│ │OpenAI    │ │DeepL     │                           │
│  │API(사전) │ │API (AI)  │ │(번역)    │                           │
│  └──────────┘ └──────────┘ └──────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 계층별 기술 스택 요약

| 계층 | 기술 | 역할 |
|------|------|------|
| 웹 프론트엔드 | Next.js 14+ (App Router), TypeScript, Tailwind CSS, Zustand | SSR/SSG, 반응형 UI |
| 모바일 | React Native (Expo), TypeScript | iOS/Android 네이티브 앱 |
| 메인 API | NestJS, TypeScript, TypeORM | RESTful API, 비즈니스 로직 |
| AI 서버 | Python FastAPI, LangChain | TTS, 벡터 검색, 번역 |
| 주 데이터베이스 | PostgreSQL + pgvector (Supabase) | 관계형 데이터, 벡터 검색 |
| 검색 엔진 | Meilisearch | 전문 검색 (성경 구절, 설교) |
| 캐시 | Redis (Upstash) | 세션, API 응답 캐시 |
| 오프라인 DB | SQLite (클라이언트) | 오프라인 성경 데이터 |
| 파일 저장소 | Supabase Storage | TTS 음성 파일, 사용자 미디어 |
| 배포 | Vercel (웹), Supabase (DB/Auth) | 서버리스 배포 |

### 1.3 통신 프로토콜

- **클라이언트 ↔ NestJS**: HTTPS REST API (JSON)
- **클라이언트 ↔ FastAPI**: HTTPS REST API (JSON), WebSocket (실시간 TTS 스트리밍)
- **NestJS ↔ FastAPI**: gRPC (내부 통신) 또는 HTTP
- **NestJS ↔ PostgreSQL**: TypeORM (TCP)
- **NestJS ↔ Meilisearch**: HTTP (Meilisearch SDK)
- **NestJS ↔ Redis**: ioredis (TCP)

---

## 2. 데이터 모델 설계

### 2.1 ERD (텍스트 다이어그램)

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   users      │     │  subscriptions   │     │   payments       │
│─────────────│     │─────────────────│     │──────────────────│
│ id (PK)      │──┐  │ id (PK)          │     │ id (PK)          │
│ email         │  ├──│ user_id (FK)     │     │ user_id (FK)     │
│ password_hash │  │  │ plan_type        │     │ subscription_id  │
│ name          │  │  │ status           │     │ amount           │
│ locale        │  │  │ started_at       │     │ currency         │
│ is_premium    │  │  │ expires_at       │     │ stripe_payment_id│
│ created_at    │  │  └─────────────────┘     │ status           │
│ updated_at    │  │                           │ created_at       │
└─────────────┘  │                           └──────────────────┘
       │          │
       │          │  ┌──────────────────┐
       │          ├──│   bookmarks      │
       │          │  │──────────────────│
       │          │  │ id (PK)          │
       │          │  │ user_id (FK)     │
       │          │  │ verse_id (FK)    │
       │          │  │ color            │
       │          │  │ note             │
       │          │  │ created_at       │
       │          │  └──────────────────┘
       │          │
       │          │  ┌──────────────────┐     ┌──────────────────┐
       │          ├──│  vocabularies    │     │  vocab_words     │
       │          │  │──────────────────│     │──────────────────│
       │          │  │ id (PK)          │──── │ id (PK)          │
       │          │  │ user_id (FK)     │     │ vocabulary_id(FK)│
       │          │  │ name             │     │ word             │
       │          │  │ sort_order       │     │ meaning          │
       │          │  │ created_at       │     │ pronunciation    │
       │          │  └──────────────────┘     │ language         │
       │          │                           │ source_verse_id  │
       │          │                           │ memorized        │
       │          │                           │ created_at       │
       │          │                           └──────────────────┘
       │          │
       │          │  ┌──────────────────┐
       │          └──│  click_histories │
       │             │──────────────────│
       │             │ id (PK)          │
       │             │ user_id (FK)     │
       │             │ action_type      │
       │             │ target_type      │
       │             │ target_id        │
       │             │ metadata (JSONB) │
       │             │ created_at       │
       │             └──────────────────┘
       │
┌──────┴──────────┐     ┌──────────────────┐
│   bibles        │     │   books          │
│─────────────────│     │──────────────────│
│ id (PK)         │──── │ id (PK)          │
│ version_code    │     │ bible_id (FK)    │
│ language        │     │ book_number      │
│ name            │     │ name             │
│ description     │     │ name_en          │
│ is_default      │     │ testament        │
└─────────────────┘     │ chapter_count    │
                        └──────┬───────────┘
                               │
                        ┌──────┴───────────┐
                        │   chapters       │
                        │──────────────────│
                        │ id (PK)          │
                        │ book_id (FK)     │
                        │ chapter_number   │
                        │ verse_count      │
                        └──────┬───────────┘
                               │
                        ┌──────┴───────────┐     ┌──────────────────┐
                        │   verses         │     │  verse_words     │
                        │──────────────────│     │──────────────────│
                        │ id (PK)          │──── │ id (PK)          │
                        │ chapter_id (FK)  │     │ verse_id (FK)    │
                        │ verse_number     │     │ word_index       │
                        │ text             │     │ original_word    │
                        │ text_original    │     │ transliteration  │
                        │ embedding (vector)│    │ strong_number    │
                        └──────────────────┘     │ grammar_code     │
                                                 │ meaning          │
                                                 └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  proper_nouns    │     │  place_locations  │
│──────────────────│     │──────────────────│
│ id (PK)          │     │ id (PK)          │
│ name             │     │ proper_noun_id   │
│ name_original    │     │ latitude         │
│ name_en          │     │ longitude        │
│ type (person/    │     │ modern_name      │
│   place/object)  │     │ description      │
│ description      │     └──────────────────┘
│ first_verse_id   │
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  sermons         │     │  sermon_verses   │
│──────────────────│     │──────────────────│
│ id (PK)          │     │ id (PK)          │
│ title            │     │ sermon_id (FK)   │
│ pastor           │     │ verse_id (FK)    │
│ church           │     └──────────────────┘
│ content          │
│ summary          │
│ embedding(vector)│
│ source_url       │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│  dictionary      │
│──────────────────│
│ id (PK)          │
│ word             │
│ language (he/gr/ │
│   en/ko)         │
│ strong_number    │
│ definition       │
│ pronunciation_url│
│ usage_examples   │
│   (JSONB)        │
└──────────────────┘

┌──────────────────┐
│  tts_cache       │
│──────────────────│
│ id (PK)          │
│ verse_id (FK)    │
│ language         │
│ voice_type       │
│ speed            │
│ audio_url        │
│ created_at       │
└──────────────────┘
```

### 2.2 테이블 상세 정의

#### 2.2.1 `users` - 사용자 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 주소 |
| password_hash | VARCHAR(255) | NULL (OAuth 사용자) | 비밀번호 해시 |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| avatar_url | TEXT | NULL | 프로필 이미지 URL |
| locale | VARCHAR(10) | DEFAULT 'ko' | 선호 언어 (ko, en, he, gr 등) |
| is_premium | BOOLEAN | DEFAULT false | 유료 회원 여부 |
| auth_provider | VARCHAR(20) | DEFAULT 'email' | 인증 제공자 (email, google, apple) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 수정일시 |

#### 2.2.2 `bibles` - 성경 버전 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PK | 성경 버전 ID |
| version_code | VARCHAR(20) | UNIQUE, NOT NULL | 버전 코드 (KJV, NIV, 개역개정 등) |
| language | VARCHAR(10) | NOT NULL | 언어 코드 (en, ko, he, gr) |
| name | VARCHAR(100) | NOT NULL | 버전 이름 |
| description | TEXT | NULL | 버전 설명 |
| is_default | BOOLEAN | DEFAULT false | 기본 버전 여부 |
| copyright | TEXT | NULL | 저작권 정보 |

#### 2.2.3 `verses` - 성경 구절 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGSERIAL | PK | 구절 고유 ID |
| chapter_id | INTEGER | FK → chapters.id, NOT NULL | 장 참조 |
| verse_number | SMALLINT | NOT NULL | 절 번호 |
| text | TEXT | NOT NULL | 번역된 본문 |
| text_original | TEXT | NULL | 히브리어/헬라어 원문 |
| embedding | VECTOR(1536) | NULL | 의미 벡터 (pgvector) |

**인덱스**: `(chapter_id, verse_number)` UNIQUE, `embedding` IVFFLAT 인덱스

#### 2.2.4 `verse_words` - 구절 단어 분석 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGSERIAL | PK | 단어 고유 ID |
| verse_id | BIGINT | FK → verses.id | 구절 참조 |
| word_index | SMALLINT | NOT NULL | 단어 순서 (0부터) |
| original_word | VARCHAR(100) | NOT NULL | 원어 단어 |
| transliteration | VARCHAR(100) | NULL | 음역 |
| strong_number | VARCHAR(10) | NULL | 스트롱 넘버 (H0001, G0001) |
| grammar_code | VARCHAR(50) | NULL | 문법 코드 |
| meaning | TEXT | NULL | 의미 |

#### 2.2.5 `vocabularies` / `vocab_words` - 단어장 테이블

| 컬럼명 (vocabularies) | 타입 | 설명 |
|------------------------|------|------|
| id | SERIAL | PK |
| user_id | UUID | FK → users.id |
| name | VARCHAR(100) | 단어장 이름 |
| sort_order | VARCHAR(20) | 정렬 기준 (alpha, date, frequency) |
| created_at | TIMESTAMPTZ | 생성일시 |

| 컬럼명 (vocab_words) | 타입 | 설명 |
|------------------------|------|------|
| id | BIGSERIAL | PK |
| vocabulary_id | INTEGER | FK → vocabularies.id |
| word | VARCHAR(200) | 단어 |
| meaning | TEXT | 뜻 |
| pronunciation | VARCHAR(200) | 발음 |
| language | VARCHAR(10) | 언어 코드 |
| source_verse_id | BIGINT | FK → verses.id (출처 구절) |
| memorized | BOOLEAN | 암기 여부 (DEFAULT false) |
| created_at | TIMESTAMPTZ | 생성일시 |

#### 2.2.6 `click_histories` - 클릭 이력 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | BIGSERIAL | PK |
| user_id | UUID | FK → users.id |
| action_type | VARCHAR(50) | 액션 유형 (view_verse, lookup_word, play_tts, search 등) |
| target_type | VARCHAR(50) | 대상 유형 (verse, word, sermon, map 등) |
| target_id | VARCHAR(100) | 대상 ID |
| metadata | JSONB | 추가 메타데이터 |
| created_at | TIMESTAMPTZ | 생성일시 |

**인덱스**: `(user_id, created_at DESC)`, `(action_type)`

#### 2.2.7 `proper_nouns` - 고유명사 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL | PK |
| name | VARCHAR(100) | 고유명사 (한국어) |
| name_original | VARCHAR(100) | 원어 |
| name_en | VARCHAR(100) | 영어명 |
| type | VARCHAR(20) | 유형 (person, place, object, ephod 등) |
| description | TEXT | 설명 |
| first_verse_id | BIGINT | 최초 등장 구절 |

#### 2.2.8 `sermons` - 설교 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL | PK |
| title | VARCHAR(500) | 설교 제목 |
| pastor | VARCHAR(100) | 목사 이름 |
| church | VARCHAR(200) | 교회 이름 |
| content | TEXT | 설교 내용 |
| summary | TEXT | 요약 |
| embedding | VECTOR(1536) | 의미 벡터 |
| source_url | TEXT | 원본 URL |
| created_at | TIMESTAMPTZ | 생성일시 |

---

## 3. API 설계

### 3.1 기본 규칙

- **Base URL**: `https://api.bibleapp.com/v1`
- **인증**: Bearer Token (JWT)
- **응답 형식**: JSON
- **페이지네이션**: cursor 기반 (`?cursor=xxx&limit=20`)
- **에러 응답**: `{ "error": { "code": "ERROR_CODE", "message": "설명" } }`

### 3.2 성경 본문 API

#### GET /bibles
사용 가능한 성경 버전 목록 조회

```json
// 응답
{
  "data": [
    {
      "id": 1,
      "version_code": "KRV",
      "language": "ko",
      "name": "개역개정",
      "is_default": true
    },
    {
      "id": 2,
      "version_code": "KJV",
      "language": "en",
      "name": "King James Version",
      "is_default": false
    }
  ]
}
```

#### GET /bibles/:versionCode/books
특정 버전의 책 목록 조회

```json
// 응답
{
  "data": [
    {
      "id": 1,
      "book_number": 1,
      "name": "창세기",
      "name_en": "Genesis",
      "testament": "old",
      "chapter_count": 50
    }
  ]
}
```

#### GET /bibles/:versionCode/books/:bookNumber/chapters/:chapterNumber
특정 장의 구절 전체 조회

```json
// 응답
{
  "data": {
    "book": { "name": "창세기", "book_number": 1 },
    "chapter": 1,
    "verses": [
      {
        "id": 1001,
        "verse_number": 1,
        "text": "태초에 하나님이 천지를 창조하시니라",
        "text_original": "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
        "proper_nouns": [
          { "word": "하나님", "type": "person", "id": 1 }
        ]
      }
    ],
    "total_verses": 31
  }
}
```

#### GET /bibles/:versionCode/verses/:verseId/compare
영어 번역 비교 조회

```json
// 요청 쿼리: ?versions=KJV,NIV,ESV,NASB
// 응답
{
  "data": {
    "reference": "Genesis 1:1",
    "comparisons": [
      {
        "version": "KJV",
        "text": "In the beginning God created the heaven and the earth."
      },
      {
        "version": "NIV",
        "text": "In the beginning God created the heavens and the earth."
      }
    ]
  }
}
```

#### GET /bibles/:versionCode/verses/:verseId/words
구절의 단어별 원어 분석 조회

```json
// 응답
{
  "data": [
    {
      "word_index": 0,
      "original_word": "בְּרֵאשִׁית",
      "transliteration": "bereshith",
      "strong_number": "H7225",
      "grammar_code": "Prep-b | N-fs",
      "meaning": "처음에, 태초에"
    }
  ]
}
```

### 3.3 검색 API

#### GET /search
성경 구절 전문 검색

```json
// 요청 쿼리: ?q=사랑&version=KRV&book=43&limit=20&cursor=abc
// 응답
{
  "data": {
    "results": [
      {
        "verse_id": 26501,
        "reference": "요한복음 3:16",
        "text": "하나님이 세상을 이처럼 사랑하사...",
        "highlight": "하나님이 세상을 이처럼 <em>사랑</em>하사...",
        "score": 0.95
      }
    ],
    "total": 523,
    "next_cursor": "def456"
  }
}
```

#### GET /search/semantic
AI 의미 기반 검색 (유료)

```json
// 요청 쿼리: ?q=용서와 화해에 대한 구절&limit=10
// 응답
{
  "data": {
    "results": [
      {
        "verse_id": 26501,
        "reference": "마태복음 6:14",
        "text": "...",
        "relevance_score": 0.92,
        "reason": "용서에 대한 예수님의 직접적인 가르침"
      }
    ]
  }
}
```

### 3.4 사전 API

#### GET /dictionary/lookup
단어 사전 검색

```json
// 요청 쿼리: ?word=love&lang=en
// 응답
{
  "data": {
    "word": "love",
    "language": "en",
    "phonetic": "/lʌv/",
    "pronunciation_url": "https://storage.../love.mp3",
    "definitions": [
      {
        "part_of_speech": "noun",
        "meaning": "an intense feeling of deep affection",
        "meaning_ko": "깊은 애정의 강렬한 감정",
        "examples": ["babies fill parents with feelings of love"]
      }
    ]
  }
}
```

#### GET /dictionary/strong/:strongNumber
스트롱 넘버로 히브리어/헬라어 사전 조회

```json
// 응답
{
  "data": {
    "strong_number": "H7225",
    "original": "רֵאשִׁית",
    "transliteration": "reshith",
    "pronunciation_url": "https://storage.../H7225.mp3",
    "definition": "처음, 시작, 으뜸",
    "usage_count": 51,
    "related_verses": [
      { "verse_id": 1001, "reference": "창세기 1:1" }
    ]
  }
}
```

### 3.5 TTS (음성 낭독) API

#### POST /tts/generate
AI 음성 낭독 생성

```json
// 요청
{
  "verse_ids": [1001, 1002, 1003],
  "language": "ko",
  "voice": "female_1",
  "speed": 1.0
}

// 응답
{
  "data": {
    "audio_url": "https://storage.../tts/abc123.mp3",
    "duration_seconds": 15.3,
    "segments": [
      { "verse_id": 1001, "start_time": 0.0, "end_time": 5.1 },
      { "verse_id": 1002, "start_time": 5.1, "end_time": 10.2 },
      { "verse_id": 1003, "start_time": 10.2, "end_time": 15.3 }
    ]
  }
}
```

#### POST /tts/stream (WebSocket)
실시간 TTS 스트리밍

```json
// 클라이언트 전송
{ "action": "start", "verse_ids": [1001, 1002], "language": "he", "speed": 0.8 }

// 서버 응답 (바이너리 오디오 청크 + 메타데이터)
{ "type": "metadata", "current_verse": 1001, "progress": 0.5 }
// [binary audio chunk]
```

### 3.6 단어장 API

#### GET /vocabularies
사용자 단어장 목록

#### POST /vocabularies
단어장 생성

```json
// 요청
{ "name": "창세기 주요 단어", "sort_order": "alpha" }
```

#### POST /vocabularies/:id/words
단어장에 단어 추가

```json
// 요청
{
  "word": "בְּרֵאשִׁית",
  "meaning": "태초에",
  "pronunciation": "bereshith",
  "language": "he",
  "source_verse_id": 1001
}
```

#### GET /vocabularies/:id/words
단어장 단어 조회

```json
// 요청 쿼리: ?sort=alpha|date|memorized&order=asc|desc
// 응답
{
  "data": {
    "vocabulary": { "id": 1, "name": "창세기 주요 단어" },
    "words": [
      {
        "id": 1,
        "word": "בְּרֵאשִׁית",
        "meaning": "태초에",
        "pronunciation": "bereshith",
        "language": "he",
        "memorized": false,
        "source_reference": "창세기 1:1"
      }
    ],
    "total": 45
  }
}
```

#### PATCH /vocabularies/:vocabId/words/:wordId
단어 암기 상태 변경

```json
// 요청
{ "memorized": true }
```

### 3.7 북마크 API

#### GET /bookmarks
사용자 북마크 목록

#### POST /bookmarks
북마크 추가

```json
// 요청
{
  "verse_id": 1001,
  "color": "#FF6B6B",
  "note": "중요한 구절"
}
```

#### DELETE /bookmarks/:id
북마크 삭제

### 3.8 설교 API

#### GET /sermons/by-verse/:verseId
구절별 설교 검색/추천

```json
// 응답
{
  "data": [
    {
      "id": 101,
      "title": "태초의 하나님",
      "pastor": "김목사",
      "church": "사랑교회",
      "summary": "창세기 1장 1절에 담긴 의미...",
      "relevance_score": 0.95,
      "source_url": "https://..."
    }
  ]
}
```

#### GET /sermons/search
설교 검색

```json
// 요청 쿼리: ?q=사랑&limit=10
```

### 3.9 지도 API

#### GET /places/:properNounId/location
고유명사 지도 위치 조회

```json
// 응답
{
  "data": {
    "name": "예루살렘",
    "name_original": "יְרוּשָׁלַםִ",
    "name_en": "Jerusalem",
    "latitude": 31.7683,
    "longitude": 35.2137,
    "modern_name": "Jerusalem, Israel",
    "description": "다윗 왕이 수도로 정한 도시...",
    "related_verses": [
      { "verse_id": 5001, "reference": "사무엘하 5:6" }
    ]
  }
}
```

#### GET /places/by-chapter/:bookNumber/:chapterNumber
장에 등장하는 모든 지명 조회

### 3.10 클릭 이력 API

#### POST /history/track
클릭 이력 기록

```json
// 요청
{
  "action_type": "view_verse",
  "target_type": "verse",
  "target_id": "1001",
  "metadata": { "version": "KRV", "duration_ms": 5000 }
}
```

#### GET /history
클릭 이력 조회

```json
// 요청 쿼리: ?action_type=view_verse&from=2026-03-01&to=2026-03-10&limit=50
// 응답
{
  "data": {
    "histories": [
      {
        "id": 1,
        "action_type": "view_verse",
        "target_type": "verse",
        "reference": "창세기 1:1",
        "created_at": "2026-03-10T09:00:00Z"
      }
    ],
    "statistics": {
      "total_views": 150,
      "most_viewed_book": "창세기",
      "streak_days": 7
    }
  }
}
```

### 3.11 인증 API

#### POST /auth/register
이메일 회원가입

```json
// 요청
{ "email": "user@example.com", "password": "securePass123!", "name": "홍길동" }
```

#### POST /auth/login
로그인

```json
// 요청
{ "email": "user@example.com", "password": "securePass123!" }
// 응답
{
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": { "id": "uuid", "name": "홍길동", "is_premium": false }
  }
}
```

#### POST /auth/oauth/:provider
소셜 로그인 (Google, Apple)

#### POST /auth/refresh
토큰 갱신

#### POST /auth/logout
로그아웃

### 3.12 결제 API (유료 기능)

#### POST /subscriptions/create
유료 구독 생성

```json
// 요청
{ "plan_type": "monthly", "payment_method_id": "pm_..." }
```

#### GET /subscriptions/status
구독 상태 조회

#### POST /subscriptions/cancel
구독 취소

---

## 4. 프론트엔드 화면 설계

### 4.1 페이지 구조

```
/                         → 홈 (오늘의 말씀, 최근 읽은 구절)
/bible                    → 성경 읽기 메인
/bible/[version]/[book]/[chapter]  → 성경 본문 뷰
/compare                  → 영어 번역 비교 뷰
/search                   → 검색 (전문 검색 + 의미 검색)
/dictionary               → 사전 (영어/히브리어/헬라어)
/vocabulary               → 단어장 목록
/vocabulary/[id]          → 단어장 상세
/map                      → 성경 지도
/sermons                  → 설교 검색
/history                  → 클릭 이력 조회
/profile                  → 프로필/설정
/premium                  → 유료 구독 안내
/auth/login               → 로그인
/auth/register            → 회원가입
```

### 4.2 주요 화면별 UI 구성요소

#### 4.2.1 홈 화면 (`/`)

```
┌─────────────────────────────────────┐
│  [로고]  성경 앱      [🔍] [👤]     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │     오늘의 말씀              │    │
│  │  "태초에 하나님이 천지를     │    │
│  │   창조하시니라"              │    │
│  │         - 창세기 1:1         │    │
│  │  [📖 읽기] [🔊 듣기]        │    │
│  └─────────────────────────────┘    │
│                                     │
│  최근 읽은 구절                     │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │창세기  │ │요한복음│ │시편    │  │
│  │1장     │ │3장     │ │23편    │  │
│  └────────┘ └────────┘ └────────┘  │
│                                     │
│  읽기 통계                          │
│  ┌─────────────────────────────┐    │
│  │ 연속 7일 | 이번 달 30구절   │    │
│  │ ████████░░ 진행률 80%       │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  [홈] [성경] [검색] [단어장] [더보기]│
└─────────────────────────────────────┘
```

#### 4.2.2 성경 본문 화면 (`/bible/[version]/[book]/[chapter]`)

```
┌─────────────────────────────────────┐
│  [←] 창세기 1장     [KRV ▼] [⋮]   │
├─────────────────────────────────────┤
│                                     │
│  ┌─ 버전 비교 바 ─────────────┐    │
│  │ [KRV] [KJV] [NIV] [원어]  │    │
│  └────────────────────────────┘    │
│                                     │
│  1 태초에 **하나님**이 천지를       │
│    창조하시니라                     │
│                                     │
│  2 땅이 혼돈하고 공허하며           │
│    흑암이 깊음 위에 있고            │
│    **하나님**의 영은 수면 위에      │
│    운행하시니라                     │
│                                     │
│  3 **하나님**이 이르시되 빛이       │
│    있으라 하시니 빛이 있었고        │
│                                     │
│  ──────────────────────────────    │
│  [고유명사: 굵은 기울임꼴로 표시]   │
│  [클릭시 사전/지도 팝업]            │
│                                     │
│  ┌─ 하단 액션 바 ─────────────┐    │
│  │ [🔊 낭독] [📑 비교] [🗺️ 지도]│   │
│  │ [📝 메모] [📌 북마크] [📋 설교]│  │
│  └────────────────────────────┘    │
│                                     │
│  [◀ 이전 장]          [다음 장 ▶]  │
├─────────────────────────────────────┤
│  [홈] [성경] [검색] [단어장] [더보기]│
└─────────────────────────────────────┘
```

**구절 클릭 시 팝업 (단어 분석)**:

```
┌─────────────────────────────────────┐
│  בְּרֵאשִׁית (bereshith)           │
│  스트롱 넘버: H7225                 │
│  의미: 처음, 시작, 으뜸             │
│  문법: 전치사 + 명사 (여성 단수)    │
│                                     │
│  [🔊 발음 듣기]  [📖 단어장에 추가] │
│  [📚 사전에서 보기]                 │
└─────────────────────────────────────┘
```

#### 4.2.3 번역 비교 화면 (`/compare`)

```
┌─────────────────────────────────────┐
│  [←] 번역 비교                      │
├─────────────────────────────────────┤
│  창세기 1:1                         │
│                                     │
│  ┌─ 개역개정 (KRV) ───────────┐    │
│  │ 태초에 하나님이 천지를      │    │
│  │ 창조하시니라                │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌─ KJV ──────────────────────┐    │
│  │ In the beginning God       │    │
│  │ created the heaven and     │    │
│  │ the earth.                 │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌─ NIV ──────────────────────┐    │
│  │ In the beginning God       │    │
│  │ created the heavens and    │    │
│  │ the earth.                 │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌─ ESV ──────────────────────┐    │
│  │ In the beginning, God      │    │
│  │ created the heavens and    │    │
│  │ the earth.                 │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌─ 히브리어 원문 ────────────┐    │
│  │ בְּרֵאשִׁית בָּרָא אֱלֹהִים  │    │
│  │ אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ│    │
│  │ [단어별 분석 보기]          │    │
│  └────────────────────────────┘    │
│                                     │
│  [+ 버전 추가]                      │
└─────────────────────────────────────┘
```

#### 4.2.4 사전 화면 (`/dictionary`)

```
┌─────────────────────────────────────┐
│  [←] 사전                          │
├─────────────────────────────────────┤
│  ┌────────────────────────────┐    │
│  │ 🔍 단어 검색...            │    │
│  └────────────────────────────┘    │
│  [영어] [히브리어] [헬라어] [한국어]│
│                                     │
│  ┌─ 검색 결과 ────────────────┐    │
│  │                             │    │
│  │  love  /lʌv/  [🔊]         │    │
│  │                             │    │
│  │  명사                       │    │
│  │  1. 깊은 애정의 강렬한 감정 │    │
│  │  2. 큰 관심과 즐거움        │    │
│  │                             │    │
│  │  동사                       │    │
│  │  1. 깊은 애정을 느끼다      │    │
│  │                             │    │
│  │  성경에서의 용례:           │    │
│  │  • 요한복음 3:16            │    │
│  │  • 고린도전서 13:4          │    │
│  │                             │    │
│  │  관련 원어:                 │    │
│  │  • ἀγάπη (agape) G26       │    │
│  │  • אַהֲבָה (ahavah) H160   │    │
│  │                             │    │
│  │  [📖 단어장에 추가]         │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 4.2.5 단어장 화면 (`/vocabulary/[id]`)

```
┌─────────────────────────────────────┐
│  [←] 창세기 주요 단어  [정렬 ▼] [⋮]│
├─────────────────────────────────────┤
│  정렬: [가나다순] [추가순] [암기순] │
│  전체 45개 | 암기 12개              │
│                                     │
│  ┌────────────────────────────┐    │
│  │ □ בְּרֵאשִׁית              │    │
│  │   bereshith | 태초에       │    │
│  │   출처: 창세기 1:1  [🔊]   │    │
│  ├────────────────────────────┤    │
│  │ ☑ בָּרָא                   │    │
│  │   bara | 창조하다          │    │
│  │   출처: 창세기 1:1  [🔊]   │    │
│  ├────────────────────────────┤    │
│  │ □ אֱלֹהִים                 │    │
│  │   elohim | 하나님          │    │
│  │   출처: 창세기 1:1  [🔊]   │    │
│  └────────────────────────────┘    │
│                                     │
│  [퀴즈 모드] [내보내기]             │
└─────────────────────────────────────┘
```

#### 4.2.6 지도 화면 (`/map`)

```
┌─────────────────────────────────────┐
│  [←] 성경 지도                      │
├─────────────────────────────────────┤
│  ┌────────────────────────────┐    │
│  │ 🔍 지명 검색...            │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │                             │    │
│  │    [Google Maps 영역]       │    │
│  │                             │    │
│  │    📍 예루살렘              │    │
│  │         📍 벧엘             │    │
│  │    📍 헤브론                │    │
│  │              📍 여리고      │    │
│  │                             │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌─ 선택된 장소 정보 ─────────┐    │
│  │ 예루살렘 (יְרוּשָׁלַםִ)     │    │
│  │ Jerusalem                   │    │
│  │                             │    │
│  │ 다윗 왕이 수도로 정한 도시. │    │
│  │ 솔로몬 성전이 건축된 곳.    │    │
│  │                             │    │
│  │ 관련 구절:                  │    │
│  │ • 사무엘하 5:6              │    │
│  │ • 열왕기상 11:42            │    │
│  │                             │    │
│  │ [구절로 이동]               │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 4.2.7 낭독 플레이어 (오버레이)

```
┌─────────────────────────────────────┐
│  ┌─ 낭독 플레이어 ────────────┐    │
│  │ 창세기 1:1-3               │    │
│  │ 한국어 | 여성 음성           │    │
│  │                             │    │
│  │ ───●──────────── 1:23/3:45 │    │
│  │                             │    │
│  │   [⏮] [⏪] [▶/⏸] [⏩] [⏭]  │    │
│  │                             │    │
│  │ 속도: [0.5x] [0.75x] [1x]  │    │
│  │       [1.25x] [1.5x] [2x]  │    │
│  │                             │    │
│  │ 언어: [한국어▼]             │    │
│  │  히브리어/헬라어/영어/      │    │
│  │  일본어/중국어/스페인어...  │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 4.2.8 설교 검색 화면 (`/sermons`)

```
┌─────────────────────────────────────┐
│  [←] 설교 검색                      │
├─────────────────────────────────────┤
│  현재 구절: 창세기 1:1              │
│                                     │
│  ┌────────────────────────────┐    │
│  │ 🔍 설교 검색...            │    │
│  └────────────────────────────┘    │
│                                     │
│  이 구절 관련 추천 설교             │
│  ┌────────────────────────────┐    │
│  │ 태초의 하나님               │    │
│  │ 김목사 | 사랑교회           │    │
│  │ 관련도: ★★★★★              │    │
│  │ "창세기 1장 1절에 담긴..."  │    │
│  ├────────────────────────────┤    │
│  │ 창조의 신비                 │    │
│  │ 이목사 | 은혜교회           │    │
│  │ 관련도: ★★★★☆              │    │
│  │ "하나님의 창조 사역은..."   │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 4.2.9 클릭 이력 화면 (`/history`)

```
┌─────────────────────────────────────┐
│  [←] 활동 이력                      │
├─────────────────────────────────────┤
│  기간: [오늘] [이번주] [이번달]     │
│  필터: [전체▼]                      │
│                                     │
│  2026년 3월 10일                    │
│  ┌────────────────────────────┐    │
│  │ 📖 창세기 1:1 조회          │    │
│  │    09:00 | 5초 체류          │    │
│  ├────────────────────────────┤    │
│  │ 🔍 "사랑" 검색              │    │
│  │    09:05 | 결과 523건       │    │
│  ├────────────────────────────┤    │
│  │ 📚 "אֱלֹהִים" 사전 조회     │    │
│  │    09:10                    │    │
│  ├────────────────────────────┤    │
│  │ 🔊 창세기 1:1-5 낭독 재생   │    │
│  │    09:15 | 한국어 1.0x      │    │
│  └────────────────────────────┘    │
│                                     │
│  통계 요약                          │
│  ┌────────────────────────────┐    │
│  │ 총 조회: 150구절            │    │
│  │ 가장 많이 본 책: 창세기     │    │
│  │ 연속 읽기: 7일              │    │
│  │ 단어 조회: 45개             │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 4.3 고유명사 표시 규칙

- **인물**: 굵은 기울임꼴 (`<strong><em>하나님</em></strong>`)
- **지명**: 굵은 밑줄 (`<strong><u>예루살렘</u></strong>`) - 클릭 시 지도로 이동
- **특수 사물 (에봇 ephod 등)**: 기울임꼴 (`<em>에봇</em>`) - 클릭 시 사전 팝업
- 모든 고유명사는 클릭 가능하며, 클릭 시 관련 정보 팝업 표시

### 4.4 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 레이아웃 |
|---------------|------|----------|
| 모바일 | < 640px | 단일 컬럼, 하단 탭 네비게이션 |
| 태블릿 | 640px - 1024px | 2컬럼 (본문 + 사이드패널) |
| 데스크톱 | > 1024px | 3컬럼 (네비게이션 + 본문 + 도구패널) |

---

## 5. 외부 서비스 연동 설계

### 5.1 Bible API 연동

#### 사용 API
- **API.Bible (by American Bible Society)**: 다양한 영어 번역본 (KJV, NIV, ESV 등)
- **STEP Bible Data**: 히브리어/헬라어 원문, 스트롱 넘버 데이터
- **자체 DB**: 한국어 번역 (개역개정 등)은 라이선스 확인 후 자체 DB에 저장

#### 연동 구조

```
┌────────────┐      ┌──────────────┐      ┌─────────────┐
│ 클라이언트  │ ──→  │  NestJS API  │ ──→  │  API.Bible  │
│            │      │  (캐시 계층) │      │             │
│            │      │              │ ──→  │ 자체 DB     │
│            │      │              │      │ (PostgreSQL)│
└────────────┘      └──────────────┘      └─────────────┘
```

#### 데이터 동기화 전략
- 초기 로드: 전체 성경 데이터를 자체 DB에 저장 (배치 작업)
- 새 번역본 추가 시: API.Bible에서 데이터 가져와 자체 DB에 적재
- 원어 데이터: STEP Bible 오픈 데이터셋 활용, 주기적 업데이트

### 5.2 TTS (음성 합성) 연동

#### 사용 API
- **Google Cloud Text-to-Speech**: 다국어 고품질 TTS
- **OpenAI TTS API**: 자연스러운 음성 (유료 기능)
- **Azure Cognitive Services Speech**: 히브리어/헬라어 특화

#### 언어별 음성 매핑

| 언어 | 서비스 | 음성 ID | 비고 |
|------|--------|---------|------|
| 한국어 | Google TTS | ko-KR-Wavenet-A/B | 남/여 |
| 영어 | OpenAI TTS | alloy, nova | 자연스러운 음성 |
| 히브리어 | Azure TTS | he-IL-AvriNeural | 히브리어 특화 |
| 헬라어 | Google TTS | el-GR-Wavenet-A | 현대 그리스어 기반 |
| 일본어 | Google TTS | ja-JP-Wavenet-A | |
| 중국어 | Google TTS | cmn-CN-Wavenet-A | 만다린 |
| 스페인어 | Google TTS | es-ES-Wavenet-A | |

#### TTS 캐싱 전략
- 생성된 음성 파일은 Supabase Storage에 저장
- 캐시 키: `{verse_id}_{language}_{voice}_{speed}`
- 자주 요청되는 구절은 미리 생성 (배치 작업)
- 캐시 만료: 없음 (영구 저장)

#### 속도 조절
- 지원 범위: 0.5x ~ 2.0x (0.25x 단위)
- 구현: TTS API의 `speaking_rate` 파라미터 활용
- 실시간 조절: 클라이언트 측 Web Audio API `playbackRate`

### 5.3 지도 (Google Maps) 연동

#### 사용 API
- **Google Maps JavaScript API**: 웹 지도 표시
- **React Native Maps**: 모바일 지도 표시

#### 연동 방식
```typescript
// 지명 데이터 구조
interface BiblePlace {
  id: number;
  name: string;          // 한국어 이름
  nameOriginal: string;  // 히브리어/헬라어 이름
  nameEn: string;        // 영어 이름
  lat: number;
  lng: number;
  modernName: string;
  description: string;
  relatedVerses: VerseReference[];
}
```

#### 지도 기능
- 장별 등장 지명 핀 표시
- 인물별 이동 경로 표시 (예: 아브라함의 여정)
- 커스텀 마커 (성경 시대 아이콘)
- 핀 클릭 시 지명 정보 + 관련 구절 표시

### 5.4 사전 API 연동

#### 영어 사전
- **Free Dictionary API** (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`)
- 무료, 발음 음성 파일 포함
- 단어 뜻, 품사, 예문, 유의어 제공

#### 히브리어/헬라어 사전
- **STEP Bible Lexicon**: 스트롱 넘버 기반 원어 사전
- **OpenScriptures Hebrew Lexicon**: 히브리어 단어 상세 정의
- 자체 DB에 사전 데이터 저장 (오프라인 지원)

#### 발음 재생 구현

```typescript
// 발음 재생 모듈
class PronunciationPlayer {
  // 영어: Free Dictionary API에서 제공하는 음성 URL 사용
  async playEnglish(word: string): Promise<void>;

  // 히브리어/헬라어: Google TTS API로 발음 생성 후 캐시
  async playOriginalLanguage(
    word: string,
    language: 'he' | 'gr'
  ): Promise<void>;
}
```

### 5.5 번역 서비스 연동

#### 사용 API
- **DeepL API**: 고품질 번역 (주요 언어)
- **Google Translate API**: 광범위한 언어 지원 (100+ 언어)

#### 번역 전략
- 주요 번역 (영어, 한국어, 일본어, 중국어): 공인 성경 번역본 사용
- 기타 언어: AI 번역 + "비공식 번역" 표시
- 번역 결과 캐싱 (DB 저장)

### 5.6 AI/ML 서비스 연동

#### OpenAI API
- **용도**: 설교 요약, 의미 검색용 임베딩 생성, 질의응답
- **모델**: text-embedding-3-small (임베딩), GPT-4o (질의응답)
- **비용 절감**: 임베딩은 사전 계산하여 pgvector에 저장

#### 설교 추천 로직

```python
# FastAPI 설교 추천 엔진
async def recommend_sermons(verse_id: int, limit: int = 5):
    # 1. 구절의 임베딩 벡터 조회
    verse_embedding = await get_verse_embedding(verse_id)

    # 2. pgvector 코사인 유사도 검색
    similar_sermons = await db.execute(
        """
        SELECT id, title, pastor, church, summary,
               1 - (embedding <=> $1) as relevance_score
        FROM sermons
        ORDER BY embedding <=> $1
        LIMIT $2
        """,
        verse_embedding, limit
    )

    return similar_sermons
```

### 5.7 결제 (Stripe) 연동

#### 유료 기능 목록

| 기능 | 무료 | 프리미엄 |
|------|------|----------|
| 성경 읽기 (기본 번역) | O | O |
| 영어 번역 비교 (2개) | O | O |
| 영어 번역 비교 (전체) | X | O |
| 단어장 (1개, 50단어) | O | O |
| 단어장 (무제한) | X | O |
| 영어 사전 | O | O |
| 히브리어/헬라어 사전 | X | O |
| TTS 기본 (한국어/영어) | O | O |
| TTS AI 음성 (전체 언어) | X | O |
| 의미 기반 AI 검색 | X | O |
| 설교 추천 (3개) | O | O |
| 설교 추천 (무제한) | X | O |
| 오프라인 모드 | X | O |
| 광고 제거 | X | O |

#### 구독 플랜

| 플랜 | 가격 | 기간 |
|------|------|------|
| 월간 | ₩4,900/월 | 1개월 |
| 연간 | ₩39,000/년 (₩3,250/월) | 12개월 |
| 평생 | ₩99,000 (1회) | 영구 |

---

## 6. 인증/권한 설계

### 6.1 인증 방식

#### Supabase Auth 활용

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  클라이언트   │     │ Supabase Auth│     │  NestJS API  │
│              │     │              │     │              │
│ 1. 로그인    │────→│ 2. 인증 처리 │     │              │
│              │     │              │     │              │
│ 3. JWT 수신  │←────│ JWT 발급     │     │              │
│              │     │              │     │              │
│ 4. API 요청  │─────────────────────────→│ 5. JWT 검증  │
│   (Bearer)   │     │              │     │   (Supabase  │
│              │     │              │     │    공개키)    │
│ 6. 응답 수신 │←─────────────────────────│              │
└──────────────┘     └──────────────┘     └──────────────┘
```

#### 지원 인증 방법
- **이메일/비밀번호**: 기본 회원가입
- **Google OAuth 2.0**: 소셜 로그인
- **Apple Sign In**: iOS 앱 필수
- **매직 링크**: 이메일로 일회용 로그인 링크 전송

### 6.2 토큰 관리

| 토큰 | 유효기간 | 용도 |
|------|----------|------|
| Access Token (JWT) | 1시간 | API 인증 |
| Refresh Token | 30일 | Access Token 갱신 |

#### JWT 페이로드 구조

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "user",
  "is_premium": true,
  "iat": 1709000000,
  "exp": 1709003600
}
```

### 6.3 권한 모델 (RBAC)

| 역할 | 설명 | 권한 |
|------|------|------|
| guest | 비로그인 사용자 | 성경 읽기(기본), 검색(기본) |
| user | 무료 회원 | guest + 북마크, 단어장(제한), 이력 |
| premium | 유료 회원 | user + 전체 기능 |
| admin | 관리자 | 전체 기능 + 데이터 관리 |

#### NestJS 가드 구현

```typescript
// 권한 데코레이터
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('premium')
@Get('search/semantic')
async semanticSearch(@Query() query: SearchDto) {
  // 유료 회원만 접근 가능
}

// 기능별 접근 제어
@UseGuards(JwtAuthGuard, PremiumFeatureGuard)
@PremiumFeature('hebrew_dictionary')
@Get('dictionary/strong/:strongNumber')
async getStrongDefinition(@Param('strongNumber') sn: string) {
  // 히브리어/헬라어 사전은 유료 기능
}
```

### 6.4 API Rate Limiting

| 역할 | 제한 | 기간 |
|------|------|------|
| guest | 100 요청 | 15분 |
| user | 500 요청 | 15분 |
| premium | 2000 요청 | 15분 |
| TTS 생성 (user) | 10 요청 | 1시간 |
| TTS 생성 (premium) | 100 요청 | 1시간 |

---

## 7. 오프라인 지원 설계

### 7.1 오프라인 아키텍처

```
┌─────────────────────────────────────────────────┐
│                  클라이언트                       │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │ UI 컴포넌트  │    │  Service Worker      │   │
│  │              │    │  (웹) / Background    │   │
│  │              │    │  Sync (RN)           │   │
│  └──────┬───────┘    └──────────┬───────────┘   │
│         │                       │                │
│  ┌──────┴───────┐    ┌─────────┴────────────┐   │
│  │ 오프라인     │    │  동기화 관리자        │   │
│  │ 데이터 접근  │    │  - 변경 큐 관리       │   │
│  │ 계층         │    │  - 충돌 해결          │   │
│  └──────┬───────┘    │  - 재시도 로직        │   │
│         │            └──────────┬───────────┘   │
│  ┌──────┴───────┐               │                │
│  │   SQLite     │←──────────────┘                │
│  │  (로컬 DB)   │                                │
│  └──────────────┘                                │
└─────────────────────────────────────────────────┘
```

### 7.2 오프라인 저장 데이터

| 데이터 | 저장 방식 | 크기 (예상) | 동기화 |
|--------|----------|-------------|--------|
| 성경 본문 (1개 버전) | SQLite | ~5MB | 초기 다운로드 |
| 성경 본문 (전체 버전) | SQLite | ~50MB | 선택적 다운로드 |
| 히브리어/헬라어 원문 | SQLite | ~10MB | 유료 다운로드 |
| 사전 데이터 | SQLite | ~20MB | 유료 다운로드 |
| 사용자 북마크 | SQLite | ~1MB | 양방향 동기화 |
| 사용자 단어장 | SQLite | ~2MB | 양방향 동기화 |
| TTS 캐시 (다운로드) | 파일 시스템 | ~500MB (전체) | 선택적 다운로드 |
| 최근 검색 이력 | SQLite | ~1MB | 온라인 시 업로드 |

### 7.3 SQLite 스키마 (클라이언트)

```sql
-- 오프라인 성경 데이터
CREATE TABLE offline_verses (
  id INTEGER PRIMARY KEY,
  version_code TEXT NOT NULL,
  book_number INTEGER NOT NULL,
  chapter_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_original TEXT
);

CREATE INDEX idx_offline_verses_ref
  ON offline_verses(version_code, book_number, chapter_number);

-- 오프라인 사용자 데이터 (동기화 대상)
CREATE TABLE offline_bookmarks (
  id TEXT PRIMARY KEY,
  verse_id INTEGER NOT NULL,
  color TEXT,
  note TEXT,
  synced INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL
);

-- 동기화 큐
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL,  -- 'create', 'update', 'delete'
  data TEXT NOT NULL,    -- JSON
  created_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0
);
```

### 7.4 동기화 전략

#### 충돌 해결 규칙
- **Last-Write-Wins (LWW)**: `updated_at` 타임스탬프 기준 최신 데이터 우선
- **서버 우선**: 결제/구독 관련 데이터는 항상 서버 데이터 우선
- **병합**: 북마크의 경우 양쪽 모두 유지 (중복 제거)

#### 동기화 프로세스

```
1. 온라인 복구 감지 (navigator.onLine / NetInfo)
2. sync_queue에서 미동기화 항목 조회
3. 서버로 변경사항 전송 (POST /sync/push)
4. 서버에서 최신 변경사항 수신 (GET /sync/pull?since=lastSyncTimestamp)
5. 충돌 해결 후 로컬 DB 업데이트
6. sync_queue에서 완료 항목 제거
```

### 7.5 Service Worker 전략 (웹)

```javascript
// 캐시 전략
const CACHE_STRATEGIES = {
  // 성경 본문: Cache First (오프라인 우선)
  '/api/v1/bibles/*/books/*/chapters/*': 'CacheFirst',

  // 사전 데이터: Cache First
  '/api/v1/dictionary/*': 'CacheFirst',

  // 검색: Network First (온라인 우선, 실패 시 캐시)
  '/api/v1/search*': 'NetworkFirst',

  // 사용자 데이터: Network First
  '/api/v1/bookmarks*': 'NetworkFirst',
  '/api/v1/vocabularies*': 'NetworkFirst',

  // TTS: Cache Only (미리 다운로드한 것만)
  '/api/v1/tts/*': 'CacheOnly',

  // 정적 리소스: Cache First
  '/_next/static/*': 'CacheFirst',
};
```

---

## 8. 성능 최적화 전략

### 8.1 프론트엔드 최적화

#### Next.js SSR/SSG 전략

| 페이지 | 렌더링 전략 | 이유 |
|--------|------------|------|
| 홈 | ISR (60초) | 오늘의 말씀 주기적 갱신 |
| 성경 목록 | SSG | 정적 데이터 |
| 성경 본문 | SSG + CSR | 본문은 정적, 사용자 데이터는 클라이언트 |
| 검색 | CSR | 동적 쿼리 |
| 단어장 | CSR | 사용자별 데이터 |
| 사전 | ISR (1일) | 사전 데이터는 거의 변경 없음 |

#### 코드 분할 및 지연 로딩

```typescript
// 지도 컴포넌트 지연 로딩 (Google Maps API가 무거움)
const BibleMap = dynamic(() => import('@/components/BibleMap'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

// TTS 플레이어 지연 로딩
const TTSPlayer = dynamic(() => import('@/components/TTSPlayer'), {
  ssr: false,
});

// 히브리어/헬라어 폰트 비동기 로딩
const HebrewFont = dynamic(() => import('@/components/HebrewText'));
```

#### 이미지/미디어 최적화
- Next.js `Image` 컴포넌트 사용 (자동 최적화, WebP 변환)
- TTS 음성: MP3 64kbps (음성에 충분한 품질)
- 지도 타일: 줌 레벨에 따른 적응형 로딩

### 8.2 백엔드 최적화

#### 캐싱 계층

```
요청 → Vercel Edge Cache → Redis Cache → PostgreSQL
       (CDN, 정적 데이터)  (동적 데이터)  (원본 데이터)
```

| 캐시 대상 | TTL | 캐시 계층 |
|-----------|-----|----------|
| 성경 본문 | 24시간 | Edge + Redis |
| 사전 데이터 | 7일 | Edge + Redis |
| 검색 결과 | 1시간 | Redis |
| TTS 음성 | 영구 | Supabase Storage |
| 사용자 세션 | 1시간 | Redis |
| 설교 추천 | 6시간 | Redis |

#### 데이터베이스 최적화

```sql
-- 성경 구절 조회 최적화 인덱스
CREATE INDEX idx_verses_chapter_verse
  ON verses(chapter_id, verse_number);

-- 전문 검색 인덱스 (PostgreSQL tsvector)
CREATE INDEX idx_verses_text_search
  ON verses USING GIN(to_tsvector('korean', text));

-- 벡터 검색 인덱스 (pgvector IVFFLAT)
CREATE INDEX idx_verses_embedding
  ON verses USING ivfflat(embedding vector_cosine_ops)
  WITH (lists = 100);

-- 설교 벡터 검색 인덱스
CREATE INDEX idx_sermons_embedding
  ON sermons USING ivfflat(embedding vector_cosine_ops)
  WITH (lists = 50);

-- 클릭 이력 조회 최적화
CREATE INDEX idx_click_histories_user_time
  ON click_histories(user_id, created_at DESC);

-- 파티셔닝: 클릭 이력 테이블 월별 분할
CREATE TABLE click_histories (
  ...
) PARTITION BY RANGE (created_at);
```

#### API 응답 최적화
- **필드 선택**: `?fields=id,text,verse_number` (불필요한 필드 제외)
- **압축**: gzip/brotli 응답 압축
- **페이지네이션**: cursor 기반 (offset보다 효율적)
- **배치 요청**: 여러 구절 동시 조회 지원

### 8.3 검색 최적화 (Meilisearch)

```javascript
// Meilisearch 인덱스 설정
const bibleIndex = {
  primaryKey: 'id',
  searchableAttributes: ['text', 'reference', 'book_name'],
  filterableAttributes: ['version_code', 'book_number', 'testament'],
  sortableAttributes: ['book_number', 'chapter_number', 'verse_number'],
  typoTolerance: {
    enabled: true,
    minWordSizeForTypos: { oneTypo: 3, twoTypos: 6 }
  },
  // 한국어 토크나이저 설정
  dictionary: ['하나님', '예수', '그리스도', ...],
};
```

### 8.4 모바일 성능 최적화

- **FlatList 가상화**: 긴 성경 본문 리스트 최적화
- **메모이제이션**: `React.memo`, `useMemo`, `useCallback` 적극 활용
- **이미지 캐싱**: `react-native-fast-image` 사용
- **번들 크기**: Hermes 엔진 사용, 트리 쉐이킹
- **애니메이션**: `react-native-reanimated` (네이티브 스레드 애니메이션)

---

## 9. 보안 고려사항

### 9.1 인증/인가 보안

- **비밀번호 해싱**: bcrypt (cost factor 12)
- **JWT 보안**: RS256 알고리즘, 짧은 만료 시간 (1시간)
- **Refresh Token**: HTTP-Only Secure Cookie로 저장 (XSS 방지)
- **CSRF 보호**: SameSite=Strict 쿠키 + CSRF 토큰
- **OAuth**: state 파라미터로 CSRF 방지, PKCE 적용

### 9.2 API 보안

- **Rate Limiting**: 역할별 차등 제한 (섹션 6.4 참조)
- **입력 검증**: class-validator (NestJS) 전 엔드포인트 적용
- **SQL Injection 방지**: TypeORM 파라미터 바인딩 (raw query 금지)
- **XSS 방지**: DOMPurify로 사용자 입력 새니타이즈
- **CORS**: 허용 도메인 화이트리스트 설정

```typescript
// NestJS 입력 검증 예시
class SearchDto {
  @IsString()
  @Length(1, 200)
  @Transform(({ value }) => DOMPurify.sanitize(value))
  q: string;

  @IsOptional()
  @IsIn(['KRV', 'KJV', 'NIV', 'ESV', 'NASB'])
  version?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(66)
  book?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

### 9.3 데이터 보안

- **전송 암호화**: TLS 1.3 (모든 통신)
- **저장 암호화**: Supabase DB 저장 시 AES-256 암호화
- **개인정보 최소화**: 필요한 최소한의 개인정보만 수집
- **로그 마스킹**: 민감 정보 (이메일, 토큰) 로그에서 마스킹

```typescript
// 로그 마스킹
function maskSensitiveData(data: any): any {
  return {
    ...data,
    email: data.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
    token: data.token ? '***MASKED***' : undefined,
  };
}
```

### 9.4 결제 보안

- **Stripe Webhook 검증**: 서명 검증으로 위조 방지
- **PCI DSS 준수**: 카드 정보 직접 처리 없음 (Stripe Elements 사용)
- **결제 상태 검증**: 서버 사이드에서 Stripe API로 이중 확인

```typescript
// Stripe Webhook 검증
@Post('webhook/stripe')
async handleStripeWebhook(
  @Req() req: RawBodyRequest,
  @Headers('stripe-signature') signature: string,
) {
  const event = this.stripe.webhooks.constructEvent(
    req.rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await this.subscriptionService.activate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await this.subscriptionService.deactivate(event.data.object);
      break;
  }
}
```

### 9.5 모바일 앱 보안

- **인증서 피닝**: SSL Certificate Pinning 적용
- **루팅/탈옥 탐지**: 루팅된 기기에서 결제 기능 제한
- **로컬 데이터 암호화**: SQLite 데이터 SQLCipher로 암호화
- **난독화**: ProGuard (Android) / 기본 빌드 최적화 (iOS)
- **API 키 보호**: 클라이언트에 API 키 노출 금지, 서버 프록시 사용

### 9.6 콘텐츠 보안

- **성경 저작권**: 각 번역본의 라이선스 조건 준수
- **설교 콘텐츠**: 출처 명시, 저작권 침해 방지
- **사용자 생성 콘텐츠** (메모, 노트): 불법/유해 콘텐츠 필터링

### 9.7 인프라 보안

- **환경 변수 관리**: Vercel/Supabase의 환경 변수 시스템 활용 (코드에 하드코딩 금지)
- **의존성 보안**: `npm audit`, Dependabot 자동 업데이트
- **접근 제어**: Supabase RLS (Row Level Security) 정책 적용
- **모니터링**: Sentry (에러 추적), 비정상 접근 패턴 알림

```sql
-- Supabase Row Level Security 예시
-- 사용자 본인의 북마크만 접근 가능
CREATE POLICY "Users can only access own bookmarks"
  ON bookmarks
  FOR ALL
  USING (auth.uid() = user_id);

-- 사용자 본인의 단어장만 접근 가능
CREATE POLICY "Users can only access own vocabularies"
  ON vocabularies
  FOR ALL
  USING (auth.uid() = user_id);
```

### 9.8 개인정보 보호 (GDPR/개인정보보호법)

- **개인정보 처리방침**: 수집 항목, 목적, 보유 기간 명시
- **데이터 삭제 요청**: 계정 삭제 시 모든 개인 데이터 30일 내 삭제
- **데이터 내보내기**: 사용자 데이터 JSON/CSV 형식 내보내기 지원
- **동의 관리**: 마케팅, 분석 등 선택적 동의 관리

---

## 부록: 개발 우선순위 로드맵

### Phase 1 - MVP (8주)
- 성경 읽기 (한국어 개역개정 + KJV)
- 기본 검색
- 사용자 인증
- 북마크

### Phase 2 - 핵심 기능 (6주)
- 영어 번역 비교 (NIV, ESV, NASB 추가)
- 영어 사전 연동 + 발음 재생
- 단어장 기능
- 클릭 이력 조회

### Phase 3 - 원어 지원 (6주)
- 히브리어/헬라어 원문 표시
- 스트롱 넘버 기반 원어 사전
- 고유명사 강조 표시 (기울임꼴, 에봇 등)

### Phase 4 - AI/고급 기능 (8주)
- AI TTS 낭독 (다국어, 속도 조절)
- 의미 기반 AI 검색
- 설교 검색/추천
- 지도 연동

### Phase 5 - 유료화/오프라인 (4주)
- Stripe 결제 연동
- 유료/무료 기능 분리
- 오프라인 모드
- 모바일 앱 출시 (App Store, Play Store)

### Phase 6 - 확장 (지속)
- 전세계 언어 번역 확대
- 성경 통독표/읽기 계획
- 커뮤니티 기능 (나눔, 기도 요청)
- 성경 퀴즈/게임화
