# 테스트 결과 요약

> 실행일: 2026-03-10

## 전체 결과: 56 테스트 | 52 통과 | 4 실패

---

### Phase 1 테스트 (26개) — 22 통과 / 4 실패

| 파일 | 테스트 수 | 통과 | 실패 |
|------|----------|------|------|
| bible-viewer.spec.ts | 8 | 7 | 1 |
| compare.spec.ts | 5 | 5 | 0 |
| search.spec.ts | 6 | 4 | 2 |
| strongs.spec.ts | 6 | 5 | 1 |

#### 실패 항목 (앱 버그)
1. **chapter navigation prev/next** - 네비게이션 버튼 동작 이슈
2. **search: can type a query and see results** - 검색 결과 미반환
3. **search: results show book name** - 검색 결과 없음으로 인한 실패
4. **strongs: entries with expected fields** - CSS 셀렉터 불일치

### Phase 2 테스트 (14개) — 14 통과 / 0 실패

| 파일 | 테스트 수 | 상태 |
|------|----------|------|
| original-text.spec.ts | 3 | 전체 통과 |
| vocabulary.spec.ts | 3 | 전체 통과 |
| audio.spec.ts | 4 | 전체 통과 |
| map.spec.ts | 4 | 전체 통과 |

### Phase 3 테스트 (16개) — 16 통과 / 0 실패

| 파일 | 테스트 수 | 상태 |
|------|----------|------|
| tts.spec.ts | 4 | 전체 통과 |
| multilang.spec.ts | 3 | 전체 통과 |
| sermons.spec.ts | 5 | 전체 통과 |
| proper-nouns.spec.ts | 4 | 전체 통과 |

---

## 통과율: 92.9% (52/56)
