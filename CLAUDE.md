# LLM Wiki 스키마

Claude Code가 위키를 어떻게 유지·관리할지 정의하는 핵심 설정 파일.
`/wiki-init`을 실행하면 아래 [미설정] 항목들이 채워집니다.

---

## 위키 기본 정보

- **위키 이름**: [미설정]
- **도메인 / 주제**: [미설정]
- **목적**: [미설정]
- **주요 소스 유형**: [미설정]
- **강조 관점 / 정리 방식**: [미설정]

---

## 핵심 운영 규칙

- `raw/` 파일은 절대 수정하지 않는다.
- `wiki/index.md`는 지식 페이지가 생성·수정될 때 업데이트한다.
- `wiki/log.md`, `wiki/hot.md`는 위키화(`ingest`) 또는 수정이 발생한 `lint` 후에만 업데이트한다. 단순 `query`, `report`, `save`, `init`, 수정 없는 `lint`는 기록하지 않는다.
- `raw/.manifest.json`으로 중복 인제스트를 방지한다. manifest는 `sha256` 기반이다.
- 새 세션 시작 시: `wiki/hot.md` → `wiki/index.md` 순서로 읽는다.
- 프론트매터에 `protected: true`인 페이지는 본문을 절대 수정하지 않는다. `tags:`, `keywords:` 추가와 `[[링크]]` 삽입만 허용한다.
- 지식 페이지 파일명은 `wiki/<type>s/<type>-[slug].md` 형식을 따른다.
- 저장된 질의응답 타입은 `question`이다. `query`는 질문 답변 절차명으로만 쓴다.
- 외부 출력물은 `exports/`에 저장한다.

---

## 폴더 구조

```
wiki/
├── index.md        ← 전체 카탈로그 (지식 페이지 변경 시 업데이트)
├── log.md          ← ingest 및 수정된 lint 기록 (append-only)
├── hot.md          ← 최근 ingest/lint 수정 컨텍스트 요약 (~500단어) — 세션 시작 시 먼저 읽기
├── overview.md     ← 위키 전체 목적·현황
├── sources/        ← raw 소스 1개당 요약 페이지 1개
├── entities/       ← 사람·조직·제품·도구 페이지
├── concepts/       ← 아이디어·패턴·프레임워크 페이지
├── comparisons/    ← A vs B 비교 분석 페이지
└── questions/      ← 저장된 질의응답 아카이브

raw/
├── .manifest.json  ← 처리된 소스 추적 (hash + 생성 페이지 목록)
├── assets/         ← 이미지 등 첨부파일
└── research/       ← 웹 리서치 결과 임시 저장

exports/            ← 위키 내용을 외부 공유·발표용으로 가공한 독립 문서 (/wiki-report)

_templates/
├── source.md       ← 소스 요약 노트 템플릿
├── entity.md       ← 개체 노트 템플릿
├── concept.md      ← 개념 노트 템플릿
├── comparison.md   ← 비교 분석 노트 템플릿
└── question.md     ← 질의응답 아카이빙 템플릿
```

날짜(`updated`, `ingested_at`, 리포트 `date`)는 한국시간(Asia/Seoul) 기준 `YYYY-MM-DD`를 사용한다.

---

## 다른 프로젝트에서 이 위키 참조하는 방법

다른 Claude Code 프로젝트의 CLAUDE.md에 아래 블록을 추가하면 이 위키를 참조할 수 있다:

```markdown
## Wiki Knowledge Base
경로: [이 위키의 절대 경로]

컨텍스트가 필요할 때 아래 순서로 읽는다:
1. wiki/hot.md 먼저 읽기 (~500단어, 최근 상태 요약)
2. 부족하면 wiki/index.md 읽기 (전체 카탈로그)
3. 도메인 특화 필요 시 wiki/<subfolder>/_index.md 읽기
4. 그 다음에만 개별 위키 페이지 읽기

읽지 말아야 할 경우:
- 일반 코딩 질문
- 이미 이 프로젝트 파일에 있는 내용
```

토큰 비용 기준: hot.md ≈ 500토큰, index.md ≈ 1000토큰, 개별 페이지 ≈ 100~300토큰

---

## 페이지 프론트매터 표준

지식 페이지:

```yaml
---
title: 페이지 제목
type: [source | entity | concept | comparison | question | overview]
summary: 핵심 요약 (60자 이내)
tags: []
keywords: []   # 핵심 용어 5~10개 — query 필터링에 사용
sources: []
updated: YYYY-MM-DD
protected: false
---
```

source 타입은 아래 확장 필드를 추가로 사용한다:

```yaml
source_type: article | research | video | podcast | book | memo | other
original_url:
author:
published:
captured_at:
reliability: high | medium | low | unknown
```

entity 타입은 인제스트 시 내용에 맞는 `subtype`이 자동 지정된다.

운영 파일(`wiki/index.md`, `wiki/log.md`, `wiki/hot.md`):

```yaml
---
type: meta
title: 운영 파일 제목
updated: YYYY-MM-DD
---
```

## 표준 경로 규칙

| 타입 | 저장 위치 |
|---|---|
| source | `wiki/sources/source-[slug].md` |
| entity | `wiki/entities/entity-[slug].md` |
| concept | `wiki/concepts/concept-[slug].md` |
| comparison | `wiki/comparisons/comparison-[slug].md` |
| question | `wiki/questions/question-[slug].md` |
