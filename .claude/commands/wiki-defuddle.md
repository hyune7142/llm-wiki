---
name: wiki-defuddle
description: Defuddle CLI로 웹 페이지에서 깔끔한 마크다운 콘텐츠 추출, 불필요한 요소 제거로 토큰 절약. 사용자가 URL 제공 시 온라인 문서·글·블로그 포스트 등 일반 웹 페이지 읽기·분석에 WebFetch 대신 사용. .md로 끝나는 URL에는 사용 금지 — 이미 마크다운이므로 WebFetch 직접 사용.
---

# Defuddle

Defuddle CLI로 웹 페이지에서 깔끔한 읽기 가능한 콘텐츠를 추출한다. 일반 웹 페이지에서는 WebFetch보다 선호 — 내비게이션, 광고, 불필요한 요소를 제거해 토큰 사용량을 줄인다.

미설치 시: `npm install -g defuddle`

## 사용법

마크다운 출력은 항상 `--md` 사용:

```bash
defuddle parse <url> --md
```

파일로 저장:

```bash
defuddle parse <url> --md -o content.md
```

특정 메타데이터 추출:

```bash
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain
```

## 출력 형식

| 플래그 | 형식 |
|--------|------|
| `--md` | 마크다운 (기본 선택) |
| `--json` | HTML과 마크다운 모두 포함한 JSON |
| (없음) | HTML |
| `-p <name>` | 특정 메타데이터 속성 |
