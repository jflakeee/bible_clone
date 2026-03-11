# 설계 구조 적합성 검토 보고서

> 검토일: 2026-03-10

---

## 검토 대상 문서

| 문서 | 파일 | 크기 |
|------|------|------|
| 아이디어 | `idea_1.txt` | 기능 20개 항목 |
| 리서치 | `research.md` | API, 사전, TTS, 지도, 경쟁앱, 기술스택 |
| 상세 설계 | `design.md` | 9개 섹션 (아키텍처~보안) |
| 브레인스토밍 | `brainstorming.md` | 100+ 추가 아이디어 |
| 구현 계획 | `implementation_plan.md` | Phase 0~3, 12개 기능 체크리스트 |
| 테스트 계획 | `test_plan.md` | 300+ 테스트 항목 |

---

## 1. 아이디어 ↔ 설계 커버리지 검토

### 원본 아이디어 기능 매핑

| 아이디어 기능 | 설계 문서 반영 | 구현 계획 반영 | 테스트 반영 | 상태 |
|---------------|---------------|---------------|------------|------|
| 영어 번역 비교 | design.md §3, §4 | Phase 1 | Phase 1 테스트 | OK |
| 단어 뜻 풀이 영어사전 연동 | design.md §5 (Free Dictionary API) | Phase 1 | Phase 1 테스트 | OK |
| 단어 발음 재생 | design.md §4 (PronunciationButton) | Phase 2 | Phase 2 테스트 | OK |
| 히브리어/헬라어 | design.md §2 (verse_words 테이블) | Phase 2 | Phase 2 테스트 | OK |
| 전세계 언어 번역 | design.md §5 (DeepL/Google Translate) | Phase 3 | Phase 3 테스트 | OK |
| 단어장 모음 | design.md §2 (vocabularies), §3 | Phase 2 | Phase 2 테스트 | OK |
| 단어장 정렬 | design.md §3 (GET /vocabulary) | Phase 2 | Phase 2 테스트 | OK |
| 고급 기능 유료화 | design.md §6 (RBAC premium), §5 (Stripe) | 구현 계획 부록 | 테스트 계획 보안 | OK |
| 지명 지도 연동 | design.md §4 (MapViewer), §5 | Phase 2 | Phase 2 테스트 | OK |
| 히/헬 사전 연동 | design.md §5 (STEP Bible Lexicon) | Phase 2 | Phase 2 테스트 | OK |
| AI 언어별 성경 낭독 | design.md §5 (TTS), §4 (AudioPlayer) | Phase 3 | Phase 3 테스트 | OK |
| 낭독 속도 조절 | design.md §4 (AudioPlayer speed) | Phase 3 | Phase 3 테스트 | OK |
| 성경구절별 설교 검색 추천 | design.md §3, §2 (sermons 테이블) | Phase 3 | Phase 3 테스트 | OK |
| 클릭한 내역 조회 | design.md §2 (click_histories), §3 | Phase 1 | Phase 1 테스트 | OK |
| 고유명사 강조 필기체 기울임 | design.md §4 (proper_nouns 스타일링) | Phase 3 | Phase 3 테스트 | OK |

> **결과:** 원본 아이디어 15개 기능 전체가 설계/구현/테스트에 반영됨 — **100% 커버리지**

---

## 2. 아키텍처 적합성 평가

### 장점

| 항목 | 평가 |
|------|------|
| **계층 분리** | 클라이언트 → API 게이트웨이 → 백엔드 → 데이터 4계층 명확 분리 |
| **마이크로서비스** | NestJS(CRUD) + FastAPI(AI) 분리로 AI 부하 격리 가능 |
| **오프라인 지원** | SQLite + Service Worker 전략 적절 |
| **검색** | PostgreSQL FTS + Meilisearch + pgvector 3단계 검색 전략 우수 |
| **확장성** | Vercel Edge + Supabase로 초기 비용 $0 시작 가능 |
| **데이터 모델** | verse_words 테이블로 Strong's 번호 연동 구조 적절 |

### 주의사항 및 개선 제안

| # | 항목 | 이슈 | 제안 |
|---|------|------|------|
| 1 | **Redis 필요성** | MVP 단계에서 Redis 추가는 복잡도 증가 | Phase 0-1은 Vercel Edge 캐시 + Supabase만으로 충분. Phase 2+에서 Redis 도입 |
| 2 | **모노레포 복잡도** | Turborepo 모노레포는 초기 설정 비용 있음 | 1인 개발 시 web + api 분리 정도로 시작, 규모 커질 때 모노레포 전환 |
| 3 | **NestJS vs 경량 대안** | NestJS는 강력하지만 보일러플레이트 많음 | MVP는 Next.js API Routes로 시작, 복잡해지면 NestJS 분리 |
| 4 | **FastAPI 별도 서버** | AI 기능은 Phase 3이므로 초기에 불필요 | Phase 3 시작 시 FastAPI 서버 추가 |
| 5 | **Meilisearch 호스팅** | 별도 서버 또는 Meilisearch Cloud 필요 | Phase 1은 PostgreSQL FTS, Phase 2+에서 Meilisearch 도입 |
| 6 | **React Native 시점** | 웹+모바일 동시 개발은 리소스 분산 | 웹 MVP 완성 후 PWA로 모바일 대응, 이후 React Native |

---

## 3. 데이터 모델 적합성

### 핵심 테이블 구조 검증

| 테이블 | 목적 | 적합성 | 비고 |
|--------|------|--------|------|
| `bibles` | 번역본 메타데이터 | 적절 | language, license 포함 |
| `books` | 성경 66권 | 적절 | testament 구분 포함 |
| `chapters` | 장 | 적절 | verse_count 포함 |
| `verses` | 절 텍스트 | 적절 | 핵심 테이블 |
| `verse_words` | 단어별 원어 매핑 | **핵심** | Strong's 번호, 형태소, 발음 |
| `strongs_dictionary` | Strong's 사전 | 적절 | 히/헬 통합 |
| `vocabularies` | 사용자 단어장 | 적절 | 복습 간격 포함 |
| `proper_nouns` | 고유명사 정의 | 적절 | 표시 스타일 포함 |
| `click_histories` | 클릭 이력 | 적절 | context 포함 |
| `sermons` | 설교 데이터 | 적절 | embedding 벡터 포함 |

> **결과:** 15개 테이블 구조가 기능 요구사항을 충족. verse_words 테이블이 원어 학습의 핵심.

---

## 4. API 설계 적합성

- RESTful 규칙 준수 (리소스 기반 URL, HTTP 메서드 적절)
- 페이지네이션, 필터링 파라미터 포함
- 응답 형식 일관성 (data + meta 구조)
- Rate Limiting 설계 포함

### 누락 검토
- WebSocket 실시간 기능 (향후 소셜 기능 시 필요) — Phase 3+ 고려
- GraphQL 대안 검토 불필요 (REST으로 충분)

---

## 5. 테스트 전략 적합성

- 테스트 피라미드 (60/30/10) 비율 적절
- 성경 데이터 무결성 테스트 (31,102절) 포함 — **매우 중요**
- 성능 기준 명확 (P50/P95/P99, 동시 사용자 수)
- 접근성(WCAG 2.1 AA) 포함

---

## 6. 종합 평가

| 영역 | 점수 | 비고 |
|------|------|------|
| 기능 커버리지 | 10/10 | 원본 아이디어 100% 반영 |
| 아키텍처 설계 | 9/10 | MVP 단순화 필요 (위 제안사항 참고) |
| 데이터 모델 | 9/10 | verse_words 핵심 테이블 적절 |
| API 설계 | 9/10 | RESTful 일관성 우수 |
| 테스트 전략 | 9/10 | 300+ 항목으로 포괄적 |
| 기술 스택 선택 | 9/10 | 무료 티어 활용 최적화 |
| 확장성 | 8/10 | Phase별 점진적 도입 전략 적절 |
| **종합** | **9/10** | **구현 준비 완료** |

### MVP 시작 시 실제 권장 스택 (간소화)

```
Phase 1 실제 스택:
├── Next.js (App Router + API Routes)  ← 프론트+백엔드 통합
├── Supabase (PostgreSQL + Auth)       ← DB + 인증
├── Vercel                             ← 배포
├── bible.helloao.org                  ← 성경 텍스트
└── openscriptures/strongs (JSON)      ← Strong's 사전 (정적 데이터)

Phase 2 추가:
├── Meilisearch Cloud                  ← 전문 검색
├── Leaflet.js + OpenBible Geocoding   ← 지도
└── STEPBible Data                     ← 원어 데이터

Phase 3 추가:
├── Python FastAPI                     ← AI 서비스
├── Bible Brain API                    ← 오디오
├── Google Cloud TTS                   ← AI 낭독
└── pgvector                           ← 시맨틱 검색
```

---

> **결론:** 설계 문서들의 구조적 적합성은 우수하며, 위 간소화 제안을 적용하면 MVP를 빠르게 시작할 수 있습니다.
