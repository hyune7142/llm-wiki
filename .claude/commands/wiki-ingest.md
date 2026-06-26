---
name: wiki-ingest
description: raw/ 파일을 위키 페이지로 변환. 소스 추가·처리·ingest 요청 또는 raw/ 파일 언급 시 실행.
---

새 소스를 위키에 추가(ingest)합니다.

**진행 방식 (Claude에게)**:

사용자가 `/wiki-ingest` 를 실행하면:

1. `raw/` 폴더 안의 파일 목록을 확인한다.
2. `raw/.manifest.json`을 읽어 이미 처리된 소스를 파악한다. 각 raw 파일의 `sha256`을 계산해 동일 경로/동일 해시, 동일 경로/다른 해시, 다른 경로/동일 해시를 구분한다. 미처리 파일이 있으면 목록을 보여주고 어떤 파일을 처리할지 물어본다.
3. 사용자가 파일을 선택하면(또는 `/wiki-ingest raw/파일명.md` 형태로 직접 지정하면) 아래 순서로 처리한다:

**처리 순서**:

1. **읽기**: 소스 파일을 읽는다. 이미지가 포함되어 있으면 이미지도 함께 확인한다.
2. **보호 여부 확인**: 소스 내용을 보고 법령·시행령·고시·규정 등 공식 문서로 판단되면 "이 자료를 보호 자료로 설정할까요? (설정 시 본문 수정 불가, 태그·링크만 변경 가능)"라고 묻는다. 일반 자료는 묻지 않는다. 사용자가 미리 "보호 자료야", "법령이야" 등으로 명시했으면 자동으로 protected 처리한다.
3. **소스 페이지 작성**: `wiki/sources/` 에 소스 요약 페이지를 만든다.
   - 파일명: `wiki/sources/source-[소스제목-슬러그].md`
   - 아래 프론트매터 스키마를 반드시 사용한다:
     ```yaml
     ---
     title: 페이지 제목
     type: source
     summary: 핵심 요약 (60자 이내)
     tags: []
     keywords: []   # 핵심 용어 5~10개 — query 필터링에 사용
     sources:
       - raw/파일명.md
     source_type: article | research | video | podcast | book | memo | other
     original_url:
     author:
     published:
     captured_at:
     reliability: high | medium | low | unknown
     updated: YYYY-MM-DD
     protected: false   # true 시 본문 수정 불가, tags·keywords·링크만 변경 가능
     ---
     ```
   - 보호 자료로 설정된 경우 `protected: true` 로 저장한다.
   - 위키 내 다른 페이지는 `[[페이지명]]` 형식으로 연결한다.
   - 요약, 핵심 주장, 주요 인용, 관련 개념/개체 링크 포함
4. **기존 페이지 업데이트**: `wiki/index.md`를 읽고 관련 entity / concept 페이지를 찾아 내용을 보완하거나 새로 생성한다. 한 소스가 여러 페이지에 영향을 줄 수 있다.
   - **중요**: 기존 페이지를 수정하기 전 프론트매터의 `protected: true` 여부를 확인한다. protected 페이지는 `tags:`, `keywords:` 추가와 `[[링크]]` 삽입만 허용하고 본문은 절대 수정하지 않는다.
5. **인덱스 업데이트**: 가능하면 `node scripts/wiki-sync-index.mjs`로 `wiki/index.md`를 재생성한다. 스크립트를 쓸 수 없으면 `| 파일 | 제목 | 타입 | 태그 | 키워드 | 요약 | updated |` 형식으로 새 페이지 행을 추가한다.
6. **manifest 업데이트**: `raw/.manifest.json`을 읽고 처리된 소스 항목을 추가한다. 형식:
   ```json
   "raw/파일명.md": {
     "sha256": "파일 SHA-256",
     "size": 12345,
     "title": "소스 제목",
     "source_type": "article | research | video | podcast | book | memo | other",
     "ingested_at": "YYYY-MM-DD",
     "status": "current",
     "pages_created": ["wiki/sources/source-슬러그.md", ...],
     "pages_updated": ["wiki/index.md", "wiki/entities/개체명.md", ...]
   }
   ```
7. **로그 기록**: `wiki/log.md` 파일 맨 끝에 다음 형식으로 항목을 추가한다 (파일을 읽지 않고 Edit으로 바로 추가):
   - 형식: `## [YYYY-MM-DD] ingest | [소스 제목]`
   - 내용: 생성/수정된 페이지 목록, 핵심 인사이트 한 줄 요약
8. **hot.md 갱신**: `wiki/hot.md`를 읽고 덮어쓴다. Last Updated, Key Recent Facts, Recent Changes, Active Threads, Open Questions 섹션을 이번 인제스트 결과로 업데이트한다 (~300~500단어 유지).
9. **검증**: `node scripts/wiki-lint.mjs`를 실행하고 오류가 있으면 수정한다.

처리가 끝나면 생성·수정된 페이지 목록을 사용자에게 보여준다. 이후 한 줄 안내: "강조하고 싶은 부분이나 방향을 바꾸고 싶으면 말씀해주세요."
