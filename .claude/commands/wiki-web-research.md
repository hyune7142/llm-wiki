---
name: wiki-web-research
description: 주제를 받아 웹 검색·수집 후 raw/research/에 마크다운 파일로 저장. 위키 직접 수정 없음 — 사용자가 검토 후 /wiki-ingest로 위키화. "웹 리서치", "조사해줘", "리서치해줘", "/wiki-web-research [주제]" 요청 시 실행.
---

# wiki-web-research: 웹 리서치 → raw 저장

주제를 받아 웹을 검색·수집하고 `raw/research/`에 마크다운으로 저장한다. **위키를 직접 건드리지 않는다.** 사용자가 결과를 검토한 뒤 `/wiki-ingest`로 위키화 여부를 직접 판단한다.

---

## 시작 전

`.claude/web-research-program.md`를 읽어 검색 목표·제한·도메인 설정을 로드한다.

---

## 주제 선택

주제가 함께 입력되지 않았으면 묻는다: "어떤 주제를 리서치할까요?"

---

## 리서치 루프

```
Input: 주제

Round 1 — 광범위 검색
1. 주제를 3~5개 검색 각도로 분해
2. 각도별 WebSearch 2~3회
3. 각도별 상위 2~3 결과: defuddle로 본문 추출
4. 각 소스에서 추출: 핵심 주장, 개체, 개념, 미해결 질문

Round 2 — 갭 보완
5. Round 1에서 빠진 내용·상충 내용 파악
6. 갭별 타겟 검색 (최대 5회)
7. 상위 결과 수집

Round 3 — 합성 점검 (선택)
8. 큰 모순·누락이 남아있으면 추가 수집 1회
9. 없으면 바로 파일 생성

program.md의 루프 제한 준수. 제한 도달 시 중단하고 미수집 내용을 open_questions에 기록.
```

---

## 웹 수집 위생

매 fetch 전 적용:

- `http(s)://` 스킴만 허용. `file://`, `javascript:`, `data:` 거부
- RFC1918 사설 주소·localhost 거부
- 본문 50KB 초과 시 잘라냄
- `<script>`, `<iframe>`, `<style>` 태그 및 내용 제거
- 수집 실패(타임아웃·4xx/5xx) 시 URL과 이유를 open_questions에 기록하고 루프 계속

defuddle 사용 가능하면 WebFetch 대신 우선 사용:
```bash
defuddle parse <url> --md
```
defuddle 미설치 시 WebFetch 사용.

---

## raw 파일 생성

수집 완료 후 `raw/research/YYYY-MM-DD-[주제-슬러그].md` 파일 하나를 생성한다.

```markdown
---
title: "리서치: [주제]"
type: research
date: YYYY-MM-DD
topic: [주제 키워드]
rounds: N
sources_fetched: N
---

# 리서치: [주제]

> 작성일: YYYY-MM-DD | 라운드: N | 수집 소스: N

## 요약

(3~5문장 핵심 요약)

## 핵심 발견

- 발견 1 (신뢰도: high | 출처: URL)
- 발견 2 (신뢰도: medium | 출처: URL)

## 수집 소스

| 제목 | URL | 신뢰도 | 날짜 |
|------|-----|--------|------|
| ... | ... | high/medium/low | YYYY-MM-DD |

## 주요 개체

- 개체명: 역할/의미

## 주요 개념

- 개념명: 한 줄 정의

## 상충 내용

- [소스 A]는 X라고 함. [소스 B]는 Y라고 함. (어느 쪽이 더 신뢰할 만한지 간단히 기술)

## 미해결 질문 / 추가 조사 필요

- [답을 찾지 못한 질문]
- [수집 실패한 소스: URL — 이유]
```

---

## 완료 후 보고

```
웹 리서치 완료: [주제]

라운드: N | 검색: N회 | 수집 소스: N개

저장 위치:
  raw/research/YYYY-MM-DD-[주제-슬러그].md

핵심 발견:
- [발견 1]
- [발견 2]
- [발견 3]

미해결 질문: N개

---
검토 후 위키에 추가하려면: /wiki-ingest
```

---

## 주의

- `wiki/` 디렉토리는 절대 수정하지 않는다
- `raw/.manifest.json`도 건드리지 않는다 (ingest 시 처리됨)
- `wiki/log.md`에도 기록하지 않는다 (ingest 후 기록됨)
