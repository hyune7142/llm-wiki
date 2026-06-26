---
description: LLM Wiki 운영 지침. 위키 관련 작업(ingest, query, lint, report, init, save, web-research) 시 항상 적용.
globs: ["raw/**", "wiki/**", "exports/**"]
alwaysApply: true
---

# LLM Wiki — Cursor Rules

이 프로젝트는 AI가 관리하는 개인 지식 위키입니다.
**전체 운영 지침은 `AGENTS.md`에 있습니다. 위키 관련 작업 시 반드시 먼저 읽으세요.**

## 핵심 규칙 (요약)

1. `raw/` 파일은 절대 수정하지 않는다
2. `wiki/index.md`는 지식 페이지 생성·수정 시 업데이트
3. `wiki/log.md`, `wiki/hot.md`는 ingest 또는 수정이 발생한 lint 후에만 업데이트
4. 새 세션 시작 시: `wiki/hot.md` → `wiki/index.md` 순서로 읽는다
5. 위키 내부 링크는 `[[페이지명]]` 형식 사용
6. 페이지 경로는 `wiki/<type>s/<type>-[slug].md` 형식 사용
7. 리포트는 `exports/`에 저장

## 트리거 → 절차 매핑

| 사용자 요청 | 실행할 절차 |
|-------------|-------------|
| "처리해줘", "ingest", raw/ 파일 언급 | AGENTS.md § 1. Ingest |
| 위키 내용 질문 | AGENTS.md § 2. Query |
| "점검", "lint", "상태 확인" | AGENTS.md § 3. Lint |
| "리포트", "보고서" | AGENTS.md § 4. Report |
| "설정", "init", [미설정] 항목 | AGENTS.md § 5. Wiki-Init |
| "저장해줘", "대화 저장" | AGENTS.md § 6. Save |
| "웹 리서치", "조사해줘", URL 수집 | `.claude/commands/wiki-web-research.md` |

## 읽기 순서

컨텍스트가 필요할 때:
1. `wiki/hot.md` — 최근 상태 (~500단어)
2. `wiki/index.md` — 전체 카탈로그
3. 해당 서브폴더 `_index.md`
4. 개별 위키 페이지
