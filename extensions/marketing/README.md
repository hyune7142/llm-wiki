# Marketing Extension

이 디렉토리는 LLM Wiki 코어와 마케팅 도메인 확장의 경계를 명확히 하기 위한 설명 문서입니다.

## 범위

- Wiki core: `AGENTS.md`, `CLAUDE.md`, `.claude/commands/wiki-*.md`, `wiki/`, `raw/`, `exports/`, `_templates/`, `scripts/`
- Marketing extension: `.claude/commands/marketing-*.md`, `SKILLS.md`의 Marketing 스킬 섹션

## 운영 원칙

- 범용 위키 규칙은 항상 Wiki core 문서에 둔다.
- 마케팅 전용 워크플로우, 카피, 캠페인, SEO, 광고, CRO 규칙은 marketing command 파일에만 둔다.
- 마케팅 커맨드는 위키 구조를 직접 바꾸지 않는다. 위키에 저장해야 할 결과는 `/wiki-save` 또는 `/wiki-ingest` 흐름을 따른다.

## 왜 파일을 이동하지 않는가

Claude Code의 슬래시 커맨드 발견 안정성을 유지하기 위해 실제 커맨드 파일은 `.claude/commands/marketing-*.md` 위치에 둔다. 대신 이 문서와 `SKILLS.md`에서 core/extension 경계를 명시한다.
