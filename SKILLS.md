# 스킬 목록

`.claude/commands/`에 등록된 모든 스킬 목록.

---

## Wiki 스킬

| 스킬 | 설명 |
|------|------|
| `/wiki-init` | 위키 초기 설정 또는 설정 변경. CLAUDE.md 업데이트·위키 생성·설정 요청 시 실행. |
| `/wiki-ingest` | raw/ 폴더의 파일을 위키 페이지로 변환. 소스 추가·처리 요청 또는 raw/ 파일 언급 시 실행. |
| `/wiki-query` | 위키 기반 질문 답변. 위키 내용에 관한 지식 질문 시 실행. |
| `/wiki-web-research` | 주제를 받아 웹 검색·수집 후 raw/research/에 저장. 위키 직접 수정 없음 — 검토 후 /wiki-ingest로 위키화. |
| `/wiki-save` | 현재 대화·인사이트·세션 내용을 위키 노트로 저장. |
| `/wiki-report` | 위키 내용을 외부 공유·발표용 문서로 가공해 exports/에 저장. 리포트·발표자료·요약 브리핑 등. |
| `/wiki-lint` | 위키 전체 점검. 링크 오류·고아 페이지·모순 탐지 등. |
| `/wiki-defuddle` | Defuddle로 웹 페이지에서 광고·불필요 요소를 제거하고 본문만 추출. (**외부 도구 필요**: `npm install -g defuddle`) |
| `/wiki-obsidian-markdown` | 외부에서 가져온 메모를 Obsidian 위키 형식으로 변환. 위키링크·콜아웃·파일 속성 정보 등 자동 적용. |

---

## Marketing 스킬

마케팅 스킬은 위키 기본 기능이 아니라 선택적으로 추가된 마케팅 특화 기능 모음입니다. 위키 기본 규칙은 `AGENTS.md`, `CLAUDE.md`, `.claude/commands/wiki-*.md`, `scripts/`를 기준으로 관리합니다.

### 전략·기획

| 스킬 | 설명 |
|------|------|
| `/marketing-product-marketing` | 제품 마케팅 정보 파일 생성·업데이트. 포지셔닝·핵심 고객 프로필·차별점 정리. **다른 마케팅 스킬 사용 전 먼저 실행 권장.** |
| `/marketing-marketing-plan` | 종합 마케팅 전략 수립. 시장 진출 전략·마케팅 로드맵·연간 계획. |
| `/marketing-marketing-ideas` | 마케팅 아이디어 및 전술 발굴. |
| `/marketing-launch` | 제품/서비스 런칭 전략 수립. 시장 진출 전략·베타·Product Hunt 준비 등. |
| `/marketing-content-strategy` | 콘텐츠 전략 수립 및 토픽 기획. 블로그·SEO 콘텐츠·캘린더. |
| `/marketing-marketing-psychology` | 마케팅에 심리학 원칙 적용. 소비자 심리·설득·인지 편향. |

### 고객·리서치

| 스킬 | 설명 |
|------|------|
| `/marketing-customer-research` | 고객 리서치, 핵심 고객 프로필 분석, 고객 유형 작성, 인터뷰/리뷰 분석. |
| `/marketing-competitor-profiling` | 경쟁사 분석 및 프로파일 작성. 경쟁사 대응 자료·경쟁 정보 수집. |
| `/marketing-competitors` | 경쟁사 비교 페이지 및 대안 페이지 콘텐츠 작성. |
| `/marketing-prospecting` | 영업 타겟 리스트 구축 및 잠재 고객 발굴. |

### 카피·콘텐츠

| 스킬 | 설명 |
|------|------|
| `/marketing-copywriting` | 전환 중심 마케팅 카피 작성. 랜딩페이지·홈페이지·제품 소개 등. |
| `/marketing-copy-editing` | 마케팅 카피 교정 및 개선. |
| `/marketing-ad-creative` | 광고 크리에이티브 제작 — 헤드라인·광고 문구·변형 생성. |
| `/marketing-social` | SNS 콘텐츠 제작, 캘린더 기획, 채널 전략. |
| `/marketing-video` | 마케팅 영상 기획 및 스크립트 작성. |
| `/marketing-image` | 마케팅 이미지 기획 및 디렉션 (직접 생성 아님). |
| `/marketing-lead-magnets` | 잠재 고객 유인 자료 기획 및 제작. 가이드·체크리스트·템플릿 등. |

### 광고·트래픽

| 스킬 | 설명 |
|------|------|
| `/marketing-ads` | 유료 광고 캠페인 전략 및 최적화. 구글·메타·링크드인 광고. |
| `/marketing-seo-audit` | SEO 감사 및 검색 최적화 개선. |
| `/marketing-ai-seo` | AI 검색 최적화. ChatGPT·Perplexity 등 AI 도구 검색 결과 노출 전략. |
| `/marketing-programmatic-seo` | 검색 최적화 자동화 — 데이터 기반으로 대량 페이지 생성. |
| `/marketing-schema` | 구조화 데이터 태그 추가. 구글 검색 결과 강조 표시·FAQ 등. |
| `/marketing-aso` | 앱스토어 최적화(ASO). 구글 플레이·앱스토어 검색 노출. |
| `/marketing-directory-submissions` | 디렉토리 및 플랫폼 등록 전략. G2·Product Hunt 등. |

### 전환·온보딩·리텐션

| 스킬 | 설명 |
|------|------|
| `/marketing-cro` | 전환율 최적화. 랜딩페이지·버튼·이탈 개선. |
| `/marketing-signup` | 가입 폼 및 온보딩 첫 단계 최적화. |
| `/marketing-onboarding` | 신규 고객/사용자 온보딩 설계. 첫 가치 경험·활성화 전략. |
| `/marketing-paywalls` | 페이월 설계 및 유료 전환 최적화. |
| `/marketing-churn-prevention` | 이탈 방지 전략 및 재활성화. |
| `/marketing-popups` | 팝업 및 배너 카피 작성. |
| `/marketing-ab-testing` | A/B 테스트 설계 및 실험 프로그램 구축. |
| `/marketing-analytics` | 마케팅 분석 및 추적 설정. 구글 애널리틱스(GA4)·광고 추적 코드·전환 추적. |

### 가격·오퍼

| 스킬 | 설명 |
|------|------|
| `/marketing-pricing` | 가격 전략 수립 및 패키징 설계. |
| `/marketing-offers` | 오퍼(제안) 설계 및 강화. 번들·보증·희소성 전략. |
| `/marketing-free-tools` | 잠재 고객 확보용 무료 도구 기획. 수익성 계산기·진단 도구·템플릿 등. |

### 이메일·메시지

| 스킬 | 설명 |
|------|------|
| `/marketing-emails` | 자동화 이메일 시리즈, 뉴스레터 기획 및 작성. |
| `/marketing-cold-email` | 기업 대상 첫 접촉 이메일 및 후속 이메일 작성. |
| `/marketing-sms` | SMS 및 문자 마케팅 캠페인. 카카오 알림톡 포함. |

### 영업·파트너십

| 스킬 | 설명 |
|------|------|
| `/marketing-sales-enablement` | 영업 지원 자료 제작. 영업 발표자료·한 장 요약 자료·경쟁사 대응 자료·제안서. |
| `/marketing-revops` | 매출 운영 전략 및 프로세스 설계. 고객 관리 시스템·영업 단계 관리. |
| `/marketing-referrals` | 추천 프로그램 및 제휴 마케팅 설계. |
| `/marketing-co-marketing` | 파트너 마케팅 및 공동 캠페인 기획. |
| `/marketing-public-relations` | 언론 홍보 전략. 보도자료 작성·기자 기사 제안. |
| `/marketing-community-marketing` | 커뮤니티 마케팅 전략 및 운영. 디스코드·카카오·슬랙. |

### 웹사이트 구조

| 스킬 | 설명 |
|------|------|
| `/marketing-site-architecture` | 웹사이트 구조 및 정보 설계. 메뉴·사이트맵·URL 구조. |

---

> **외부 도구 필요 스킬**: `/wiki-defuddle` — `npm install -g defuddle` (`/wiki-init` 실행 시 자동 설치 안내)
