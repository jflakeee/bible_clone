# 성경 앱 코드 리뷰 보고서

> 검토일: 2026-03-10

---

## 1. 설계내용과 다른 부분 (Design Deviations)

| 항목 | 설명 | 심각도 |
|------|------|--------|
| 모노레포 미적용 | 설계: Turborepo 모노레포 → 실제: 단일 Next.js 프로젝트 | 높음 |
| 백엔드 API 미구현 | 설계: NestJS REST API → 실제: Next.js API Routes (BFF) | 중간 |
| 데이터베이스 미사용 | 설계: PostgreSQL+pgvector+Meilisearch → 실제: 외부 API 직접 호출 | 높음 |
| API 응답 형식 불일치 | 설계: `{data:{...}}` 래핑 → 실제: 비표준 형식 | 중간 |
| 인증 시스템 부재 | 설계: Supabase Auth → 실제: 미구현 | 높음 |

## 2. 미구현 기능 (높음 심각도)

- DB 스키마/마이그레이션
- Meilisearch 인덱싱 (브루트포스 검색으로 대체)
- 인증 (로그인/회원가입)
- React Native 모바일 앱
- FastAPI AI 서비스
- 벡터 임베딩/의미 검색

## 3. 중복 구현

| 중복 | 파일들 | 심각도 |
|------|--------|--------|
| AudioPlayer 2개 | AudioPlayer.tsx vs EnhancedAudioPlayer.tsx | 중간 |
| TTS 로직 2개 | audio-api.ts vs tts-service.ts | 중간 |
| getLanguageForBook 2개 | audio-api.ts vs original-text-api.ts | 낮음 |

## 4. 더미데이터

| 파일 | 데이터 | 규모 | 대체 소스 |
|------|--------|------|-----------|
| sermon-service.ts | 설교 샘플 | 40개 (~600줄) | PostgreSQL |
| map-data.ts | 지명 좌표 | 55개 | OpenBible Geocoding |
| proper-nouns.ts | 고유명사 | 150+개 | DB proper_nouns 테이블 |

## 5. 하드코딩

- 외부 API URL 4개 (bible.helloao.org, GitHub raw URLs) → 환경변수로
- supabase.ts 빈 문자열 fallback → 에러 처리 필요
- 레이트 리밋, 최대 결과 수 등 매직 넘버

## 6. 검색 성능 위험

search API가 성경 66권 모든 장을 순차 외부 API 호출하여 브루트포스 검색 → 극도로 느림

## 종합: 높음 10건, 중간 17건, 낮음 12건
