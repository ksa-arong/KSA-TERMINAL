# KSA Terminal Design Token Specification

- 문서 버전: 1.1
- 기준일: 2026-10-06
- 상태: 디자인 토큰 마이그레이션 1단계 완료 및 직접값 현황 재점검 기준
- 공식 소스: `common/style.css`
- 적용 범위: 실제 서비스 CSS

## 1. 문서 목적

이 문서는 `common/style.css`에 선언된 디자인 토큰의 현재 구조, 역할, alias 관계와 사용 규칙을 정의한다. 신규 CSS 작성과 후속 토큰 마이그레이션은 이 문서를 기준으로 한다.

현재 토큰 체계는 기존 토큰을 삭제하지 않고 canonical alias를 추가한 과도기 구조다. 따라서 기존 토큰과 새 토큰이 함께 존재하지만, 신규 코드에서는 이 문서가 지정한 canonical 토큰을 우선한다.

백업 CSS는 비교 자료일 뿐 공식 소스가 아니다. 토큰 값과 지원 여부는 항상 `common/style.css`의 현재 선언을 기준으로 판단한다.

## 2. 현재 구조 요약

`common/style.css`의 기본 `:root`에는 현재 서로 다른 custom property 243개가 선언되어 있다. `max-width: 700px`의 `:root`에는 이 중 5개를 다시 정의하는 반응형 override가 있다. `:root` 밖에는 컴포넌트 기본값, variant, 상태, 지역별 지도 좌표와 반응형 재정의를 포함한 scoped custom-property 선언 255개가 있으며, 이름 기준으로는 98개다.

토큰은 다음 세 계층으로 해석한다.

```text
Primitive
  원시 팔레트, 숫자 스케일, 폰트 패밀리·굵기, 간격, 행간, radius, shadow preset

Semantic
  text, surface, border, action, status, focus처럼 UI 역할을 표현하는 토큰

Component
  portal, map, guide, weather, operation, floating quick 등 특정 컴포넌트에 한정된 토큰
```

기본 참조 방향은 다음과 같다.

```text
Primitive → Semantic → Component → CSS property
```

반대 방향 참조와 순환 참조는 허용하지 않는다.

## 3. 네이밍 규칙

| 계층 | canonical 접두사 | 예 | 규칙 |
|---|---|---|---|
| Primitive | `--global-*` | `--global-color-blue-600` | 재사용 가능한 원시 값 |
| Semantic | `--text-*`, `--surface-*`, `--border-*`, `--action-*`, `--status-*`, `--focus-*` | `--surface-base` | 시각 값이 아니라 UI 역할을 표현 |
| Component | `--portal-*`, `--weather-*`, `--operation-*`, `--schedule-*` 등 | `--portal-floating-quick-width` | 컴포넌트 이름을 접두사로 사용 |
| Scoped component | 컴포넌트 루트 내부 선언 | `--btn-size` | 전역 계약이 아니며 선언된 selector 범위에서만 사용 |

### 3.1 과도기 토큰

다음 토큰군은 기존 이름을 유지하면서 `--global-*` alias로 마이그레이션 중이다.

- `--spacing-*` → `--global-space-*`
- `--line-height-*` → `--global-line-height-*`
- `--shadow-sm/md/lg` → `--global-shadow-sm/md/lg`
- `--bg-*` → `--surface-*`
- `--color-brand*` → 역할에 따라 `--action-*` 또는 `--focus-*`

기존 토큰은 아직 삭제하거나 값을 변경하지 않는다. 신규 사용처에서는 canonical alias를 우선하며, 기존 사용처는 역할을 확인한 후 단계적으로 교체한다.

## 4. Primitive 토큰

### 4.1 색상 팔레트

| 토큰 | 값 | 용도 |
|---|---|---|
| `--global-color-blue-050` | `#EDF2FA` | 연한 브랜드 배경 |
| `--global-color-blue-100` | `#EAF4FB` | 보조 브랜드 배경 |
| `--global-color-blue-300` | `#77b9e8` | 브랜드 focus 계열 원시색 |
| `--global-color-blue-500` | `#2563EB` | 브랜드 hover 원시색 |
| `--global-color-blue-600` | `#1C4B9A` | 기본 브랜드 원시색 |
| `--global-color-blue-600-rgb` | `28, 75, 154` | alpha 합성용 RGB 채널 |
| `--global-color-navy-800` | `#123763` | 짙은 남색 보조색 |
| `--global-color-navy-900` | `#0B284A` | inverse surface |
| `--global-color-navy-950` | `#071B33` | 가장 짙은 남색 |
| `--global-color-white` | `#FFFFFF` | 흰색 |
| `--global-color-gray-050` | `#F4F7FB` | 연한 중립 배경 |
| `--global-color-gray-200` | `#D8DEE7` | 기본 테두리 |
| `--global-color-gray-500` | `#6B7280` | 보조 텍스트 |
| `--global-color-gray-700` | `#374151` | 본문 텍스트 |
| `--global-color-gray-900` | `#101828` | 강한 텍스트 |
| `--global-color-red-600` | `#C2333B` | 위험 상태 |
| `--global-color-green-600` | `#1F7A45` | 성공 상태 |
| `--global-color-orange-600` | `#B4700D` | 경고 상태 |

원시 팔레트는 컴포넌트에서 직접 사용하기보다 Semantic 토큰을 통해 사용한다. 새로운 직접 색상값이 반복될 경우 먼저 Primitive 승격 여부를 검토한다.

### 4.2 폰트 패밀리와 굵기

| 토큰 | 값 |
|---|---|
| `--global-font-family-body` | `"Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif` |
| `--global-font-family-hero` | `"Gmarket Sans", var(--global-font-family-body)` |
| `--global-font-weight-regular` | `400` |
| `--global-font-weight-medium` | `500` |
| `--global-font-weight-semibold` | `600` |
| `--global-font-weight-bold` | `700` |
| `--global-font-weight-extrabold` | `800` |

### 4.3 행간

| 기존 토큰 | 값 | canonical alias |
|---|---:|---|
| `--line-height-icon` | `1` | `--global-line-height-icon` |
| `--line-height-tight` | `1.3` | `--global-line-height-tight` |
| `--line-height-title-compact` | `1.2` | `--global-line-height-title-compact` |
| `--line-height-metric` | `1.2` | `--global-line-height-metric` |
| `--line-height-title-loose` | `1.4` | `--global-line-height-title-loose` |
| `--line-height-normal` | `1.5` | `--global-line-height-normal` |
| `--line-height-relaxed` | `1.6` | `--global-line-height-relaxed` |
| `--line-height-loose` | `1.75` | `--global-line-height-loose` |

모든 global 행간 토큰은 같은 행의 기존 토큰을 직접 참조한다. 값 변경은 기존 토큰에서만 수행하며 alias에는 직접 값을 넣지 않는다.

### 4.4 간격

| 기존 토큰 | 값 | canonical alias |
|---|---:|---|
| `--spacing-4` | `4px` | `--global-space-4` |
| `--spacing-8` | `8px` | `--global-space-8` |
| `--spacing-12` | `12px` | `--global-space-12` |
| `--spacing-16` | `16px` | `--global-space-16` |
| `--spacing-20` | `20px` | `--global-space-20` |
| `--spacing-24` | `24px` | `--global-space-24` |
| `--spacing-32` | `32px` | `--global-space-32` |
| `--spacing-40` | `40px` | `--global-space-40` |
| `--spacing-48` | `48px` | `--global-space-48` |
| `--spacing-64` | `64px` | `--global-space-64` |
| `--spacing-80` | `80px` | `--global-space-80` |

레이아웃 간격 alias:

| 토큰 | 참조 | 역할 |
|---|---|---|
| `--global-spacing-section` | `var(--spacing-80)` | 기본 섹션 간격 |
| `--global-spacing-section-tight` | `var(--global-space-64)` | 좁은 섹션 간격 |

신규 단일 속성에는 `--global-space-*`를 사용한다. 기존 `padding`, `margin`, `gap`, `flex` shorthand는 계산 결과와 반응형 문맥을 검토한 뒤 별도 작업으로 교체한다.

### 4.5 Radius

| 토큰 | 값 | 상태 |
|---|---:|---|
| `--global-radius-sm` | `8px` | canonical |
| `--global-radius-md` | `16px` | canonical |
| `--global-radius-pill` | `999px` | canonical |
| `--radius-card-sm` | `12px` | 과도기 원시 토큰 |

`--radius-card-sm`은 현재 사용처를 유지한다. 추후 Primitive 스케일에 포함할지 Component alias로 남길지 별도 결정한다.

### 4.6 Shadow preset

| 기존 토큰 | 값 | canonical alias |
|---|---|---|
| `--shadow-sm` | `0 4px 12px rgba(0, 0, 0, 0.05)` | `--global-shadow-sm` |
| `--shadow-md` | `0 10px 24px rgba(0, 0, 0, 0.1)` | `--global-shadow-md` |
| `--shadow-lg` | `0 12px 32px var(--shadow-lg-color)` | `--global-shadow-lg` |

## 5. Semantic 토큰

### 5.1 Brand, action, focus

| 토큰 | 참조 또는 값 | 역할 |
|---|---|---|
| `--color-brand` | `var(--global-color-blue-600)` | 기존 브랜드 대표색 |
| `--color-brand-hover` | `var(--global-color-blue-500)` | 기존 브랜드 hover색 |
| `--color-brand-rgb` | `var(--global-color-blue-600-rgb)` | 브랜드 alpha 합성 |
| `--action-primary` | `var(--color-brand)` | 기본 action색 |
| `--action-primary-hover` | `var(--color-brand-hover)` | 기본 action hover색 |
| `--color-brand-focus` | `var(--global-color-blue-300)` | 기존 focus 원본 |
| `--focus-ring-brand` | `var(--color-brand-focus)` | 브랜드 focus ring |

`--action-*`은 버튼, 링크 등 사용자의 행동을 나타내는 UI에만 사용한다. 단순 브랜드 텍스트와 장식에는 `--text-brand` 또는 적절한 Component 토큰을 사용한다.

### 5.2 Surface

| 기존 토큰 | Primitive 참조 | canonical alias | 의미 |
|---|---|---|---|
| `--bg-base` | `--global-color-white` | `--surface-base` | 기본 배경 |
| `--bg-subtle` | `--global-color-gray-050` | `--surface-subtle` | 연한 중립 배경 |
| `--bg-muted` | `--global-color-blue-050` | `--surface-muted` | 연한 브랜드 배경 |
| `--bg-inverse` | `--global-color-navy-900` | `--surface-inverse` | 어두운 반전 배경 |

`--surface-*`는 `background`와 `background-color` 역할에만 사용한다. 텍스트, 아이콘, border, outline 또는 shadow에 기존 `--bg-*`가 사용된 경우 surface alias로 기계적으로 교체하지 않는다.

### 5.3 Text와 border

| 토큰 | 참조 또는 값 | 역할 |
|---|---|---|
| `--text-strong` | `var(--global-color-gray-900)` | 제목과 강한 본문 |
| `--text-body` | `var(--global-color-gray-700)` | 기본 본문 |
| `--text-muted` | `var(--global-color-gray-500)` | 보조 정보 |
| `--text-inverse` | `var(--global-color-white)` | 반전 배경 위 텍스트 |
| `--text-inverse-muted` | `#C3C8D1` | 반전 배경 위 보조 텍스트 |
| `--text-brand` | `var(--global-color-blue-600)` | 브랜드 텍스트·아이콘 |
| `--border-default` | `var(--global-color-gray-200)` | 기본 테두리 |

### 5.4 Status

| 토큰 | 값 또는 참조 |
|---|---|
| `--status-danger` | `var(--global-color-red-600)` |
| `--status-success` | `var(--global-color-green-600)` |
| `--status-warning` | `var(--global-color-orange-600)` |
| `--status-success-bg` | `#eef8f1` |
| `--status-warning-bg` | `#fff5e8` |
| `--status-danger-bg` | `#fff0ef` |

상태 배경의 직접 색상값은 현재 공식 값으로 유지한다. 향후 동일 값이 다른 역할에서도 반복될 때 Primitive 승격을 검토한다.

### 5.5 확장 색상과 gradient

아래 토큰은 현재 `:root`에 있지만 역할이 특정 화면 또는 컴포넌트에 가깝다. 1단계에서는 이름과 값을 유지하며, 후속 단계에서 Component scope 이동 여부를 검토한다.

| 토큰 | 값 또는 참조 |
|---|---|
| `--color-hero-quick-accent` | `#a9ddff` |
| `--color-inverse-info-accent` | `#a8d8f4` |
| `--color-brand-accent` | `#59b7ed` |
| `--gradient-brand-symbol-end` | `#31a9d8` |
| `--quick-guide-booking-accent` | `#0b5fc1` |
| `--quick-guide-lost-accent` | `#244b9d` |
| `--quick-guide-phone-accent` | `#102e63` |
| `--gradient-hero-quick-start` | `#003060` |
| `--gradient-hero-quick-mid` | `#004890` |
| `--gradient-hero-quick-end` | `#18789a` |
| `--gradient-terminal-guide-start` | `#3F51B5` |
| `--gradient-terminal-guide-end` | `#007fb9` |
| `--showcase-bg` | `#081321` |
| `--showcase-card-bg` | `#12263d` |
| `--portal-guide-showcase-eyebrow-color` | `var(--color-brand-focus)` |

### 5.6 Weather metric aliases

다음 토큰은 모두 현재 `var(--text-brand)`를 참조한다.

- `--weather-metric-direction`
- `--weather-metric-temperature`
- `--weather-metric-wind`
- `--weather-metric-rain`
- `--weather-metric-wave`
- `--weather-metric-visibility`
- `--weather-metric-swell`
- `--weather-metric-pressure`

각 토큰은 값이 같더라도 날씨 지표별 의미 alias로 유지한다. 향후 지표별 색상을 다시 분리할 수 있기 때문이다.

### 5.7 Brand overlay

모든 brand overlay는 `--color-brand-rgb`에서 파생된다.

| 토큰 | alpha |
|---|---:|
| `--brand-overlay-faint` | `.04` |
| `--brand-overlay-faint-hover` | `.05` |
| `--brand-overlay-primary` | `.08` |
| `--brand-overlay-subtle` | `.09` |
| `--brand-overlay-pill` | `.10` |
| `--brand-overlay-hover` | `.14` |
| `--brand-overlay-showcase` | `.20` |
| `--brand-overlay-medium` | `.22` |
| `--brand-overlay-active` | `.24` |
| `--brand-overlay-focus` | `.28` |
| `--brand-overlay-strong` | `.34` |
| `--brand-overlay-border` | `.35` |
| `--brand-overlay-ring` | `.42` |
| `--brand-overlay-photo-focus` | `.50` |

`--brand-control-hover-bg`는 흰색 표면인 `var(--global-color-white)`를 사용한다.

### 5.8 Inverse 계열

Inverse 계열은 `--text-inverse`와 `transparent`를 `color-mix()`로 합성한다.

| 역할 | 토큰과 비율 |
|---|---|
| Border | `--inverse-border-subtle` 18%, `--inverse-border-medium` 24%, `--inverse-border-divider` 34%, `--inverse-border-hover` 36%, `--inverse-border-strong` 38%, `--inverse-border-hero` 42%, `--inverse-border-accent` 50%, `--inverse-border-select-focus` 64% |
| Arrow | `--inverse-arrow-accent` 58% |
| Text | `--inverse-text-subtle` 62%, `--inverse-text-soft` 68%, `--inverse-text-muted` 70%, `--inverse-text-muted-strong` 72%, `--inverse-text-body` 76%, `--inverse-text-body-strong` 78%, `--inverse-text-strong` 82%, `--inverse-text-hero` 84% |
| Link·focus·nav | `--inverse-link-strong` 90%, `--inverse-focus-strong` 92%, `--inverse-nav-strong` 94% |

### 5.9 Shadow color와 scrim

다음 토큰은 `--text-strong`과 `transparent`를 `color-mix()`로 합성한다.

| 그룹 | 토큰과 비율 |
|---|---|
| Shadow | `--shadow-extra-subtle` 4%, `--shadow-table-row` 5%, `--shadow-subtle` 6%, `--shadow-map-soft` 8%, `--shadow-lg-color` 9%, `--shadow-marker` 11%, `--shadow-medium` 14%, `--shadow-panel` 16%, `--shadow-dot` 18%, `--shadow-focus` 20%, `--shadow-strong` 22%, `--shadow-text` 24% |
| Border | `--strong-border-subtle` 12% |
| Scrim | `--scrim-light` 46%, `--scrim-medium` 67%, `--scrim-heavy` 84% |

## 6. Layout와 typography 역할 토큰

### 6.1 Layout

| 토큰 | 값 또는 참조 |
|---|---|
| `--layout-container-max` | `1280px` |
| `--layout-section-padding` | `var(--global-spacing-section)` |

### 6.2 Typography

| 토큰 | 값 또는 참조 |
|---|---|
| `--font-hero` | `clamp(38px, 4.2vw, 52px)` |
| `--font-display` | `32px` |
| `--font-h1` | `clamp(40px, 3.2vw, 44px)` |
| `--font-h2` | `24px` |
| `--font-h3` | `20px` |
| `--font-body-lg` | `18px` |
| `--font-body` | `16px` |
| `--font-small` | `13px` |
| `--font-caption` | `13px` |
| `--font-compact-description` | `14px` |
| `--font-button` | `14px` |
| `--font-home-notice-date` | `15px` |
| `--font-photo-card-title` | `clamp(20px, 1.5vw, 23px)` |
| `--font-quick-guide-description` | `15px` |
| `--font-quick-guide-feature-title` | `23px` |
| `--font-showcase-eyebrow` | `12px` |
| `--font-showcase-title` | `clamp(32px, 4vw, 50px)` |
| `--font-showcase-card-title` | `clamp(19px, 1.5vw, 23px)` |
| `--font-showcase-arrow` | `15px` |
| `--font-subpage-title` | `clamp(38px, 3.2vw, 52px)` |
| `--font-subpage-title-mobile` | `clamp(32px, 9vw, 40px)` |
| `--font-subhero-title-mobile` | `clamp(var(--font-h2), 8vw, var(--font-display))` |
| `--font-card-title-lg` | `28px` |
| `--font-metric-label` | `15px` |
| `--font-metric-value` | `22px` |
| `--font-metric-secondary` | `14px` |
| `--font-hero-quick-label` | `12px` |
| `--font-hero-quick-list-description` | `12px` |
| `--font-hero-quick-title-mobile` | `21px` |
| `--font-hero-quick-description-mobile` | `12px` |
| `--font-hero-quick-list-title-mobile` | `15px` |
| `--font-hero-service-card-description-mobile` | `12px` |

의미 alias:

| 토큰 | 참조 |
|---|---|
| `--font-display-title` | `var(--font-display)` |
| `--font-page-title` | `var(--font-h1)` |
| `--font-section-title` | `var(--font-h1)` |
| `--font-subsection-title` | `var(--font-h2)` |
| `--font-card-title` | `var(--font-h3)` |

`--font-small`과 `--font-caption`처럼 값이 같더라도 역할이 다른 토큰은 alias 의미를 유지한다.

## 7. 전역 Component 토큰

| 토큰 | 값 또는 참조 | 소유 컴포넌트 |
|---|---|---|
| `--portal-btn-radius` | `24px` | Portal button |
| `--portal-btn-height` | `44px` | Portal button |
| `--portal-btn-px` | `var(--spacing-16)` | Portal button |
| `--portal-pill-bg` | `var(--bg-muted)` | Portal pill |
| `--schedule-header-bg` | `var(--bg-inverse)` | Schedule |
| `--schedule-tab-width` | `144px` | Schedule tab |
| `--schedule-tab-text-active` | `var(--global-font-weight-bold)` | Schedule tab |
| `--section-title-weight` | `var(--global-font-weight-bold)` | Section title |
| `--section-title-gap` | `var(--spacing-32)` | Section title |
| `--section-eyebrow-gap` | `var(--spacing-8)` | Section title |
| `--section-eyebrow-spacing` | `2.5px` | Section title |
| `--portal-floating-quick-width` | `104px` | Floating quick |
| `--portal-floating-quick-link-height` | `76px` | Floating quick |
| `--portal-floating-quick-toggle-height` | `44px` | Floating quick |
| `--portal-floating-quick-collapsed-width` | `88px` | Floating quick |
| `--portal-floating-quick-mobile-top-size` | `56px` | Floating quick |
| `--portal-floating-quick-focus-width` | `3px` | Floating quick |
| `--portal-floating-quick-border-width` | `1px` | Floating quick |
| `--portal-floating-quick-icon-stroke` | `1.7` | Floating quick |

전역 Component 토큰은 여러 규칙 또는 breakpoint가 공유할 때 `:root`에 둔다. 한 컴포넌트 루트 안에서만 필요한 토큰은 가능한 한 해당 루트에 둔다.

## 8. Scoped Component 토큰

`:root` 밖의 custom property는 전역 API가 아니다. 해당 selector의 하위 요소와 명시된 variant·breakpoint에서만 유효하다.

| 소유 범위 | 대표 토큰 | 역할 |
|---|---|---|
| `.btn`과 크기 variant | `--btn-size`, `--btn-padding-inline` | 버튼 크기와 수평 여백 |
| `.status.*` | `--status-color` | 운항 상태별 색상 |
| `.portal-page` | `--portal-marker-*`, `--portal-map-*`, `--portal-panel-*`, `--portal-hero-*`, `--portal-content-*` | Portal 전반의 지도·패널·히어로 구성 |
| `.terminal-summary` | `--terminal-type-filter-*` | 터미널 타입 필터 |
| `.portal-hero-slide--*` | `--portal-hero-slide-overlay` | 슬라이드별 overlay |
| `.korea-map[data-zoom-region]` | `--portal-map-zoom-*`, `--portal-map-focus-marker-*` | 지역별 지도 위치 |
| `.portal-quick-guide-card--*` | `--quick-guide-*` | 퀵 가이드 카드 variant |

Scoped 토큰 규칙:

1. 동일 컴포넌트 내부에서만 소비한다.
2. 상태와 variant의 재정의는 기본 토큰 선언을 덮어쓰는 방식으로 작성한다.
3. breakpoint 재정의는 기본값과 같은 이름을 사용한다.
4. 다른 컴포넌트에서 공유하기 시작하면 Semantic 또는 전역 Component 토큰 승격을 검토한다.
5. 지역별 지도 좌표는 디자인 스케일 토큰으로 승격하지 않는다.

## 9. Alias 관계 명세

### 9.1 핵심 의존 그래프

```text
--global-color-white
  └─ --bg-base
       └─ --surface-base

--global-color-gray-050
  └─ --bg-subtle
       └─ --surface-subtle

--global-color-blue-050
  └─ --bg-muted
       └─ --surface-muted

--global-color-navy-900
  └─ --bg-inverse
       └─ --surface-inverse

--global-color-blue-600
  ├─ --color-brand
  │    └─ --action-primary
  └─ --text-brand

--global-color-blue-500
  └─ --color-brand-hover
       └─ --action-primary-hover

--global-color-blue-300
  └─ --color-brand-focus
       ├─ --focus-ring-brand
       └─ --portal-guide-showcase-eyebrow-color
```

### 9.2 Alias 작성 규칙

- alias에는 원본과 같은 직접 값을 다시 입력하지 않는다.
- alias는 반드시 `var(--source-token)` 형태로 원본을 참조한다.
- alias 자기 자신을 참조하지 않는다.
- Primitive alias가 Semantic 또는 Component 토큰을 참조하지 않도록 한다.
- 역할이 다른 토큰은 값이 같아도 자동 통합하지 않는다.
- `calc()`, `clamp()`, `color-mix()` 내부 참조는 단순 alias 교체와 분리해서 검토한다.

## 10. 1단계 마이그레이션 현황

아래 수치는 `common/style.css`에서 해당 새 alias를 `var()`로 직접 참조하는 횟수다.

| alias | 현재 직접 사용 |
|---|---:|
| `--global-space-24` | 2 |
| `--global-space-40` | 0 |
| `--global-space-64` | 1 |
| `--global-line-height-icon` | 2 |
| `--global-line-height-tight` | 51 |
| `--global-line-height-normal` | 102 |
| `--global-line-height-title-compact` | 1 |
| `--global-line-height-metric` | 1 |
| `--global-line-height-title-loose` | 2 |
| `--global-line-height-relaxed` | 3 |
| `--global-line-height-loose` | 1 |
| `--global-shadow-sm` | 0 |
| `--global-shadow-md` | 3 |
| `--global-shadow-lg` | 6 |
| `--surface-base` | 10 |
| `--surface-subtle` | 9 |
| `--surface-muted` | 5 |
| `--surface-inverse` | 5 |
| `--action-primary` | 0 |
| `--action-primary-hover` | 0 |
| `--focus-ring-brand` | 4 |
| `--portal-guide-showcase-eyebrow-color` | 1 |

사용 횟수 0은 미사용 또는 삭제 가능을 의미하지 않는다. 1단계에서는 alias 계약을 먼저 확정하고, 사용처 교체는 의미 검증 후 별도 작업으로 진행한다.

## 11. 신규 CSS 작성 규칙

1. 색상은 먼저 적절한 Semantic 토큰이 있는지 확인한다.
2. 일반 배경에는 `--surface-*`를 사용한다.
3. 텍스트에는 `--text-*`, action에는 `--action-*`, focus ring에는 `--focus-*`를 사용한다.
4. 간격·행간·shadow preset은 신규 코드에서 `--global-*` alias를 우선한다.
5. 기존 토큰을 새 alias로 교체할 때 계산값이 동일한지 확인한다.
6. 상태, variant, media query, shorthand와 복합식은 기본 규칙과 분리해 검토한다.
7. 컴포넌트 한정 값은 컴포넌트 접두사 또는 scoped custom property를 사용한다.
8. 직접 색상·간격·radius를 추가할 때 기존 스케일로 표현 가능한지 먼저 확인한다.
9. 토큰 삭제는 전체 CSS·HTML·JS 사용처 조사 후 별도 단계에서만 수행한다.

## 12. 변경 검증 체크리스트

토큰을 추가하거나 사용처를 교체할 때 다음을 확인한다.

- 원본과 alias의 최종 계산값이 같은가
- alias 참조가 순환하지 않는가
- 변경한 속성의 의미와 토큰 역할이 일치하는가
- 상태·variant·breakpoint의 계산 결과가 유지되는가
- shorthand 또는 복합식의 일부를 잘못 변경하지 않았는가
- 컴포넌트 전용 의미를 전역으로 넓히지 않았는가
- CSS 구조 검사가 통과하는가
- `git diff --check`가 통과하는가
- 요청 범위 밖 파일과 기존 작업 트리 변경이 보존되었는가

## 13. 백업 CSS 비교 원칙

`common/style.backup-20260921.css`는 비교용 스냅샷이다. 현재 서비스 CSS의 `:root` 토큰은 235개, 백업의 `:root` 토큰은 195개다. 현재 파일에는 spacing, line-height, shadow, surface, action, focus alias와 floating quick Component 토큰 등이 추가되어 있다.

백업에만 있거나 백업과 값이 다른 선언을 현재 명세로 복원하지 않는다. 변경 이력을 확인할 때만 참고하고, 실제 구현과 문서 값은 `common/style.css`를 따른다.

## 14. 유지보수 원칙

- 이 문서는 토큰 선언 또는 alias 관계가 변경되는 작업과 함께 갱신한다.
- 단순 CSS 사용처 변경으로 토큰 계약이 달라지지 않으면 사용 횟수 표만 필요에 따라 갱신한다.
- 토큰 이름, 값 또는 계층을 변경할 때는 deprecated 기간과 교체 대상을 먼저 문서화한다.
- Primitive, Semantic, Component 계층을 동시에 변경하는 대규모 치환은 피하고 단계별로 검증한다.

## 15. Breakpoint 영향도 분석

> 이 절은 2026-09-30 당시의 migration 분석 기록이다. 이후 breakpoint 통합과 모바일 내비게이션 보정으로 블록 수와 라인이 변경되었으며, 현재 기준선은 29절을 따른다.

### 15.1 분석 범위와 기준

이 절은 디자인 토큰 마이그레이션 3단계를 위한 breakpoint 영향도 분석이다. 분석 대상은 다음 네 media query의 실제 서비스 규칙이다.

- `@media (max-width: 700px)`
- `@media (max-width: 760px)`
- `@media (max-width: 1000px)`
- `@media (max-width: 1023px)`

조사 대상은 surface, spacing, line-height, shadow와 color·focus 원본 토큰 및 대응 alias의 `var()` 직접 참조다. 백업 CSS는 집계에서 제외했다.

이 분석에서 `background`, `padding`, `margin`, `gap`, `flex`, `border`는 shorthand로 취급한다. shorthand 안의 원본 토큰은 계산값이 같더라도 즉시 교체 후보에서 제외한다.

### 15.2 Breakpoint 구성과 겹침

| breakpoint | 실제 viewport 범위 | block 수 | CSS block 위치 |
|---|---|---:|---|
| `max-width: 700px` | 0–700px | 24 | 2376–2702, 3032–3051, 3313–3357, 3371–3379, 3975–4042, 4506–4566, 4943–5045, 5300–5333, 6041–6057, 7111–7119, 7357–7389, 7453–7551, 9276–9284, 9455–9496, 9782–9790, 9801–9807, 9992–10066, 10176–10199, 10341–10449, 10662–10669, 11306–11346, 11410–11515, 11556–11571, 11878–11988 |
| `max-width: 760px` | 0–760px | 13 | 879–884, 3026–3030, 8030–8070, 8188–8201, 8229–8233, 9623–9627, 10833–10844, 10858–10879, 11056–11084, 12267–12598, 12793–12835, 13006–13024, 13082–13095 |
| `max-width: 1000px` | 0–1000px | 12 | 2312–2371, 3291–3308, 4886–4894, 5721–5738, 6529–6540, 7428–7448, 8021–8025, 9983–9987, 11045–11054, 12776–12791, 12981–13004, 13716–13765 |
| `max-width: 1023px` | 0–1023px | 4 | 2297–2307, 3757–3775, 9300–9441, 13112–13521 |

Syntactic nested media query는 없다. 다음과 같은 결합 조건은 별도 media block이며 중첩 문법이 아니다.

- `min-width: 701px and max-width: 1000px`
- `min-width: 371px and max-width: 700px`
- `min-width: 480px and max-width: 700px`
- `max-width: 1023px and prefers-reduced-motion: reduce`

Viewport별 활성 범위는 다음과 같다.

| viewport | 동시에 활성화되는 대상 breakpoint |
|---|---|
| 0–700px | 700, 760, 1000, 1023 모두 활성화 |
| 701–760px | 760, 1000, 1023 활성화 |
| 761–1000px | 1000, 1023 활성화 |
| 1001–1023px | 1023만 활성화 |

Media query 자체는 선택자 specificity를 높이지 않는다. 같은 선택자와 속성이면 기본 규칙과 동일 specificity로 나중에 선언된 media 규칙이 이긴다. 상태 pseudo-class와 상태·variant class가 결합된 규칙은 기본 규칙보다 specificity가 높다.

대상 토큰 사용처 중 서로 다른 대상 breakpoint에서 같은 선택자·속성을 다시 선언한 경우는 없다. 따라서 이번 조사 범위에서는 breakpoint 사이 토큰 선언이 직접 충돌하지 않는다. 다만 700px 이하에서는 네 breakpoint가 모두 활성화되므로 대상 밖의 다른 속성은 기존 CSS 소스 순서에 계속 의존한다.

### 15.3 Token 사용 집계

| breakpoint | 전체 | 원본 참조 | 이미 alias | Surface 원본 | Spacing 원본 | Line-height 원본 | Line-height alias | Shadow alias |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 700px | 28 | 23 | 5 | 8 | 14 | 1 | 5 | 0 |
| 760px | 22 | 14 | 8 | 4 | 3 | 7 | 8 | 0 |
| 1000px | 5 | 4 | 1 | 2 | 2 | 0 | 0 | 1 |
| 1023px | 6 | 4 | 2 | 4 | 0 | 0 | 2 | 0 |
| 합계 | 61 | 45 | 16 | 18 | 19 | 8 | 15 | 1 |

다음 토큰은 대상 breakpoint 안에서 직접 사용되지 않는다.

- `--bg-muted`
- 원본 `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--global-shadow-sm`, `--global-shadow-md`
- `--color-brand-focus`
- `--global-color-blue-300`
- `--focus-ring-brand`

`--global-shadow-lg`는 1000px breakpoint의 hover 상태에서 이미 사용되고 있다.

### 15.4 계산값과 scope 검증

| 원본 | alias | 원본 계산값 | alias 계산값 | fallback | scoped 재정의 |
|---|---|---|---|---|---|
| `--bg-base` | `--surface-base` | `#FFFFFF` | `#FFFFFF` | 없음 | 없음 |
| `--bg-subtle` | `--surface-subtle` | `#F4F7FB` | `#F4F7FB` | 없음 | 없음 |
| `--bg-muted` | `--surface-muted` | `#EDF2FA` | `#EDF2FA` | 없음 | 없음 |
| `--bg-inverse` | `--surface-inverse` | `#0B284A` | `#0B284A` | 없음 | 없음 |
| `--spacing-24` | `--global-space-24` | `24px` | `24px` | 없음 | 없음 |
| `--spacing-40` | `--global-space-40` | `40px` | `40px` | 없음 | 없음 |
| `--spacing-64` | `--global-space-64` | `64px` | `64px` | 없음 | 없음 |
| `--line-height-icon` | `--global-line-height-icon` | `1` | `1` | 없음 | 없음 |
| `--line-height-title-compact` | `--global-line-height-title-compact` | `1.2` | `1.2` | 없음 | 없음 |
| `--line-height-title-loose` | `--global-line-height-title-loose` | `1.4` | `1.4` | 없음 | 없음 |
| `--shadow-lg` | `--global-shadow-lg` | `0 12px 32px var(--shadow-lg-color)` | 동일 | 없음 | 없음 |
| `--color-brand-focus` | `--focus-ring-brand` | `#77b9e8` | `#77b9e8` | 없음 | 없음 |

원본 및 alias 토큰 자체의 지역 scope 재정의는 없다. 예외적으로 Semantic 토큰 `--global-spacing-section-tight`는 700px 이하에서 `--spacing-40`으로 재정의된다. 이는 원본 spacing 토큰의 재정의가 아니라 해당 Semantic 토큰의 반응형 override다.

### 15.5 `max-width: 700px` 상세

| breakpoint | 실제 범위 | 선택자 | 속성 | 원본 토큰 | alias 후보 | 기본 규칙 위치 | override 여부 | 상태·variant | 계산값 변경 | 영향도 | 권장 조치 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 700px | 0–700px | L2379 `:root` | `--global-spacing-section-tight` | `--spacing-40` | `--global-space-40` | L119, 기본값 `--global-space-64` | 예, 64px→40px | 없음 | 없음 | 보통 | alias 교체 후 section 간격 회귀 확인 |
| 700px | 0–700px | L2533 `.mobile-table--stacked tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 보류 | background shorthand이므로 별도 검토 |
| 700px | 0–700px | L2558 `.mobile-table--stacked td::before` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 700px | 0–700px | L2606 `.guide-page-hero` | `padding` | `--spacing-40` | `--global-space-40` | L1857 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L2693 `.terminal-grid` | `gap` | `--spacing-24` | `--global-space-24` | L2230, 40px | 예 | 없음 | 없음 | 보류 | gap shorthand 유지 |
| 700px | 0–700px | L3043 `.portal-map-page .region-quick-btn` | `--btn-padding-inline` | `--spacing-24` | `--global-space-24` | L559 `.btn`, 16px | Component override | 없음 | 없음 | 보통 | 버튼 너비·선택 상태와 함께 검증 |
| 700px | 0–700px | L6047 `.site-footer-main` | `gap` | `--spacing-24` | `--global-space-24` | 동일 속성 기본 규칙 없음 | 모바일 전용 | 없음 | 없음 | 보류 | gap shorthand 유지 |
| 700px | 0–700px | L6048 `.site-footer-main` | `padding` | `--spacing-24` | `--global-space-24` | L5915 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L7366 `.portal-faq-list summary` | `padding` | `--spacing-40` | `--global-space-40` | L7251 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L7498 `.portal-split-guide` | `gap` | `--spacing-24` | `--global-space-24` | L6750, 64px | 예 | 없음 | 없음 | 보류 | gap shorthand 유지 |
| 700px | 0–700px | L7501 `.portal-check-panel` | `padding` | `--spacing-24` | `--global-space-24` | 기본 컴포넌트 규칙 존재 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L7504 `.portal-action-band` | `padding` | `--spacing-24` | `--global-space-24` | L7401 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L7546 `.portal-hero-quick small` | `line-height` | `--line-height-title-loose` | `--global-line-height-title-loose` | L5668, `--global-line-height-normal` | 예, 1.5→1.4 | 없음 | 없음 | 낮음 | 교체 권장 |
| 700px | 0–700px | L10040 `.id-guide-matrix tbody tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L10050 `.id-guide-matrix tbody th` | `background` | `--bg-subtle` | `--surface-subtle` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L10190 `.portal-vehicle-checklist ul` | `padding` | `--spacing-24` | `--global-space-24` | L6927 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L10381 `.portal-notice-table-wrap .portal-notice-table-body tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L10387 `.portal-notice-page … tr:focus-within` | `background` | `--bg-subtle` | `--surface-subtle` | 동일 desktop 규칙 없음 | 모바일 전용 | `:focus-within` | 없음 | 높음 | 상태 규칙으로 분리 유지 |
| 700px | 0–700px | L10424 `.portal-notice-table-title a` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 700px | 0–700px | L11433 `.portal-terminal-directory-table-wrap … tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L11487 `.portal-terminal-directory-mobile-heading strong` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 700px | 0–700px | L11494 `.portal-terminal-directory-mobile-info p` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 700px | 0–700px | L11887 `.portal-weather-advisory-item h3` | `padding` | `--spacing-64` | `--global-space-64` | L11665 | 예, 마지막 inset만 변경 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 700px | 0–700px | L11907 `.portal-weather-advisory-item .mobile-table--card tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L11919 `.portal-weather-advisory-item .mobile-table--card td` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 모바일 카드 전용 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 700px | 0–700px | L11921 `.portal-weather-advisory-item .mobile-table--card td` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 규칙 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 700px | 0–700px | L11979 `.portal-weather-metric-icon svg` | `width` | `--spacing-24` | `--global-space-24` | L11782, 38px | 예, 38px→24px | 없음 | 없음 | 낮음 | 교체 권장, 기본 SVG 크기 확인 |
| 700px | 0–700px | L11980 `.portal-weather-metric-icon svg` | `height` | `--spacing-24` | `--global-space-24` | L11783, 38px | 예, 38px→24px | 없음 | 없음 | 낮음 | 교체 권장, 기본 SVG 크기 확인 |

### 15.6 `max-width: 760px` 상세

| breakpoint | 실제 범위 | 선택자 | 속성 | 원본 토큰 | alias 후보 | 기본 규칙 위치 | override 여부 | 상태·variant | 계산값 변경 | 영향도 | 권장 조치 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 760px | 0–760px | L8045 `.portal-booking-card` | `padding` | `--spacing-24` | `--global-space-24` | 기본 카드 규칙 존재 | 예 | 없음 | 없음 | 보류 | 다중값 shorthand 유지 |
| 760px | 0–760px | L8199 `.portal-guide-item--photo .portal-guide-copy` | `padding` | `--spacing-24` | `--global-space-24` | L8145 | 예 | photo variant | 없음 | 높음 | variant·shorthand 분리 검토 |
| 760px | 0–760px | L10864 `.portal-guide-grid` | `gap` | `--spacing-24` | `--global-space-24` | 동일 토큰 기본 규칙 없음 | 모바일 override | 없음 | 없음 | 보류 | gap shorthand 유지 |
| 760px | 0–760px | L12303 `.portal-operation-table tbody tr` | `background` | `--bg-base` | `--surface-base` | 동일 desktop 규칙 없음 | 카드 전환 규칙 | 없음 | 없음 | 보류 | background shorthand 유지 |
| 760px | 0–760px | L12307 `.portal-operation-table tbody tr:hover td` | `background` | `--bg-base` | `--surface-base` | L12144, `--bg-subtle` | 예 | `:hover` | 없음 | 높음 | 상태 규칙으로 분리 유지 |
| 760px | 0–760px | L12328 `.portal-operation-table tbody td::before` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12386 `.portal-operation-card__identity>span` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12392 `.portal-operation-card__identity h3` | `line-height` | alias 사용: `--global-line-height-tight` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12399 `.portal-operation-card__header .portal-operation-status` | `background` | `--bg-subtle` | `--surface-subtle` | 동일 desktop 선언 없음 | 모바일 상태 표시 | status variant | 없음 | 높음 | 상태·background shorthand 유지 |
| 760px | 0–760px | L12425 `.portal-operation-card__route>span` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12428 `.portal-operation-card__time time` | `color` | `--bg-inverse` | 없음 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 해당 없음 | 제외 | 비배경이므로 surface alias 금지 |
| 760px | 0–760px | L12431 `.portal-operation-card__time time` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12440 `.portal-operation-card__route strong` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12465 `.portal-operation-card__meta dt` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12471 `.portal-operation-card__meta dd` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12491 `.portal-operation-card__departure-time time` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 후속 교체 가능 |
| 760px | 0–760px | L12508 `.portal-operation-card__heading>span` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12535 `.portal-operation-card__operation>p` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12560 `.portal-operation-card__result` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L12574 `.portal-operation-card__result>i` | `line-height` | `--line-height-icon` | `--global-line-height-icon` | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 교체 권장 |
| 760px | 0–760px | L12595 `.portal-operation-card__reason` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |
| 760px | 0–760px | L13017 `.portal-hero-service-card strong` | `line-height` | alias 사용: `--global-line-height-tight` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 override | 없음 | 없음 | 낮음 | 유지 |

### 15.7 `max-width: 1000px` 상세

| breakpoint | 실제 범위 | 선택자 | 속성 | 원본 토큰 | alias 후보 | 기본 규칙 위치 | override 여부 | 상태·variant | 계산값 변경 | 영향도 | 권장 조치 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1000px | 0–1000px | L2340 `.terminal-guide-card` | `padding` | `--spacing-24` | `--global-space-24` | L1556, 같은 24px | 중복 override | 없음 | 없음 | 보류 | shorthand이며 중복 선언이므로 유지 |
| 1000px | 0–1000px | L11048 `.portal-guide-showcase-grid` | `gap` | `--spacing-24` | `--global-space-24` | 동일 토큰 기본 규칙 없음 | 모바일 override | 없음 | 없음 | 보류 | gap shorthand 유지 |
| 1000px | 0–1000px | L13761 `.portal-floating-quick__top:hover` | `background` | `--bg-base` | `--surface-base` | 기본 top 규칙 존재 | 상태 override | `:hover` | 없음 | 높음 | 상태·background shorthand 유지 |
| 1000px | 0–1000px | L13762 `.portal-floating-quick__top:hover` | `color` | `--bg-inverse` | 없음 | 기본 top 규칙 존재 | 상태 override | `:hover` | 해당 없음 | 제외 | 비배경이므로 surface alias 금지 |
| 1000px | 0–1000px | L13763 `.portal-floating-quick__top:hover` | `box-shadow` | alias 사용: `--global-shadow-lg` | 적용 완료 | 기본 top 규칙 존재 | 상태 override | `:hover` | 없음 | 높음 | 이미 alias, 상태 시각 회귀만 유지 확인 |

### 15.8 `max-width: 1023px` 상세

| breakpoint | 실제 범위 | 선택자 | 속성 | 원본 토큰 | alias 후보 | 기본 규칙 위치 | override 여부 | 상태·variant | 계산값 변경 | 영향도 | 권장 조치 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1023px | 0–1023px | L9321 `.portal-subpage .site-header.scrolled` | `background` | `--bg-base` | `--surface-base` | L8375 scrolled header 계열 | 태블릿 override | `.scrolled` | 없음 | 높음 | 상태·background shorthand 유지 |
| 1023px | 0–1023px | L9322 `.portal-subpage .site-header.scrolled` | `color` | `--bg-inverse` | 없음 | scrolled header 계열 | 태블릿 override | `.scrolled` | 해당 없음 | 제외 | 비배경이므로 surface alias 금지 |
| 1023px | 0–1023px | L9363 `.portal-page .site-header .menu-button` | `color` | `--bg-inverse` | 없음 | 기본 menu button 규칙 존재 | 태블릿 override | 없음 | 해당 없음 | 제외 | 비배경이므로 surface alias 금지 |
| 1023px | 0–1023px | L9398 `.portal-subnav-bar` | `background` | `--bg-base` | `--surface-base` | 기본 subnav 규칙 존재 | 태블릿 override | 없음 | 없음 | 보류 | background shorthand 유지 |
| 1023px | 0–1023px | L13283 `.mobile-terminal-menu .terminal-switcher-disabled` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | disabled variant | 없음 | 높음 | 이미 alias, disabled 레이아웃 유지 |
| 1023px | 0–1023px | L13453 `.mobile-menu-utility a` | `line-height` | alias 사용: `--global-line-height-normal` | 적용 완료 | 동일 desktop 선언 없음 | 모바일 전용 | 없음 | 없음 | 낮음 | 유지 |

### 15.9 상태·variant 결합 요약

대상 토큰 사용처에서 확인된 상태·variant 결합은 다음과 같다.

| 위치 | breakpoint | 상태·variant | 토큰 | 조치 |
|---|---|---|---|---|
| L10387 | 700px | `:focus-within` | `--bg-subtle` | 기본 배경 사용처와 분리 유지 |
| L8199 | 760px | photo variant | `--spacing-24` | shorthand와 함께 별도 검토 |
| L12307 | 760px | `:hover` | `--bg-base` | hover 상태 회귀 검증 전 유지 |
| L12399 | 760px | status component | `--bg-subtle` | 상태 의미 확인 후 변경 |
| L13761–13763 | 1000px | `:hover` | `--bg-base`, `--bg-inverse`, `--global-shadow-lg` | surface·text·shadow 역할을 분리 유지 |
| L9321–9322 | 1023px | `.scrolled` | `--bg-base`, `--bg-inverse` | scrolled header 상태로 별도 검토 |
| L13283 | 1023px | disabled variant | `--global-line-height-normal` | 이미 alias, 유지 |

대상 토큰과 결합된 `:focus-visible`, `:active`, `.is-open`, `.is-collapsed`, `.is-selected`, `:has()` 사용처는 네 breakpoint 안에서 발견되지 않았다. 대상 사용처의 `!important` 선언도 0개다.

### 15.10 안전한 다음 교체 후보

다음 10곳은 media query 내부이지만 단순 단일 토큰 참조이고, shorthand·상태·variant와 결합되지 않으며 alias 계산값과 scope가 동일하다.

| 파일 | 실제 라인 | breakpoint | 선택자 | 속성 | 원본 토큰 | alias | 영향도 | 변경 권장 이유 | 함께 검증할 기본 규칙 |
|---|---:|---|---|---|---|---|---|---|---|
| `common/style.css` | 2379 | 700px | `:root` | `--global-spacing-section-tight` | `--spacing-40` | `--global-space-40` | 보통 | 40px 계산값 동일, 반응형 Semantic override 관계 명확 | L119 기본 64px와 L7549 등 소비 규칙 |
| `common/style.css` | 7546 | 700px | `.portal-hero-quick small` | `line-height` | `--line-height-title-loose` | `--global-line-height-title-loose` | 낮음 | 1.4 계산값 동일, 같은 속성의 명확한 mobile override | L5668 기본 `--global-line-height-normal` |
| `common/style.css` | 11979 | 700px | `.portal-weather-metric-icon svg` | `width` | `--spacing-24` | `--global-space-24` | 낮음 | 단일 장축 속성, 24px 동일 | L11782 기본 width 38px |
| `common/style.css` | 11980 | 700px | `.portal-weather-metric-icon svg` | `height` | `--spacing-24` | `--global-space-24` | 낮음 | 단일 장축 속성, 24px 동일 | L11783 기본 height 38px |
| `common/style.css` | 12328 | 760px | `.portal-operation-table tbody td::before` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 낮음 | 모바일 전용 단일 속성, 1.2 동일 | 모바일 table-to-card 전환 규칙 |
| `common/style.css` | 12386 | 760px | `.portal-operation-card__identity>span` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 낮음 | 모바일 전용 단일 속성, 1.2 동일 | operation card identity typography |
| `common/style.css` | 12425 | 760px | `.portal-operation-card__route>span` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 낮음 | 모바일 전용 단일 속성, 1.2 동일 | operation card route typography |
| `common/style.css` | 12431 | 760px | `.portal-operation-card__time time` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 낮음 | 모바일 전용 단일 속성, 1.2 동일 | operation card time typography |
| `common/style.css` | 12465 | 760px | `.portal-operation-card__meta dt` | `line-height` | `--line-height-title-compact` | `--global-line-height-title-compact` | 낮음 | 모바일 전용 단일 속성, 1.2 동일 | operation card meta typography |
| `common/style.css` | 12574 | 760px | `.portal-operation-card__result>i` | `line-height` | `--line-height-icon` | `--global-line-height-icon` | 낮음 | 모바일 전용 단일 속성, 값 1 동일 | operation result separator alignment |

L12491의 `.portal-operation-card__departure-time time`도 동일한 저위험 조건을 만족하지만 후보 수 제한 때문에 다음 묶음으로 남긴다.

### 15.11 다음 실행 단계 권장 범위

1. 먼저 15.10의 line-height와 SVG 장축 속성 후보를 교체한다.
2. `--global-spacing-section-tight` 반응형 override는 소비 규칙의 section 간격을 함께 확인한다.
3. `background`와 spacing shorthand는 별도 단계로 유지한다.
4. hover, focus-within, scrolled, disabled 및 Component variant는 기본 규칙과 분리해서 검증한다.
5. 비배경 `color: var(--bg-inverse)` 사용처는 surface alias로 교체하지 않고 향후 inverse text 토큰 대상으로 분석한다.
6. 이미 global line-height·shadow alias를 사용하는 16곳은 추가 변경하지 않는다.

## 16. 구형 `.button` 시스템 전환 영향도 분석

### 16.1 분석 범위와 결론

- 실제 서비스 CSS: `common/style.css`
- 사용처 조사: 프로젝트의 HTML·JS 전체. 백업 JS와 브라우저 검증 캐시는 서비스 사용처에서 제외했다.
- 조사 시점 기준 `.button`, `.button-primary`, `.button-outline`의 HTML·JS 직접 참조는 각각 0건이다.
- 세 클래스는 CSS 선언만 남은 미사용 레거시 후보이며, 현재 저장소 안에는 `.btn`으로 치환할 실제 마크업 대상이 없다.
- 시각·상태 모델이 `.btn.btn--lg`와 같지 않으므로 클래스 이름만 직접 치환하는 방식은 안전하지 않다.
- 다음 실행 단계에서는 우선 deprecated로 표시하고 신규 사용을 금지한다. CSS 삭제는 외부 CMS, 서버 템플릿 또는 저장소 밖에서 주입되는 마크업이 없음을 확인한 뒤 별도 작업으로 수행한다.

### 16.2 선언과 사용 현황

| 위치 | 선택자 | 역할 | HTML·JS 사용 횟수 | 상태 |
|---|---|---|---:|---|
| `common/style.css:715` | `.button` | 구형 공통 버튼 기반 | 0 | deprecated 후보 |
| `common/style.css:731` | `.button:hover` | 모든 구형 버튼의 이동·shadow | 0 | deprecated 후보 |
| `common/style.css:736` | `.button-primary` | 흰 배경·inverse text variant | 0 | deprecated 후보 |
| `common/style.css:741` | `.button-outline` | navy outline variant | 0 | deprecated 후보 |
| `common/style.css:750` | `.button-outline:hover` | navy 채움 hover | 0 | `.quick-card:hover`와 그룹 선택자 공유 |
| `common/style.css:2418` | `.button` | 700px 이하 `width: 100%` | 0 | deprecated 후보 |

`.button-outline:hover`는 `.quick-card:hover`와 한 규칙으로 합쳐져 있다. 향후 `.button-outline:hover`를 제거하더라도 `.quick-card:hover`의 배경과 text color 선언은 반드시 보존해야 한다.

### 16.3 `.button`과 `.btn.btn--lg` 계산값 비교

| 항목 | `.button` | `.btn.btn--lg` | 일치 여부 | 전환 영향 |
|---|---|---|---|---|
| display·정렬 | `inline-flex`, 가운데 정렬 | 동일 | 일치 | 공통화 가능 |
| gap | 8px | 8px | 일치 | 공통화 가능 |
| 높이 | `min-height: 56px`, 명시적 height 없음 | `height`와 `min-height` 모두 56px | 불일치 | 긴 문구·줄바꿈 시 확장 방식 차이 |
| 좌우 padding | 24px | 24px | 일치 | 공통화 가능 |
| border 폭 | 2px | 1px | 불일치 | 박스 내부 크기와 윤곽 두께 변화 |
| radius | 8px | 8px | 일치 | 공통화 가능 |
| desktop 글자 | `--font-body`, 16px | `--font-body-lg`, 18px | 불일치 | 직접 치환 시 2px 증가 |
| 700px 이하 글자 | `--font-body`, 15px | `--font-body-lg`, 18px | 불일치 | 모바일에서 3px 증가 |
| font-weight | 500 | 500 | 일치 | 공통화 가능 |
| line-height | 1.5 | 1.5 | 일치 | 공통화 가능 |
| white-space | 별도 제한 없음 | `nowrap` | 불일치 | 좁은 폭에서 wrapping 동작 변화 |
| 기본 너비 | content 기반 | content 기반 | 실질 일치 | 기본 상태 영향 낮음 |
| 700px 이하 너비 | `width: 100%` | 별도 전체 너비 규칙 없음 | 불일치 | 모바일 CTA 폭 변화 |
| transition | transform·shadow·background, 180ms | border·background-color·color·transform, 150ms | 불일치 | 속성·시간 차이 |
| hover motion | `translateY(-2px)`와 직접 shadow | 기본 `.btn`에는 공통 이동 없음 | 불일치 | 상호작용 인상 변화 |
| focus-visible | 전역 3px `--focus-ring-brand` 적용 | `.btn` 전용 2px `--color-brand-hover` 적용 | 불일치 | outline 색상·두께·offset 변화 |
| disabled | 전용 규칙 없음, hover 차단 없음 | opacity·금지 cursor·variant hover 차단 | 불일치 | 동작과 접근성 변화 |
| selected 상태 | 없음 | pressed·selected·current 상태 제공 | 불일치 | 상태 모델이 다름 |

높이 56px과 좌우 padding 24px의 최종 숫자는 같지만, `.button`은 최소 높이만 지정하고 `.btn.btn--lg`는 고정 height와 `white-space: nowrap`을 함께 적용한다. 숫자가 같다는 이유로 동일 레이아웃으로 분류하지 않는다.

### 16.4 Variant 대응 관계

| 구형 조합 | 가장 가까운 새 조합 | 직접 치환 | 차이와 필요한 조치 |
|---|---|---|---|
| `.button` | `.btn.btn--lg` | 불가 | border 2px, 16px 글자, wrapping, hover motion, 모바일 full width 보존용 호환 modifier 필요 |
| `.button.button-primary` | 정확한 기존 조합 없음 | 불가 | 구형은 흰 배경과 navy text이며 `.btn--solid`의 brand 배경과 의미·색상이 반대임 |
| `.button.button-outline` | `.btn.btn--lg.btn--outline` | 불가 | 기본 border·text 색, border 폭, hover navy 채움, motion·shadow가 모두 다름 |

`.button-primary`를 `.btn--solid`로 매핑하면 흰 배경에서 brand 배경으로 바뀐다. `.button-outline`을 `.btn--outline`로 매핑하면 navy 2px 윤곽이 gray 1px 윤곽으로 바뀌고 hover 색상도 달라진다. 두 variant 모두 기존 `.btn` variant와 의미상 1:1 대응하지 않는다.

### 16.5 상태와 breakpoint 영향

| 범위 | 규칙 | 영향도 | 판단 |
|---|---|---|---|
| 기본 | `.button:hover` | 높음 | 모든 legacy variant에 이동과 shadow를 무조건 적용하며 `:disabled` 예외가 없음 |
| 기본 | `.button-outline:hover` | 높음 | `.quick-card:hover`와 선언을 공유하므로 선택자 단위 삭제 필요 |
| 기본 | 전역 `:focus-visible` | 보통 | legacy는 전역 focus ring을 사용하지만 `.btn`은 더 구체적인 전용 outline을 사용함 |
| `max-width: 700px` | `.button { width: 100%; }` | 높음 | `.btn.btn--lg`로 바꾸면 별도 full-width modifier 없이는 폭이 줄어듦 |
| `max-width: 700px` | `--font-body: 15px` | 보통 | legacy 글자는 15px이 되지만 `.btn--lg`는 계속 18px임 |
| reduced motion | 별도 규칙 없음 | 보통 | `prefers-reduced-motion`에서도 legacy hover transform이 유지됨 |

`.button` 계열에 결합된 `:focus`, `:active`, pressed·selected 속성, disabled selector 및 추가 breakpoint override는 발견되지 않았다. `!important`도 사용하지 않는다.

### 16.6 안전한 전환 범위

#### 즉시 전환 가능

- 저장소 내부 실제 사용처가 0건이므로 현재 치환할 HTML·JS 대상도 0건이다.
- 동일 계산값만 공유하는 CSS 리팩터링은 가능하지만, 미사용 코드에 새로운 호환 계층을 추가하는 이점이 작으므로 권장하지 않는다.

#### 호환 modifier가 필요한 경우

저장소 밖 사용처가 확인되면 한 번에 variant를 바꾸지 말고 다음 차이를 보존하는 임시 modifier가 필요하다.

1. 56px 최소 높이와 wrapping 허용
2. 24px 좌우 padding
3. 2px border
4. desktop 16px·mobile 15px 글자
5. 180ms hover 이동·shadow
6. 700px 이하 full width
7. primary의 흰 배경·navy text
8. outline의 navy 윤곽·navy 채움 hover

임시 modifier를 만들더라도 `.button`과 `.btn`을 같은 요소에 동시에 붙이는 과도기 방식은 피한다. 두 기반 클래스의 height, border, font-size, transition 및 focus 규칙이 cascade 순서에 따라 섞일 수 있기 때문이다.

### 16.7 권장 다음 단계

1. `.button`, `.button-primary`, `.button-outline`를 문서상 deprecated로 확정하고 신규 마크업 사용을 금지한다.
2. 외부 템플릿·CMS·서버 렌더링 마크업의 클래스 참조 여부를 확인한다.
3. 외부 사용처도 없다면 여섯 legacy 규칙을 삭제 후보로 지정한다. 그룹 규칙에서는 `.quick-card:hover`를 남긴다.
4. 외부 사용처가 있다면 화면별로 캡처한 뒤 기존 시각을 보존하는 임시 `.btn` modifier를 정의하고 개별 전환한다.
5. 전환 후 desktop과 700px 이하에서 높이, 글자, 전체 너비, hover, focus, disabled를 각각 회귀 검증한다.

## 17. 카드 계열 통합 및 alias 전환 분석

### 17.1 분석 범위와 결론

- 실제 서비스 CSS `common/style.css`의 이름에 `card`가 포함된 선택자와 카드 역할을 하는 주요 panel·summary를 조사했다.
- HTML·JS는 실제 클래스 사용 여부 확인에만 사용했으며 수정하지 않았다.
- 카드 계열은 하나의 공통 `.card` 클래스로 즉시 합칠 수 없다. 기본 정보 카드, 링크 카드, 미디어 카드, glass 카드, 지도 컨테이너, 모바일 라인형 카드의 레이아웃과 상태 모델이 다르다.
- 우선 공통화 대상은 클래스 자체가 아니라 surface·spacing·line-height alias다. radius와 shadow는 동일 계산값이 없는 경우가 많아 이번 통합 범위에서 제외한다.
- 카드 기반 클래스를 새로 추가하기 전에 실제 사용처가 없는 카드 CSS를 별도 deprecated 분석 대상으로 분리해야 한다.

### 17.2 카드 계열 분류

| 계열 | 주요 선택자 | 공통 구조 | 예외·상태 | 통합 판단 |
|---|---|---|---|---|
| 기본 정보 카드 | `.guide-card`, `.terminal-guide-card`, `.portal-terminal-link-card`, `.portal-guide-card` | border, radius, surface, 24–32px padding | 링크 카드는 hover 이동, guide 카드는 hover shadow | surface alias 우선, 공통 클래스는 보류 |
| inverse 정보 카드 | `.contact-card`, `.portal-preparing-block` | inverse surface와 inverse text | preparing block은 redirect 안내 panel | `--surface-inverse` 사용 가능 |
| 포털 기본 카드 | `.portal-card` | border, 16px radius, 24px padding, shadow | 첫 번째 카드 gradient variant | 현재 서비스 사용처 확인 후 처리 |
| 터미널 정보 | `.terminal-card`, `.terminal-summary` | 정보 행과 상세 콘텐츠 | map breakpoint에 따라 크기·배치가 크게 변함 | 공통 카드 기반에서 제외 |
| 홈 공지·예약 | `.portal-home-notice-card`, `.portal-booking-card` | 16px radius 공유 | 예약 카드는 gradient와 장식 pseudo-element | radius만 공유, surface 통합 분리 |
| 퀵 가이드 | `.portal-quick-guide-card--compact`, `.portal-quick-guide-card--feature` | icon·copy·arrow 구조 | compact와 feature의 높이·surface·shadow가 다름 | variant 체계 유지 |
| 쇼케이스·포토 | `.portal-guide-showcase-card`, `.portal-guide-item--photo` | 이미지, overlay, focus 상태 | pill형 showcase, staggered transform, 전용 shadow | 전용 컴포넌트 유지 |
| 날씨 | `.portal-weather-summary-card`, `.portal-weather-feature-card` | subtle surface, radius 16px, shadow 없음 | 1100px·700px padding override | surface alias 통합 가능 |
| 운항 모바일 | `.portal-operation-card` | 760px 이하에서만 생성되는 정보 묶음 | borderless line layout, radius 0, transparent surface | 일반 카드 기반에서 제외 |
| 히어로 서비스 | `.portal-hero-service-card` | grid, glass surface, icon·copy | hover/focus에서 거의 흰 surface로 반전 | 전용 component 유지 |
| 선택형 카드 | `.id-guide-card` | pill button, pressed·focus 상태 | 카드가 아니라 selectable control | 버튼·탭 계열로 분류 |
| 지도 카드 | `.terminal-map-card` | 지도 viewport 컨테이너 | 370·700·1000px 구간별 geometry override | layout 계열로 분류 |

### 17.3 공통 구조와 현재 차이

| 속성 | 관찰된 값 | 판단 |
|---|---|---|
| surface | `--bg-base`, `--bg-subtle`, semantic surface alias, transparent, gradient | 단순 기본 배경만 semantic surface alias로 전환 |
| border | `--border-default`, `--portal-content-border`, inverse border, 0 | 브랜드·inverse 문맥이 달라 하나로 통합하지 않음 |
| radius | 0, 12px `--radius-card-sm`, 14px `--portal-content-card-radius`, 16px `--global-radius-md`, pill | 값과 역할이 모두 다르므로 유지 |
| padding | 16, 20, 24, 32px 및 다중값 shorthand | 단일 카드 기반으로 통합하지 않음 |
| shadow | none, global shadow alias, 여러 literal shadow | literal shadow와 preset 계산값이 달라 직접 치환 금지 |
| interaction | 정적, hover 이동, shadow, focus outline, pressed, image zoom | 상태 모델을 컴포넌트별로 유지 |
| responsive | 370, 480, 700, 760, 1000, 1100, 1200px | breakpoint override가 많은 계열은 기본 규칙과 함께 검증 |

### 17.4 카드 관련 Component 토큰

| 토큰 | 선언 위치 | 현재 값 | 사용 현황 | 판단 |
|---|---:|---|---|---|
| `--radius-card-sm` | L95 | `12px` | 카드 외 항목을 포함해 18곳 사용 | 12px global radius가 없으므로 유지 |
| `--showcase-card-bg` | L162 | `#12263d` | showcase card 전용 | component token 유지, 원시 색상 승격은 별도 단계 |
| `--font-photo-card-title` | L243 | `clamp(20px, 1.5vw, 23px)` | photo card title | component typography 유지 |
| `--font-showcase-card-title` | L248 | `clamp(19px, 1.5vw, 23px)` | showcase copy title | component typography 유지 |
| `--font-card-title-lg` | L253 | `28px` | weather card heading | 역할 확인 후 weather prefix 검토 |
| `--font-hero-service-card-description-mobile` | L262 | `12px` | hero service mobile description | component token 유지 |
| `--font-card-title` | L267 | `var(--font-h3)` | title alias | 사용처 재확인 후 semantic typography 여부 판단 |
| `--portal-panel-card-padding` | L2707 | spacing 12/16 shorthand | 선언만 존재 | deprecated 후보, alias 전환보다 사용처 확인 우선 |
| `--portal-panel-card-surface` | L2708 | `var(--bg-subtle)` | 선언만 존재 | deprecated 후보, 사용처 없이 alias만 변경하지 않음 |
| `--portal-content-card-radius` | L2746 | `14px` | portal content 계열 7곳 | shared component token 유지 |

### 17.5 Surface alias 전환 판단

`--surface-base`, `--surface-subtle`, `--surface-muted`, `--surface-inverse`는 각각 원본 `--bg-*`를 직접 참조하며 지역 scope 재정의가 없다. 아래 기본 상태의 단순 background는 계산값이 동일하다.

| 위치 | 선택자 | 현재 | 후보 | 상태·breakpoint | 판단 |
|---:|---|---|---|---|---|
| L1520 | `.terminal-guide-card` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L6677 | `.portal-terminal-link-card` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L6739 | `.portal-preparing-block` | `--bg-inverse` | `--surface-inverse` | 기본 | 즉시 교체 가능 |
| L6815 | `.portal-check-panel` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L6871 | `.portal-guide-card` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L7751 | `.portal-home-notice-card` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L10686 | `.portal-bottom-column--notice` | `--bg-base` | `--surface-base` | 기본 | 즉시 교체 가능 |
| L11706 | `.portal-weather-summary-card`, `.portal-weather-feature-card` | `--bg-subtle` | `--surface-subtle` | 기본 | 즉시 교체 가능 |

다음 surface 사용은 첫 실행 범위에서 제외한다.

- `.quick-card:hover`, `.portal-terminal-link-card:hover`: hover 상태다.
- `.portal-booking-card`와 hero service card: gradient 또는 `color-mix()` 복합식이다.
- booking CTA의 background: border·text에 같은 `--bg-base`가 함께 사용된다.
- 모바일 weather table card: 700px media query 안의 table-to-card 변환 규칙이다.
- operation status: 상태 표시와 결합된 760px 전용 규칙이다.
- `.terminal-summary`: surface가 아니라 `--text-inverse`를 배경에 사용해 의미 교정이 별도로 필요하다.
- `.portal-card`, compact quick guide, booking card, notice featured: 현재 서비스 HTML·JS 직접 사용처가 확인되지 않아 deprecated 여부를 먼저 분석한다.

### 17.6 Spacing·line-height alias 전환 판단

카드 내부의 `padding`과 `margin`은 대부분 shorthand 또는 컴포넌트 geometry이므로 첫 실행 범위에서 제외한다. 다음은 단일 토큰만 사용하는 카드 collection의 `gap`으로 alias 계산값과 cascade가 동일하다.

| 위치 | 선택자 | 현재 | 후보 | 판단 |
|---:|---|---|---|---|
| L1443 | `.guide-grid` | `--spacing-16` | `--global-space-16` | 즉시 교체 가능 |
| L1511 | `.terminal-guide-grid` | `--spacing-20` | `--global-space-20` | 즉시 교체 가능 |
| L4675 | `.terminal-card-list` | `--spacing-12` | `--global-space-12` | 즉시 교체 가능 |
| L6863 | `.portal-guide-card-grid`, `.portal-contact-grid` | `--spacing-16` | `--global-space-16` | 즉시 교체 가능 |

추가 후보는 다음과 같이 분리한다.

- L13030 `.portal-hero-service-card small`: `--line-height-title-loose`를 `--global-line-height-title-loose`로 바꾸는 것은 계산값 1.4로 동일하지만 hero component 회귀 확인 후 교체한다.
- L12580 `.portal-operation-card__departure-time time`: 동일 alias 전환이 가능하지만 760px 전용 운항 카드이므로 breakpoint 단계에 유지한다.
- showcase·weather·hero grid의 gap은 여러 breakpoint에서 재정의되므로 기본·override를 한 묶음으로 분석한다.
- padding, margin, column-gap·row-gap 다중 선언은 geometry 검토 전 즉시 교체 후보에서 제외한다.

### 17.7 Radius와 shadow 판단

- `--global-radius-md`를 사용하는 guide, portal, weather, feature card는 이미 global alias 체계에 있다.
- `--radius-card-sm: 12px`와 `--portal-content-card-radius: 14px`는 각각 고유 계산값이다. 현재 global radius에 동일 값이 없으므로 `--global-radius-md: 16px`로 바꾸면 시각 결과가 달라진다.
- `.guide-card:hover`, `.portal-card:hover`는 이미 `--global-shadow-lg`를 사용한다.
- portal card 기본 shadow, compact·feature quick guide, showcase, hero service card의 shadow는 preset과 값이 다르다. 값 비교 없이 global shadow alias로 치환하지 않는다.
- shadow literal의 반복 여부와 신규 Primitive preset 필요성은 카드 통합 후 별도 분석한다.

### 17.8 사용처가 없는 CSS 후보

서비스 HTML·JS 직접 참조가 확인되지 않은 주요 선택자는 다음과 같다.

- `.portal-card`
- `.portal-booking-card`
- `.portal-quick-guide-card--compact`
- `.portal-notice-featured`

부분 문자열이 포함된 다른 클래스와 혼동하지 않고 exact class token 기준으로 재검증한 뒤, alias 마이그레이션보다 deprecated 삭제 가능성 분석을 먼저 수행한다.

### 17.9 권장 실행 순서

1. 17.5의 기본 상태 surface 8개 선언만 semantic alias로 교체한다.
2. 17.6의 카드 collection gap 4개를 global spacing alias로 교체한다.
3. hero service와 operation card의 line-height를 각각 기본·breakpoint 검증 단계에서 교체한다.
4. hover·focus·pressed 상태와 gradient·`color-mix()` 사용처는 별도 상태 단계로 유지한다.
5. radius 12px·14px과 literal shadow는 새 Primitive 필요성 분석 전 변경하지 않는다.
6. 사용처가 없는 카드 CSS 네 계열은 migration하지 말고 삭제 가능성을 먼저 조사한다.
7. 공통 `.card` 클래스 도입은 위 작업 후에도 border·radius·surface가 반복되는 실제 사용 계열만 대상으로 재평가한다.

## 18. 카드 collection 단일 `gap` 후보 적용 전 분석

### 18.1 분석 범위와 결론

- 실제 서비스 CSS `common/style.css`에서 17.6에 기록한 카드 collection의 기본 `gap` 선언 4곳을 다시 확인했다.
- 네 선언은 모두 media query 밖의 기본 규칙이며, 상태·variant·`!important`와 결합되지 않는다.
- 값은 모두 fallback, `calc()`, `clamp()` 또는 다중값 없이 `var(--spacing-*)` 하나만 사용하는 단일 참조다.
- `gap`은 row와 column 양쪽에 적용되는 shorthand지만, 토큰 참조만 1:1 alias로 바꾸므로 shorthand의 축 의미와 cascade는 달라지지 않는다.
- `--global-space-12`, `--global-space-16`, `--global-space-20`은 각각 대응하는 `--spacing-*` 원본만 직접 참조하며 지역 scope 재정의가 없다.
- 따라서 아래 4개 기본 선언은 다음 실행 단계에서 각각 한 줄씩 교체할 수 있다. CSS는 이번 분석 단계에서 변경하지 않았다.

### 18.2 후보별 실제 선언과 영향도

| 위치 | 선택자 | 속성 | 현재 토큰 | alias 후보 | 최종 계산값 전·후 | 기본 규칙 중복 | 상태·variant | breakpoint 관계 | 영향도 | 판단 |
|---:|---|---|---|---|---|---|---|---|---|---|
| L1444 | `.guide-grid` | `gap` | `--spacing-16` | `--global-space-16` | `16px` → `16px` | 없음 | 없음 | 700px 이하에서 열 수만 1열로 변경, gap은 기본값 상속 | 낮음 | 즉시 교체 가능 |
| L1512 | `.terminal-guide-grid` | `gap` | `--spacing-20` | `--global-space-20` | `20px` → `20px` | 없음 | 없음 | 1000px 이하에서 별도 `gap: var(--spacing-16)`, 700px 이하에서는 열 수만 1열로 변경 | 보통 | 기본 선언만 교체 가능 |
| L4676 | `.terminal-card-list` | `gap` | `--spacing-12` | `--global-space-12` | `12px` → `12px` | 없음 | 없음 | 후반 `.portal-page .terminal-card-list`는 padding·background만 선언하고 gap은 덮어쓰지 않음 | 낮음 | 즉시 교체 가능 |
| L6864 | `.portal-guide-card-grid`, `.portal-contact-grid` | `gap` | `--spacing-16` | `--global-space-16` | `16px` → `16px` | 없음 | 없음 | 1000px·700px 이하에서 열 수만 변경, gap은 기본값 상속 | 낮음 | 즉시 교체 가능 |

### 18.3 Alias 계산값과 scope

| alias | 선언 위치 | 참조 | 원본 값 | 지역 재정의 | 순환 참조 | 계산값 동일 여부 |
|---|---:|---|---:|---|---|---|
| `--global-space-12` | L109 | `var(--spacing-12)` | `12px` | 없음 | 없음 | 동일 |
| `--global-space-16` | L110 | `var(--spacing-16)` | `16px` | 없음 | 없음 | 동일 |
| `--global-space-20` | L111 | `var(--spacing-20)` | `20px` | 없음 | 없음 | 동일 |

### 18.4 기본 규칙과 breakpoint 최종 적용 관계

| viewport | `.guide-grid` | `.terminal-guide-grid` | `.terminal-card-list` | `.portal-guide-card-grid`, `.portal-contact-grid` |
|---|---|---|---|---|
| 1001px 이상 | 2열, gap 16px | 2열, gap 20px | gap 12px | 3열, gap 16px |
| 701–1000px | 2열, gap 16px | 2열, gap 16px (`max-width: 1000px` override) | gap 12px | 2열, gap 16px |
| 700px 이하 | 1열, gap 16px | 1열, gap 16px (`max-width: 1000px` override 유지) | gap 12px | 1열, gap 16px |

- `.guide-grid`의 700px 규칙은 `grid-template-columns`만 덮어쓴다.
- `.terminal-guide-grid`의 1000px 규칙은 `gap`을 20px에서 16px로 덮어쓰며, 700px 규칙은 `grid-template-columns`만 덮어쓴다. 다음 단계에서 L1512만 바꾸고 L2298의 override는 변경하지 않아야 한다.
- `.terminal-card-list`의 후반 `.portal-page .terminal-card-list` 규칙은 더 높은 specificity를 가지지만 `gap`을 선언하지 않으므로 후보 선언의 계산에 영향을 주지 않는다.
- portal guide/contact collection의 1000px·700px 규칙은 `grid-template-columns`만 덮어쓰며 기본 gap 16px를 계속 사용한다.
- 네 후보 모두 selector specificity, 선언 순서, media query 활성 범위와 무관하게 토큰 참조만 바뀌므로 cascade 결과가 유지된다.

### 18.5 다음 실행 단계의 최소 변경 범위

다음 실행에서는 `common/style.css`의 아래 네 선언만 변경하는 것이 안전하다.

1. L1444 `.guide-grid`: `var(--spacing-16)` → `var(--global-space-16)`
2. L1512 `.terminal-guide-grid`: `var(--spacing-20)` → `var(--global-space-20)`
3. L4676 `.terminal-card-list`: `var(--spacing-12)` → `var(--global-space-12)`
4. L6864 `.portal-guide-card-grid`, `.portal-contact-grid`: `var(--spacing-16)` → `var(--global-space-16)`

다음 항목은 같은 실행에 포함하지 않는다.

- L2298의 `.terminal-guide-grid` 1000px gap override
- 카드 내부 padding·margin
- 여러 값을 사용하는 gap, row-gap, column-gap
- 다른 collection 또는 breakpoint의 spacing 참조
- spacing 토큰 선언부와 원본 토큰

권장 검증은 정확히 4개 참조가 변경되었는지, 각 alias 계산값이 동일한지, 1000px·700px에서 위 표의 최종 gap이 유지되는지, 지정 범위 밖 spacing 참조가 변경되지 않았는지를 확인하는 것이다.

- 코드 변경 여부: 없음
- CSS·HTML·JS 수정 여부: 없음
- 문서 수정: `docs/design-tokens.md`

## 19. 사용처 미확인 카드 계열 삭제 가능성 분석

### 19.1 조사 범위와 방법

- 서비스 CSS는 `common/style.css`만 조사했다. 백업 CSS와 브라우저 검증 캐시는 제외했다.
- 서비스 HTML·JS·템플릿 확장자 77개 파일에서 exact class token을 검색했다. 하이픈으로 이어지는 다른 클래스와 CSS custom property의 부분 문자열은 사용처로 계산하지 않았다.
- 기본 규칙뿐 아니라 pseudo-class, pseudo-element, 자식 선택자, attribute 상태, media query와 그룹 선택자 구성까지 확인했다.
- CSS, HTML, JS와 템플릿은 수정하지 않았다. 이 절은 삭제 실행 전 범위 확정을 위한 문서다.

### 19.2 사용처 결론

| 후보 계열 | 서비스 HTML·JS·템플릿 exact 사용 | CSS selector 구성 | 반응형·상태 | 외부 의존 단서 | 삭제 판단 |
|---|---:|---|---|---|---|
| `.portal-card` | 0건 | exact selector member 13개, 11개 규칙에 분산 | hover, `::after`, `:first-child`, 메인 페이지 shadow 제거 그룹 | `README.md`가 `.portal-grid`를 새 터미널 추가 확장 지점으로 안내 | 보류: 확장 계약 정리 후 삭제 |
| `.portal-booking-card` | 0건 | exact selector member 13개와 BEM element 1개, 공유 그룹 포함 | `::before`, `::after`, link hover, 760px override | 전용 gradient 토큰 2개가 연결됨 | 조건부 삭제 가능: 독립 작업 권장 |
| `.portal-notice-featured` | 0건 | exact selector member 7개 | `[hidden]`, 760px padding override | JS는 `.portal-notice-content`와 generic `[data-notice-category]`만 사용하며 이 클래스는 생성하지 않음 | 삭제 가능 |
| `.portal-quick-guide-card--compact` | 0건 | exact selector member 3개, 2개 규칙 | hover와 focus-visible 그룹 | 활성 feature variant가 공통 quick-guide 기반 규칙을 공유 | variant 전용 2개 규칙만 삭제 가능 |

검색 결과는 현재 저장소 내부 사용만 보장한다. 저장소 밖 CMS, 서버 템플릿 또는 런타임 HTML 주입이 존재한다면 삭제 전에 별도 확인이 필요하다.

### 19.3 `.portal-card` 계열

전용 selector는 다음 범위에 있다.

| 위치 | selector 또는 문맥 | 삭제 시 처리 |
|---:|---|---|
| L396–397 | `.portal-card:first-child h2`, `.portal-card:first-child .number` | 4개 그룹 selector에서 두 member만 제거하고 `.utility strong`, `.region-quick-btn:hover .arr` 보존 |
| L2803–2865 | base, hover, arrow pseudo-element, number, heading, copy, first-child variants | 전용 규칙 9개 전체가 한 묶음 |
| L8352–8353 | 메인 페이지 shadow 제거 그룹의 base·hover member | 두 member만 제거하고 나머지 selector와 `box-shadow: none` 보존 |

인접 `.portal-grid`는 L2796 기본, L3256의 1000px override, L3334의 700px override로 구성된다. 현재 서비스 마크업에는 exact `.portal-grid`가 없지만 `README.md:L65`가 이를 새 터미널 카드 추가 위치로 명시한다. 따라서 `.portal-card`와 `.portal-grid`는 단순 미사용 CSS가 아니라 오래된 확장 계약일 수 있다.

권장 조치는 다음과 같다.

1. 현재 데이터 기반 터미널 생성 방식이 README의 수동 `.portal-grid` 추가 절차를 완전히 대체했는지 확인한다.
2. 확장 계약을 폐기한다면 README를 먼저 또는 같은 변경 세트에서 최신 절차로 수정한다.
3. 그 다음 `.portal-card` 전용 selector와 `.portal-grid` 기본·반응형 규칙을 별도 삭제 대상으로 확정한다.

`--portal-card-detail-icon-size`와 `.portal-card-region`은 이름에 `portal-card`가 포함되지만 각각 터미널 상세 아이콘과 `.portal-terminal-link-card`의 지역 라벨에서 실제 사용된다. `.portal-card` 삭제 범위에 포함하면 안 된다.

### 19.4 `.portal-booking-card` 계열

| 위치 | selector 또는 문맥 | 삭제 시 처리 |
|---:|---|---|
| L6728 | `.portal-booking-card>a i` | 그룹에서 이 member만 제거하고 `.portal-terminal-link-card i` 보존. `merged: 2 identical rules` 주석도 더 이상 정확하지 않으므로 정리 필요 |
| L7735 | `.portal-bottom-column .portal-booking-card` | 그룹에서 booking member만 제거하고 home notice·quick guide 규칙 보존 |
| L7749 | `.portal-booking-card` | 그룹에서 booking member만 제거하고 `.portal-home-notice-card`의 radius 규칙 보존 |
| L7775–7785 | heading | 전용 규칙 삭제 가능 |
| L8045–8118 | base, 장식 pseudo-elements, eyebrow, copy, link, link hover | 전용 규칙 삭제 가능 |
| L8152–8155 | `max-width: 760px` padding·height override | 전용 media rule 삭제 가능 |

`--portal-booking-gradient-start`와 `--portal-booking-gradient-end`는 L2694–2695에서 선언되고 booking card gradient에서만 사용된다. selector 삭제 후에는 orphan Component token이 되므로 별도 토큰 정리 대상으로 분류한다. 같은 gradient가 참조하는 `--portal-marker-accent`는 지도·다른 포털 UI에서도 사용되므로 삭제하면 안 된다.

현재 메인 페이지의 예약 CTA는 `.portal-quick-guide-card--feature.portal-quick-guide-card--booking`이다. 이 클래스는 `.portal-booking-card`와 별개이며 실제 사용 중이므로 booking card 삭제 작업에서 문자열 기반 일괄 삭제를 사용하면 안 된다. `.portal-bottom-info-grid`, `.portal-bottom-column`, `.portal-quick-guide-list`도 현재 메인 페이지 구조이므로 보존한다.

### 19.5 `.portal-notice-featured` 계열

전용 규칙은 L7942–7988의 `[hidden]`, base, `strong`, `p`, `time`, `time b`와 L8171–8173의 760px padding override다. exact class token은 서비스 마크업·스크립트에 없으며, `common/portal.js`는 `.portal-notice-content` 내부의 `[data-notice-category]` 요소를 필터링할 뿐 `.portal-notice-featured`를 생성하거나 토글하지 않는다.

따라서 현재 저장소 기준으로 위 7개 selector member는 함께 삭제할 수 있다. 다만 `.portal-notice-content`, `.portal-notice-tabs`, `.portal-home-notice-list`는 별도 계열이다. 특히 공지 목록 생성과 탭 초기화 코드까지 이 후보와 함께 삭제해서는 안 된다.

### 19.6 `.portal-quick-guide-card--compact` 계열

삭제 가능한 범위는 다음 두 규칙으로 제한한다.

- L9645–9658: compact variant 기본 규칙
- L9660–9664: compact variant hover·focus-visible 규칙

현재 메인 페이지는 feature variant 세 개를 사용한다. 다음 공통·활성 규칙은 반드시 보존한다.

- `.portal-quick-guide-card:focus-visible`
- `.portal-quick-guide-icon`, `.portal-quick-guide-copy`, `.portal-quick-guide-arrow`
- `.portal-quick-guide-card--feature`와 booking·lost·phone feature variants
- 메인 페이지 shadow 제거 그룹의 feature selector

compact는 Component token을 별도로 선언하지 않으므로 두 규칙 삭제 후 추가 토큰 정리는 없다.

### 19.7 공유 규칙과 삭제 위험

| 위험 | 영향 | 권장 처리 |
|---|---|---|
| 그룹 selector 전체 삭제 | 현재 사용 중인 utility, terminal link, home notice, quick guide, 지도·showcase 규칙 손실 | 미사용 selector member만 제거 |
| 부분 문자열 일괄 삭제 | `.portal-card-region`, `--portal-card-detail-icon-size`, `.portal-quick-guide-card--booking` 등 활성 코드 손실 | exact selector 단위 패치 사용 |
| media rule 누락 | base만 삭제되고 orphan override 잔존 | 기본·상태·breakpoint를 컴포넌트별 한 묶음으로 삭제 |
| orphan 토큰 | booking gradient 토큰만 남음 | selector 삭제 후 전용 토큰 사용 횟수 재검증 |
| README 계약 불일치 | 새 터미널 추가 안내가 작동하지 않음 | `.portal-card`·`.portal-grid` 삭제 전 문서 계약 결정 |

### 19.8 권장 삭제 순서

1. 낮은 위험: `.portal-quick-guide-card--compact` 전용 규칙 2개만 삭제한다.
2. 낮은 위험: `.portal-notice-featured` 전용 기본·상태·760px 규칙을 한 번에 삭제한다.
3. 보통 위험: `.portal-booking-card` selector member와 BEM element를 제거하되 모든 공유 그룹 sibling을 보존한다. 이후 gradient 토큰 2개의 orphan 여부를 다시 확인한다.
4. 보류: `.portal-card`와 `.portal-grid`는 README 확장 계약을 유지할지 먼저 결정한 뒤 별도 작업으로 삭제한다.
5. 각 단계에서 exact class token 0건, CSS 구조, `git diff --check`, desktop·760px 이하 메인 페이지의 공지·빠른 안내 영역을 검증한다.

### 19.9 이번 단계 변경 범위

- 코드 변경 여부: 없음
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 삭제한 코드: 없음
- 문서 수정: `docs/design-tokens.md`

## 20. 표·테이블 계열 통합 및 alias 전환 분석

### 20.1 분석 범위와 결론

- 실제 서비스 CSS `common/style.css`의 `table`, `thead`, `tbody`, `th`, `td`, table wrapper와 모바일 table modifier 규칙을 조사했다.
- 서비스 HTML·JS·템플릿은 클래스 조합과 동적 생성 여부 확인에만 사용했으며 수정하지 않았다.
- 표 계열은 하나의 공통 `.table` 클래스로 즉시 통합할 수 없다. 운항표, 터미널 상세표, 포털 데이터표, 신분증 matrix가 서로 다른 column geometry와 모바일 변환 방식을 사용한다.
- 현재 가장 명확한 공유 기반은 `.portal-data-table`이며, 반응형 방식은 `.mobile-table--stacked`, `.mobile-table--default`, `.mobile-table--list`, `.mobile-table--card` modifier로 분리되어 있다. 이 구조를 유지하는 것이 안전하다.
- 첫 통합 범위는 기본 상태의 단순 surface 8곳과 비반응형 단일 gap 1곳이다. hover·focus 상태, media query 내부 카드 변환, shorthand padding과 column geometry는 별도 단계로 유지한다.

### 20.2 테이블 계열 분류와 실제 사용

| 계열 | 주요 선택자 | 실제 생성·사용 | 구조와 예외 | 통합 판단 |
|---|---|---|---|---|
| 운항 현황표 | `.status-table-wrap`, `.schedule-table`, `#schedule`, `.mobile-table--stacked` | `common/schedule.js`가 생성, `common/layout.js`의 `#schedule`에 삽입 | desktop 고정 열 너비 6개, 700px 이하 카드형 stacked 변환 | 전용 geometry 유지 |
| 주차 요금표 | `.terminal-parking-table`, `.mobile-table--default` | `common/guide.js`, `common/terminal-guide.js`가 생성 | 모바일에서도 table display를 강제 유지 | 기본 cell surface만 전환 가능 |
| 터미널 항로표 | `.terminal-route-table`, `.terminal-route-table-wrap` | 서비스 HTML·JS exact 참조 0건 | 첫 열 너비, 700px table 복원, portal card 전용 override 다수 | alias 전환보다 deprecated 분석 우선 |
| 포털 데이터표 기반 | `.portal-data-table`, `.portal-table-wrap`, `.table-scroll-region` | 터미널 목록, 공지, 문의, 유실물, 날씨, 운항정보에서 사용 | border·cell typography 공유, 페이지별 column/row variant 다수 | 공통 기반으로 유지 |
| 공지·문의 목록 | `.mobile-table--list`, `.portal-notice-table-wrap`, `.portal-inquiry-table-wrap` | 정적 HTML과 JS 필터 사용 | 700px 이하 grid list로 전환, `nth-child`로 열 재배치 | 기본 table과 mobile list 규칙 분리 유지 |
| 터미널 목록 | `.portal-terminal-directory-table-wrap` | `terminal/terminal-list.html` | 700px 이하 행 내부에 별도 mobile entry 표시 | 전용 responsive variant 유지 |
| 신분증 인정범위 | `.id-guide-matrix` | `boarding/id.html` | 700px 이하 행을 카드형 grid로 전환 | 기본 surface와 내부 list gap만 우선 전환 |
| 해상기상 안내표 | `.portal-weather-advisory-item .mobile-table--card` | `common/portal-weather.js`가 동적 생성 | 700px 이하 2열 card-row 표현 | breakpoint 묶음으로 후속 검토 |
| 운항정보표 | `.portal-operation-table` | `schedule/operation.html`, `common/operation-info.js` | desktop 8열, 760px 이하 table wrapper를 숨기고 별도 card list 노출 | table과 mobile card list를 별도 컴포넌트로 유지 |
| 포털 항로 wrapper | `.portal-route-table-wrap` | 서비스 HTML·JS exact 참조 0건 | typography 토큰을 padding에 사용, 700px override 존재 | deprecated 여부 먼저 확인 |

### 20.3 공통 구조와 통합 한계

| 관심사 | 공통점 | 주요 예외 | 판단 |
|---|---|---|---|
| wrapper | horizontal overflow, border 또는 focusable region | schedule은 inverse wrapper, mobile list는 overflow 해제 | `.table-scroll-region` 접근성 기반만 공유 |
| table base | width 100%, collapse, 기본 surface | operation은 fixed 980px, route·matrix는 고정 column, mobile은 block/grid | layout 공통화 금지 |
| header | strong text, border-bottom, base 또는 subtle surface | schedule은 inverse header, weather card는 header를 행 안에 유지 | surface alias만 역할별 전환 |
| cell | border-bottom, body typography | padding 값과 정렬이 화면별로 다름 | 공통 padding token 도입 보류 |
| row state | hover 또는 focus-within surface | literal color, overlay, subtle surface가 혼재 | 상태 semantic 설계 후 통합 |
| mobile | header visually hidden, `data-label`, block/grid row | parking은 table 유지, operation은 별도 card list 사용 | modifier별 동작 유지 |
| column sizing | `nth-child`, `first-child`, col class | 6열·8열·목록형마다 완전히 다름 | component CSS로 유지 |

새 `.table` 기반 클래스를 추가하면 기존 `.schedule-table`과 `.portal-data-table`의 cascade가 중첩될 수 있다. 현재 단계에서는 shared selector를 늘리지 않고 alias 참조만 정리한다.

### 20.4 현재 토큰 사용 상태

#### Surface

- 기본 cell·table surface에는 `--bg-base`, header에는 `--bg-base` 또는 `--bg-subtle`이 남아 있다.
- `--surface-base`와 `--surface-subtle`은 각각 원본 `--bg-base`, `--bg-subtle`을 직접 참조하며 지역 scope 재정의가 없다.
- `--bg-inverse`가 `color` 또는 `border-top`에 사용된 경우는 surface 역할이 아니므로 교체 대상이 아니다.

#### Spacing

- cell padding은 대부분 2개 이상의 값을 가진 shorthand이며 표의 행 높이와 column 폭에 직접 영향을 준다. 일괄 alias 전환 대상에서 제외한다.
- mobile table의 `gap`도 breakpoint의 grid 변환과 결합되어 있으므로 기본 규칙과 분리해 변경하지 않는다.
- `.id-guide-matrix ul`의 `gap`만 비반응형 단일 토큰 참조이며 계산값이 동일한 저위험 후보다.

#### Line-height와 shadow

- 조사한 테이블 기본 규칙은 이미 `--global-line-height-*` alias를 사용한다.
- 표 관련 규칙에서 `--shadow-sm`, `--shadow-md`, `--shadow-lg`의 직접 사용은 없다.
- 모바일 stacked row는 전용 `--shadow-table-row`를 사용한다. 역할이 명확한 semantic shadow이므로 global preset으로 바꾸지 않는다.

#### Typography 토큰의 spacing 사용

- `.id-guide-matrix th, td`의 padding은 `--font-body-lg`, `.portal-data-table th, td`의 padding은 `--font-body-lg`와 `--font-body`, `.portal-route-table-wrap`의 padding은 `--font-h2`를 사용한다.
- 계산값이 spacing scale과 우연히 같더라도 typography 토큰을 global spacing alias로 기계적으로 바꾸지 않는다. 의도와 시각 회귀를 확인하는 별도 semantic correction이 필요하다.

### 20.5 안전한 surface alias 후보

아래 후보는 media query 밖의 기본 규칙이며, 상태·variant와 결합되지 않고 값 전체가 단순한 `background: var(--bg-*)` 참조다.

| 위치 | 선택자 | 현재 | 후보 | 계산값 | 영향도 | 판단 |
|---:|---|---|---|---|---|---|
| L1622 | `.terminal-parking-table th, .terminal-parking-table td` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L9850 | `.portal-subpage table thead th`, `#schedule` header, terminal route header 그룹 | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L9914 | `.id-guide-matrix` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L9953 | `.id-guide-matrix thead th` | `--bg-subtle` | `--surface-subtle` | 동일 | 낮음 | 즉시 교체 가능 |
| L10278 | `.portal-data-table` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L10318 | `.portal-data-table th, .portal-data-table td` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L10327 | `.portal-data-table thead th` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |
| L10346 | `.portal-data-table tbody th` | `--bg-base` | `--surface-base` | 동일 | 낮음 | 즉시 교체 가능 |

`.terminal-route-table`의 L4508 cell surface와 L4814 wrapper surface도 문법상 같은 alias로 교체할 수 있다. 그러나 해당 계열의 서비스 exact 사용처가 0건이므로 미사용 CSS 삭제 가능성을 먼저 분석하고 이번 실행 후보에서는 제외한다.

### 20.6 안전한 spacing alias 후보

| 위치 | 선택자 | 속성 | 현재 | 후보 | 계산값 | breakpoint·상태 | 판단 |
|---:|---|---|---|---|---|---|---|
| L9967 | `.id-guide-matrix ul` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 없음 | 즉시 교체 가능 |

이 후보는 list 내부 row·column 간격 모두에 같은 단일값을 적용한다. alias로 바꿔도 shorthand 의미와 cascade는 유지된다.

### 20.7 상태·반응형·복합 사용처

다음은 계산값이 같더라도 첫 실행 범위에서 제외한다.

| 계열 | 대표 위치 | 제외 이유 | 권장 조치 |
|---|---:|---|---|
| parking tbody·row·hover 그룹 | L1609–1623 | 기본과 hover가 같은 그룹 selector로 결합 | 상태 그룹 별도 검토 |
| terminal route hover | L799–800 | `.section-soft`와 그룹화된 상태 surface | selector 분리 여부 확인 |
| mobile stacked schedule | L2468–2523 | 700px 카드 변환, padding·gap·shadow 결합 | breakpoint 단위 검증 |
| id matrix mobile rows | L10069–10087 | 700px card 변환의 row·header surface | 기본 후보 적용 후 별도 전환 |
| portal data hover | L9681–9688, L10365–10367 | hover·focus-within 상태 및 overlay 혼재 | 상태 semantic 유지·정리 |
| notice/inquiry mobile list | L10377–10485, L14147–14169 | `nth-child` grid 재배치와 row surface 결합 | 페이지별 회귀 검증 |
| terminal directory mobile rows | L11446–11550 | mobile 전용 DOM 노출과 row surface 결합 | terminal list 단위 검증 |
| weather mobile card | L11914–11967 | row와 cell 모두 surface 선언, 2열 grid 변환 | 두 선언을 한 묶음으로 검토 |
| operation desktop hover | L12179–12181 | hover 상태의 subtle surface | 상태 단계로 유지 |
| operation 760px rules | L12303 이후 | table hidden과 별도 card list 병행, 내부 table 변환 규칙 존재 | dead override 여부까지 별도 분석 |

### 20.8 직접값과 신규 토큰 검토 후보

- `.schedule-table tbody tr:hover`의 `#f8fbfd`는 row hover semantic token 후보지만 현재 동일 역할의 공식 토큰이 없다.
- `.portal-table-wrap` scrollbar의 `#aebdca`, `#edf2f6`는 scrollbar component token 후보이다.
- `.portal-operation-muted`의 `#9aa8b5`는 table 자체보다 operation text semantic 역할에 가깝다.
- cell padding과 row 높이는 값이 반복되어도 column 밀도와 모바일 동작이 다르므로 신규 global table spacing token을 바로 만들지 않는다.

### 20.9 높은 특이도와 유지보수 주의점

- `#schedule`은 ID selector와 6개 `nth-child` column 규칙을 사용한다.
- terminal route table은 base, `.portal-page .terminal-card-routes` override, 700px·1000px 규칙이 중첩된다.
- notice·inquiry·terminal directory는 `nth-child`와 자식 결합자로 mobile grid 위치를 재배치한다.
- operation table은 8개 column class와 여러 `nth-child` 규칙을 사용하며 760px 이하에서 별도 card list가 활성화된다.
- `.portal-subpage table thead th`처럼 넓은 selector가 `.portal-data-table`의 후반 규칙과 cascade를 형성한다. selector 통합이나 순서 변경은 alias 치환과 분리해야 한다.

### 20.10 권장 실행 순서

1. 20.5의 기본 surface 8곳만 semantic alias로 교체한다.
2. 20.6의 단일 gap 1곳을 global spacing alias로 교체한다.
3. id matrix, notice list, terminal directory, weather의 mobile surface는 컴포넌트별 breakpoint 작업으로 처리한다.
4. hover·focus-within surface는 상태 토큰 검토 단계로 분리한다.
5. 사용처가 없는 `.terminal-route-table`과 `.portal-route-table-wrap`은 migration하지 말고 삭제 가능성을 먼저 분석한다.
6. operation의 760px 내부 table 변환 규칙이 hidden wrapper 때문에 실제로 도달 가능한지 확인한 뒤 dead CSS 여부를 판단한다.
7. 공통 `.table` 클래스나 global table spacing token은 위 정리 후에도 실제 중복이 남을 때 재평가한다.

### 20.11 이번 단계 변경 범위

- 코드 변경 여부: 없음
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 삭제한 코드: 없음
- 문서 수정: `docs/design-tokens.md`

## 21. `.id-guide-matrix ul` 단일 `gap` 적용 전 분석

### 21.1 현재 선언과 실제 사용

| CSS 위치 | 선택자 | 속성 | 현재 값 | 제안 값 | 적용 구조 | 상태·variant |
|---|---|---|---|---|---|---|
| `common/style.css:9967` | `.id-guide-matrix ul` | `gap` | `var(--spacing-8)` | `var(--global-space-8)` | `display: grid`인 신분증 안내 목록 | 없음 |

- 선택자와 `gap` 선언은 서비스 CSS에서 각각 한 번만 확인된다.
- `boarding/id.html`의 `.id-guide-matrix` 표 안에서 여러 `ul > li` 목록에 실제로 적용되므로 미사용 규칙이 아니다.
- 관련 JavaScript는 행 필터만 제어하며 목록의 클래스, 구조 또는 `gap` 값을 변경하지 않는다.

### 21.2 alias와 계산값

| 토큰 | 선언 위치 | 참조 관계 | 최종 계산값 | 지역 scope 재정의 | 순환 참조 |
|---|---|---|---:|---|---|
| `--spacing-8` | `common/style.css:97` | 원본 Primitive | `8px` | 없음 | 없음 |
| `--global-space-8` | `common/style.css:108` | `var(--spacing-8)` | `8px` | 없음 | 없음 |

현재 값과 제안 값은 모두 `8px`로 계산된다. `gap`은 단일값 shorthand이므로 변경 전후의 `row-gap`과 `column-gap`도 각각 `8px`로 동일하다. fallback, `calc()`, `clamp()` 또는 다중값은 포함되지 않는다.

### 21.3 cascade와 breakpoint 영향

- 현재 규칙은 media query 밖의 기본 규칙이다.
- 같은 선택자에 대한 `gap` 재선언, 중복 속성, `!important`는 없다.
- 토큰 참조만 교체하므로 선택자 특이도, 선언 순서와 cascade는 바뀌지 않는다.
- `@media (max-width: 1000px)`는 `.id-guide-audience` 계열을 조정하며 `.id-guide-matrix ul`을 재정의하지 않는다.
- `@media (max-width: 700px)`는 표와 행·셀을 모바일 카드 구조로 바꾸지만 `.id-guide-matrix ul` 또는 해당 `gap`은 재정의하지 않는다. 따라서 모바일에서도 최종 간격은 `8px`이다.
- `@media (min-width: 480px) and (max-width: 700px)` 역시 audience 버튼만 조정하며 이 목록에는 영향을 주지 않는다.
- hover, focus, active, selected 또는 disabled 상태와 결합되지 않는다.

### 21.4 적용 판단과 보존 범위

| 판단 항목 | 결과 |
|---|---|
| 교체 가능성 | 즉시 교체 가능 |
| 영향도 | 낮음 |
| 시각적 계산 결과 | 변경 없음 (`8px` → `8px`) |
| 반응형 위험 | 낮음: 목록 자체의 override 없음 |
| 롤백 난이도 | 낮음: 단일 선언 1곳 |

다음 실행 단계에서는 아래 한 줄만 변경하는 것이 최소 안전 범위다.

```css
/* 변경 전 */
gap: var(--spacing-8);

/* 변경 후 */
gap: var(--global-space-8);
```

다음 관련 규칙은 유지해야 한다.

- `.id-guide-matrix ul`의 `display`, `margin`, `padding`, `list-style`
- `.id-guide-matrix li`의 `padding-left`
- `.id-guide-matrix li::before`의 불릿 표현
- `.id-guide-matrix .id-guide-primary`의 강조 간격
- 700px 이하의 표 카드 변환 규칙
- 다른 `gap`, `row-gap`, `column-gap` 및 spacing 토큰 사용처
- 원본 토큰과 alias 선언부

### 21.5 다음 실행 단계 검증 기준

1. 실제 변경이 `.id-guide-matrix ul`의 `gap` 한 곳인지 확인한다.
2. `--global-space-8`이 `--spacing-8`을 참조하고 두 값이 모두 `8px`로 계산되는지 확인한다.
3. 다른 `gap`, 목록 여백 및 breakpoint 규칙이 변경되지 않았는지 확인한다.
4. CSS 중괄호·괄호 구조와 `git diff --check`를 검증한다.
5. 데스크톱과 700px 이하에서 목록의 row·column 간격이 동일한지 확인한다.

- 코드 변경 여부: 없음
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 문서 수정: `docs/design-tokens.md`

## 22. 사용처가 없는 표·테이블 CSS 삭제 가능성 분석

### 22.1 조사 범위와 판정 기준

- 서비스 CSS는 `common/style.css`만 조사했다. 백업 CSS는 실제 사용처 집계에서 제외했다.
- 프로젝트의 HTML 40개와 JavaScript 37개에서 exact class token을 검색했다. 별도 템플릿 확장자 파일은 확인되지 않았다.
- 정적 마크업뿐 아니라 `className`, `innerHTML`, `createElement` 등 동적 생성 코드도 대조했다.
- 클래스명이 비슷한 활성 목록 UI와 공통 table 기반 클래스는 별도 계열로 분리했다.

### 22.2 exact 사용 현황

| 클래스 | 서비스 HTML·JS 사용 횟수 | CSS 역할 | 판정 |
|---|---:|---|---|
| `.terminal-route-table` | 0 | 기존 터미널 카드의 항로 표 | 삭제 가능 |
| `.terminal-route-table-wrap` | 0 | 위 표의 border·overflow wrapper | 삭제 가능 |
| `.portal-route-table-wrap` | 0 | 포털 항로 데이터표 wrapper | 삭제 가능 |
| `.portal-route-browser` | 0 | 포털 항로표 상위 컨테이너 | 표 계열과 함께 조건부 삭제 가능 |
| `.portal-route-empty` | 0 | 포털 항로표 빈 상태 | 표 계열과 함께 조건부 삭제 가능 |
| `.terminal-route-pending` | 0 | 터미널 항로표 준비 중 상태 | 표 계열과 함께 조건부 삭제 가능 |
| `.terminal-card-routes` | 1 | 현재 카드의 항로 목록 row | 유지 |
| `.terminal-route-list` | 1 | 현재 항로 `ul` 목록 | 유지 |
| `.portal-data-table` | 6 | 공지·문의·터미널 목록·운항정보 등 공통 표 | 유지 |
| `.portal-table-wrap` | 6 | 활성 공통 표 wrapper | 유지 |
| `.status-table-wrap` | 1 | 운항 현황표 wrapper | 유지 |

현재 `common/portal.js:150–159`의 `createRouteList()`는 `ul.terminal-route-list`와 `li`를 생성한다. `common/portal.js:183–187`은 이 목록을 `.terminal-card-routes`에 넣으며 table 또는 위 세 table wrapper 클래스를 만들지 않는다.

### 22.3 `.terminal-route-table` 계열 삭제 경계

#### 전용 규칙

| CSS 위치 | 범위 | 내용 | 조치 |
|---|---|---|---|
| L4490–4531 | wrapper, table, cell, header, 첫 열, row header | 기본 항로표 전체 | 블록 삭제 가능 |
| L4584–4620 | `max-width: 700px` | table display 복원, cell·thead·tbody·tr 재정의 | 해당 selector 규칙만 삭제하고 media block의 다른 규칙은 유지 |
| L4809–4850 | `.terminal-card-routes` 하위 legacy table | card 전용 border·cell·hover·색상 | 블록 삭제 가능 |
| L5231–5235 | `701px–1000px` | cell 세로 padding override | 해당 규칙만 삭제 |
| L5306–5320 | 2·3열 폭과 정렬 | `nth-child` 기반 column geometry | 블록 삭제 가능 |
| L5341–5349 | `min-width: 1001px` | wrapper scroll과 sticky header | 해당 규칙만 삭제 |
| L5385–5387 | `max-width: 700px` | header 글자 크기 | 해당 규칙만 삭제 |

#### 공유 selector에서 member만 제거할 규칙

| CSS 위치 | dead member | 반드시 보존할 활성 member |
|---|---|---|
| L798–802 | table row hover의 `th`, `td` | `.section-soft` |
| L1226–1235 | `.terminal-route-table` 마지막 행 `th`, `td` | schedule, parking, guide, safety selector |
| L5290–5297 | table body `th`, `td` | address, phone, hours selector |
| L9831–9835 | `.portal-page .terminal-route-table` | portal subpage table, `#schedule table` |
| L9837–9843 | 700px route table member | portal subpage table, `#schedule table` |
| L9845–9852 | route table header member | portal subpage 및 schedule header |

공유 규칙 전체를 삭제하면 활성 컴포넌트의 surface, border 또는 typography가 손실된다. 따라서 exact selector member만 제거해야 한다. L796의 `merged` 주석은 member 제거 후 실제 내용에 맞게 함께 정리할 필요가 있다.

### 22.4 `.portal-route-table-wrap` 계열 삭제 경계

| CSS 위치 | 내용 | 조치 |
|---|---|---|
| L9298–9321 | wrapper overflow·padding, 내부 `.portal-data-table`, caption, 숫자 열 폭·정렬 | 전용 규칙 삭제 가능 |
| L9333–9341 | `max-width: 700px` wrapper·cell padding | media block 전체 삭제 가능 |
| L9346–9352 | 공통 `max-width: 100%` 그룹 | `.portal-route-table-wrap` member만 제거하고 나머지 4개 selector 유지 |

`.portal-route-table-wrap .portal-data-table`은 descendant 조합 전체가 미사용이다. 하지만 `.portal-data-table` 자체는 6개 서비스 사용처가 있으므로 공통 클래스 규칙은 삭제하면 안 된다.

### 22.5 연계된 보조 규칙과 토큰

| 위치 | 대상 | 사용 현황 | 권장 조치 |
|---|---|---:|---|
| L9292–9296 | `.portal-route-browser` | 0 | portal route table 제거와 같은 작업에서 삭제 가능 |
| L9323–9328 | `.portal-route-empty` | 0 | portal route table 제거와 같은 작업에서 삭제 가능 |
| L4852–4860 | `.terminal-route-pending` | 0 | terminal route table 제거와 같은 작업에서 삭제 가능 |
| L2724 | `--terminal-route-first-cell-padding` | dead table selector에서만 1회 참조 | table 규칙 삭제 후 orphan 확인을 거쳐 별도 삭제 가능 |

`portal.routeCaption`, `routeName`, `routePending` 번역 키는 locale 정의에 남아 있지만 실행 코드의 참조는 0건이다. `portal-data.js`의 route `duration`과 `frequency` 데이터는 남아 있으나 현재 `createRouteList()`는 route name만 사용한다. 데이터·번역 키 삭제는 이번 CSS 분석 범위를 벗어나므로 후속 정리 대상으로만 기록한다.

### 22.6 삭제하면 안 되는 유사 계열

- `.terminal-card-routes`와 `.terminal-route-list`는 `common/portal.js`가 실제 생성하므로 유지한다.
- L4783–4807, L5076, L5094의 `.terminal-route-list` 레이아웃과 구분점 규칙은 유지한다.
- `.terminal-card-routes`가 포함된 규칙이라도 descendant가 legacy table이 아닌 row 자체의 레이아웃 규칙은 유지한다.
- `.portal-data-table`, `.portal-table-wrap`, `.status-table-wrap`과 각 페이지별 활성 variant는 유지한다.
- `.terminal-route-block`은 exact 사용처가 0건이지만 table 계열이 아니므로 이번 삭제 후보에 포함하지 않고 별도 분석한다.

### 22.7 삭제 안전성 결론

| 후보 묶음 | 저장소 내부 삭제 안전성 | 위험도 | 전제 |
|---|---|---|---|
| `.terminal-route-table` + `.terminal-route-table-wrap` 전용 규칙 | 높음 | 낮음 | 공유 selector에서는 dead member만 제거 |
| `.portal-route-table-wrap` 전용 규칙 | 높음 | 낮음 | 공통 `.portal-data-table` 규칙 보존 |
| `.portal-route-browser`, `.portal-route-empty`, `.terminal-route-pending` | 높음 | 낮음 | 각 table 계열과 한 묶음으로 제거 |
| `--terminal-route-first-cell-padding` | 조건부 | 낮음 | selector 삭제 후 참조 0건 재검증 |

현재 저장소 기준으로 두 legacy 항로표 계열은 삭제 가능하다. 다만 저장소 밖 CMS 또는 서버 렌더링 마크업이 이 클래스 계약을 사용한다면 영향이 생길 수 있으므로, 외부 주입이 없다는 전제에서만 실행한다.

### 22.8 권장 실행 순서

1. `.terminal-route-table`과 `.terminal-route-table-wrap` 전용 규칙을 제거한다.
2. 여섯 공유 규칙에서는 legacy table selector member만 제거하고 활성 member를 보존한다.
3. `.portal-route-table-wrap` 전용 base·700px 규칙을 제거하고 공통 max-width 그룹에서는 해당 member만 제거한다.
4. 세 보조 클래스 규칙을 같은 계열과 함께 제거한다.
5. `--terminal-route-first-cell-padding`의 참조가 0건인지 재확인한 뒤 토큰 삭제 여부를 별도 결정한다.
6. `.terminal-card-routes`, `.terminal-route-list`, 공통 data table 규칙이 그대로인지 검증한다.
7. CSS 구조 검사와 `git diff --check`를 실행한다.

- 코드 변경 여부: 없음
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 삭제한 코드: 없음
- 문서 수정: `docs/design-tokens.md`

## 23. 문서·알림·탭 계열 토큰 및 중복 분석

### 23.1 조사 범위와 원칙

- 서비스 CSS는 `common/style.css`만 분석했다.
- HTML과 JavaScript는 실제 클래스 조합, 동적 생성, ARIA 상태 전환 확인에만 사용했으며 수정하지 않았다.
- 탭·필터는 `.btn`으로 통합하지 않고 `role="tab"`, `aria-selected`, `aria-pressed`, roving `tabindex`와 keyboard 처리 여부를 우선했다.
- 같은 계산값이라도 surface, text, border, indicator, status처럼 역할이 다르면 통합 후보로 보지 않았다.

### 23.2 실제 사용 계열

| 계열 | 대표 선택자 | 서비스 exact 참조 | 상태·역할 | 판정 |
|---|---|---:|---|---|
| 문서 heading | `.portal-content-heading` | 17 | 정적 heading, 700px typography override | 유지·spacing alias 전환 가능 |
| 정책 문서 | `.portal-policy-page`, `.portal-policy-section` | 2 / 14 | 정적 article·section, 600px padding override | 유지 |
| 사이트맵 | `.portal-sitemap-group` | 5 | navigation link, hover·focus-visible, 1000px·600px grid override | 유지·기본 surface 전환 가능 |
| 일정 안내문 | `.notice-line` | 1 | 비상태 보조 안내문 | 유지 |
| 발권 주의문 | `.terminal-ticket-notice` | 2 | warning surface | status semantic 유지 |
| 목록 빈 상태 | `.portal-notice-empty` | 3 | `role="status"`, `[hidden]` | 유지 |
| 공지 상세 | `.portal-notice-detail` | 1 | 본문·이전/다음 navigation·hover·focus | 유지·단순 gap 전환 가능 |
| 문의 오류 | `.portal-inquiry-auth-form [role="alert"]` | 1 | danger status, 700px grid override | 유지 |
| 스케줄 pill filter | `.terminal-tabs`, `.tab-pill`, `.route-type-filter` | 1 / 9 / 2 | `aria-pressed` | 유지 |
| 출발·도착 탭 | `.movement-tabs`, `.movement-tab` | 1 / 3 | `role="tablist"`, `aria-selected`, keyboard tab semantics | 유지 |
| 터미널 유형 filter | `.terminal-type-filter` | 2 | `aria-pressed`, component-scoped sizing token | 유지 |
| FAQ category 탭 | `.portal-faq-categories`, `.portal-faq-category` | 1 / 6 | `role="tablist"`, `aria-selected`, roving `tabindex` | 유지 |
| 공지 underline 탭 | `.portal-notice-tabs` | query-only 1 | JS는 조회·상태 로직만 존재, 마크업 생성 없음 | 통합 보류·미사용 분석 우선 |
| 공지 탭 toolbar | `.portal-notice-toolbar` | 0 | 공지 탭 layout | migration 제외·미사용 분석 우선 |

### 23.3 토큰 사용 구조

#### 문서 계열

| 선택자·위치 | surface | spacing | radius·border | typography | 상태·breakpoint |
|---|---|---|---|---|---|
| `.portal-content-heading` L6224–6264 | 없음 | `12px` 상단 문단 margin, literal `36px` bottom | 없음 | caption·display·body-lg와 global line-height | 700px에서 heading margin·h2 크기 override |
| `.portal-policy-section` L6283–6323 | 없음 | `32px 8px` padding, `12px` heading margin | `--border-default` | h3·body-lg, global loose line-height | 600px에서 `24px 0` padding |
| `.portal-sitemap-group` L6329–6405 | `--bg-base`, header는 `--surface-subtle` | grid `16px`, link `8px` gap | `--portal-content-border`, top brand border | h3·body | hover·focus-visible 공유, 1000px·600px grid override |
| `.portal-notice-detail` L9465–9578 | nav hover `--brand-overlay-faint` | `24px`, `8px`, `20px` gap 등 | inverse/content border | h2·body | nav hover·focus, disabled, 700px `dl` gap override |

#### 알림 계열

| 선택자·위치 | 의미 토큰 | 직접·복합값 | 판단 |
|---|---|---|---|
| `.notice-line` L1410–1416 | muted text | margin `0` | 이미 단순 semantic text 사용 |
| `.terminal-ticket-notice` L1648–1662 | `--status-warning-bg`, `--status-warning` | border `color-mix()`, spacing shorthand, `--radius-card-sm` | warning 의미가 명확해 유지. 단순 alias 일괄 치환 제외 |
| `.portal-faq-empty, .portal-notice-empty` L7203–7211 | muted text, content border | padding shorthand | status region의 구조 유지, spacing 기계 치환 제외 |
| `.portal-notice-detail-empty, .portal-weather-fallback-status` L9476–9491 | `--bg-subtle`, body text | 두 컴포넌트 공유 selector | `--surface-subtle` 계산값은 같지만 cross-component 규칙이라 묶음 확인 후 전환 |
| `.portal-inquiry-auth-form [role="alert"]` L14030–14036 | `--status-danger` | margin shorthand | danger semantic이 정확하므로 유지 |

#### 탭·필터 계열

| 선택자·위치 | 기본 surface·border | 선택 상태 | focus | 구조 판단 |
|---|---|---|---|---|
| `.tab-pill` L993–1032 | `--surface-base`, `--border-default`, pill radius | `aria-selected`·`aria-pressed`가 inverse background/text 사용 | `--text-brand` outline | pill visual foundation이며 button 일반화 대상 아님 |
| `.movement-tab` L1078–1121 | transparent, border 없음 | inverse text와 3px underline | 전역 focus-visible 상속 | 실제 ARIA tab |
| `.terminal-type-filter` L4546–4585 | component token 기반 geometry, transparent | `aria-pressed` bottom indicator | text-brand outline | map/card filter 전용 계약 유지 |
| `.portal-faq-category` L7074–7106 | `.tab-pill` 조합 후 overlay로 override | `aria-selected` brand surface와 check 표시 | 전역 focus ring을 보존한 selected group | pill과 tab semantics가 조합된 variant |
| `.portal-notice-tabs button` L7689–7752 | movement tab과 거의 동일 | `aria-selected` inverse text·underline | outline offset만 추가 | 현재 마크업 부재로 공통화보다 deprecated 분석 우선 |

### 23.4 실제 중복과 값만 같은 경우

#### 실제 의미 중복

- `.movement-tab`과 `.portal-notice-tabs button`은 width, transparent background, typography, selected underline 및 active weight가 같은 underline tab 모델이다.
- 두 계열 모두 `aria-selected`를 사용하지만 공지 탭 마크업이 현재 존재하지 않으므로 지금 공통 selector나 새 tab foundation을 만들면 미사용 CSS를 보존하는 결과가 된다.
- 공지 탭 사용 여부를 먼저 확정하고, 사용한다면 `.tab-underline` 같은 별도 tab foundation을 검토한다. `.btn` 통합은 하지 않는다.

#### 값만 같은 경우

- `8px`은 tab collection gap, link 내부 gap, 문서 spacing에 반복되지만 역할이 다르므로 값이 같다는 이유로 속성이나 컴포넌트를 통합하지 않는다.
- `--portal-content-border`는 현재 `--border-default`를 참조하지만 portal 문서 계열의 경계 의미를 유지할 수 있으므로 직접 치환하지 않는다.
- `--global-radius-pill: 999px`, `--radius-card-sm: 12px`, `--global-radius-sm: 8px`은 각각 pill, warning card, control 역할이 달라 통합하지 않는다.
- inverse 색상은 selected background, tab indicator, text에 함께 쓰이지만 속성 의미가 다르다. background만 surface alias 후보이며 text·border·indicator를 surface로 치환하지 않는다.

### 23.5 focus와 접근성 보존

- `.tab-pill:focus-visible`과 `.terminal-type-filter:focus-visible`은 `--text-brand`를 outline 색상으로 사용한다. `--focus-ring-brand`는 다른 색상값이므로 교체하면 시각 결과가 달라져 이번 저위험 후보에서 제외한다.
- `.movement-tab`과 FAQ category는 전역 `:focus-visible` outline을 상속한다. selected selector를 단순화하면서 focus-visible member를 제거하면 안 된다.
- FAQ는 JavaScript가 `aria-selected`와 `tabindex`를 함께 갱신한다. CSS 통합 시 이 관계와 arrow-key 이동을 유지해야 한다.
- `aria-pressed` filter와 `aria-selected` tab은 상태 의미가 다르므로 같은 selector나 token 이름으로 합치지 않는다.
- 사이트맵과 공지 상세 link의 `:focus-visible`은 hover 색상을 공유하더라도 전역 focus outline을 유지한다.

### 23.6 저위험 alias 전환 후보

다음 후보는 단순 단일값 참조이며 selector, 상태 모델과 계산값을 바꾸지 않는다.

| 우선순위 | 위치 | 선택자 | 속성 | 변경 전 | 변경 후 | 계산값 | 영향도 |
|---:|---:|---|---|---|---|---:|---|
| 1 | L6343 | `.portal-sitemap-group` | `background` | `--bg-base` | `--surface-base` | white → white | 낮음 |
| 2 | L989 | `.terminal-tabs` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 낮음 |
| 3 | L1037 | `.route-type-filters` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 낮음 |
| 4 | L1074 | `.movement-tabs` | `gap` | `--spacing-32` | `--global-space-32` | 32px → 32px | 낮음 |
| 5 | L6448 | `.portal-content-heading-row` | `gap` | `--spacing-32` | `--global-space-32` | 32px → 32px | 낮음 |
| 6 | L6950 | `.portal-filter-select-group` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 낮음 |
| 7 | L7065 | `.portal-faq-categories` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 낮음 |
| 8 | L9496 | `.portal-notice-detail dl` | `gap` | `--spacing-24` | `--global-space-24` | 24px → 24px | 낮음; 700px override 유지 |
| 9 | L9504 | `.portal-notice-detail dl div` | `gap` | `--spacing-8` | `--global-space-8` | 8px → 8px | 낮음 |
| 10 | L9532 | `.portal-notice-detail-nav>a, >span` | `gap` | `--spacing-20` | `--global-space-20` | 20px → 20px | 낮음 |

라인은 현재 서비스 CSS 기준이며 후속 편집으로 이동할 수 있으므로 실행 전 selector·속성·원본 토큰을 다시 확인한다.

### 23.7 즉시 전환에서 제외할 항목

| 대상 | 이유 | 권장 조치 |
|---|---|---|
| `.portal-notice-tabs`, `.portal-notice-toolbar` | 실제 마크업·생성 코드가 없고 query만 존재 | 삭제 가능성 선행 분석 |
| selected·pressed background | 상태 surface 의미를 별도 token으로 명세하지 않음 | component state token 검토 후 전환 |
| tab underline `background: --bg-inverse` | surface가 아니라 indicator 역할 | indicator semantic token 검토 |
| FAQ selected `background: --text-brand` | action·selection 의미 판단 필요 | 값이 같아도 `--action-primary`로 즉시 변경하지 않음 |
| tab/filter focus outline | `--focus-ring-brand`와 현재 계산값이 다름 | 시각 변경 승인 전 유지 |
| warning border `color-mix()` | 복합식이며 status와 base surface를 혼합 | status border token 검토 |
| padding·margin shorthand | 축별 의미와 breakpoint override 존재 | collection 단위 후속 분석 |
| `--radius-card-sm` | global radius와 동일 계산값 없음 | 유지 또는 신규 Primitive 검토 |
| `.portal-content-border` | 현재 값은 같지만 portal 문서 경계 의미를 가짐 | alias 계약 유지 |

### 23.8 권장 다음 단계

1. 23.6의 기본 규칙 10곳만 한 번의 제한된 실행 단계로 교체한다.
2. media query 내부 gap과 padding shorthand는 이번 10곳과 분리한다.
3. 공지 underline 탭 계열은 exact markup·외부 주입 여부를 확인한 뒤 deprecated 분석을 수행한다.
4. selected·pressed·indicator·focus token은 상태 명세를 먼저 만든 뒤 변경한다.
5. 탭·필터의 클래스명, ARIA 속성, keyboard 처리와 HTML·JS는 유지한다.

- 코드 변경 여부: 없음
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 삭제한 코드: 없음
- 문서 수정: `docs/design-tokens.md`

## 24. 문서·알림·탭 계열 미사용 CSS 삭제 분석 및 적용 결과

> 적용 상태: 완료 (2026-10-02). `common/style.css`에서 공지 underline 탭·toolbar·content 전용 CSS 17개 rule block을 삭제했다. 현재 서비스 CSS에서 `.portal-notice-toolbar`, `.portal-notice-tabs`, `.portal-notice-content` 참조는 각각 0건이다. 이 장의 기존 CSS 라인 번호는 삭제 전 분석 시점의 위치다.

### 24.1 조사 범위와 집계 기준

- 서비스 소스는 `common/style.css`, `common/layout.js`, `common/portal.js`를 우선 확인하고, 실제 생성 경로 확인을 위해 `common/schedule.js`, `common/portal-map.js`와 이 스크립트를 로드하는 HTML도 교차 검색했다.
- HTML, JS, Markdown과 저장소 내 템플릿·테스트·빌드 스크립트 후보 81개 파일을 검색했다. 실제 서비스 참조는 `common/portal.js`, `common/portal-map.js`, `common/schedule.js`에서만 확인됐다.
- `.codex/**`의 브라우저 Cache_Data와 `common/style.backup-20260921.css`, `common/style.before-mobile-drawer-20260921.css`는 서비스 사용처 집계에서 제외했다. 백업 CSS에는 대상 규칙의 과거 복사본이 있지만 런타임 사용 근거가 아니다.
- 아래 표의 수치는 raw substring 수가 아니라 역할별 코드 지점 수다. `실제 런타임 사용`은 현재 서비스 페이지에서 도달 가능하면 1, DOM 생성 경로가 없어 가드에서 종료되면 0이다. `문서·예시`는 이 분석을 추가하기 전 `docs/design-tokens.md`의 exact selector 언급 수다.

| selector | HTML·템플릿 | JS 생성 | classList·setAttribute | selector 조회 | 이벤트 연결 | 문서·예시 | 실제 런타임 사용 | 합계 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `.portal-notice-tabs` | 0 | 0 | 0 | 1 | 2 | 5 | 0 | 8 |
| `.portal-notice-tabs button` | 0 | 0 | 1 | 1 | 2 | 2 | 0 | 6 |
| `.movement-tab` | 0 | 2 | 2 | 1 | 2 | 4 | 1 | 12 |
| `.movement-tabs` | 0 | 1 | 0 | 0 | 0 | 2 | 1 | 4 |
| `.terminal-type-filter` | 0 | 1 | 3 | 1 | 1 | 3 | 1 | 10 |
| `.terminal-tabs` | 0 | 1 | 2 | 0 | 1 | 2 | 1 | 7 |
| `.route-type-filters` | 0 | 1 | 4 | 1 | 1 | 1 | 1 | 9 |

`HTML·템플릿`은 정적 HTML class 속성을 뜻한다. 일정·지도 UI는 JavaScript template 또는 DOM API로 생성되므로 `JS 생성`에 집계했다. `classList·setAttribute`와 `이벤트 연결`은 부모 selector 자체뿐 아니라 그 collection이 소유하는 child 상태 처리도 포함한다.

### 24.2 실제 생성·조회·호출 경로

| 계열 | 생성·조회 위치 | 호출 페이지 | null·fallback 처리 | 판정 |
|---|---|---|---|---|
| 공지 underline 탭 | 삭제 전 `common/portal.js` L324–360, 호출 L463 | `index.html`, `terminal/map.html`이 `portal.js`를 로드 | 삭제 전 L325–327에서 `.portal-notice-tabs`와 `.portal-notice-content`를 조회하고 하나라도 없으면 즉시 return | 런타임 미사용으로 확인 후 CSS·JS 제거 완료 |
| 출발·도착 탭 | `common/schedule.js` L73–75 생성, L111 조회 | 군산·인천·제주·포항·통영·완도·여수 `index.html` 7개 | `#schedule`이 없으면 스크립트 상단에서 종료하며, 대상 페이지에서는 section 존재 | 실제 런타임 사용 |
| 터미널 pill filter | `common/schedule.js` L77–79 생성, L108 조회 | 위 터미널 7개 페이지 | 생성 직후 동일 section에서 조회 | 실제 런타임 사용 |
| 항로 유형 filter | `common/schedule.js` L82–86 조건부 생성, L109–110 조회 | route type 데이터가 있는 터미널 일정 | panel은 없을 수 있고 optional chaining·조건문으로 처리. 존재 시 terminal 선택에 따라 `hidden` 갱신 | 조건부이지만 실제 런타임 사용 |
| 터미널 유형 filter | `common/portal-map.js` L89 container 생성, `common/portal.js` L97·L225·L255 | `index.html`, `terminal/map.html` | map marker가 없으면 `portal.js` L92에서 종료. 대상 두 페이지에는 marker와 container가 함께 생성됨 | 실제 런타임 사용 |

`common/layout.js`에는 우선 조사 selector의 생성, 조회, class toggle, 이벤트 위임이 없다. 공지 목록 전용 페이지 `customer/notice.html`은 select·검색·table 구조를 자체 생성하며 `portal.js`를 로드하지 않는다. 따라서 공지 underline 탭의 숨은 소비자가 아니다.

### 24.3 CSS 하위 규칙과 삭제 경계

| selector 계열 | CSS 위치 | 포함 상태·반응형 | 공유 여부 | 분류 | 조치 |
|---|---|---|---|---|---|
| `.portal-notice-toolbar` | 삭제 전 L7599–7607, L7947–7949 | 760px margin override | 전용. L7609 descendant도 공지 탭 전용 | dead CSS 확인 | 삭제 완료 |
| `.portal-notice-tabs` | 삭제 전 L7609–7612, L7705–7716, L7950–7955 | scrollbar, 760px overflow | 전용 | dead CSS 확인 | 삭제 완료 |
| `.portal-notice-tabs button` | 삭제 전 L7718–7768, L7956–7958 | `::after`, hover, `[aria-selected]`, focus-visible, 760px indicator 위치 | 전용 | dead CSS 확인 | parent와 함께 삭제 완료 |
| `.portal-notice-content` | 삭제 전 L7770–7779, L7920–7924, L7959–7961 | `.is-list-only`, 1000px grid override, 760px gap override | 전용 | dead CSS 확인 | 탭·toolbar와 함께 삭제 완료 |
| `.movement-tabs` | L1074–1078, L2431–2433 | 700px width override | 전용 | 실제 사용 규칙 | 유지 필요 |
| `.movement-tab` | L1080–1123, L2434–2436 | `::after`, hover, `[aria-selected]`, 700px typography | 전용. 공지 탭과 현재 grouped selector 없음 | 실제 사용 상태 규칙 | 전체 유지 |
| `.terminal-tabs` | L989–993, L2437–2440 | 700px scroll·padding | container 전용, 상태는 `.tab-pill`이 담당 | 실제 사용 규칙 | 유지 필요 |
| `.route-type-filters` | L1036–1061, L2447–2453 | `[hidden]`, child label, 700px overflow | `[hidden]`은 다른 7개 selector와 grouped | 실제 사용 상태 규칙 | 유지. grouped rule 전체 삭제 금지 |
| `.terminal-type-filter` | L4542–4588, L4921–4929, L5072–5074, L5112–5137, L5206–5213 | hover, focus-visible, `[aria-pressed]`, hidden, 700px·1000px 계열 layout | focus-visible은 `.site-footer-select select`와 grouped | 실제 사용 상태 규칙 | 유지. shared focus rule 분리·삭제 금지 |

현재 CSS에는 예시의 `.movement-tab, .portal-notice-tabs button { ... }` 같은 결합 규칙이 없다. 두 계열은 시각 모델이 유사하지만 각각 독립 선언이다. 따라서 공지 탭 규칙을 제거해도 `.movement-tab`의 base, selected underline, hover, mobile typography에는 cascade 영향이 없다.

공지 계열의 최소 CSS 삭제 묶음은 다음 17개 rule block이다.

1. `.portal-notice-toolbar` base와 760px override
2. `.portal-notice-toolbar .portal-notice-tabs`
3. `.portal-notice-tabs` base, scrollbar, 760px override
4. `.portal-notice-tabs button` base, `::after`, hover, `[aria-selected]`, selected `::after`, focus-visible, 760px `::after`
5. `.portal-notice-content` base, `.is-list-only`, 1000px override, 760px override

1000px media block L7920–7924는 `.portal-notice-content`만 포함하므로 rule 제거 후 빈 media block도 함께 정리할 수 있다. 760px media block은 활성 `.portal-home-notice-card`, `.portal-home-notice-list` 등과 공유하므로 공지 탭 관련 member만 제거해야 한다.

### 24.4 접근성·상태·JS 의존성

| 계열 | 선택 상태 | focus·keyboard | panel 연결 | URL 상태 | 판단 |
|---|---|---|---|---|---|
| 공지 underline 탭 | JS가 `[data-notice-filter]`의 `aria-selected`와 `[data-notice-category]`의 `hidden`을 갱신 | click, 좌·우 화살표, focus 이동. button이면 Enter·Space는 native click. roving `tabindex`, `role=tab`, `aria-controls` 생성은 없음 | generic category item만 show/hide | hash·query 연결 없음 | DOM이 없어 현재 동작하지 않음. 재도입 시 ARIA tab 구조와 roving tabindex 보완 필요 |
| 출발·도착 탭 | `aria-selected` 갱신 | click, 좌·우 화살표, roving `tabIndex` 0/-1, 전역 focus ring. Enter·Space는 native button | `aria-controls`로 `role=tabpanel`의 `hidden` 갱신 | 없음 | 완전한 런타임 의존. 삭제 금지 |
| 터미널 pill filter | child `.terminal-tab`의 `aria-pressed` 단일 선택 | native button click·keyboard, `.tab-pill:focus-visible` | table render filter | 없음 | filter이며 tab으로 일반화하거나 삭제하지 않음 |
| 항로 유형 filter | child `.route-type-filter`의 `aria-pressed` toggle | native button click·keyboard, `.tab-pill:focus-visible` | 선택 터미널에 route type이 있을 때 parent `hidden` 해제 | 없음 | 조건부 상태 규칙 포함, 삭제 금지 |
| 터미널 유형 filter | `aria-pressed`, `aria-disabled`, native disabled | click, 전용 focus-visible. roving tabindex·방향키 없음 | 지도 marker·terminal card 선택과 연결 | 없음 | 지도 컴포넌트 핵심 상태, 삭제 금지 |

우선 조사 계열에는 `aria-current`, `.active`, `.selected`, `.is-open`, `.is-collapsed`, `:has()`가 결합되지 않는다. 공지 탭과 movement tab의 선택 indicator는 `[aria-selected="true"]::after`, filter 계열은 `[aria-pressed="true"]`가 담당한다.

### 24.5 추가 미사용 후보와 보존 대상

추가 발견한 미사용 후보는 `.portal-notice-content`와 `.portal-notice-content.is-list-only`다. 서비스 HTML·생성 JS에는 class가 없고, `common/portal.js`의 query 1건만 존재한다. `.portal-notice-toolbar`도 서비스 생성·조회 0건이다. 세 계열은 공지 underline 탭과 함께 제거해야 잔여 layout CSS가 남지 않는다.

반대로 다음은 이름이 유사해도 삭제 묶음에 포함하지 않는다.

- `.portal-home-notice-card`, `.portal-home-notice-list`: `index.html` L166과 `common/portal.js` L321의 최신 공지 렌더링에서 실제 사용
- `.portal-notice-page`, `.portal-notice-table-*`, `.portal-notice-empty`: `customer/notice.html`의 현재 공지 목록·검색·pagination에서 실제 사용
- `.portal-notice-detail*`: 공지 상세 페이지에서 실제 사용
- `.notice-line`, `.terminal-ticket-notice`, FAQ empty·alert 규칙: 각각 서비스 마크업 또는 동적 상태에서 사용

### 24.6 삭제 실행 결과

| 대상 | 삭제 안전성 | 근거 | 적용 결과 |
|---|---|---|---|
| 공지 underline 탭·toolbar·content CSS 17개 rule block | 높음 | 생성 마크업 0, 정적 DOM 0, active selector와 grouped rule 없음 | `common/style.css`에서 삭제 완료, 잔여 참조 0건 |
| `initializeNoticeTabs()`와 호출 | 높음 | 항상 no-op이었고 외부 API가 아닌 로컬 함수 | 후속 JS 작업에서 삭제 완료, 잔여 참조 0건 |
| movement tabs | 삭제 불가 | 7개 터미널 페이지의 ARIA tab·panel·keyboard 동작 | 유지 |
| terminal tabs·route type filters | 삭제 불가 | 일정 filtering과 conditional panel 표시 | 유지 |
| terminal type filters | 삭제 불가 | 메인·지도 페이지의 terminal card와 marker 선택 | 유지 |

삭제는 공지 underline 탭·toolbar·content 전용 17개 rule block으로 제한했다. `.portal-home-notice-*`, 공지 목록 table, movement tab, `.tab-pill`, terminal type filter, shared `[hidden]`, shared focus selector는 보존했다. CSS 구조 검사와 `git diff --check`가 통과했으며 줄바꿈 관련 LF→CRLF 메시지는 CSS 오류가 아니다.

- 적용 코드 변경 여부: 있음
- 적용 파일: `common/style.css`
- 삭제한 CSS: 공지 underline 탭 전용 17개 rule block
- HTML·템플릿 수정 여부: 없음

## 25. 공지 underline 탭 JS dead code 분석 및 적용 결과

> 적용 상태: 완료 (2026-10-02). `common/portal.js`에서 `initializeNoticeTabs()` 함수 전체와 유일한 호출부를 삭제했다. 현재 서비스 소스에서 함수명과 관련 공지 underline 탭 selector·data attribute 참조는 0건이다. 이 장의 JS 라인 번호는 삭제 전 분석 시점의 위치다.

### 25.1 조사 범위

- 우선 조사: `common/portal.js`, `common/layout.js`
- 교차 확인: 서비스 HTML, `common/style.css`, locale 파일, 기타 JS, Markdown, 템플릿·테스트·빌드 스크립트 후보
- 제외 집계: `.codex/**` 브라우저 캐시, `common/*.backup-*`, `common/*.before-*`

CSS 삭제 후 서비스 소스에서 공지 underline 탭을 직접 참조하는 코드는 `common/portal.js`의 `initializeNoticeTabs()` 한 곳뿐이다. `common/layout.js`에는 관련 class, data attribute, DOM 생성, selector 조회, 이벤트 위임 또는 상태 변경이 없다.

### 25.2 선언·호출·DOM 의존성

| 항목 | 위치 | 참조 수 | 역할 | 현재 도달 결과 | 판정 |
|---|---:|---:|---|---|---|
| `initializeNoticeTabs()` 선언 | 삭제 전 `common/portal.js` L324–360 | 선언 1 | 공지 category tab 상태와 item 표시 제어 | DOM 부재로 실동작 없음 | 삭제 완료 |
| `initializeNoticeTabs()` 호출 | 삭제 전 `common/portal.js` L463 | 호출 1 | portal 초기화 마지막 단계에서 실행 | 함수 내부 guard에서 종료 | 삭제 완료 |
| `.portal-notice-tabs` | `common/portal.js` L325 | 조회 1 | tab container 조회 | 실제 DOM 0건으로 `null` | dead selector 조회 |
| `.portal-notice-content` | `common/portal.js` L326 | 조회 1 | filter 대상 container 조회 | 실제 DOM 0건으로 `null` | dead selector 조회 |
| `[data-notice-filter]` | `common/portal.js` L328 | 조회 1 | child tab 수집 | L327 return 이후라 실행되지 않음 | dead branch |
| `[data-notice-category]` | `common/portal.js` L329 | 조회 1 | 공지 item 수집 | L327 return 이후라 실행되지 않음 | dead branch |
| `noticeFilter`, `noticeCategory` dataset | `common/portal.js` L332, L339 | 각 1 | category 값 비교 | 실행되지 않음 | dead branch |

함수는 export되거나 `window`에 할당되지 않은 IIFE 내부 로컬 함수다. 호출도 L463 한 곳뿐이며 반환값을 사용하지 않는다. 따라서 선언과 호출을 함께 제거하면 다른 함수의 호출 계약이나 전역 API가 달라지지 않는다.

### 25.3 삭제 전 런타임 흐름

`common/portal.js`는 `index.html`과 `terminal/map.html`에서만 로드된다. 두 페이지 모두 map marker가 있으므로 L92의 marker guard를 통과하고 L463의 `initializeNoticeTabs()` 호출까지 도달한다. 그러나 저장소 내 정적 HTML, `common/portal-map.js`, `common/layout.js`, inline template 어디에도 `.portal-notice-tabs` 또는 `.portal-notice-content`를 생성하는 경로가 없다.

실제 흐름은 다음과 같다.

1. L463에서 `initializeNoticeTabs()` 호출
2. L325에서 `.portal-notice-tabs` 조회 결과 `null`
3. L326에서 `.portal-notice-content` 조회 결과 `null`
4. L327의 `if (!tabList || !content) return;`에서 종료
5. tab·item 조회, `aria-selected`, `hidden`, click·keydown listener 등록은 실행되지 않음

`customer/notice.html`은 `portal.js`를 로드하지 않는다. 해당 페이지는 `.portal-list-select`, `.portal-notice-table-body`, `.portal-notice-empty`를 사용하는 별도 select·검색·pagination 로직이므로 underline 탭 함수 삭제의 영향을 받지 않는다. 메인 최신 공지는 `initializeLatestNotices()`와 `.portal-home-notice-list`가 담당하며 이 함수와 데이터·DOM을 공유하지 않는다.

### 25.4 상태·접근성 영향

dead 함수가 의도했던 동작은 다음과 같다.

- `[data-notice-filter]`의 `aria-selected` 전환
- `[data-notice-category]` item의 `hidden` 전환과 최대 4건 제한
- click 처리
- ArrowLeft·ArrowRight 이동, focus와 선택 동기화

현재 DOM이 없으므로 event listener는 한 번도 등록되지 않고 접근성 tree에도 대응 element가 없다. 함수와 호출을 제거해도 현재 focus 순서, keyboard 동작, `aria-selected`, panel 표시에는 변화가 없다. 또한 URL, hash, query parameter, `aria-controls`, roving `tabindex`, `aria-current`, classList 상태와 연결된 코드도 없다.

### 25.5 관련 잔여 항목

| 항목 | 위치 | 상태 | 이번 삭제 범위 포함 여부 |
|---|---|---|---|
| `portal.noticeTabsAria` | 삭제 전 `common/locales/ko.js`, `common/locales/en.js` | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryAll` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryOperation` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryNotice` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryAnnouncement` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryRecruit` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.noticeCategoryWorks` | 동일 | 정의만 있고 사용 0 | 후속 locale 작업에서 삭제 완료 |
| `portal.featuredNoticeTitle`, `portal.featuredNoticeText` | 동일 | 과거 featured notice 계열과 연관된 별도 잔여 후보 | underline 탭 함수와 묶어 삭제하지 않음 |

locale key는 JavaScript 함수와 달리 언어 데이터 schema 역할을 할 수 있으므로 이번 dead 함수 삭제와 분리한다. `latestNotices`, `viewAllNotices`, `bottomInfoAria`, `notice1`–`notice7`은 현재 메인 최신 공지와 공지 데이터 문맥이므로 보존한다.

### 25.6 삭제 실행 결과

| 삭제 대상 | 안전성 | 근거 | 적용 결과 |
|---|---|---|---|
| 삭제 전 `common/portal.js` L324–360 `initializeNoticeTabs()` 전체 | 높음 | local-only, DOM 생성 0, 항상 null guard 종료, 상태·이벤트 미등록 | 함수 전체 삭제 완료 |
| 삭제 전 `common/portal.js` L463 `initializeNoticeTabs();` | 높음 | 유일 호출, 반환값 미사용 | 함수와 함께 삭제 완료 |
| `common/layout.js` | 삭제 대상 없음 | 관련 참조 0 | 수정하지 않음 |

실제 변경 범위는 `common/portal.js`의 함수 37행과 호출 1행으로 제한했다. `initializeLatestNotices()`, `.portal-home-notice-list` 생성, map·terminal rendering, `common/layout.js`, HTML과 template은 변경하지 않았다. `node --check common/portal.js`와 전체 서비스 JavaScript 구문 검사가 통과했다.

- 적용 코드 변경 여부: 있음
- 적용 파일: `common/portal.js`
- 삭제한 코드: `initializeNoticeTabs()` 함수 37행과 호출 1행
- CSS·HTML·템플릿 수정 여부: 없음

## 26. 공지 underline 탭 번역 키 7개 삭제 분석 및 적용 결과

> 적용 상태: 완료 (2026-10-02). `common/locales/ko.js`와 `common/locales/en.js`에서 동일한 번역 키 7개를 삭제했다. 현재 두 locale과 서비스 코드에서 대상 키의 정의·참조는 0건이다. 아래 정의 위치와 값은 삭제 전 분석 기록이다.

### 26.1 문서 대조와 조사 범위

25.5에 기록된 키 이름과 실제 locale 정의는 모두 일치한다. 문서의 장 제목은 “공지 underline 탭 JS dead code 분석”이며 요청에서 표현한 “검토”와 문구만 다르고 대상 키에는 불일치가 없다.

조사한 리소스는 JS·HTML·Markdown을 포함한 저장소 전체와 locale/i18n, JSON, YAML, CSV, 서버 template 확장자, 번역 리소스, 빌드·생성 스크립트, test·fixture 후보이다. `.codex/**` 브라우저 캐시와 backup/before 파일은 서비스 참조 집계에서 제외했다. 실제 번역 리소스는 `common/locales/ko.js`, `common/locales/en.js` 두 파일뿐이며 JSON·YAML·CSV·PO·properties, 추가 locale, 공통 fallback locale, 서버 번역 리소스와 번역 생성 스크립트는 발견되지 않았다.

### 26.2 삭제 전 키별 정의와 참조

`정적 참조 수`는 locale 정의와 문서의 분석 문구를 제외한 서비스 코드·마크업 참조 수다.

| 번역 키 | 정의 파일 | 정의 라인 | 참조 파일 | 참조 라인 | 정적 참조 수 | 동적 참조 가능성 | 삭제 판단 |
|---|---|---:|---|---:|---:|---|---|
| `portal.noticeTabsAria` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·data-i18n·prefix 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryAll` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryOperation` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryNotice` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryAnnouncement` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryRecruit` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |
| `portal.noticeCategoryWorks` | `common/locales/ko.js`<br>`common/locales/en.js` | 72<br>15 | 없음 | — | 0 | 관련 DOM·dataset·key 조합 없음 | 삭제 가능 |

각 키는 중첩 `portal` 객체의 단일 property이며 runtime namespace는 `portal.*`이다. 한국어 값은 모두 비어 있지 않은 일반 문자열이고, 영어 값은 모두 빈 문자열이다. plural·gender variant, interpolation placeholder, alias, 중복 property 선언은 없다. 두 locale에 동일한 key set으로 1회씩 정의되어 있으므로 특정 locale만 남기거나 삭제할 이유는 없다.

### 26.3 i18n fallback·동적 조회 검토

`common/i18n.js`의 `t(key)`는 dot path를 분해해 현재 언어 값을 찾고, 값이 `undefined`, `null`, 빈 문자열이면 한국어 동일 key로 fallback하며, 두 값이 모두 없으면 key 문자열 자체를 반환한다. key 목록을 선등록하거나 schema로 검증하지 않으며 다음 의존성도 없다.

- `Object.keys`, `Object.entries`, `Object.values` 등 locale 전체 순회
- locale 간 key parity 검증
- 누락 키를 build failure로 처리하는 validator
- `portal.noticeCategory${...}` 또는 prefix·suffix 문자열 결합
- `window.I18N.portal[...]` 형태의 직접·대괄호 접근
- target key를 가진 `data-i18n`, `data-i18n-attr`, `data-translate`
- `translate()`, `getTranslation()` 또는 서버 template 번역 helper
- 공지 category를 locale key로 변환하는 map

`translateDocument()`는 실제 DOM의 `data-i18n`과 `data-i18n-attr` 값을 읽어 `t()`에 전달하지만, 7개 key를 가진 element가 없다. `common/layout.js`가 menu data의 `labelKey`와 `descriptionKey`를 동적으로 번역하는 경로도 있으나 menu/data 파일에 대상 key 문자열이 없다. 따라서 generic lookup 기능은 존재하지만 대상 key가 runtime에 입력될 경로는 확인되지 않는다.

영어 값이 빈 문자열인 현재 상태에서는 key를 호출할 경우 한국어로 fallback된다. 두 locale에서 key를 함께 삭제하면 가상의 외부 호출은 key 문자열을 반환하게 되지만, 저장소 내부에는 그런 호출이 없으므로 현재 UI 계산 결과는 바뀌지 않는다.

### 26.4 실제 공지 기능 영향

| 기능 | 현재 구현 | 대상 7개 key 의존 | 삭제 영향 |
|---|---|---:|---|
| 메인 최신 공지 | `common/portal.js`의 `initializeLatestNotices()`, `common/notice-data.js`, `.portal-home-notice-list` | 0 | 없음 |
| 공지 목록 | `customer/notice.html`의 terminal select·검색·table render | 0 | 없음 |
| 공지 상세 | `customer/notice-detail.html`의 notice data lookup·이전/다음 navigation | 0 | 없음 |
| 공지 table·pagination | `.portal-notice-table-body`, `common/pagination.js` | 0 | 없음 |
| 검색·filter | terminal ID와 입력 문자열 비교 | 0 | 없음 |
| loading·error·empty | 정적 한국어 문자열과 `.portal-notice-empty` | 0 | 없음 |
| 접근성 label | 현재 목록의 정적 `aria-label`, `aria-live`, table caption | 0 | 없음 |
| 페이지 title·metadata | `portal.metaTitle`, `portal.metaDescription`, `portalSubpage.description.notices` | 0 | 없음 |

`noticeTabsAria`는 제거된 underline 탭 container의 접근성 label 용도였고, 나머지 6개 category key도 제거된 tab label 용도였다. 실제 공지 목록의 terminal category select option은 `common/notice-data.js`의 terminal label을 사용하므로 이 key들과 관계가 없다.

### 26.5 외부 사용 가능성

저장소 안에서는 CMS client, 서버 주입 번역, iframe·embed contract, 사용자 생성 콘텐츠가 번역 key를 호출하는 코드와 CDN·정적 build 산출물 manifest를 찾지 못했다. 별도 배포 저장소나 운영 CMS의 설정은 현재 workspace에서 검증할 수 없다.

저장소 외부 사용 여부: 확인 불가

외부 사용 계약이 별도로 없다면 저장소 기준으로는 7개 모두 삭제 가능하다. 외부 CMS가 key 문자열을 직접 참조하는 구조라면 삭제 전에 운영 설정 검색이 필요하다.

### 26.6 삭제 실행 결과

두 locale에서 동일한 7개 property만 함께 제거했다.

- 삭제 전 `common/locales/ko.js` L72: 7개 한국어 정의
- 삭제 전 `common/locales/en.js` L15: 7개 빈 문자열 정의

`bottomInfoAria`, `latestNotices`, `viewAllNotices`, `featuredNoticeTitle`, `featuredNoticeText`, `notice1`–`notice7`과 그 밖의 `portal` namespace는 보존했다. 두 locale의 객체 구조와 export 구조도 유지했다. `node --check common/locales/ko.js`와 `node --check common/locales/en.js`가 통과했으며, 제거된 키를 런타임에서 조회하면 기존 i18n fallback 정책에 따라 키 문자열 자체가 반환된다. 저장소 내부에는 해당 조회 경로가 없다.

- 적용 코드 변경 여부: 있음
- 적용 파일: `common/locales/ko.js`, `common/locales/en.js`
- 삭제한 번역 키: locale별 7개, 총 14개 property
- CSS·HTML·JS·템플릿 수정 여부: 없음
- 저장소 외부 사용 여부: 확인 불가

## 27. 직접 작성된 CSS 값 현황 재점검

### 27.1 조사 기준

2026-10-06 현재 `common/style.css` 14,958행을 기준으로 조사했다. 백업 CSS, HTML과 JavaScript는 포함하지 않았다. 주석을 제외한 선언을 selector와 media query 문맥으로 분리한 뒤 다음 조건으로 집계했다.

- 색상: 일반 CSS property 값에 직접 포함된 hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`
- 간격: `gap`, `row-gap`, `column-gap`, `padding*`, `margin*`에 포함된 직접 길이값
- 폰트 크기: `font-size`에 직접 작성된 길이값 또는 `clamp()`
- radius: `border-radius` 계열에 포함된 직접 길이값·백분율·복합식
- custom property 선언부의 원시값은 토큰 정의이므로 일반 규칙의 직접값 집계에서 제외
- `width`, `height`, 위치 좌표와 지도 좌표는 간격이 아니라 컴포넌트 크기·배치값이므로 이번 범위에서 제외
- `0`은 토큰화 실익이 없어 별도 집계하고 교체 후보에서 제외

이 조사는 값의 존재를 기록하는 단계다. 동일한 숫자라는 이유만으로 토큰을 통합하지 않으며, 컴포넌트 역할과 반응형 계산을 확인하기 전에는 CSS를 변경하지 않는다.

### 27.2 토큰 기준선 재확인

| 구분 | 현재 수 | 비고 |
|---|---:|---|
| 기본 `:root` 선언 | 243 | 이름 중복 없음 |
| 반응형 `:root` override | 5 | `max-width: 700px`, 기본 선언과 별도 집계 |
| scoped custom-property 선언 | 255 | 동일 이름의 variant·좌표 재정의 포함 |
| scoped custom-property 이름 | 98 | 이름 기준 고유 수 |
| 기본 `:root`의 단순 `var(--*)` alias | 78 | 복합 `rgba()`, `color-mix()`, `clamp()` alias 제외 |

반응형 `:root` override는 다음 5개다.

| 토큰 | 기본 위치·값 | 모바일 위치·값 | 판단 |
|---|---|---|---|
| `--layout-section-padding` | L230 `var(--global-spacing-section)` | L2348 `var(--spacing-48)` | 의도된 responsive override |
| `--global-spacing-section-tight` | L119 `var(--global-space-64)` | L2349 `var(--global-space-40)` | 의도된 responsive override |
| `--font-h1` | L233 `clamp(40px, 3.2vw, 44px)` | L2350 `30px` | 의도된 responsive override |
| `--font-body` | L237 `16px` | L2351 `15px` | 의도된 responsive override |
| `--section-title-gap` | L280 `var(--spacing-32)` | L2352 `var(--spacing-32)` | 계산값이 같은 잔여 override, 8번에서 재검토 |

기존 문서의 235개·195개 수치는 현재 CSS보다 이전 상태의 수치였으므로 위 기준선으로 갱신했다. 토큰의 계층 분류와 alias 방향 자체는 4~10절의 명세와 충돌하지 않는다.

### 27.3 직접 색상

일반 규칙에서 직접 색상 리터럴을 포함한 선언은 72개, 선언값 기준 고유 값은 61개다. 이 중 media query 내부는 7개, hover·focus·ARIA·open 등 상태 selector와 결합된 것은 18개, gradient·shadow·filter 등 복합 효과값은 12개다.

단순 색상 중 우선 의미 검토가 필요한 값은 다음과 같다.

| 값 | 위치 | 속성·역할 | 판단 |
|---|---|---|---|
| `#9fc3df` | L1468, L2827 | guide/portal card hover border | 실제 의미 중복 가능, border semantic 후보 |
| `#dce6ef` | L7925, L10210 | guide photo placeholder background | guide component alias 후보 |
| `#17498f` | L13242, L13269 | 모바일 언어 선택 text/background | 선택 상태 component token 후보 |
| `rgba(4, 24, 47, .28)` | L8104, L14473 | portal header background | 같은 상태 재현값, 8번 후반부 재정의 검토 대상 |
| `rgba(5, 27, 53, .32)` | L8153, L14499 | portal search button background | 같은 상태 재현값, 8번 후반부 재정의 검토 대상 |
| `#dbe7f1` | L381 | utility text | text semantic 매핑 검토 |
| `#cfeaff` | L526 | hero eyebrow text | hero component token 후보 |
| `#edf7ff` | L554 | hero body text | inverse text semantic 검토 |
| `#d8e8f5` | L803 | quick card hover text | 상태 의미 확인 후 component token 후보 |
| `#f3f7fb` | L1185 | schedule header text | inverse text semantic 검토 |
| `#f8fbfd` | L1247 | schedule row hover background | surface hover semantic 후보 |
| `#dceaf4` | L2180 | contact card text | inverse text semantic 검토 |
| `#3f566b` | L2223 | information body text | `--text-body`와 대비 비교 필요 |
| `#b9cad8` | L2229 | terminal footer text | inverse muted text 후보 |
| `rgba(4, 24, 46, .23)` | L2381 | mobile hero overlay | 반응형·복합 시각값이므로 component 유지 |
| `#e7f2f9` | L2800 | portal hero body text | inverse text semantic 검토 |
| `#d9e8f3` | L2870 | first portal card text | variant 전용, 즉시 공통화 제외 |
| `#c5d9e5` | L3134 | Jeju map shape | map component token 후보 |
| `#5f6b7a` | L3775 | mega-menu link text | muted text semantic 검토 |
| `rgba(5, 27, 53, .18/.62)` | L5468, L5480 | hero quick 기본/hover background | 상태 쌍 component token 후보 |
| `#bdd1e7`, `#e1e9f3` | L7492, L10179 | portal guide section background | 후반부 재정의 여부를 8번에서 확인 |
| `#dfe7ef` | L8038 | terminal heading divider | border semantic 후보 |
| `rgba(119, 185, 232, .86)` | L10669 | showcase focus border | focus token과 계산·대비 비교 필요 |
| `#9aa8b5` | L11923 | operation muted text | muted text semantic 검토 |
| `#3e4a5f` | L12696 | service card focus description | focus 상태 전용, 즉시 공통화 제외 |

나머지 직접 색상은 shadow, gradient, scrim, filter 또는 illustration 형태를 만드는 복합값이다. 대표적으로 L502·L511·L2784 hero gradient, L5980 subhero gradient, L7932·L10712 photo scrim, L10602 showcase background, L12364 hero quick texture가 있다. 이 값들은 팔레트 값이 일부 같아도 전체 효과의 의미가 다르므로 단순 색상 치환 대상이 아니다.

### 27.4 직접 간격

직접 길이값을 하나 이상 포함한 간격 선언은 196개이며 선언값 기준 고유 값은 80개다. media query 내부 70개, `padding`·`margin` shorthand 22개, `calc()`·`clamp()`·`max()` 또는 token을 섞은 복합식 9개다. 별도로 `0`, `0 auto`, `auto 0`처럼 0만 사용하는 선언은 239개이며 토큰화 대상에서 제외한다.

반복 횟수가 높은 비토큰 단일값은 다음과 같다.

| 값 | 횟수 | 대표 위치 | 판단 |
|---|---:|---|---|
| `14px` | 11 | L998, L2432, L5610, L7300, L9662, L11793 | 역할이 서로 달라 일괄 통합 금지 |
| `18px` | 10 | L525, L1593, L5654~5655, L6965, L11711 | spacing scale 부재값, 용도별 검토 |
| `24px` | 10 | L1925, L3292, L6367, L7602, L10578, L12378 | `--global-space-24` 매핑 후보지만 shorthand·반응형 제외 |
| `3px` | 10 | L1071, L1937, L7475, L11549, L12790 | 미세 정렬값이므로 component 유지 우선 |
| `10px` | 8 | L3222, L3748, L5205~5206, L6350, L7976 | 역할 혼재, 신규 primitive 도입 보류 |
| `8px` | 8 | L2211, L2471, L3002, L5102, L7370 | `--global-space-8` 단순 선언만 후보 |
| `16px` | 7 | L1997, L2793, L4716, L6601, L10745 | `--global-space-16` 단순 선언만 후보 |
| `22px` | 7 | L1476, L1949, L1982, L6356, L10774 | scale 밖의 component 간격, 의미 검토 |
| `20px` | 6 | L1537, L2031, L3713, L4417, L12535 | `--global-space-20` 단순 선언만 후보 |
| `28px` | 6 | L2580, L9387, L9443, L10611, L11450 | scale 밖의 layout 간격, 의미 검토 |
| `4px` | 6 | L680, L1660, L5902, L6169, L9329 | `--global-space-4` 단순 선언만 후보 |
| `12px` | 5 | L3915, L4503, L9410, L9883, L10617 | `--global-space-12` 단순 선언만 후보 |
| `32px` | 5 | L2810, L5367, L7060, L7102, L7305 | `--global-space-32` 단순 선언만 후보 |
| `48px` | 5 | L2910, L7915~7916, L12800, L12804 | `--global-space-48` 후보이나 layout/section 의미 확인 |

다음 복합값은 계산 목적이 명확해 즉시 치환에서 제외한다: L13073 safe-area padding, L12864·L12916 safe-area와 `clamp()` 조합, L14006 `clamp(var(--spacing-32), 5vw, var(--spacing-48))`, L6276 `clamp(56px, 6vw, 80px)`. 음수 margin과 지도 marker 위치 보정값(L2393, L6315, L14644~L14653)도 spacing scale이 아니라 배치 보정값이다.

### 27.5 직접 폰트 크기

일반 규칙의 비토큰 font-size는 0을 제외하면 정확히 6개다.

| 위치 | 선택자 | 현재 값 | 문맥 | 권장 조치 |
|---:|---|---|---|---|
| L681 | `.btn--arrow::after` | `1.2em` | 아이콘을 본문 크기에 비례시킴 | component 계산값 유지 |
| L12953 | `.mobile-menu-terminal-button` | `.875rem` | `max-width: 1023px` | `--font-button` 등과 계산값 비교 후 변경 |
| L13031 | `.mobile-terminal-menu .terminal-switcher-disabled small` | `.75rem` | `max-width: 1023px` | `--font-caption`과 목적 비교 |
| L13110 | `.mobile-menu-title` | `clamp(1.375rem, 5vw, 1.5rem)` | `max-width: 1023px` | responsive component typography 유지 |
| L13288 | `.mobile-menu-language-options em` | `10px` | `max-width: 1023px` | badge 전용 component token 후보 |
| L14023 | `.portal-inquiry-auth-close` | `28px` | close glyph | 아이콘 크기 토큰 여부 검토 |

모두 아이콘·모바일 메뉴·badge 역할이므로 값만 보고 기존 본문 typography token에 합치면 안 된다.

### 27.6 직접 radius

0이 아닌 직접 radius 또는 직접값을 포함한 복합 radius 선언은 19개, 고유 값은 13개다. `border-radius: 0` 선언은 reset 또는 결합부 처리이므로 토큰화 대상에서 제외한다. 모바일 언어 선택 UI의 원형·pill 두 선언은 조사 도중 기존 global radius token을 참조하도록 외부 갱신되어 직접값 집계에서 빠졌다.

| 값 | 위치 | 역할 | 판단 |
|---|---|---|---|
| `2px` | L491, L3534, L5569 | menu/search/customer icon drawing | 도형 표현값, 유지 |
| `1px` | L3499 | utility grid icon | 도형 표현값, 유지 |
| `4px` | L5544 | boarding icon | 도형 표현값, 유지 |
| `60% 40% 55% 45%` | L3133 | Jeju map shape | illustration 값, 유지 |
| `50% 50% 50% 0` | L5513 | terminal icon shape | illustration 값, 유지 |
| `3rem` | L3191 | terminal summary card | global radius와 계산 비교 필요 |
| `calc(var(--global-radius-md) - 6px)` | L9761, L9857 | nested card radius | 계산 관계 유지 |
| `0 0 8px 8px` | L6186 | breadcrumb menu bottom corners | component token 후보 |
| `0 0 4px 4px` | L11788 | operation table bottom corners | component token 후보 |
| `0 12px 12px 0` | L12441 | hero quick joined card | 결합 구조 유지 |
| `10px` | L13237 | mobile language container | component token 후보 |
| `50%` | L13880, L14034, L14204, L14324 | 날짜·상태 icon | 형태 semantic으로 유지 가능 |
| `999px` | L13707 | badge/pill | `--global-radius-pill` 1:1 후보 |

### 27.7 다음 단계 연결

직접값 조사 결과만으로 CSS를 변경하지 않는다. 다음 작업은 원래 0단계의 5번인 주요 컴포넌트 CSS 시작·종료 위치표 작성이다. 그 위치표를 기준으로 6번 breakpoint 영향도를 현재 CSS에 맞게 갱신하고, 7번 특이도·`!important`·`nth-child` 목록을 작성한 뒤 8번 중복 선언·후반부 재정의를 판단한다.

4번 단계의 우선 후속 검토 후보는 다음과 같다.

1. L1468/L2827 hover border와 L7925/L10210 photo background의 실제 의미 중복
2. L8104/L14473 및 L8153/L14499 header 상태 재현 선언의 후반부 중복 여부
3. spacing scale과 정확히 같은 단일 `gap`·단일 방향 margin/padding만 alias 후보로 선별
4. L13707의 `999px`를 `--global-radius-pill`로 바꿀 수 있는지 검증
5. 직접 font-size 6개는 역할 토큰 대응표 작성 전까지 유지

- 코드 변경 여부: 없음
- CSS·HTML·JS 수정 여부: 없음
- 문서 수정 여부: 있음
- 수정한 파일: `docs/design-tokens.md`

## 28. 특이도·구조 의존 selector 전수 조사

### 28.1 조사 기준

2026-10-06 현재 `common/style.css` 14,958행을 기준으로 다음 항목을 조사했다.

- 모든 `!important`
- `:nth-child()`, `:nth-last-child()`, `:nth-of-type()` 계열
- `:first-child`, `:last-child` 등 순서 의존 selector
- ID selector를 포함한 규칙
- ID가 없더라도 class, attribute, pseudo-class 결합 수가 5개 이상인 selector
- `:has()`, `:not()`, 상태 class와 ARIA attribute가 결합된 후반부 규칙

고특이도 수치는 자동 삭제 기준이 아니라 검토 후보를 보수적으로 찾기 위한 screening 기준이다. `:is()`, `:not()`, `:has()`의 표준 specificity는 argument별 최대값 계산이 필요하므로, 이 절에서는 기능별 hotspot과 실제 cascade 관계를 함께 판단한다.

| 항목 | 현재 수 | 비고 |
|---|---:|---|
| `!important` 선언 | 7 | reduced-motion 1, inquiry 6 |
| `nth-*` selector 발생 | 56 | table column과 card 순서 의존 포함 |
| `:first-child` | 11 | first card/table column 등 |
| `:last-child` | 33 | row border와 joined layout 등 |
| ID 포함 selector | 55 | 고유 selector 52개 |
| 고특이도 screening 후보 | 223 | ID 포함 또는 class·attribute·pseudo-class 결합 5개 이상 |
| `:has()` 발생 | 49 | 주로 header open state |
| `:not()` 발생 | 163 | header, button, map state 조합 |

### 28.2 `!important` 전체 목록

| 위치 | 선택자 | 선언 | 문맥 | 판단 |
|---:|---|---|---|---|
| L13637 | `*, *::before, *::after` | `transition: none !important` | `prefers-reduced-motion: reduce` | 접근성 강제 override로 유지 |
| L14343 | `.portal-inquiry-file` | `padding: ... !important` | 기본 규칙 | 앞선 `.portal-form-control`보다 뒤에 있고 specificity도 같아 제거 가능성 높음, computed style 확인 필요 |
| L14400 | `.portal-inquiry-use-summary` | `display: grid !important` | 기본 규칙 | `.portal-inquiry-detail dl`과 충돌 회피, selector 구조 개선 후보 |
| L14403 | `.portal-inquiry-use-summary` | `gap: ... !important` | 기본 규칙 | 위와 같은 원인 |
| L14409 | `.portal-inquiry-use-summary div` | `display: grid !important` | 기본 규칙 | `.portal-inquiry-detail dl div`의 더 높은 type specificity를 덮음 |
| L14412 | `.portal-inquiry-use-summary div` | `gap: ... !important` | 기본 규칙 | 위와 같은 원인 |
| L14449 | `.portal-inquiry-use-summary div` | `gap: ... !important` | `max-width:800px` | L14412 자체가 important여서 반응형 override도 important가 된 연쇄 사용 |

문의 summary의 5개 important는 L14127 `.portal-inquiry-detail dl`과 L14135 `.portal-inquiry-detail dl div`가 먼저 정의된 뒤, L14399 이후 subtype이 이를 다시 덮는 구조에서 발생한다. base selector를 `.portal-inquiry-detail .portal-inquiry-use-summary`와 같이 역할 class 중심으로 정리하면 일부 important를 제거할 수 있지만, 이번 단계에서는 변경하지 않는다.

### 28.3 `nth-*` 사용 분포

| 컴포넌트 | 발생 수 | 주요 위치 | 역할 | 위험도 |
|---|---:|---|---|---|
| Schedule table | 12 | L1204~1230 | 1~6열 고정 폭 | 높음: 열 순서 변경과 직접 결합 |
| Legacy quick/guide | 5 | L2293~2412 | mobile 2열 배치와 홀짝 card | 보통 |
| Sitemap | 5 | L6387~6471 | 마지막 두 card border와 홀수 마지막 card | 보통: 열 수 변경에 민감 |
| Portal photo guide | 3 | L7951, L10225~10236 | 3·4번째 이미지 object-position 차등 | 보통: modifier class 대체 후보 |
| Notice table | 5 | L9940~10165 | 3·4열 mobile 표시·시간 배치 | 높음: table schema 의존 |
| Guide showcase | 9 | L10663~10807 | 짝수 card offset과 2·3번째 이미지 위치 | 보통: 디자인 variant 의존 |
| Terminal directory | 2 | L11077~11078 | 4·5열 처리 | 높음: 동적 result table schema 의존 |
| Weather | 1 | L11679 | 세 번째 metric divider | 낮음~보통 |
| Operation table/card | 8 | L11847~12066 | 1·3·5·6·8열 폭과 mobile label | 높음: table-to-card schema 의존 |
| Hero quick/service | 2 | L12556~12559 | 짝수·3번째 이후 border/grid | 낮음~보통 |
| Inquiry table | 3 | L13688, L13967~13972 | 4·5열 mobile card 배치 | 높음: table schema 의존 |

`nth-*` 총 56개 중 table 열 위치를 데이터 의미처럼 사용하는 schedule, notice, terminal directory, operation, inquiry가 가장 취약하다. column 순서가 바뀌면 CSS는 문법 오류 없이 잘못된 열에 적용되므로 8번 정리보다 markup/data schema 변경 시 회귀 검증이 우선이다.

### 28.4 `first/last-child` 구조 의존성

`first-child` 11개와 `last-child` 33개는 대부분 border 제거와 card 연결에 사용된다. 다음은 유지보수 주의 구간이다.

- L399~400, L2864~2873: 첫 portal card를 강조 variant로 사용
- L1237~1242: schedule/guide/safety 여러 컴포넌트의 마지막 border 제거를 그룹 selector 하나에 결합
- L2527~2531: mobile stacked table의 마지막 cell border 처리
- L6456~6471: sitemap의 마지막 홀수 card layout
- L9631, L9775~9778: identity matrix의 마지막 row/cell radius
- L9939, L10129: notice table 첫 열 mobile 처리
- L13015, L13280: mobile terminal/language menu 마지막 item border 처리

첫 card의 의미가 “featured”인 L2864 계열은 순서보다 modifier class가 의미를 더 잘 표현한다. 나머지 border cleanup은 실제 순서 의미와 일치하므로 즉시 교체 대상이 아니다.

### 28.5 ID selector

ID 포함 selector는 55개이며 다음 영역에 집중된다.

| 영역 | selector 발생 수 | 대표 selector | 판단 |
|---|---:|---|---|
| Schedule | 23 | `#schedule td:nth-child(...)`, `#schedule .section-title` | legacy root scope, 가장 큰 ID 특이도 묶음 |
| Terminal directory mobile table | 8 | `#terminal-directory-results td`, `tr[hidden]` | 동적 table root와 직접 결합, 유지 필요 |
| Late header controls | 7 | `#language-switcher-button`, `#terminal-switcher-button:hover` | class 상태 규칙보다 우선하도록 후반부에 배치됨 |
| Legacy guide roots | 5 | `#terminal-guide`, `#boarding` 등 | 페이지 anchor와 styling scope가 혼재 |
| Portal app shell | 3 | `.portal-subpage #app` 계열 | page shell layout scope |
| Portal schedule/table | 3 | `.portal-page #schedule table` | legacy schedule을 portal에 재사용하는 bridge |
| Terminal explorer | 3 | `#terminal-region`, `#region-home-link` | 특정 DOM control 대상 |
| 기타 | 3 | `#hero-title` 등 | 단일 element styling |

ID selector 자체를 일괄 제거하면 기존 class selector보다 우선순위가 낮아져 결과가 달라질 수 있다. 특히 schedule 23개와 late header control 7개는 8번에서 후반부 재정의와 함께 분석한다.

### 28.6 고특이도 hotspot

screening 후보 223개는 다음 구간에 집중된다.

| 구간 | 후보 수 | 주요 원인 | 우선순위 |
|---|---:|---|---|
| Late header state | 42 | `.portal-page:not(...).site-header:not(...):has(...)`와 hover/focus 조합 | 1 |
| Map/marker | 39 | zoom, region-visible, nearby-selection, data attribute 상태 중첩 | 1 |
| Portal guide/header overlay | 33 | hero header 상태와 photo guide variant | 2 |
| Subpage/terminal list | 33 | subpage header chain과 mobile dynamic table ID | 2 |
| Schedule | 23 | `#schedule` + `nth-child` | 2 |
| Final mobile map | 22 | home page + zoom state + marker variant + hover | 1 |
| Legacy guide/terminal | 7 | ID root와 child chain | 3 |
| Terminal explorer/map | 6 | page scope와 component scope 중첩 | 3 |
| Hero/header/template/footer | 5 | subpage `#app`와 header state | 3 |
| Floating quick | 4 | collapsed/show/hover variant | 3 |

가장 높은 조합의 대표는 다음과 같다.

- L14493: `.portal-page:not(.portal-subpage) .site-header:not(.scrolled):has(.terminal-switcher.open) .gnb-link::after`
- L8183: subpage + not-scrolled + not-mega-open + switcher-not-open + hover/focus
- L14502: main header switcher-open 상태의 utility hover/focus 묶음
- L14531: main header not-scrolled/not-mega-open과 terminal/language open 상태 결합
- L8592: zoom + nearby selection + visible marker + pseudo-element
- L8910: zoom region attribute + marker variant + visible label
- L10941: subpage breadcrumb dropdown open/hover/focus chain
- L14695: mobile home map + non-zoom + terminal variant + active/hover label

이 selector들은 대부분 상태를 정확히 제한하기 위한 것이므로 단순 축약하면 적용 범위가 넓어질 수 있다. 반면 같은 header 상태가 L8097대, L10813대, L14469대에 반복되는 점은 8번 후반부 재정의 검토 대상이다.

### 28.7 breakpoint와 결합된 고위험 selector

- `max-width:700px`: schedule ID/table columns, terminal directory result ID, notice/operation/inquiry `nth-child`, final mobile map state chain
- `max-width:760px`: operation table-to-card의 열 위치 selector
- `max-width:1023px`: mobile navigation의 `.is-open`, ARIA, hover/active/focus-visible 조합
- `max-width:800px`: inquiry summary important 연쇄
- reduced motion: 전역 important 1개가 모든 transition을 확실히 제거

breakpoint 안의 구조 selector는 기본 규칙을 단순 override하는 동시에 DOM 순서를 계약으로 사용한다. 따라서 selector 정리와 breakpoint 통합을 한 번에 수행하지 않는다.

### 28.8 7번 단계 결론

- 접근성 목적의 reduced-motion important 1개는 유지한다.
- inquiry important 6개는 selector cascade를 정리하면 줄일 가능성이 있으며, 특히 file input 1개는 저위험 검증 후보다.
- `nth-child`는 card 장식보다 table column 의미에 사용된 구간의 위험도가 높다.
- ID selector는 schedule과 terminal directory에서 구조 계약 역할을 하므로 일괄 class 전환 대상이 아니다.
- 고특이도 hotspot은 header와 map 상태 규칙에 집중되며 8번 중복·후반부 재정의 조사에서 우선 대조한다.

다음 작업은 8번 중복 선언·후반부 재정의 전수 조사다. 30절의 컴포넌트 위치, 29절의 breakpoint 관계, 본 절의 specificity hotspot을 함께 사용해 “의도된 variant”, “cascade 유지 필요”, “실제 중복”, “삭제 후보”로 구분한다.

- 코드 변경 여부: 없음
- CSS·HTML·JS 수정 여부: 없음
- 문서 수정 여부: 있음
- 수정한 파일: `docs/design-tokens.md`

## 29. Breakpoint 영향도 최신화

### 29.1 조사 기준

2026-10-06 현재 `common/style.css` 14,958행의 모든 `@media` 83개를 조사했다. 15절의 과거 분석과 달리 현재 서비스 CSS에는 `max-width: 1000px`가 없으며, tablet/mobile 공통 전환은 `max-width: 1023px`, desktop 전환은 `min-width: 1024px`를 사용한다.

이번 집계는 동일 조건의 물리적 block 수와 block 내부 declaration 수를 구분한다. declaration 수는 영향 규모를 비교하기 위한 값이며 selector 수나 실제 DOM 사용 수를 의미하지 않는다.

### 29.2 전체 media query 구성

| 조건 | 블록 수 | 선언 수 | 주요 영향 영역 |
|---|---:|---:|---|
| `max-width: 700px` | 27 | 920 | legacy mobile, schedule card table, guide, terminal explorer, map, FAQ, identity/lost, terminal list, weather, inquiry |
| `max-width: 1023px` | 15 | 563 | header, mega-menu, terminal explorer, sitemap, portal content, map repair, showcase, hero service, mobile navigation, floating quick |
| `max-width: 760px` | 13 | 298 | section title, region selector, guide cards, operation table-to-card, hero quick/service, home section spacing |
| `min-width: 1024px` | 6 | 72 | desktop mega-menu, compact terminal explorer, summary panel, desktop map, guide feature sizing |
| `max-width: 480px` | 4 | 36 | booking/guide card, compact guide, showcase, hero service |
| `max-width: 1200px` | 2 | 3 | guide/photo card column count |
| `max-width: 600px` | 2 | 25 | sitemap, operation toolbar |
| `max-width: 1180px` | 1 | 5 | shared header navigation |
| `max-width: 1100px` | 1 | 4 | weather observation composition |
| `max-width: 900px` | 1 | 8 | operation toolbar |
| `max-width: 800px` | 1 | 8 | inquiry form summary |
| `max-width: 420px` | 1 | 3 | hero quick copy |
| `max-width: 370px` | 1 | 15 | narrow terminal explorer |
| `min-width: 371px` and `max-width: 700px` | 1 | 11 | mobile terminal map sizing |
| `min-width: 480px` and `max-width: 700px` | 1 | 6 | identity matrix intermediate layout |
| `min-width: 701px` | 1 | 1 | region selected check indicator |
| `min-width: 701px` and `max-width: 1023px` | 1 | 29 | home terminal explorer tablet two-column layout |
| hover/fine pointer | 1 | 2 | terminal guide menu hover |
| `max-width:1023px` + reduced motion | 1 | 1 | mobile menu transition removal |
| reduced motion | 1 | 8 | global transition, hero/map/quick animation removal |
| print | 1 | 1 | floating quick menu 숨김 |

총 블록 수는 83개다. 동일 breakpoint가 여러 위치에 존재하지만 각 위치가 해당 컴포넌트 기본 규칙 바로 뒤에 있거나 뒤쪽 정상화 규칙의 cascade를 보존하고 있어, 조건 문자열만 보고 한곳으로 이동하면 적용 순서가 달라질 수 있다.

### 29.3 핵심 breakpoint별 실제 범위

#### `max-width: 700px`

주요 block 범위는 L2346~2669, L3006~3025, L3287~3353, L4043~4110, L4534~4557, L4888~5040, L5213~5243, L5960~5976, L7030~7038, L7282~7313, L7377~7482, L9202~9244, L9508~9531, L9715~10172, L10385~10392, L11021~11286, L11593~11703, L13958~13997, L14237~14262, L14453~14466, L14585~14946이다.

- legacy schedule/table은 table row를 mobile card로 전환한다.
- terminal explorer는 단일 열, 지도와 summary 순서, region button 크기를 바꾼다.
- home map의 마지막 block은 marker layer 좌표, zoom transform, 숨김 marker 상태를 최종 결정한다.
- terminal list, identity/lost table과 inquiry table은 desktop table 구조를 mobile card 구조로 바꾼다.
- weather observation card는 metric grid와 제목 크기를 줄인다.
- 700px 이하에서는 `max-width:760px`와 `max-width:1023px` 규칙도 함께 활성화되므로 동일 specificity라면 파일 뒤쪽 선언이 우선한다.

#### `max-width: 760px`

13개 block 중 영향이 큰 범위는 L7865~8050 guide/photo cards, L10548~10810 compact guide/showcase, L11994~12325 operation table-to-card, L12520~12574 hero quick, L12733~12821 hero service와 section spacing이다.

- 701~760px에서도 적용되므로 순수 mobile 전용으로 해석하면 안 된다.
- operation 영역은 220개 선언으로 가장 큰 단일 block이며 table을 숨기고 card list를 구성한다.
- 700px 이하에서는 `max-width:700px`과 함께 적용된다. 두 조건의 rule을 통합하려면 selector별 source order를 먼저 비교해야 한다.

#### `max-width: 1023px`

영향이 큰 범위는 L9037~9188 portal header/map repair, L12838~13384 mobile fullscreen navigation, L13579~13628 floating quick menu다.

- desktop GNB/mega-menu를 mobile menu로 교체한다.
- terminal explorer와 portal map은 폭·overflow·marker visibility를 조정한다.
- mobile navigation은 `.is-open`, `[aria-expanded]`, `[aria-current]`, `[hidden]` 상태와 키보드 focus-visible 규칙을 함께 포함한다.
- floating quick은 desktop fixed panel을 mobile top button 중심 구조로 변경한다.

#### `min-width: 1024px`

L3719~3739, L5048~5121, L5192~5208, L8706~8733, L9193~9197, L10235~10239에 존재한다.

- desktop mega-menu grid와 terminal explorer/map/summary 크기를 확정한다.
- `max-width:1023px`과 수치상 겹치지 않으며 1px 공백도 없다.
- desktop 전용 block을 파일 끝으로 합치면 인접한 기본 규칙과의 source order가 달라질 수 있으므로 현 위치를 유지한다.

### 29.4 경계 구간 적용 관계

| viewport | 활성 핵심 조건 | 전환 결과 | 판단 |
|---:|---|---|---|
| 700px | `max-width:700`, `max-width:760`, `max-width:1023`; 조건에 따라 371~700·480~700 | mobile card/table/map 규칙 적용 | 수치상 누락 없음 |
| 701px | `min-width:701`, `701~1023`, `max-width:760`, `max-width:1023` | terminal explorer가 tablet 두 열로 전환 | mobile/tablet 구조 교체가 크므로 시각 회귀 대상 |
| 760px | `max-width:760`, `min-width:701`, `701~1023`, `max-width:1023` | compact tablet layout | 누락 없음 |
| 761px | `min-width:701`, `701~1023`, `max-width:1023` | 760 전용 guide/operation/hero 규칙 해제 | operation table 복귀 여부 확인 필요 |
| 1023px | `max-width:1023`, `701~1023` | mobile header와 tablet terminal explorer | 누락 없음 |
| 1024px | `min-width:1024` | desktop GNB, explorer, map, summary | 조건 중첩·공백 없음 |

700/701과 1023/1024 모두 media condition 자체에는 공백이나 동시 충족이 없다. 다만 `display`, `grid-template-columns`, `height`, `overflow`, `order`가 한 번에 전환되는 terminal explorer/map, operation table, header는 경계 양쪽 viewport에서 별도 시각 확인이 필요하다.

### 29.5 컴포넌트 영향도

| 컴포넌트 | 관련 breakpoint | 영향도 | 근거 |
|---|---|---|---|
| Shared/portal header | 1180, 1023/1024, reduced motion | 높음 | desktop GNB와 fullscreen mobile navigation 교체, open/scrolled 상태 결합 |
| Terminal explorer/summary | 700/701, 760, 1023/1024, 370/371 | 높음 | 열 수, 요소 순서, 지도 높이, filter 배치가 동시에 변경 |
| Korea map/markers | 700, 1023/1024, reduced motion | 높음 | 좌표계, zoom layer, visibility, pointer-events, animation 결합 |
| Schedule/status table | 700 | 높음 | table row가 stacked card로 전환되고 `nth-child` 폭 규칙 해제 |
| Operation information | 900, 760, 600 | 높음 | toolbar 재배치 후 760에서 table-to-card 전환 |
| Hero service cards | 1023, 760, 480/420 | 보통 | hero 높이·grid gap·타이포·card 크기 변경 |
| Guide/photo/showcase | 1200, 1023, 760, 480 | 보통 | 열 수와 card 높이 변경, 서로 다른 variant 유지 |
| Marine weather | 1100, 700 | 보통 | observation card grid와 metric layout 변경 |
| FAQ/list toolbar | 1023, 700 | 보통 | horizontal categories, search/select 폭 변경 |
| Inquiry | 800, 700 | 보통 | table/card와 form summary grid 변경, 일부 `!important` 유지 |
| Footer/sitemap | 1023, 700, 600 | 낮음~보통 | 열 수와 stack 방향 변경 |

### 29.6 상태·variant 결합

breakpoint 내부에서 다음 상태가 실제로 결합된다.

- Header/mobile navigation: `.is-open`, `[aria-expanded="true"]`, `[aria-current="page"]`, `[hidden]`, `:hover`, `:active`, `:focus-visible`
- Terminal/map: `.active`, `.is-region-zoomed`, `.is-region-visible`, `.is-region-unzooming`, `[data-zoom-region]`, `:hover`, `:focus-visible`
- Floating quick: `.show`, `.is-collapsed`, `:hover`
- FAQ/filter: `[aria-selected="true"]`, `[aria-pressed="true"]`, `.open`
- Operation/inquiry: `[hidden]`, status classes, `nth-child` 기반 mobile label

이 규칙들은 상태 모델과 breakpoint가 함께 최종 UI를 만들기 때문에 다른 동일 조건 block으로 이동시키거나 기본 selector와 합치지 않는다.

### 29.7 지도 marker와 reduced motion

기본 terminal marker hit area는 L8290~8308에서 `82px × 56px`로 정의되어 일반적인 44px touch target을 초과한다. mobile zoom marker도 L14648~14654에서 같은 크기를 유지한다.

- zoom에서 보이지 않는 marker: L8547~8552의 `visibility:hidden`, `opacity:0`, `pointer-events:none`
- unzoom transition 중 숨김 marker: L14666~14669의 `pointer-events:none`
- 확대된 인접 marker의 투명한 부모: L9011~9014에서 `pointer-events:none`
- 실제 dot/label 자식: L9016~9021에서만 `pointer-events:auto`

따라서 숨겨진 marker가 클릭을 가로채는 구조는 현재 확인되지 않는다. 확대 상태에서 넓은 투명 button box가 서로 겹치는 문제도 자식만 pointer target으로 남기는 방식으로 방지한다.

reduced-motion 규칙은 L13386~13392와 L13630~13666에 있다. transition과 decorative pulse/shine animation만 제거하며 `outline`, 선택 색상, `.active`, `[aria-current]` 또는 `[aria-expanded]` 상태를 숨기지 않는다. feature card의 장식용 `::before` opacity는 0으로 만들지만 card 자체의 focus-visible outline은 유지된다.

### 29.8 `!important`와 shorthand 주의점

media query 내부 `!important`는 reduced-motion의 전역 `transition:none` 1건과 inquiry form summary의 gap 1건이다. 후자는 L14429~14451의 `max-width:800px` block에 있으며 기존 desktop summary의 강한 선언을 덮기 위한 것으로 보인다. 7번 특이도 조사에서 원인을 다시 확인한다.

`padding`, `margin`, `gap`, `grid-template-columns`, `display`, `height`, `overflow`가 breakpoint 전환의 핵심이므로, 같은 media condition이라는 이유만으로 block을 합치거나 shorthand를 분해하지 않는다.

### 29.9 6번 단계 결론

- 현재 핵심 breakpoint는 700/701과 1023/1024로 정렬되어 있으며 `1000px` legacy condition은 없다.
- 700/701 및 1023/1024 조건에는 수치상 gap이나 overlap이 없다.
- 760px는 701~760 tablet 구간에도 적용되므로 mobile alias로 취급하지 않는다.
- 동일 조건 block이 분산되어 있지만 component 인접성과 cascade 의존성이 있어 이번 단계에서 물리적으로 통합하지 않는다.
- 가장 높은 회귀 위험은 terminal explorer/map, mobile header, operation table-to-card다.
- 지도 marker touch target, hidden marker pointer 차단, reduced-motion의 focus/selected 상태는 현재 구조상 유지된다.

7번 특이도 조사는 28절에 반영했다. 다음 작업은 30절 위치표, 본 절 breakpoint 관계와 28절 specificity hotspot을 함께 사용해 8번 중복·후반부 재정의를 판정하는 것이다.

- 코드 변경 여부: 없음
- CSS·HTML·JS 수정 여부: 없음
- 문서 수정 여부: 있음
- 수정한 파일: `docs/design-tokens.md`

## 30. 주요 컴포넌트 CSS 위치표

### 30.1 범위 표기 원칙

2026-10-06 현재 `common/style.css` 14,958행을 기준으로 작성했다. 이 표의 `주 정의 범위`는 해당 기능이 연속적으로 정의된 논리 구간이며, 모든 selector가 그 범위 안에만 있다는 뜻은 아니다. 동일 컴포넌트가 consolidated media block이나 후반부 보정 규칙에 다시 나타나는 경우 `추가 정의·override`에 별도로 기록했다.

- 시작선은 최초 핵심 selector 또는 해당 섹션 주석을 기준으로 한다.
- 종료선은 다음 독립 컴포넌트의 시작 직전으로 잡는다.
- 그룹 selector에 다른 컴포넌트가 섞인 경우 양쪽 컴포넌트에 공유 규칙으로 기록한다.
- media query 안에 여러 컴포넌트가 함께 있으면 물리적으로 합치지 않고 각 컴포넌트의 override 위치로 기록한다.
- 지도 좌표와 marker variant는 selector 수가 많아 지도 시스템 아래에 묶되, 기본 지도·지역 확대·모바일 좌표를 분리한다.
- 이번 단계에서는 위치만 확정하며 중복, 우선순위 또는 삭제 가능성은 판단하지 않는다.

### 30.2 전역 기반과 공통 UI

| 영역 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Font face | L1~47 | `@font-face` | 없음 | Pretendard, Gmarket Sans |
| Token foundation | L49~291 | `:root` | L2346~2353, L12826~12831 | 모바일 root override와 mobile-nav scoped root가 별도 존재 |
| Reset·base typography | L293~378 | `*`, `html`, `body` | L2346~2360 | body와 heading의 모바일 typography 포함 |
| Shared utility/header shell | L379~560 | `.utility` | L2267~2343, L3356~3845 | 초기 utility/header와 refined header가 분리됨 |
| Standard `.btn` system | L561~731 | `.portal-outline-btn`, `.btn` | L7643~7652 | portal outline 호환 규칙이 후반부에 존재 |
| Quick cards | L732~805 | `.quick-wrap`, `.quick-grid`, `.quick-card` | L2388~2411 | 모바일 quick grid 보정 |
| Section title system | L806~975 | `section`, `.section-title` | L859~868, L5610~5635, L7382~7392, L8021~8052 | portal heading 변형과 모바일 보정이 분산됨 |
| Schedule tabs·table | L976~1424 | `#schedule`, `.schedule-controls` | L2413~2569 | 모바일 stacked table과 filter 규칙 포함 |

### 30.3 레거시 가이드·터미널 영역

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Guide card landing | L1425~1500 | `.notice-line`, `.guide-layout`, `.guide-grid` | L2571~2605 | `.guide-card` hover 포함 |
| Terminal guide cards/menu | L1501~1817 | `#terminal-guide` | L1811~1816 | pointer hover media가 주 범위 끝에 위치 |
| Guide detail page | L1818~2103 | `#boarding`, `.guide-page` | L2607~2671 | hero, breadcrumb, TOC, transit block 포함 |
| News/contact cards | L2104~2191 | `.news-layout`, `.contact-card` | L2267~2280 | terminal 이전의 정보 카드 계열 |
| Legacy terminal information | L2192~2264 | `.terminal`, `.terminal-grid` | L2282~2671 | mobile footer·table·guide 보정과 같은 media block에 섞임 |

### 30.4 포털 기본 구조와 터미널 탐색기

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Portal core/cards | L2672~2904 | `/* Shared multi-terminal additions */`, `.portal-page` | L3265~3355 | portal base, legacy hero/card, section heading 포함 |
| Region quick selector | L2905~3027 | `.region-quick-select` | L2946~3027, L4888~5042 | desktop/mobile button 배치가 여러 breakpoint에 존재 |
| Initial terminal map card | L3028~3262 | `.terminal-map-card` | L3265~3332 | 초기 peninsula, marker, summary 스타일 포함 |
| Refined shared header | L3356~3845 | `/* Refined shared brand header */` | L3806~3845 | mega-menu와 1180/1023 대응 포함 |
| Terminal selector and supplied map | L3846~4426 | `/* Airport-network inspired portal selector */` | L4043~4232 | route block, map image, teardrop marker 포함 |
| Header terminal switcher | L4233~4378 | `.terminal-switcher` | L4822~4832 | open/disabled 상태와 responsive grid 포함 |
| Terminal summary/detail panel | L4379~4559 | `/* Portal map surface cleanup */` | L5124~5245, L9025~9034 | summary typography와 mobile overflow 보정이 후반부에 존재 |
| Region terminal accordion/cards | L4560~5042 | `/* Portal region terminal accordion */` | L4822~5013 | tablet two-column, mobile·371px·370px 분기 포함 |
| Desktop compact explorer | L5043~5245 | `/* Compact horizontal terminal explorer */` | 없음 | `min-width:1024px`와 mobile summary 보정이 같은 논리 구간에 있음 |

### 30.5 포털 hero·header·template·footer

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Main portal hero and quick links | L5246~5659 | `/* Impactful portal index hero */` | L5640~5659, L8097~8253 | 이후 photo overlay header와 결합됨 |
| Portal brand/GNB | L5660~5776 | `/* Portal brand mark, navigation and information pages */` | L8097~8287, L10813~10893, L14469~14575 | hero, subpage, dropdown 상태별 색상 규칙이 분산됨 |
| Site footer | L5777~5977 | `.site-footer` | L5960~5977 | 모바일 footer 포함 |
| Subhero·breadcrumb·template content | L5978~6307 | `.portal-subhero`, `.portal-template-page` | L10894~11063 | breadcrumb dropdown과 subpage title composition이 후반부에 보정됨 |
| Policy pages | L6308~6369 | `/* Footer information pages */` | 없음 | terms/privacy 계열 |
| Sitemap | L6370~6483 | `.portal-sitemap-grid` | L6448~6483 | 1023/600 breakpoint 포함 |

### 30.6 포털 공통 콘텐츠·목록·FAQ

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Content heading/callout | L6484~6529 | `.portal-content-heading-row` | L7352~7392 | tablet/mobile typography 보정 |
| Terminal directory cards | L6530~6595 | `.portal-terminal-directory` | 없음 | booking icon 공유 selector 존재 |
| Step/check/safety/contact guide | L6596~6947 | `.portal-preparing-block` | L7030~7040 | 여러 guide/info card 계열이 연속 정의됨 |
| List toolbar/filter controls | L6948~7101 | `.portal-content-badge`, `.portal-list-toolbar` | L7028~7057 | select group과 mobile layout 포함 |
| FAQ | L7102~7349 | `.portal-faq-categories` | L7282~7349 | selected, open, pagination과 mobile 규칙 포함 |
| Portal responsive content helpers | L7350~7484 | consolidated 1023/700 blocks | 해당 구간 자체 | content heading, info callout, hero text 보정이 혼재 |

### 30.7 포털 가이드·공지·예약·정보 표

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Portal guide cards | L7485~7580 | `/* Portal guide, notices, and booking */` | L7856~8052, L10175~10812 | 기본 카드, photo card, compact guide, showcase가 세 구간에 존재 |
| Bottom info/notice/booking cards | L7581~7653 | `.portal-bottom-info` | L7778~7891, L10175~10570 | booking visual과 feature card가 후반부에 확장됨 |
| Shared form controls | L7654~7777 | `/* Shared form controls */` | 각 페이지별 media rule | input/select/textarea 공통 규칙 |
| Photo guide composition | L7912~8052 | `/* Main guide: full-image cards */` | L7998~8052 | 1200/760 breakpoint와 heading 보정 포함 |
| Portal hero-header overlay | L8097~8287 | `/* Portal header over the hero image */` | L14469~14575 | header 상태별 재현 규칙 존재 |

### 30.8 지도 시스템

| 하위 시스템 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Normalized Korea map/markers | L8288~8538 | `/* Portal Korea map markers */` | L5698, L1270~1273 | marker label/focus의 이전 공통 규칙 존재 |
| All-region focus and pan | L8539~8700 | `/* Portal map: all-region focus and pan */` | L14576~14772 | map transform과 mobile coordinate surface 연결 |
| Desktop explorer sizing | L8701~8735 | `/* Portal terminal explorer */` | 없음 | `min-width:1024px` 전용 |
| Regional zoom/nearby markers | L8736~9034 | `/* Incheon focus */` | L14773~14958 | 지역별 marker 좌표와 mobile zoom 좌표가 분리됨 |
| Tablet/mobile map repair | L9035~9246 | consolidated 1023/1024/700 blocks | 해당 구간 자체 | overflow, subhero, summary, marker layout이 혼재 |
| Final mobile map coordinates | L14576~14958 | `/* Marker buttons use the map itself */` | 없음 | media block은 L14583~14946, pulse keyframes는 L14948~14958이며 cascade 우선순위가 가장 높음 |

### 30.9 세부 콘텐츠 컴포넌트

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Quick guide links | L9247~9385 | `/* Portal additions: guide links, notice board, and detail */` | L9350~9385 | 760 breakpoint 포함 |
| Notice detail | L9386~9541 | `.portal-notice-detail` | L9508~9541 | mobile detail navigation과 shared table header 포함 |
| Identity guide | L9542~9804 | `/* Identity guide */` | L9706~9804 | 1023/700 및 480~700 matrix 변환 포함 |
| Lost-and-found | L9805~10174 | `/* Lost-and-found process */` | L9899~10174 | data table wrapper와 mobile card table 포함 |
| Home quick guide/cards | L10175~10570 | `/* Index page: compact guide and unified quick cards */` | L10235~10570 | 1024/700/760/480 규칙 포함 |
| Guide showcase | L10571~10812 | `/* Index page: alternate photo guide */` | L10760~10812 | 1023/760/480 layout 포함 |
| Subpage header/GNB restoration | L10813~10893 | `/* Restored subpage accent GNB */` | 없음 | portal header 계열과 연결 |
| Subpage breadcrumb/title | L10894~11063 | `/* Restored subpage breadcrumb and title composition */` | L11021~11063 | mobile title composition 포함 |
| Terminal list | L11064~11232 | `/* Terminal list: notice-style controls and pagination */` | L11125~11232 | mobile list/table transformation 포함 |
| Marine weather | L11233~11705 | `/* Marine weather dashboard */` | L11271~11705 | observation-card 조합과 1100/700 breakpoint 포함 |
| Operation information | L11706~12327 | `/* Operation information */` | L11930~12327 | 900/600/760 table-to-card 규칙 포함 |

### 30.10 Hero service·모바일 내비게이션·퀵 메뉴·문의

| 컴포넌트 | 주 정의 범위 | 시작 기준 | 추가 정의·override | 비고 |
|---|---:|---|---|---|
| Hero Smart Service panel | L12328~12576 | `/* Portal hero Smart Service panel */` | L12503~12576 | 1023/760/420 variants |
| Photo overlay service cards | L12577~12795 | `/* Hero photo overlay Smart Service cards */` | L12708~12795 | 1023/760/480 variants |
| Home section spacing bridge | L12796~12823 | `/* Main page: keep the outer breathing room */` | L12808~12823 | terminal/guide 인접 여백 전용 |
| Mobile fullscreen navigation | L12824~13394 | `/* Mobile fullscreen navigation */` | L13339~13392 | 1023 전용, touch/focus 보정 및 reduced-motion 결합 |
| Floating quick menu | L13395~13674 | `/* Main portal floating quick menu */` | L13579~13674 | 1023, reduced-motion, print 포함 |
| Inquiry list | L13675~13999 | `/* Customer inquiry board */` | L13958~13999 | mobile table/card 변환 포함 |
| Inquiry auth/detail | L14000~14264 | `/* Inquiry password and detail */` | L14237~14264 | mobile detail layout 포함 |
| Inquiry write form | L14265~14468 | `/* Inquiry registration page */` | L14429~14468 | 800/700 breakpoint 포함 |
| Late header state corrections | L14469~14575 | `/* Main header dropdowns */` | 없음 | 기존 portal/header 선언보다 뒤에서 적용 |

### 30.11 분산도가 높은 컴포넌트

다음 컴포넌트는 기본 정의와 최종 적용 규칙이 세 구간 이상으로 나뉜다. 8번 중복·후반부 재정의 조사에서 우선 비교해야 하지만, 현재 단계에서는 의도된 cascade일 가능성을 배제하지 않는다.

| 컴포넌트 | 주요 분산 구간 | 다음 단계에서 확인할 내용 |
|---|---|---|
| Header/GNB | L379~560, L3356~3845, L5660~5776, L8097~8287, L10813~10893, L12824~13394, L14469~14575 | hero/subpage/open/scrolled 상태별 우선순위와 같은 선언 반복 여부 |
| Korea map/markers | L3028~3262, L3959~4232, L8288~9246, L14576~14958 | 이전 좌표의 실제 override 여부와 숨김 marker pointer 처리 |
| Terminal summary/explorer | L2905~3262, L3846~5245, L8701~9246 | 같은 selector의 크기·gap·height 후반부 재정의 여부 |
| Portal guide | L7485~8052, L10175~10812 | 서로 다른 카드 variant인지 같은 구조의 중복 구현인지 |
| Portal hero/service | L5246~5659, L8097~8253, L12328~12795 | legacy quick link와 service card의 공유 가능 범위 |
| Breadcrumb/subpage title | L5978~6307, L10894~11063 | 복원 규칙이 기본 규칙을 전면 덮는지 여부 |

### 30.12 5번 단계 결론

주요 컴포넌트의 기본 정의 범위와 후속 override 위치를 현재 CSS 기준으로 확정했다. 물리적 순서만 보면 단일 컴포넌트처럼 보이지만 실제로는 서로 다른 페이지 variant인 경우가 있으므로, 이 위치표 자체를 병합 근거로 사용하면 안 된다.

6번 breakpoint 영향도는 29절, 7번 특이도 조사는 28절에 반영했다. 다음 작업은 두 결과를 이 위치표에 연결해 8번 중복·후반부 재정의를 판정하는 것이다.

- 코드 변경 여부: 없음
- CSS·HTML·JS 수정 여부: 없음
- 문서 수정 여부: 있음
- 수정한 파일: `docs/design-tokens.md`
