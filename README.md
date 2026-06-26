# LLM Wiki

AI가 굴려주는 개인 지식 위키 템플릿입니다.

읽은 글, 논문, 메모 같은 걸 `raw/` 폴더에 넣어두면 AI가 읽고 정리해서 위키를 만들어줍니다. 직접 정리할 필요 없이 "이거 처리해줘" 한마디면 됩니다. 그 다음부턴 질문하면서 쌓인 위키를 탐색하거나, 결과물을 `exports/`로 뽑아내는 게 전부입니다.

**Claude Code에서 가장 잘 동작하지만**, Cursor·Gemini CLI 등 다른 AI 도구에서도 `AGENTS.md`를 통해 동일한 방식으로 운영할 수 있습니다.

---

## 필요한 것

| 도구 | 용도 | 설치 |
|---|---|---|
| [Claude Code](https://claude.ai/download) | **권장.** 슬래시 커맨드, 자동 트리거 등 풀 기능 지원 | 링크에서 설치 |
| Cursor / Gemini CLI / 기타 AI | `AGENTS.md` 기반으로 동일한 위키 운영 가능 | 각 도구 설치 |
| [Obsidian](https://obsidian.md) | 위키를 보기 좋게 열어주는 뷰어. 그래프 뷰, 링크 탐색 등 | 링크에서 설치 |
| [Obsidian Web Clipper](https://obsidian.md/clipper) | (선택) 브라우저 아티클을 마크다운으로 바로 저장 | 링크에서 설치 |

> **defuddle**: URL을 붙여넣으면 광고 없이 깔끔하게 읽어오는 도구입니다. 터미널에서 `npm install -g defuddle`로 설치하는데, npm이 없다면 생략해도 됩니다. 없어도 위키 운영에는 문제 없습니다.

---

## 시작하는 방법

**1. 이 레포를 내 컴퓨터에 받기**

```bash
git clone <레포 URL>
```

Git이 없다면 GitHub 페이지에서 `Code → Download ZIP`으로 받아도 됩니다.

**2. Obsidian으로 폴더 열기**

Obsidian 실행 → `Open folder as vault` → 받은 폴더 선택.  
그래프 뷰에서 위키 연결 구조를 시각적으로 볼 수 있습니다.

**3. Claude Code 실행**

```bash
claude
```

**4. 초기 설정**

```
/wiki-init
```

Claude가 위키 이름, 다루는 주제, 목적 등을 질문하면서 설정 파일을 자동으로 채워줍니다. 5분이면 끝납니다.

**5. 첫 소스 추가**

`raw/` 폴더에 파일을 넣고 말하면 됩니다.

> "raw/파일명.md 처리해줘"

---

## 커맨드 목록

슬래시 커맨드를 몰라도 됩니다. "이거 정리해줘", "~에 대해 알려줘" 같은 자연어로 말하면 Claude가 알아서 맞는 커맨드를 실행합니다.

### 위키 운영

| 커맨드 | 하는 일 | 자연어 예시 |
|---|---|---|
| `/wiki-init` | 초기 설정. 위키 이름·주제·목적을 질문해서 설정 파일 자동 업데이트 | "위키 설정해줘" |
| `/wiki-ingest` | 새 소스 추가. `raw/`의 파일을 읽고 위키 페이지로 변환 | "이 파일 처리해줘" |
| `/wiki-query` | 위키 기반 질문 답변. 관련 페이지를 읽고 출처를 명시해서 답변 | "~에 대해 알려줘" |
| `/wiki-web-research` | 웹 검색·수집 결과를 `raw/research/`에 저장. 검토 후 ingest 가능 | "웹 리서치해줘" |
| `/wiki-report` | 위키 내용을 기반으로 독립 리포트 생성 후 `exports/`에 저장 | "리포트 만들어줘" |
| `/wiki-lint` | 위키 전체 점검. 모순·고아 페이지·누락 링크 등을 보고하고 개선 제안 | "위키 점검해줘" |
| `/wiki-save` | 현재 대화·인사이트를 위키 노트로 즉시 파일링 | "저장해줘", "이거 메모해줘" |

### 작성 보조

| 커맨드 | 하는 일 |
|---|---|
| `/wiki-obsidian-markdown` | Obsidian 전용 문법 자동 적용. `[[위키링크]]`, 콜아웃, frontmatter 등 |
| `/wiki-defuddle` | URL에서 광고·네비게이션 제거 후 깔끔한 마크다운 추출 (defuddle 설치 필요) |

---

## 폴더 구조

```
/
├── raw/                    ← 원본 소스 넣는 곳 (AI가 읽기만 함, 수정 금지)
│   ├── assets/             ← 이미지 등 첨부파일
│   ├── research/           ← 웹 리서치 결과 임시 저장
│   └── .manifest.json      ← 처리된 소스 추적 (중복 ingest 방지)
├── wiki/                   ← AI가 만들고 관리하는 위키 페이지
│   ├── index.md            ← 전체 페이지 목차 (query 시 진입점)
│   ├── log.md              ← ingest 및 수정된 lint 기록 (append-only)
│   ├── hot.md              ← 최근 ingest/lint 수정 컨텍스트 요약 — 새 세션 시작 시 먼저 읽힘
│   ├── overview.md         ← 위키 전체 목적·현황
│   ├── sources/            ← 소스 1개당 요약 페이지 1개
│   ├── entities/           ← 사람·조직·제품·도구 페이지
│   ├── concepts/           ← 아이디어·패턴·프레임워크 페이지
│   ├── comparisons/        ← A vs B 비교 분석 페이지
│   └── questions/          ← 저장된 질의응답 아카이브
├── _templates/             ← 노트 유형별 프론트매터 템플릿
├── clipper/                ← Obsidian Web Clipper 설정 파일
├── extensions/marketing/   ← 마케팅 도메인 확장 설명
├── exports/                ← 사용자가 외부 활용할 결과물 (스냅샷, 공유용)
├── scripts/                ← index 동기화·lint 검증 스크립트
├── CLAUDE.md               ← Claude Code 전용 설정 파일
├── AGENTS.md               ← 모든 AI 도구 공통 운영 지침 (Cursor, Gemini CLI 등)
└── README.md
```

Wiki core는 `wiki-*` 커맨드와 `scripts/`가 담당합니다. `.claude/commands/marketing-*.md`는 이 템플릿에 포함된 선택적 마케팅 확장입니다.

### wiki/ vs exports/

`wiki/`는 지식이 계속 쌓이고 갱신되는 내부 저장소입니다. `exports/`는 특정 시점의 결과물을 독립 문서로 보존하는 외부 출력 공간입니다. `/wiki-query`로 답변을 받은 뒤 "리포트로 저장해줘"라고 하거나, `/wiki-report`를 직접 실행해서 만들 수 있습니다.

---

## 자주 막히는 곳

**`claude` 명령어를 실행했는데 아무것도 안 됨**  
→ Claude Code가 설치되어 있지 않거나 로그인이 안 된 상태입니다. [claude.ai/download](https://claude.ai/download)에서 설치 후 `claude login`을 먼저 실행하세요.

**`/wiki-init`을 했는데 질문이 이상하게 나옴**  
→ Claude Code를 프로젝트 폴더 안에서 실행해야 합니다. `cd 폴더이름` 후 다시 `claude`를 실행하세요.

**Obsidian에서 `[[링크]]`가 연결이 안 됨**  
→ Obsidian 설정 → Files & Links → `Default location for new notes`를 `Same folder as current file`로 변경해보세요.

**raw/ 파일을 넣었는데 Claude가 처리를 안 함**  
→ 파일을 넣은 뒤 직접 "raw/파일명 처리해줘"라고 말해야 합니다. 자동으로 감지하지는 않습니다.

---

## 팁

- `/wiki-lint`를 주기적으로 돌려두면 위키 품질이 유지됩니다.
- 위키가 쌓이면 Obsidian 그래프 뷰에서 어떤 개념이 허브가 되는지 한눈에 보입니다.
- 그냥 마크다운 파일 모음이라 git이 그대로 됩니다. 버전 관리, 브랜치, 협업 다 가능합니다.

---

## 다른 AI 도구에서 사용하기

Claude Code 외 도구(Cursor, Gemini CLI 등)에서도 동일한 위키 운영이 가능합니다. `AGENTS.md`가 그 역할을 합니다.

### 차이점

| | Claude Code | 다른 AI 도구 |
|---|---|---|
| 지침 로드 | `CLAUDE.md` + `.claude/commands/` 자동 주입 | `AGENTS.md` 수동 참조 또는 자동 인식 |
| 커맨드 실행 | `/wiki-ingest`, `/wiki-query` 등 슬래시 커맨드 | 자연어로 요청 |

### 도구별 설정

**Cursor**  
`.cursor/rules/wiki.md` 파일이 이미 포함되어 있어 프로젝트를 열면 자동으로 규칙이 적용됩니다. 추가로 `@AGENTS.md`를 멘션해 전체 지침을 참조할 수 있습니다.

**Gemini CLI**  
프로젝트 루트의 `AGENTS.md`를 자동으로 인식합니다.

**기타 도구**  
`AGENTS.md`를 시스템 프롬프트나 컨텍스트로 붙여넣으면 됩니다.

### 자연어 트리거 예시

| 기능 | 자연어 예시 |
|---|---|
| ingest | "raw/ 폴더 처리해줘", "이 파일 위키에 넣어줘" |
| web-research | "웹 리서치해줘", "이 주제 조사해줘" |
| query | 위키 관련 질문을 그냥 하면 됨 |
| lint | "위키 점검해줘", "상태 확인해줘" |
| report | "이 주제로 리포트 만들어줘" |
| wiki-init | "위키 설정해줘", "처음 설정할게" |

---

## Obsidian Web Clipper 설정 (`clipper/`)

`clipper/` 폴더에는 소스 유형별 Web Clipper 템플릿이 들어 있습니다. Obsidian Web Clipper 확장 프로그램에 임포트하면 브라우저에서 아티클을 클리핑할 때 자동으로 `raw/` 폴더에 맞는 형식으로 저장됩니다.

| 파일 | 대상 소스 |
|------|-----------|
| `news-clipper.json` | 뉴스 아티클 |
| `research-clipper.json` | 논문·리서치 페이지 |
| `youtube-clipper.json` | 유튜브 영상 (자막 포함) |
| `podcast-clipper.json` | 팟캐스트 에피소드 |
| `book-clipper.json` | 책·챕터 노트 |

**임포트 방법**: Obsidian → Settings → Web Clipper → Templates → Import → 해당 JSON 파일 선택.

---

## RAG와 다른 점

ChatGPT나 NotebookLM처럼 매번 원본 문서를 뒤지는 방식이 아닙니다. 소스를 한 번 읽고 위키를 만들어두면, 다음 질문부터는 이미 정리된 위키를 보고 답합니다. 소스가 쌓일수록 위키도 같이 풍부해지는 구조입니다.
