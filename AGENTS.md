# LLM Wiki — Agent Instructions

모든 AI 에이전트(Cursor, Gemini CLI, OpenHands 등)가 읽는 공통 운영 지침.  
Claude Code에서는 CLAUDE.md + `.claude/commands/`가 동일한 역할을 함.

---

## 위키 기본 정보

- **위키 이름**: [미설정]
- **도메인 / 주제**: [미설정]
- **목적**: [미설정]
- **주요 소스 유형**: [미설정]
- **강조 관점 / 정리 방식**: [미설정]

---

## 핵심 규칙

1. `raw/` 폴더 파일은 절대 수정하지 않는다.
2. `wiki/index.md`는 지식 페이지가 생성·수정될 때 업데이트한다.
3. `wiki/log.md`, `wiki/hot.md`는 위키화(`ingest`) 또는 수정이 발생한 `lint` 후에만 업데이트한다. 단순 `query`, `report`, `save`, `init`, 수정 없는 `lint`는 기록하지 않는다.
4. `raw/.manifest.json`으로 중복 인제스트를 방지한다. manifest는 `sha256` 기반이다.
5. 새 세션 시작 시: `wiki/hot.md` → `wiki/index.md` 순서로 읽는다.
6. 위키 내 내부 링크는 `[[페이지명]]` 형식을 사용한다.
7. 지식 페이지 파일명은 `wiki/<type>s/<type>-[slug].md` 형식을 따른다.
8. 저장된 질의응답 타입은 `question`이다. `query`는 질문 답변 절차명으로만 쓴다.
9. 외부 출력물은 `exports/`에 저장한다.
10. 프론트매터에 `protected: true`인 페이지는 본문을 수정하지 않는다. `tags`, `keywords`, `[[링크]]` 보강만 허용한다.

---

## 파일 구조

```
raw/
├── .manifest.json   # 처리된 소스 추적 (hash + 생성 페이지 목록)
└── assets/          # 이미지 등 첨부파일

wiki/
├── index.md         # 전체 카탈로그 (지식 페이지 변경 시 업데이트)
├── log.md           # ingest 및 수정된 lint 기록 (append-only)
├── hot.md           # 최근 ingest/lint 수정 컨텍스트 요약 (~500단어) — 세션 시작 시 먼저 읽기
├── overview.md      # 위키 전체 목적·현황
├── sources/         # raw 소스 1개당 요약 페이지 1개
├── entities/        # 사람·조직·제품·도구 페이지
├── concepts/        # 아이디어·패턴·프레임워크 페이지
├── comparisons/     # A vs B 비교 분석 페이지
└── questions/       # 저장된 질의응답 아카이브

_templates/
├── source.md        # 소스 요약 노트 템플릿
├── entity.md        # 개체 노트 템플릿
├── concept.md       # 개념 노트 템플릿
├── comparison.md    # 비교 분석 노트 템플릿
└── question.md      # 질의응답 아카이빙 템플릿

exports/             # 독립 출력물
```

## 표준 경로 규칙

| 타입 | 저장 위치 | 예시 |
|---|---|---|
| source | `wiki/sources/source-[slug].md` | `wiki/sources/source-example.md` |
| entity | `wiki/entities/entity-[slug].md` | `wiki/entities/entity-openai.md` |
| concept | `wiki/concepts/concept-[slug].md` | `wiki/concepts/concept-rag.md` |
| comparison | `wiki/comparisons/comparison-[slug].md` | `wiki/comparisons/comparison-a-vs-b.md` |
| question | `wiki/questions/question-[slug].md` | `wiki/questions/question-pricing.md` |

---

## 페이지 프론트매터 스키마

지식 페이지에 필수 적용:

```yaml
---
title: 페이지 제목
type: source | entity | concept | comparison | question | overview
summary: 핵심 요약 (60자 이내)
tags: []
keywords: [] # 핵심 용어 5~10개 — query 필터링에 사용
sources: []
updated: YYYY-MM-DD
protected: false
---
```

소스 페이지는 아래 확장 필드를 권장한다:

```yaml
---
title: 소스 제목
type: source
summary: 핵심 요약
tags: []
keywords: []
sources:
  - raw/파일명.md
source_type: article | research | video | podcast | book | memo | other
original_url:
author:
published:
captured_at:
reliability: high | medium | low | unknown
updated: YYYY-MM-DD
protected: false
---
```

운영 파일(`wiki/index.md`, `wiki/log.md`, `wiki/hot.md`)은 아래 메타 스키마를 사용한다:

```yaml
---
type: meta
title: 운영 파일 제목
updated: YYYY-MM-DD
---
```

---

## 운영 절차

### 1. Ingest — 소스 추가·처리

**트리거**: 사용자가 "ingest", "처리해줘", "소스 추가", raw/ 파일 언급, "이 파일 위키에 넣어줘" 등을 요청할 때.

**절차**:

1. `raw/` 폴더 파일 목록 확인
2. `raw/.manifest.json` 읽어 이미 처리된 소스 파악 → 미처리 파일 목록 보여주고 처리할 파일 선택 요청
3. 사용자가 파일 지정하면 아래 순서로 처리:

   a. **읽기**: 소스 파일 읽기 (이미지 포함 시 함께 확인)

   b. **소스 페이지 작성**: `wiki/sources/source-[슬러그].md` 생성
   - 프론트매터 스키마 적용
   - 요약, 핵심 주장, 주요 인용, 관련 개념/개체 링크 포함
   - 내부 참조는 `[[페이지명]]` 형식

   c. **기존 페이지 업데이트**: `wiki/index.md` 읽고 관련 entity/concept 페이지 보완 또는 신규 생성

   d. **인덱스 업데이트**: `wiki/index.md` 테이블에 새 페이지 행 추가 (summary 필드 그대로 사용)

   e. **manifest 업데이트**: `raw/.manifest.json` 읽고 처리된 소스 항목 추가
   ```json
   "raw/파일명.md": {
     "sha256": "파일 SHA-256",
     "size": 12345,
     "title": "소스 제목",
     "source_type": "article | research | video | podcast | book | memo | other",
     "ingested_at": "YYYY-MM-DD",
     "status": "current",
     "pages_created": ["wiki/sources/source-슬러그.md", ...],
     "pages_updated": ["wiki/index.md", ...]
   }
   ```

   f. **로그 기록**: `wiki/log.md` 맨 끝에 추가 (파일 읽지 않고 append)
   - 형식: `## [YYYY-MM-DD] ingest | [소스 제목]`
   - 내용: 생성/수정된 페이지 목록, 핵심 인사이트 한 줄

   g. **hot.md 갱신**: `wiki/hot.md` 읽고 덮어쓴다. Last Updated, Key Recent Facts, Recent Changes 섹션을 이번 인제스트 결과로 업데이트 (~300~500단어 유지)

4. 완료 후 생성·수정 페이지 목록 보여줌. 한 줄 안내: "강조하고 싶은 부분이나 방향을 바꾸고 싶으면 말씀해주세요."

---

### 2. Query — 위키 기반 질문 답변

**트리거**: 사용자가 위키 내용에 관해 질문할 때. 일반 지식 질문은 제외.

**절차**:

1. 질문 미입력 시 "어떤 게 궁금하세요?" 질문
2. 답변 작성:

   a. **컨텍스트 파악**: `wiki/hot.md` 먼저 읽어 최근 작업 상태 파악. 이후 `wiki/index.md` 읽고 tags·keywords·summary로 1차 필터링
   b. **페이지 읽기**: 관련 페이지만 읽고 내용 종합
   c. **답변 작성**:
   - 핵심 답변 (2~3문장)
   - 근거 페이지 출처 명시 (`[[페이지명]]`)
   - 필요 시 표, 비교, 타임라인 형식 활용

3. 답변 후 안내: "위키나 리포트로 저장하려면 말씀해주세요."
   - "위키에 저장해줘" → Save 절차로 처리
   - "리포트로 저장해줘" → 아래 Report 절차로 처리

**출력 형식** (요청 시):

- 기본: 마크다운 서술형
- 비교 필요: 표
- 개념 정리: 계층형 목록
- 발표 자료: Marp 슬라이드 형식

---

### 3. Lint — 위키 전체 점검

**트리거**: "점검", "lint", "상태 확인", "링크 오류", "고아 페이지", "정리해줘" 등 요청 시.

**점검 항목**:

1. **모순 탐지**: 페이지 간 상충하는 주장 확인
2. **낡은 내용**: 더 최신 소스가 있는데 미업데이트된 페이지
3. **고아 페이지**: 어느 페이지에서도 링크되지 않은 페이지
4. **누락된 페이지**: 여러 곳에서 언급되지만 전용 페이지 없는 개념/개체
5. **누락된 크로스 레퍼런스**: 연결되어야 할 페이지 간 링크 누락
6. **데이터 공백**: 위키를 풍부하게 할 미조사 주제 제안
7. **기계 검증**: `scripts/wiki-lint.mjs`를 실행해 frontmatter, index, wikilink, manifest 동기화를 확인

**보고 형식**:

```
## 위키 점검 결과 — YYYY-MM-DD

### 발견된 문제
- 🔴 (즉시 수정 필요)
- 🟡 (여유 있을 때 수정)
- 🟢 (선택적 개선)

### 추천 액션
1. ...

### 다음에 조사해보면 좋을 것들
- ...
```

점검 후: "어떤 문제부터 수정할까요?" 질문. 선택 시 바로 수정 시작.

수정 작업을 수행한 경우에만 log 업데이트 (append only) 및 hot.md 갱신:

- 형식: `## [YYYY-MM-DD] lint | 발견 [N]건, 수정 [M]건`
- 수정 없이 점검 보고만 한 경우 `wiki/log.md`와 `wiki/hot.md`를 변경하지 않는다.

---

### 4. Report — 리포트 생성

**트리거**: "리포트 만들어줘", "보고서", "report", query 답변 후 리포트 저장 요청 시.

**절차**:

1. 주제 미입력 시 "어떤 주제로 리포트를 만들까요?" 질문
2. 형식 미지정 시 기본 마크다운 서술형 사용

**작성 순서**:

1. `wiki/index.md` 읽고 관련 페이지 파악
2. 관련 페이지들 읽고 내용 종합
3. 아래 구조로 독립 문서 작성:
   - 제목 및 작성일
   - 요약 (Executive Summary) — 3~5문장
   - 본문 — 주제에 맞게 구성
   - 참고 소스 — 근거가 된 wiki/ 파일 및 raw 파일 명시
   - `[[위키링크]]` 대신 일반 텍스트로 참조 (독립 문서)
4. `exports/YYYY-MM-DD-[슬러그].md`로 저장
5. `wiki/log.md`와 `wiki/hot.md`는 변경하지 않는다.

**리포트 파일 프론트매터**:

```yaml
---
title: 리포트 제목
date: YYYY-MM-DD
topic: 주제 키워드
sources: [] # 참조한 wiki/ 또는 raw/ 파일 목록
---
```

**출력 형식** (요청 시):

- 기본: 마크다운 서술형
- 비교 분석: 표 중심
- 발표 자료: Marp 슬라이드 형식
- 요약 브리핑: 핵심 포인트 목록

---

### 5. Wiki-Init — 위키 초기 설정

**트리거**: "위키 설정", "init", "처음 설정", "설정 바꾸고 싶어", CLAUDE.md/AGENTS.md의 [미설정] 항목 채우기 요청 시.

**절차**: 아래 5가지 질문을 하나씩 순서대로 묻는다.

1. **위키 이름** → `위키 이름` 필드
2. **어떤 분야/주제를 다루나요?** → `도메인 / 주제` 필드
3. **이 위키를 왜 만드시나요? 어떤 상황에서 활용하실 건가요?** → `목적` 필드
4. **주로 어떤 종류의 자료를 추가하실 예정인가요?** (웹 아티클, 논문, 책 챕터, 회의 메모, 유튜브 자막 등) → `주요 소스 유형` 필드
5. **정보를 어떻게 정리하는 게 편하신가요?** (저자/출처별, 시간순, 주제별 클러스터, 찬반 논점 정리 등) → `강조 관점 / 정리 방식` 필드

각 답변 확인 후 다음 질문. 5개 완료 후 요약 보여주고 확인 요청.  
확인 시:
1. 이 파일(AGENTS.md) + CLAUDE.md의 `위키 기본 정보` 섹션 동시 업데이트
2. `wiki/overview.md` 읽고 수집한 정보(목적·도메인·소스 유형·정리 방식) 반영
3. 아래 파일/폴더가 없으면 생성 (있으면 스킵):
   - `wiki/sources/_index.md`
   - `wiki/entities/_index.md`
   - `wiki/concepts/_index.md`
   - `wiki/comparisons/_index.md`
   - `wiki/questions/_index.md`
   - `wiki/hot.md` (기본 템플릿으로)
   - `raw/.manifest.json` (`{"version": 1, "sources": {}}` 으로)
   - `exports/`

`wiki/log.md`와 `wiki/hot.md`는 변경하지 않는다. 초기 설정은 운영 이력으로 누적하지 않는다.

완료 후 안내:

- `raw/` 폴더에 첫 소스를 넣고 "이 파일 처리해줘"라고 말하면 ingest가 시작됩니다.

---

### 6. Save — 대화 내용 위키 저장

**트리거**: "저장해줘", "위키에 저장", "대화 저장", "이거 메모", 세션 종료 시 저장 요청.

**절차**:

1. **저장 대상 파악**: 현재 대화에서 핵심 인사이트·결론·개념·질의응답 중 무엇을 저장할지 파악. 불명확하면 질문.

2. **노트 타입 결정** (자동 판단, 애매하면 질문):
   - `concept` — 아이디어·패턴·프레임워크·방법론
   - `question` — 질의응답 기록
   - `entity` — 사람·조직·제품·도구
   - `comparison` — A vs B 비교 분석

3. **페이지 작성**:
   - `_templates/` 의 해당 타입 템플릿 프론트매터 적용
   - 저장 위치: `wiki/[타입]s/[타입]-[슬러그].md`
   - 관련 페이지는 `[[페이지명]]` 형식 연결
   - 대화 원본 뉘앙스 유지하며 요약

4. **인덱스 업데이트**: `wiki/index.md` 테이블에 새 페이지 행 추가

5. **검증**: 가능하면 `node scripts/wiki-lint.mjs`로 형식을 확인한다. 검증 중 오류를 실제로 수정한 경우에만 Lint 절차의 기록 정책에 따라 `wiki/log.md`와 `wiki/hot.md`를 갱신한다.

6. save 자체만으로는 `wiki/log.md`와 `wiki/hot.md`를 변경하지 않는다. 저장은 지식 페이지 생성이지만 운영 로그 누적 대상은 아니다.

완료 후 파일 경로와 제목 표시.

---

## 다른 프로젝트에서 이 위키 참조하는 방법

다른 프로젝트의 AGENTS.md 또는 CLAUDE.md에 아래 블록을 추가하면 이 위키를 참조할 수 있다:

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

## 마크다운 규칙 (Obsidian Flavored Markdown)

이 위키는 Obsidian 볼트입니다. 아래 Obsidian 전용 문법을 사용합니다.

### 내부 링크 (Wikilinks)

```markdown
[[페이지명]] 내부 페이지 링크
[[페이지명|표시 텍스트]] 커스텀 표시 텍스트
[[페이지명#헤딩]] 특정 헤딩으로 링크
```

외부 URL은 표준 마크다운 `[텍스트](url)` 사용.

### 콜아웃 (Callouts)

```markdown
> [!note]
> 기본 콜아웃

> [!warning] 커스텀 제목
> 경고 콜아웃

> [!tip]- 기본 접힘
> 접힌 콜아웃
```

타입: `note`, `tip`, `warning`, `info`, `example`, `quote`, `bug`, `danger`, `success`

### 임베드

```markdown
![[다른페이지]] 노트 임베드
![[이미지.png]] 이미지 임베드
![[이미지.png|300]] 너비 지정 이미지
```

### 태그

```markdown
#태그 인라인 태그 #중첩/태그 계층 태그
```

### 강조

```markdown
==하이라이트 텍스트==
```

---

## 웹 페이지 읽기

URL이 포함된 소스를 처리할 때는 `defuddle` CLI 사용 (설치: `npm install -g defuddle`):

```bash
defuddle parse <url> --md
```

`.md`로 끝나는 URL은 직접 fetch.
