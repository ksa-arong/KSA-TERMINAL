# Design Token Guide

## 1. 개요

이 문서는 `common/style.css`를 수정하거나 새 UI를 만들 때 폰트, 컬러, 반투명 효과 토큰을 어떻게 사용해야 하는지 정리한 기준 문서다.

새 스타일 작성 원칙:
- 새 텍스트 크기에는 직접 `px` 값을 쓰기 전에 먼저 `--font-*` 토큰을 찾는다.
- 새 색상에는 직접 `hex`, `rgba()`, `color-mix()`를 쓰기 전에 먼저 semantic 토큰을 찾는다.
- primitive 컬러(`--global-color-*`)는 컴포넌트에서 직접 참조하지 않고, semantic 토큰을 거쳐 사용한다.
- 반투명 효과는 값이 비슷해도 역할이 다르면 재사용하지 않는다. `border`, `text`, `shadow`, `scrim`, `overlay` 역할을 먼저 구분한다.
- 하드코딩 값을 새로 추가해야 한다면, 먼저 이 문서를 갱신하고 토큰 추가 여부를 검토한다.

## 2. 폰트 토큰

새 텍스트 스타일을 만들 때는 아래 역할군 중 가장 가까운 토큰을 사용한다. 맞는 토큰이 없으면 직접값을 추가하지 말고 토큰과 이 문서를 함께 추가한다.

### 제목용

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--font-hero` | `clamp(38px, 4.2vw, 52px)` | 홈 히어로 대제목 | `.portal-page .portal-hero h1` 계열 |
| `--font-display` | `32px` | display급 제목 | `.terminal-main-title`, display alias |
| `--font-h1` | `clamp(40px, 3.2vw, 44px)` | 큰 섹션/페이지 제목 기준 | `--font-page-title`, `--font-section-title` |
| `--font-h2` | `24px` | 중간 제목 | `.portal-hero-quick-head h2`, `--font-subsection-title` |
| `--font-h3` | `20px` | 소제목/카드 제목 | `.portal-guide-item h3`, `--font-card-title` |
| `--font-showcase-title` | `clamp(32px, 4vw, 50px)` | showcase 대제목 | `.portal-guide-showcase-head h2` |
| `--font-showcase-card-title` | `clamp(19px, 1.5vw, 23px)` | showcase 카드 제목 | `.portal-guide-showcase-copy h3` |
| `--font-subpage-title` | `clamp(38px, 3.2vw, 52px)` | 서브페이지 히어로 제목 | `.portal-template-page .portal-subhero h1` |
| `--font-subpage-title-mobile` | `clamp(32px, 9vw, 40px)` | 모바일 서브페이지 제목 | mobile subhero override |
| `--font-subhero-title-mobile` | `clamp(var(--font-h2), 8vw, var(--font-display))` | 모바일 subhero 보조 제목 | mobile subhero rules |
| `--font-card-title-lg` | `28px` | 큰 카드 제목 | `.portal-weather-summary-card h2`, `.portal-weather-feature-head h2` |
| `--font-display-title` | `var(--font-display)` | display 제목 alias | display title selectors |
| `--font-page-title` | `var(--font-h1)` | 페이지 제목 alias | `.portal-template-page .portal-subhero h1` |
| `--font-section-title` | `var(--font-h1)` | 섹션 제목 alias | `.section-title__title`, `.portal-guide-section h2` |
| `--font-subsection-title` | `var(--font-h2)` | 하위 섹션 제목 alias | subsection title rules |
| `--font-card-title` | `var(--font-h3)` | 카드 제목 alias | card title rules |

### 본문/설명용

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--font-body-lg` | `18px` | 큰 본문/강조 설명 | `.portal-card p`, `.portal-guide-copy strong` |
| `--font-body` | `16px` | 기본 본문/폼/표 텍스트 | `.btn`, `.portal-list-search input`, `.portal-data-table td` |
| `--font-compact-description` | `14px` | compact 카드 설명 | `.portal-guide-showcase-copy p`, `.portal-weather-feature-head p` |
| `--font-quick-guide-description` | `15px` | 빠른 안내 설명 | `.portal-quick-guide-copy small` |
| `--font-home-notice-date` | `15px` | 홈 공지 날짜 | `.portal-home-notice-list time` |

### 라벨/캡션용

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--font-small` | `13px` | 작은 라벨/상태 배지 | `.portal-weather-advisory-level`, `.status` |
| `--font-caption` | `13px` | 캡션/메타 텍스트 | `.portal-booking-card__eyebrow`, table meta |
| `--font-showcase-eyebrow` | `12px` | showcase eyebrow | `.portal-guide-showcase-head span` |
| `--font-showcase-arrow` | `15px` | showcase arrow glyph | `.portal-guide-showcase-arrow` |
| `--font-hero-quick-label` | `12px` | hero quick eyebrow | `.portal-hero-quick-head > span` |
| `--font-hero-quick-list-description` | `12px` | hero quick list 설명 | `.portal-hero-quick-list small` |
| `--font-hero-quick-description-mobile` | `12px` | 모바일 hero quick 설명 | mobile `.portal-hero-quick-head p` |
| `--font-hero-service-card-description-mobile` | `12px` | 모바일 hero service card 설명 | mobile hero service card small |

### Metric/특수 숫자용

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--font-metric-label` | `15px` | metric 라벨 | `.portal-weather-metric small` |
| `--font-metric-value` | `22px` | metric 숫자값 | `.portal-weather-metric strong` |
| `--font-metric-secondary` | `14px` | metric 단위/모바일 라벨 | `.portal-weather-metric strong em`, mobile `.portal-weather-metric small` |

### 버튼/인터랙션/카드 전용

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--font-button` | `14px` | 기본 버튼 텍스트 | `.btn` |
| `--font-photo-card-title` | `clamp(20px, 1.5vw, 23px)` | 사진 카드 제목 | `.portal-guide-item--photo h3` |
| `--font-quick-guide-feature-title` | `23px` | quick guide feature 카드 제목 | `.portal-quick-guide-card--feature .portal-quick-guide-copy strong` |
| `--font-hero-quick-title-mobile` | `21px` | 모바일 hero quick 제목 | mobile `.portal-hero-quick-head h2` |
| `--font-hero-quick-list-title-mobile` | `15px` | 모바일 hero quick list 제목 | mobile `.portal-hero-quick-list strong` |

## 3. 컬러 토큰

### 3-1. 색상 원시값(primitive)

Primitive는 컴포넌트에서 직접 참조하지 않고, 아래 semantic 토큰을 거쳐 사용한다.

| 토큰 | 값 | 역할 요약 |
|---|---:|---|
| `--global-color-blue-050` | `#EDF2FA` | 연한 브랜드 배경 |
| `--global-color-blue-100` | `#EAF4FB` | 보조 브랜드 배경 |
| `--global-color-blue-500` | `#2563EB` | 브랜드 hover |
| `--global-color-blue-600` | `#1C4B9A` | 기본 브랜드 |
| `--global-color-blue-600-rgb` | `28, 75, 154` | 브랜드 rgba 원본 |
| `--global-color-navy-800` | `#123763` | 진한 네이비 |
| `--global-color-navy-900` | `#0B284A` | inverse 배경 |
| `--global-color-navy-950` | `#071B33` | 가장 강한 네이비 텍스트 |
| `--global-color-white` | `#FFFFFF` | 기본 흰색 |
| `--global-color-gray-050` | `#F4F7FB` | 연한 회색 배경 |
| `--global-color-gray-200` | `#D8DEE7` | 기본 테두리 |
| `--global-color-gray-500` | `#6B7280` | muted 텍스트 |
| `--global-color-gray-700` | `#374151` | 본문 텍스트 |
| `--global-color-gray-900` | `#172A3D` | 강한 회색/네이비 텍스트 |
| `--global-color-red-600` | `#C2333B` | danger |
| `--global-color-green-600` | `#1F7A45` | success |
| `--global-color-orange-600` | `#B4700D` | warning |

### 3-2. Semantic 컬러 토큰

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--bg-base` | `var(--global-color-white)` | 기본 표면 | `body`, `.portal-card`, `.btn--outline` |
| `--bg-subtle` | `var(--global-color-gray-050)` | 연한 섹션 배경 | `.portal-guide-section`, table/card surfaces |
| `--bg-muted` | `var(--global-color-blue-050)` | soft brand 배경 | `--portal-pill-bg`, pill/badge backgrounds |
| `--bg-inverse` | `var(--global-color-navy-900)` | 어두운 배경 | footer/header, `.btn--solid` |
| `--text-strong` | `var(--global-color-navy-950)` | 제목/강조 텍스트 | headings, `.portal-weather-metric strong` |
| `--text-body` | `var(--global-color-gray-700)` | 본문 텍스트 | `.btn`, form/input text |
| `--text-muted` | `var(--global-color-gray-500)` | 보조 텍스트 | descriptions, meta, `.portal-weather-metric small` |
| `--text-inverse` | `var(--global-color-white)` | 어두운 배경 위 텍스트 | footer/hero/dark cards |
| `--text-inverse-muted` | `#C3C8D1` | inverse muted 예비 토큰 | 현재 사용처 적음 |
| `--text-brand` | `var(--global-color-blue-600)` | 브랜드 텍스트 | links, active states |
| `--border-default` | `var(--global-color-gray-200)` | 기본 테두리 | cards, tables, inputs |
| `--color-brand` | `var(--global-color-blue-600)` | 기본 브랜드색 | brand UI |
| `--color-brand-hover` | `var(--global-color-blue-500)` | 밝은 브랜드 hover/focus | focus outlines |
| `--action-primary` | `var(--color-brand)` | 주요 액션 기본색 | `.btn--solid` |
| `--action-primary-hover` | `var(--global-color-gray-700)` | 주요 액션의 진한 중립 hover색 | `.btn--solid:hover` |
| `--color-brand-rgb` | `var(--global-color-blue-600-rgb)` | 브랜드 투명도 원본 | `--brand-overlay-*` |
| `--status-danger` | `var(--global-color-red-600)` | 위험/오류 텍스트 | `.status.cancel`, weather danger |
| `--status-success` | `var(--global-color-green-600)` | 성공/정상 텍스트 | `.status.normal`, weather success |
| `--status-warning` | `var(--global-color-orange-600)` | 경고/주의 텍스트 | `.status.control`, weather warning |
| `--status-success-bg` | `#eef8f1` | success soft 배경 | `.portal-weather-advisory-level` |
| `--status-warning-bg` | `#fff5e8` | warning soft 배경 | `.terminal-ticket-notice`, weather warning |
| `--status-danger-bg` | `#fff0ef` | danger soft 배경 | weather danger |

### 3-3. 상태색

상태를 표시할 때는 텍스트는 `--status-*`, 배경은 `--status-*-bg`를 세트로 사용한다.

| 상태 | 텍스트 토큰 | 배경 토큰 | 사용 예시 |
|---|---|---|---|
| success | `--status-success` | `--status-success-bg` | `.status.normal`, weather success badge |
| warning | `--status-warning` | `--status-warning-bg` | `.status.control`, `.terminal-ticket-notice`, weather warning badge |
| danger | `--status-danger` | `--status-danger-bg` | `.status.cancel`, weather danger badge |

### 3-4. 브랜드 액센트

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--color-brand` | `var(--global-color-blue-600)` | 기본 브랜드색. 새 일반 브랜드 UI는 이 토큰을 우선 사용한다. |
| `--color-brand-hover` | `var(--global-color-blue-500)` | hover/focus 상태의 브랜드 강조. |
| `--action-primary-hover` | `var(--global-color-gray-700)` | solid와 outline 액션에 공통으로 사용하는 진한 중립 hover/focus 색상. |
| `--color-brand-focus` | `#77b9e8` | focus ring 또는 dark showcase focus처럼 밝은 강조가 필요한 곳. |
| `--color-brand-accent` | `#59b7ed` | 단일 브랜드 accent. 현재 `.eyebrow::before` 배경. |
| `--color-hero-quick-accent` | `#a9ddff` | hero quick 영역 전용 accent. 다른 컴포넌트에 재사용하지 않는다. |
| `--color-inverse-info-accent` | `#a8d8f4` | inverse 배경 위 정보성 accent. `.contact-card .label`, `.portal-preparing-block span` |

### 3-5. Overlay/Shadow/Scrim 토큰

새로운 반투명 효과가 필요하면 새 값을 만들기 전에 이 목록에서 먼저 찾아본다. 비슷한 값이 있어도 역할(`border`, `text`, `shadow`, `scrim`, `overlay`)이 다르면 함부로 재사용하지 말고, 정말 같은 역할일 때만 기존 토큰을 쓴다.

이 원칙이 중요한 이유: 과거에 역할이 다른 opacity 값을 하나로 합쳤다가, 실제 렌더 색이 바뀌어 다시 역할별로 분리한 이력이 있다.

| 토큰 | 값 | 역할 구분 | 사용 예시 |
|---|---|---|---|
| `--brand-overlay-faint` | `rgba(var(--color-brand-rgb), .04)` | overlay | table hover, notice nav focus |
| `--brand-overlay-faint-hover` | `rgba(var(--color-brand-rgb), .05)` | overlay | notice list focus |
| `--brand-overlay-primary` | `rgba(var(--color-brand-rgb), .08)` | overlay | `.id-guide-matrix .id-guide-primary` |
| `--brand-overlay-subtle` | `rgba(var(--color-brand-rgb), .09)` | overlay | `.id-guide-audience`, `.id-guide-card:hover` |
| `--brand-overlay-pill` | `rgba(var(--color-brand-rgb), .1)` | overlay | `.portal-step-flow li > span` |
| `--brand-overlay-hover` | `rgba(var(--color-brand-rgb), .14)` | overlay | `.portal-guide-item:hover` shadow |
| `--brand-overlay-showcase` | `rgba(var(--color-brand-rgb), .2)` | overlay | map hover/showcase radial overlay |
| `--brand-overlay-medium` | `rgba(var(--color-brand-rgb), .22)` | overlay | reserved medium overlay |
| `--brand-overlay-active` | `rgba(var(--color-brand-rgb), .24)` | overlay | active map marker shadow |
| `--brand-overlay-focus` | `rgba(var(--color-brand-rgb), .28)` | overlay | compact quick guide focus border |
| `--brand-overlay-strong` | `rgba(var(--color-brand-rgb), .34)` | overlay | guide hover border |
| `--brand-overlay-border` | `rgba(var(--color-brand-rgb), .35)` | overlay | safety list border |
| `--brand-overlay-ring` | `rgba(var(--color-brand-rgb), .42)` | overlay | terminal switcher focus outline |
| `--brand-overlay-photo-focus` | `rgba(var(--color-brand-rgb), .5)` | overlay | photo guide focus border |
| `--inverse-border-subtle` | `color-mix(in srgb, var(--text-inverse) 18%, transparent)` | border | footer select, hero quick dividers |
| `--inverse-border-medium` | `color-mix(in srgb, var(--text-inverse) 24%, transparent)` | border | booking card border, transparent header border |
| `--inverse-border-divider` | `color-mix(in srgb, var(--text-inverse) 34%, transparent)` | border | footer address divider, transparent search border |
| `--inverse-border-hover` | `color-mix(in srgb, var(--text-inverse) 36%, transparent)` | border | footer select hover |
| `--inverse-border-strong` | `color-mix(in srgb, var(--text-inverse) 38%, transparent)` | border | subpage transparent search border |
| `--inverse-border-hero` | `color-mix(in srgb, var(--text-inverse) 42%, transparent)` | border | hero quick card border |
| `--inverse-border-accent` | `color-mix(in srgb, var(--text-inverse) 50%, transparent)` | border | showcase arrow, hero service card |
| `--inverse-arrow-accent` | `color-mix(in srgb, var(--text-inverse) 58%, transparent)` | border | photo guide arrow |
| `--inverse-text-subtle` | `color-mix(in srgb, var(--text-inverse) 62%, transparent)` | text | footer copyright/address |
| `--inverse-border-select-focus` | `color-mix(in srgb, var(--text-inverse) 64%, transparent)` | border | footer select focus border |
| `--inverse-text-soft` | `color-mix(in srgb, var(--text-inverse) 68%, transparent)` | text | hero quick small/showcase description |
| `--inverse-text-muted` | `color-mix(in srgb, var(--text-inverse) 70%, transparent)` | text | hero quick head paragraph |
| `--inverse-text-muted-strong` | `color-mix(in srgb, var(--text-inverse) 72%, transparent)` | text | footer/action band muted text |
| `--inverse-text-body` | `color-mix(in srgb, var(--text-inverse) 76%, transparent)` | text | footer policy/contact, showcase copy |
| `--inverse-text-body-strong` | `color-mix(in srgb, var(--text-inverse) 78%, transparent)` | text | dark eyebrow, hero service small |
| `--inverse-text-strong` | `color-mix(in srgb, var(--text-inverse) 82%, transparent)` | text | booking eyebrow, photo card text |
| `--inverse-text-hero` | `color-mix(in srgb, var(--text-inverse) 84%, transparent)` | text | hero content paragraph |
| `--inverse-link-strong` | `color-mix(in srgb, var(--text-inverse) 90%, transparent)` | text | footer links, booking body |
| `--inverse-focus-strong` | `color-mix(in srgb, var(--text-inverse) 92%, transparent)` | border | footer arrow, hero service focus outline |
| `--inverse-nav-strong` | `color-mix(in srgb, var(--text-inverse) 94%, transparent)` | text | transparent header GNB |
| `--shadow-extra-subtle` | `color-mix(in srgb, var(--text-strong) 4%, transparent)` | shadow | status table shadow |
| `--shadow-table-row` | `color-mix(in srgb, var(--text-strong) 5%, transparent)` | shadow | mobile table row |
| `--shadow-subtle` | `color-mix(in srgb, var(--text-strong) 6%, transparent)` | shadow | `.portal-card` shadow |
| `--shadow-map-soft` | `color-mix(in srgb, var(--text-strong) 8%, transparent)` | shadow | map land shadows |
| `--shadow-lg-color` | `color-mix(in srgb, var(--text-strong) 9%, transparent)` | shadow | `--shadow-lg` |
| `--shadow-marker` | `color-mix(in srgb, var(--text-strong) 11%, transparent)` | shadow | terminal marker |
| `--strong-border-subtle` | `color-mix(in srgb, var(--text-strong) 12%, transparent)` | border | photo guide item border |
| `--shadow-medium` | `color-mix(in srgb, var(--text-strong) 14%, transparent)` | shadow | brand symbol inset |
| `--shadow-panel` | `color-mix(in srgb, var(--text-strong) 16%, transparent)` | shadow | terminal switcher/menu/map dot |
| `--shadow-dot` | `color-mix(in srgb, var(--text-strong) 18%, transparent)` | shadow | marker dot inner shadow |
| `--shadow-focus` | `color-mix(in srgb, var(--text-strong) 20%, transparent)` | shadow | terminal marker focus shadow |
| `--shadow-strong` | `color-mix(in srgb, var(--text-strong) 22%, transparent)` | shadow | active terminal marker shadow |
| `--shadow-text` | `color-mix(in srgb, var(--text-strong) 24%, transparent)` | shadow | subhero text-shadow |
| `--scrim-light` | `color-mix(in srgb, var(--text-strong) 46%, transparent)` | scrim | subhero scrim gradient |
| `--scrim-medium` | `color-mix(in srgb, var(--text-strong) 67%, transparent)` | scrim | subhero scrim gradient |
| `--scrim-heavy` | `color-mix(in srgb, var(--text-strong) 84%, transparent)` | scrim | subhero scrim gradient |
| `--shadow-sm` | `0 4px 12px rgba(0, 0, 0, 0.05)` | shadow | small elevation |
| `--shadow-md` | `0 10px 24px rgba(0, 0, 0, 0.1)` | shadow | medium elevation |
| `--shadow-lg` | `0 12px 32px var(--shadow-lg-color)` | shadow | large elevation |

### 3-6. 컴포넌트 전용 토큰

이 값들은 특정 컴포넌트 전용이며 다른 곳에 재사용하지 않는다. 값이 같거나 비슷해도 새 컴포넌트의 의미가 다르면 새 토큰을 만든다.

| 토큰 | 값 | 전용 영역 |
|---|---:|---|
| `--gradient-brand-symbol-end` | `#31a9d8` | brand symbol gradient |
| `--quick-guide-booking-accent` | `#0b5fc1` | quick guide booking card |
| `--quick-guide-lost-accent` | `#244b9d` | quick guide lost card |
| `--quick-guide-phone-accent` | `#102e63` | quick guide phone card |
| `--gradient-hero-quick-start` | `#003060` | hero quick gradient start |
| `--gradient-hero-quick-mid` | `#004890` | hero quick gradient middle |
| `--gradient-hero-quick-end` | `#18789a` | hero quick gradient end |
| `--gradient-terminal-guide-start` | `#3F51B5` | terminal guide gradient start |
| `--gradient-terminal-guide-end` | `#007fb9` | terminal guide gradient end |
| `--showcase-bg` | `#081321` | guide showcase background |
| `--showcase-card-bg` | `#12263d` | guide showcase card background |
| `--weather-metric-direction` | `#0099a3` | weather metric direction icon |
| `--weather-metric-temperature` | `#00a6bb` | weather metric temperature icon |
| `--weather-metric-wind` | `#63aa49` | weather metric wind icon |
| `--weather-metric-visibility` | `#0088f5` | weather metric visibility/wave icon |
| `--weather-metric-swell` | `#ff6f00` | weather metric swell icon |
| `--weather-metric-pressure` | `#c96a39` | weather metric pressure icon |
| `--portal-floating-quick-width` | `104px` | floating quick menu width |
| `--portal-floating-quick-link-height` | `76px` | floating quick menu link minimum height |
| `--portal-floating-quick-toggle-height` | `44px` | floating quick menu toggle minimum height |
| `--portal-floating-quick-collapsed-width` | `88px` | collapsed floating quick menu pill width |
| `--portal-floating-quick-mobile-top-size` | `56px` | mobile floating TOP button size |
| `--portal-floating-quick-focus-width` | `3px` | floating quick menu focus outline |
| `--portal-floating-quick-border-width` | `1px` | floating quick menu dividers |
| `--portal-floating-quick-icon-stroke` | `1.7` | floating quick menu icon stroke |

## 4. Spacing 토큰

새 `padding`, `margin`, `gap`이 필요하면 아래 스케일 토큰 중 하나를 사용한다. 스케일에 없는 값을 직접 쓰지 않고, 예외가 필요하면 이 문서에 사유를 남긴다.

| 토큰 | 값 | 사용 예시 |
|---|---:|---|
| `--spacing-4` | `4px` | `.section-kicker`, `.status-legend span`, `.portal-list-filter` |
| `--spacing-8` | `8px` | `.eyebrow`, `.btn`, `.portal-pagination` |
| `--spacing-12` | `12px` | `.skip-link`, `.brand-logo`, `.portal-list-search` |
| `--spacing-16` | `16px` | `--portal-btn-px`, `.quick-card`, `.portal-terminal-meta` |
| `--spacing-20` | `20px` | `.utility .container`, `.container`, `.terminal-route-item` |
| `--spacing-24` | `24px` | `.header-inner`, `.button`, `.portal-card` |
| `--spacing-32` | `32px` | `--section-title-gap`, `nav ul`, `.section-head` |
| `--spacing-40` | `40px` | mobile `--global-spacing-section-tight`, `.portal-footer-links` |
| `--spacing-48` | `48px` | mobile `--layout-section-padding`, `.site-footer-main` |
| `--spacing-64` | `64px` | `--global-spacing-section-tight`, `.portal-policy-section` |
| `--spacing-80` | `80px` | `--global-spacing-section`, `.portal-guide-detail-section` |

### Semantic spacing 토큰

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---|---|---|
| `--global-spacing-section` | `var(--spacing-80)` | 기본 섹션 세로 여백 | `--layout-section-padding` |
| `--global-spacing-section-tight` | `var(--spacing-64)` | 좁은 섹션 세로 여백 | `.portal-guide-section`, `.portal-hero-quick` responsive padding |
| `--layout-section-padding` | `var(--global-spacing-section)` | 섹션 padding alias | `.portal-section`, `.portal-terminal-section` |
| `--section-title-gap` | `var(--spacing-32)` | 제목 블록과 본문 사이 간격 | `.section-title`, `.portal-guide-section` |
| `--section-eyebrow-gap` | `var(--spacing-8)` | eyebrow와 제목 사이 간격 | `.section-title__eyebrow`, `.portal-section-eyebrow` |
| `--portal-btn-px` | `var(--spacing-16)` | 버튼 좌우 padding 기준 | `.btn` |

Responsive override도 같은 스케일을 사용한다. 현재 `@media (max-width: 760px)` 안에서 `--layout-section-padding: var(--spacing-48)`, `--global-spacing-section-tight: var(--spacing-40)`, `--section-title-gap: var(--spacing-32)`로 조정한다.

### 스케일 예외

| 값 | 사용처 | 사유 |
|---:|---|---|
| `44px` | `--portal-btn-height` | 모바일 터치 타겟 기준값이므로 spacing 스케일로 흡수하지 않는다. |
| `85px`, `92px`, `94px`, `105px`, `112px`, `120px` 포함 padding/margin | hero/showcase 큰 섹션 여백 | 별도 시각 검증 후 정리할 영역이다. |
| `0`, `auto`, 음수 margin | reset, 중앙 정렬, 미세 위치 보정 | 레이아웃 의미가 있어 스케일 치환 대상이 아니다. |
| `rem` 단위 spacing | `.portal-panel-padding`, 일부 콘텐츠 padding | 단위 체계가 달라 별도 검토 대상이다. |
| `2.5px` | `--section-eyebrow-spacing` letter-spacing | spacing이 아니라 자간 토큰이므로 8px 스케일 대상이 아니다. |

## 5. Radius 토큰

새 컴포넌트의 radius가 필요하면 먼저 이 표에서 역할이 맞는 토큰을 찾는다.

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---:|---|---|
| `--global-radius-sm` | `8px` | 버튼/칩/작은 컨트롤 | `.btn`, `.menu-button`, `.portal-list-search`, `.portal-pagination` |
| `--radius-card-sm` | `12px` | 카드/패널 | `.quick-icon`, `.status-table-wrap`, `.terminal-card`, `.portal-guide-item--photo` |
| `--global-radius-md` | `18px` | 큰 패널/기본 카드 radius | `.portal-page .portal-hero-service-card`, existing md surfaces |
| `--global-radius-pill` | `999px` | pill/button/badge | `.btn`, `.portal-content-badge`, `.portal-weather-advisory-level` |

### Radius 예외

장식형 radius와 조합형 radius는 컴포넌트 전용 예외로 유지한다. 새 컴포넌트에서 재사용하지 않는다.

| 값 | 사용처 | 사유 |
|---:|---|---|
| `60% 40% 55% 45%` | 지도/비주얼 장식 요소 | 유기적 장식 형태 |
| `50% 50% 50% 0` | marker pin 형태 | 지도 marker 전용 |
| `0 12px 12px 0` | 한쪽만 둥근 결합형 UI | 구조 결합형 radius |
| `0 0 8px 8px`, `0 0 4px 4px` | 하단 결합형 패널/메뉴 | 구조 결합형 radius |
| `1px`, `2px`, `4px` | 아이콘/도트/pseudo 요소 | 작은 장식 요소 크기와 결합된 값 |

## 6. Line-height 토큰

새 텍스트의 줄간격이 필요하면 먼저 역할이 맞는 토큰을 찾는다.

### 제목류

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---:|---|---|
| `--line-height-tight` | `1.3` | 기본 제목 줄간격 | `--global-line-height-tight`, `.portal-weather-summary-card h2` |
| `--line-height-title-compact` | `1.2` | 큰 display/showcase 제목 | `.portal-guide-showcase-head h2` |
| `--line-height-title-loose` | `1.4` | 카드 제목/FAQ Q/작은 제목 | `.portal-guide-item h3`, `.portal-faq-list summary::before` |

### 본문류

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---:|---|---|
| `--line-height-normal` | `1.5` | 기본 본문 줄간격 | `--global-line-height-normal`, `.portal-guide-showcase-copy p` |
| `--line-height-relaxed` | `1.6` | 긴 설명문/카드 설명 | `.portal-guide-item p`, `.portal-guide-showcase-head p` |
| `--line-height-loose` | `1.75` | 정책/FAQ 본문처럼 긴 읽기 텍스트 | `.portal-policy-section li`, `.portal-faq-term-list` |

### 숫자·아이콘류

| 토큰 | 값 | 역할 | 사용 예시 |
|---|---:|---|---|
| `--line-height-icon` | `1` | 아이콘/pseudo glyph/compact count | `.btn--arrow::after`, `.terminal-marker span`, `.portal-step-flow li::after` |
| `--line-height-metric` | `1.2` | metric 숫자값 | `.portal-weather-metric strong` |

## 7. 컴포넌트 사용 패턴

| 패턴 | 대표 selector | 토큰 조합 |
|---|---|---|
| 기본 버튼 | `.btn`, `.btn--solid`, `.btn--outline`, `.btn--ghost` | `--font-button`, `--action-primary`, `--action-primary-hover`, `--text-brand`, `--bg-base`, `--bg-inverse`, `--border-default` |
| 작은/아이콘 버튼 | `.btn--sm`, `.btn--icon`, `.portal-pagination .btn--sm.btn--icon` | `--font-button`, `--portal-btn-radius`, `--border-default`, `--text-brand` |
| 페이지네이션 | `.portal-pagination`, `.portal-pagination .btn[aria-current="page"]` | `.btn` 패턴 + `--text-brand`, `--bg-base`, `--border-default` |
| 검색/필터 입력 | `.portal-list-search`, `.portal-list-search input`, `.portal-list-select select` | `--font-body`, `--bg-base`, `--border-default`, `--text-body`, `--text-muted` |
| 일반 폼 컨트롤 | `.portal-form-control` | `--font-body`, `--surface-base`, `--border-default`, `--text-strong`, `--text-muted`, `--text-brand`, `--brand-overlay-focus` |
| 상태 배지 | `.status.*`, `.portal-operation-status`, `.portal-weather-advisory-level` | `--status-*`, `--status-*-bg`, `--font-small` |
| 카드 | `.portal-card`, `.portal-guide-item`, `.portal-guide-item--photo` | `--bg-base`, `--border-default`, `--shadow-lg`, `--font-card-title`, `--font-body-lg`, component-specific tokens |
| 표 | `.portal-data-table`, `.portal-info-table` | `--font-body`, `--border-default`, `--text-strong`, `--text-muted`, `--brand-overlay-faint` |
| 안내/콘텐츠 배지 | `.portal-content-badge`, `.portal-content-badge--common`, `.portal-content-badge--terminal` | `--portal-pill-bg`, `--global-color-blue-500`, `--font-small` |
| 기상 metric | `.portal-weather-metric small/strong/em` | `--font-metric-label`, `--font-metric-value`, `--font-metric-secondary`, `--text-muted`, `--text-strong`, `--weather-metric-*` |

## 8. 새 코드 작성 규칙

- [ ] 새 텍스트 스타일이 필요하면 먼저 2번 섹션에서 맞는 폰트 토큰을 찾는다. 없으면 새로 만들기 전에 이 문서에 추가한다.
- [ ] 새 색상이 필요하면 3-1 primitive에 이미 있는 색인지 먼저 확인한다.
- [ ] primitive 색상은 컴포넌트에서 직접 쓰지 않고 semantic 토큰을 통해 사용한다.
- [ ] 반투명 효과가 필요하면 3-5에서 역할이 같은 토큰이 있는지 먼저 찾는다. 값이 비슷해도 역할이 다르면 새 토큰을 만든다.
- [ ] 상태 표시는 3-3의 텍스트/배경 세트를 사용한다.
- [ ] 컴포넌트 전용 값(3-6)은 다른 컴포넌트에 재사용하지 않는다.
- [ ] 새 `padding`, `margin`, `gap`이 필요하면 먼저 4번 섹션에서 맞는 spacing 토큰을 찾는다. 스케일에 없는 값을 쓰기 전에 정말 예외가 맞는지 확인한다.
- [ ] 새 radius가 필요하면 5번 섹션에서 컴포넌트 역할에 맞는 토큰을 찾는다.
- [ ] 새 line-height가 필요하면 6번 섹션에서 텍스트 역할에 맞는 토큰을 찾는다.
- [ ] 하드코딩된 `hex`, `rgba()`, `color-mix()`를 직접 `style.css`에 추가하기 전에 이 문서를 갱신한다.

## 9. 추후 정리 예정

아래 항목은 아직 통일 작업을 완료하지 않았다. 규칙으로 확정하지 않고 현황만 기록한다.

### Hero/showcase 큰 섹션 여백

`85px`, `92px`, `94px`, `105px`, `112px`, `120px`가 포함된 hero/showcase 계열 `padding`/`margin` 중 `.portal-hero`, `.portal-terminal-section`, `.portal-guide-showcase`의 죽은 padding 규칙과 관련 모바일 override는 검증 후 삭제했다.

남은 보류 항목은 아래 2곳이다.

| selector | 위치 | 현재 값 | 사용 범위 | 보류 사유 | 재검토 조건 |
|---|---|---|---|---|---|
| `.hero-content` | `common/style.css:475`, mobile `common/style.css:2367` | desktop `padding: 85px 0 112px`, mobile `padding: 65px 0 105px` | `yeosu`, `gunsan`, `incheon`, `jeju`, `tongyeong`, `wando`, `pohang` 등 지역 터미널 메인 페이지 hero | 지역 터미널 페이지 자체가 아직 정리 전이라, hero 시각 구조와 함께 봐야 한다. | 지역 터미널 페이지 작업이 시작되면 `.hero-content` 여백을 함께 재검토한다. |
| `.site-header .gnb` | `common/style.css:9095` 근처 | mobile `padding: 92px 22px 36px` | 모바일 풀스크린 GNB | 고정 헤더 높이에 맞춘 안전 여백일 가능성이 있어, 임의로 줄이면 메뉴 콘텐츠가 헤더에 가려질 수 있다. | 모바일 GNB는 실제 헤더 높이를 브라우저에서 측정한 뒤 재검토한다. |

### Font-family / font-weight

TODO: 통일 작업 필요.

| 토큰 | 값 | 현재 사용 예시 |
|---|---:|---|
| `--global-font-family-body` | `"Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif` | body font family |
| `--global-font-family-hero` | `"Gmarket Sans", var(--global-font-family-body)` | hero/display font family |
| `--global-font-weight-regular` | `400` | body text |
| `--global-font-weight-medium` | `500` | labels/buttons |
| `--global-font-weight-semibold` | `600` | headings/cards |
| `--global-font-weight-bold` | `700` | active tabs/section title |
| `--global-font-weight-extrabold` | `800` | reserved heavy emphasis |
| `--section-title-weight` | `var(--global-font-weight-bold)` | section title |
| `--schedule-tab-text-active` | `var(--global-font-weight-bold)` | active schedule tabs |

### Component sizing

TODO: 통일 작업 필요.

| 토큰 | 값 | 현재 사용 예시 |
|---|---:|---|
| `--portal-btn-height` | `44px` | button min-height |
| `--portal-btn-px` | `16px` | button horizontal padding / related spacing |
| `--portal-pill-bg` | `var(--global-color-blue-100)` | content badge/pill |
| `--portal-table-cell-padding-block` | `var(--spacing-16)` | data table cell vertical padding |
| `--portal-table-cell-padding-inline` | `var(--spacing-20)` | data table cell horizontal padding |
| `--schedule-header-bg` | `var(--bg-inverse)` | schedule header |
| `--schedule-tab-width` | `144px` | schedule tab width |

### 다크모드/테마

현재 별도 다크모드 토큰 세트는 없다. `prefers-color-scheme`, `[data-theme]`, `.dark` 기반 테마 전환도 없다. 일부 섹션에서 `.section-title--dark`처럼 inverse 색상 토큰을 직접 적용하는 수준이다.

### 의도적 예외

아래 값은 hover/marker 강조 border 역할이 달라 `--border-default`로 통일하지 않았다.

| 값 | 사용처 | 사유 |
|---:|---|---|
| `#a9bfce` | `.empty-state` dashed border | 비어있는 상태 강조용 dashed border |
| `#b5c9d7` | `.terminal-marker` border | 지도 marker 전용 강조 border |
| `#9fc3df` | `.guide-card:hover`, `.portal-card:hover` | hover 강조 border |
