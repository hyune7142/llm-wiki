---
name: marketing-schema
description: 구조화 데이터(Schema Markup) 추가. "스키마 마크업", "리치 스니펫", "구조화 데이터", "별점 검색 결과", "FAQ 스니펫", "제품 스키마", "이벤트 스키마" 등 요청 시 실행.
---

## 시작 전: 제품 마케팅 컨텍스트 확인

`.claude/product-marketing.md`가 있으면 먼저 읽고 시작한다. 이미 파악된 제품/고객/포지셔닝 정보는 다시 묻지 않는다. 파일이 없으면 `/marketing-product-marketing` 먼저 실행 권장.

---
검색 결과에서 풍부한 정보(리치 스니펫)가 표시되도록 구조화 데이터를 추가합니다.

**구조화 데이터란**: 검색 엔진이 페이지 내용을 더 잘 이해하도록 추가하는 코드. 별점, FAQ, 가격 등이 검색 결과에 직접 보이게 됨.

**시작 전 확인사항**:

1. **페이지 유형**: 제품, FAQ, 이벤트, 리뷰, 기사, 레시피 등
2. **원하는 표시**: 별점? FAQ 드롭다운? 가격?
3. **현재 기술 스택**: HTML 직접 수정? CMS(워드프레스 등)?

---

## 자주 쓰이는 스키마 유형

### FAQ 스키마 (가장 일반적)

질문-답변이 검색 결과에 직접 펼쳐져 보임.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "질문 내용",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "답변 내용"
      }
    }
  ]
}
</script>
```

---

### 제품 스키마

이커머스, SaaS 가격 페이지에서 별점과 가격 표시.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "제품명",
  "description": "제품 설명",
  "offers": {
    "@type": "Offer",
    "price": "49000",
    "priceCurrency": "KRW"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "120"
  }
}
</script>
```

---

### 조직 스키마

브랜드 정보 강화, 지식 패널 표시.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "회사명",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/...",
    "https://twitter.com/..."
  ]
}
</script>
```

---

### 이벤트 스키마

웨비나, 세미나 검색 결과에 날짜/장소 표시.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "이벤트명",
  "startDate": "2025-03-15T10:00",
  "endDate": "2025-03-15T12:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://zoom.us/..."
  }
}
</script>
```

---

## 적용 방법

**방법 1: HTML 직접 추가**
- `<head>` 또는 `<body>` 끝에 `<script type="application/ld+json">` 블록 추가

**방법 2: 워드프레스 플러그인**
- Yoast SEO, RankMath 등에서 GUI로 설정

**방법 3: 구글 태그 매니저**
- GTM에서 Custom HTML 태그로 추가

---

## 검증 방법

구글 리치 리절트 테스트: https://search.google.com/test/rich-results
스키마 마크업 검증기: https://validator.schema.org/

---

## 연관 스킬

- `/marketing-seo-audit` — 전체 SEO 점검
- `/marketing-ai-seo` — AI 검색 최적화
- `/marketing-content-strategy` — FAQ 콘텐츠 기획
