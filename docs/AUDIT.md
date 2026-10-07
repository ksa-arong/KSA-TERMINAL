# 지역 여객선 터미널 재작업 사전 감사

- 감사 기준일: 2026-10-07
- 기준 커밋: `5e3c730` (`chore: 지역 페이지 재작업 전 전체 스냅샷`)
- 분석 범위: 루트 포털과 문서, `common/`, 7개 지역 폴더, 기능 폴더, 지정된 루트 HTML
- 변경 범위: 이 문서만 생성. 기존 HTML/CSS/JS/이미지는 수정·삭제하지 않았다.
- 방법: 정적 소스·Git 추적 상태·파일 해시·정적 링크를 대조했다. 브라우저별 실제 렌더링, 외부 사이트 응답, 데이터의 행정·운항 사실성은 이번 감사에서 검증하지 않았다. 해당 항목은 **미확인**으로 구분한다.

## 0. 요약 결론

1. 모든 서비스 HTML은 런타임에 `common/style.css`만 로드한다. 따라서 파일 경로 관점에서는 단일 진실 소스다. 그러나 이 파일 안에 포털 계열과 구형 지역 계열이 함께 있고, 같은 컴포넌트의 기본·상태·후반 override가 멀리 분산되어 있어 컴포넌트 관점의 단일 진실 소스라고 보기는 어렵다.
2. 통합 포털은 외부 CSS 중심이며 `<style>` 블록이나 `style` 속성이 없다. 저장소 전체의 인라인 CSS도 표 열 너비 14건뿐이다. 루트의 리다이렉트 페이지와 일부 콘텐츠 페이지에는 인라인 **JavaScript**가 있지만 인라인 CSS는 아니다.
3. `style.backup-20260921.css`와 `style.before-mobile-drawer-20260921.css`는 어떤 서비스 HTML/JS에서도 참조되지 않는 수동 스냅샷이다. 런타임 관점에서는 삭제 가능하고 Git 이력으로 복원할 수 있다.
4. 현재 7개 지역 페이지는 얇은 HTML 셸과 지역별 데이터 파일을 공통 `layout.js`, `schedule.js`, `terminal-guide.js`가 렌더링하는 구조다. 이 데이터·공통 렌더러는 살릴 가치가 있지만, 화면은 통합 포털의 `.portal-*` 조합이 아니라 구형 `.hero`, `.quick-*`, `.terminal-footer` 조합을 사용한다. 스타일 일치를 위해 화면 조합부는 재작성하는 편이 낫다.
5. `portal-data.js`, `terminal-directory.js`, 각 지역의 `terminal-data.js`가 동일한 터미널 정보를 서로 다른 스키마와 값으로 중복 보유한다. 지역 페이지에서 `portal-data.js`를 그대로 단독 재사용하기에는 상세 가이드·주차·공지·히어로 데이터가 부족하고 TODO/SAMPLE 값도 많다.
6. 서비스 경로는 모두 상대경로이며 정적 HTML의 로컬 `href`/`src` 누락은 0건이다. GitHub Pages의 프로젝트 하위 경로에도 대체로 안전하다. 다만 깊이가 한 단계 더 늘어나면 수동 `rootPrefix`가 깨질 수 있고, 메인 페이지만 CSS 캐시 버전 쿼리를 사용한다.
7. 가장 큰 저장소 위생 문제는 `.gitignore` 부재다. `.codex/`의 Chromium 검증 프로필 2,609개, 약 254.58MiB가 이미 Git에 추적되어 있다. 서비스 코드·자산은 124개, 약 42.82MiB다.

## 1. 디자인 시스템 추출

### 1.1 CSS 작성 방식과 폰트 로딩

| 항목 | 확인 결과 | 근거 |
|---|---|---|
| 주력 방식 | 외부 CSS | `index.html:9`가 `common/style.css?v=20260929-1`을 로드한다. 나머지 서비스 HTML도 `common/style.css` 또는 `../common/style.css`만 로드한다. |
| `<style>` | 서비스 HTML 0건 | 전체 서비스 HTML 검색 결과 없음 |
| `style="..."` | 포털 `index.html` 0건, 저장소 서비스 HTML 전체 14건 | `customer/notice.html:42`, `customer/inquiry.html:31`, `customer/lost-found.html`의 문자열 템플릿, `terminal/terminal-list.html:39-43`; 모두 표 `col` 너비 |
| 본문 폰트 | Pretendard | `common/style.css:1-39`, `69`, `303-310` |
| 히어로 폰트 | Gmarket Sans Bold → Pretendard fallback | `common/style.css:41-47`, `70`, `352-356` |
| 로딩 방식 | 저장소 내 로컬 폰트 + `@font-face`, `font-display: swap` | Pretendard 400/500/600/700/800과 Gmarket Sans 700만 실제 선언 |

`common/fonts/`에는 Pretendard Thin/ExtraLight/Light/Black도 있지만 현재 `@font-face`에는 등록되지 않는다. 따라서 이 네 파일은 CSS에서 직접 사용할 수 없는 상태이며, 보존 필요성은 **미확인**이다.

### 1.2 실제 포털의 핵심 색상

`index.html` 자체에는 색상 선언이 없으므로 실제 값은 `common/style.css`의 토큰과 포털 전용 scope에서 나온다. 아래는 메인 포털 구성에서 확인되는 핵심값이다.

| 역할 | 실제 값/토큰 | 주요 사용 |
|---|---|---|
| Brand | `#1C4B9A` (`--global-color-blue-600`, `--text-brand`) | 링크, 선택 상태, 버튼, 아이콘 |
| Brand hover | `#2563EB` | 브랜드 hover 원시값 |
| Focus blue | `#77B9E8` | 포커스·showcase 강조 |
| Navy 800/900/950 | `#123763`, `#0B284A`, `#071B33` | 카드 강조, inverse surface, hero fallback |
| Strong/body/muted text | `#101828`, `#374151`, `#6B7280` | 제목, 본문, 보조 텍스트 |
| Base/subtle/muted surface | `#FFFFFF`, `#F4F7FB`, `#EDF2FA` | 본문, 연한 섹션, 브랜드 연한 배경 |
| Default border | `#D8DEE7` | 카드·표·컨트롤 |
| Status | danger `#C2333B`, success `#1F7A45`, warning `#B4700D` | 상태 표시 |
| Hero accent | `#8BD8FF` | 메인 hero quick icon·focus (`common/style.css:2665`) |
| Hero quick gradient | `#003060 → #004890 → #18789A` | 포털 hero quick 배경 토큰 |
| Guide section | 직접값 `#E1E9F3` | `common/style.css:9175-9177` |
| Guide image placeholder | 직접값 `#DCE6EF` | `common/style.css:9208` 등 |
| Showcase | `#081321`, card `#12263D` | `common/style.css:161-162`, `9588-9746` |
| Quick guide variants | `#EAF4FB`와 navy/indigo 혼합값 | `common/style.css:9383-9455` |

색상 토큰만으로 완전히 닫힌 체계는 아니다. 현재 CSS 전체에는 토큰 선언과 장식용 gradient/shadow를 포함해 125개의 고유 hex/rgba 표현이 있고, 포털 주요 영역에도 `#E1E9F3`, `#DCE6EF`, `rgba(...)` 직접값이 남아 있다. 따라서 새 지역 화면은 기존 semantic 토큰을 우선하되, 포털 장식값을 별도 컴포넌트 토큰으로 승격한 뒤 재사용하는 것이 안전하다.

### 1.3 실제 포털의 타이포그래피

| 토큰/역할 | 값 |
|---|---|
| Hero title 기본 | `clamp(38px, 4.7vw, 64px)` (`.portal-page` scope, `common/style.css:2659`) |
| 일반 hero 토큰 | `clamp(38px, 4.2vw, 52px)` |
| Page/H1 | `clamp(40px, 3.2vw, 44px)`; 700px 이하 `30px` |
| Display | `32px` |
| H2 / H3 | `24px` / `20px` |
| Body large / body | `18px` / `16px`; 700px 이하 body `15px` |
| Small / caption | `13px` / `13px` |
| Compact description / button | `14px` / `14px` |
| Showcase title | `clamp(32px, 4vw, 50px)` |
| Photo card title | `clamp(20px, 1.5vw, 23px)` |
| Weight | 400, 500, 600, 700, 800 |
| Line-height | 1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.75 |

메인 hero는 `Gmarket Sans`, 나머지는 대체로 `Pretendard`다. 포털 hero 제목은 `common/style.css:4813-4829`, 설명은 `4832-4838`, hero service card 제목/설명은 `11270-11286`에서 최종 형태가 정해진다.

### 1.4 간격·레이아웃·radius

| 구분 | 실제 값 |
|---|---|
| 기본 spacing scale | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px |
| 컨테이너 | 최대 1280px, 좌우 20px (`common/style.css:358-362`) |
| 기본 section padding | 80px; tight 64px; 700px 이하 기본 48px, tight 40px |
| Hero | 최소 높이 760px, content top 118px/bottom 190px(후반 override 포함) |
| Hero mobile | 760px 이하 최소 높이 820px, 480px 이하 830px |
| 기본 radius | 8px, 12px, 16px, pill 999px |
| 컴포넌트 예외 | `24px` portal button, `14px` portal content card, `3rem` terminal summary, 원형 50%, 결합형 `0 0 8px 8px`/`0 0 4px 4px` |

간격 스케일은 비교적 명확하지만 실제 CSS에는 14/18/22/28px 같은 비스케일 간격과 배치 보정값이 남아 있다. 전부 오류는 아니며 지도 좌표·아이콘 도형·복합 레이아웃 값은 토큰화 대상이 아니다.

### 1.5 반응형 breakpoint

현재 `common/style.css`에는 media block 81개가 있으며 조건은 다음과 같다.

| 조건 | 블록 수 | 역할 |
|---|---:|---|
| `max-width: 700px` | 26 | 핵심 mobile 전환, 표 카드화, 지도·지역 탐색기 |
| `max-width: 760px` | 13 | 포털 섹션·hero/guide/operation 보정 |
| `max-width: 1023px` | 15 | desktop GNB → mobile drawer, tablet 공통 전환 |
| `min-width: 1024px` | 6 | desktop GNB·지도·탐색기 |
| `max-width: 480px` | 4 | 좁은 hero/guide/showcase |
| 기타 | 1200(2), 1180, 1100, 900, 800, 600(2), 370, 371-700, 480-700, 701+, 701-1023 | 컴포넌트별 보정 |
| 환경 조건 | hover/fine pointer, reduced-motion 2종, print | 입력·접근성·인쇄 |

핵심 경계는 `700/701`, `1023/1024`다. `760px`는 별도 보정선이므로 하나의 “모바일 breakpoint”로 단순화하면 안 된다. Header의 JS 전환도 `window.innerWidth < 1024` 및 `>= 1024`를 사용한다(`common/layout.js:450`, `671`).

### 1.6 `docs/design-tokens.md`와 실제 코드의 일치 여부

값 정의 자체는 대체로 일치한다. 색상 팔레트, 폰트, spacing, radius, typography 표의 주요 값은 현재 `common/style.css:49-291`과 같다. 그러나 문서의 집계와 라인 위치는 최신 CSS와 어긋난다.

| 항목 | 문서 | 현재 코드 | 판정 |
|---|---:|---:|---|
| `common/style.css` 줄 수 | 14,958 (`docs/design-tokens.md:1836`, `1987`, `2131`, `2281`) | 13,434 | 불일치 |
| 기본 `:root` 고유 토큰 | 243 (`:19`, `:1852`) | 238 | 불일치 |
| media block | 83 (`:2131`, `:2161`) | 81 | 불일치 |
| `max-width:700px` block | 27 (`:2139`) | 26 | 불일치 |
| `max-width:420px` | 1 (`:2150`) | 0 | 삭제 후 문서 잔존 |
| 핵심 값 표 | 색상/폰트/spacing/radius | 실제 선언과 일치 | 일치 |
| 컴포넌트 위치표 | 14,958행 기준 | 후속 dead CSS 삭제로 전체 이동 | 라인 번호 다수 무효 |

문서 내부에도 과거 수치가 혼재한다. 예를 들어 `docs/design-tokens.md:504`는 현재 `:root` 235개라고 쓰고, 후반 `:1852`는 243개라고 쓴다. 문서가 분석 이력을 누적한 로그 역할까지 겸하고 있어 “현재 명세”와 “과거 작업 기록”을 구분하기 어렵다. 토큰 값 표는 참고 가능하지만 수치·라인 위치표는 재생성해야 한다.

## 2. CSS 파일 현황 진단

### 2.1 단일 진실 소스 여부

| 관점 | 판정 | 이유 |
|---|---|---|
| 런타임 파일 | **예** | 모든 서비스 HTML이 `common/style.css`만 로드한다. 다른 CSS 링크는 없다. |
| 문서 계약 | **예** | `docs/design-tokens.md:6`, `:15`가 공식 소스로 명시한다. |
| 컴포넌트 구조 | **아니오에 가까움** | Header, hero, guide, 지도 등이 여러 구간의 후반 override에 의존한다. 지역용 legacy와 포털용이 한 파일에 공존한다. |
| 데이터/스타일 결합 | **부분적** | body의 `.portal-page`, `.portal-subpage` 여부에 따라 같은 공통 요소의 최종 스타일이 크게 달라진다. |

현재 파일은 13,434행, 357.6KiB다. 지역 재작업 전에 파일을 무작정 분할하면 cascade 순서가 달라질 위험이 크다. 먼저 새 지역 템플릿이 사용할 명시적 scope를 정의한 뒤, 관련 규칙만 새 컴포넌트 블록으로 모으는 순서가 안전하다.

### 2.2 수동 백업 파일

| 파일 | 크기/줄 | 현재 참조 | 삭제 판단 |
|---|---:|---:|---|
| `common/style.backup-20260921.css` | 310.3KiB / 12,162줄 | 런타임 0건; 문서에서 과거 비교 자료로만 언급 | 삭제 가능 |
| `common/style.before-mobile-drawer-20260921.css` | 308.7KiB / 12,085줄 | 런타임·문서 직접 참조 0건 | 삭제 가능 |
| 참고: `common/layout.before-mobile-drawer-20260921.js` | 33.9KiB / 551줄 | 런타임 0건 | 같은 정책으로 정리 후보 |

두 CSS 백업은 현재 CSS와 수천 줄 차이가 있어 대체 파일이 아니다. Git에 이미 과거 버전이 남아 있으므로 별도 스냅샷 보존 요구가 없다면 삭제해도 된다. 다만 이번 감사에서는 삭제하지 않았다.

### 2.3 죽은 스타일 비중 추정

현재 CSS class token 530개를 서비스 HTML/JS/Markdown의 exact token과 대조하면 비정적 사용 후보는 5개(0.9%)뿐이다.

- `portal-quick-icon--terminal/schedule/booking/customer`: `common/layout.js:29`가 문자열 보간으로 생성하므로 **실사용**이다.
- `section-title--center`: 서비스 소스에서 exact 사용이 없어 **실제 dead 후보**다(`common/style.css:784-787`).

이 기준의 확인 가능한 죽은 스타일은 고유 클래스 기준 약 **0.2%(1/530)**이며, CSS 줄 기준으로는 4줄 안팎이라 **0.1% 미만**이다. 다만 이 수치는 정적 exact-token 검사다. 태그 선택자, attribute selector, 구조 선택자, 동적 문자열, 외부 CMS 주입 여부까지 완전히 증명하는 coverage는 아니므로 전체 dead CSS의 확정치가 아니라 **보수적 하한**이다.

기존 문서에 dead 후보로 적힌 `.portal-card`, `.portal-booking-card`, `.portal-notice-featured`, `.portal-quick-guide-card--compact`, legacy route table 계열은 현재 `common/style.css`에서 이미 제거되어 있다. 실제 브라우저 coverage 기반의 전체 비중은 **미확인**이다.

## 3. 재사용 컴포넌트 목록

| 컴포넌트 | 마크업/동작 정의 | CSS 정의 | 재사용 판단 |
|---|---|---|---|
| 공통 Header | `common/layout.js:36-164`, 초기화 `:429-680` | `common/style.css:3091-3568`, hero overlay `:7163-7353`, 상태 보정 `:12953-13059` | **재사용 가능**. `portal`/terminal 모드 분기를 줄이고 새 지역 scope를 추가할 필요가 있다. |
| GNB·mega menu | `common/layout.js:52-81`, `:87-110`, `:115-120` | `common/style.css:3125-3438` | **재사용 가능**. menu 데이터는 `common/menu-data.js`. |
| 모바일 drawer | `common/layout.js:69-83`, `:146-163`, 동작 `:429-680` | `common/style.css:11442-11878` | **그대로 재사용 권장**. focus trap, Escape, inert, 1024 전환 포함. |
| 포털 hero | `index.html:16-46`, 슬라이드 동작 `common/portal.js:1-83` | `common/style.css:4720-5124`, service overlay `:11134-11413` | **패턴 재사용 가능**, 그대로 복사하지 말고 지역 hero variant로 분리. 현재 5개 배경은 포털 전용. |
| 지역 legacy hero | `common/layout.js:739-742` | `common/style.css:453-523` | **시각 구현은 버림**, 콘텐츠 필드(`heroTitle`, `heroDescription`)만 살림. 모든 지역이 `hero-ferry.png`를 공유한다. |
| Hero service cards | `common/layout.js:22-33`, `common/menu-data.js`의 `quick` | `common/style.css:11203-11413` | **재사용 가능**. 포털용 링크 prefix 가정은 점검 필요. |
| 터미널 explorer/map | `common/portal-map.js:4-146`, 동작 `common/portal.js:85-311` | `common/style.css:2822` 이후, 핵심 map `:3570-4717`, `:7354-8285`, mobile 좌표 `:13060-13434` | **포털·지도 페이지에서 재사용 가능**. 지역 상세 본문에 그대로 넣기에는 과도함. |
| 터미널 summary/card | 생성 `common/portal.js:153-205` | `common/style.css:4032-4292`, card 시작 `:4157` | **데이터 카드로 재사용 가능**. 상세 페이지용 정보 카드로 확장할 수 있다. |
| 지역 quick cards | `common/layout.js:743-748` | `common/style.css:686-776` | **콘텐츠/IA만 살림**. 디자인은 포털 service card 또는 새 지역 quick nav로 교체. |
| 포털 guide photo cards | `index.html:52-103` | 기본 `common/style.css:6694-7093`, 최종 override `:9173-9288` | **재사용 가능**. 중복 정의를 정리한 뒤 사용. |
| Showcase cards | `index.html:106-153` | `common/style.css:9586-9801` | **선택적 재사용**. 원형 pill 카드와 410px 높이는 지역 정보용으로는 강한 스타일. |
| 지역 terminal guide cards | `common/terminal-guide.js:88-128` | `common/style.css:1425-1760` | **구조·데이터 재사용 가능**, 포털 카드 토큰에 맞춘 재스타일 필요. |
| 탭/필터 | 지역 schedule `common/schedule.js:77-96`; portal filter는 페이지별 JS | `common/style.css:954-1089`, portal toolbar `:6220` 이후 | **로직 재사용 가능**. 범용 tab API는 없고 schedule 전용이다. |
| 데이터 table | 각 HTML 및 `common/schedule.js:98-166` | 지역 table `common/style.css:1090-1424`, portal table `:8970-9041` | **두 계열 존재**. 새 지역 페이지는 portal table 계열로 통일 권장. |
| Pagination | `common/pagination.js:1-45` | `common/style.css:6519-6544` | **그대로 재사용 가능**. `window.PortalPagination.renderPagination` 공개. |
| Portal footer | `common/layout.js:173-208` | `common/style.css:5192-5368` | **새 지역 페이지에도 재사용 권장**. |
| 지역 legacy footer | `common/layout.js:166-171` | `common/style.css:2178-2216` | **버림**. 포털 footer와 이중 체계다. |
| Button | 공통 class 조합, 동적 사용 다수 | `common/style.css:524-691` | **그대로 재사용 가능**. `btn--sm/md/lg`, solid/outline/inverse/ghost/pill/icon/region 제공. |
| Section title | 정적·`common/section-title.js` | `common/style.css:778-868` | **재사용 가능**. `section-title--center`는 현재 미사용 후보. |

## 4. 공통 JavaScript 모듈과 데이터 구조

### 4.1 역할 요약

| 파일 | 역할 | 지역 재작업 활용 |
|---|---|---|
| `layout.js` | 공통 header/GNB/mobile drawer/footer, portal subpage shell, 지역 legacy 전체 레이아웃 렌더링 | Header/drawer/footer는 재사용. `:704-770` 지역 page compositor는 교체 대상. |
| `menu-data.js` | portal/terminal GNB, quick, footer IA의 단일 메뉴 데이터 | 재사용 권장 |
| `i18n.js`, `locales/*` | URL의 `/en/`로 언어 판정, key 번역, `{ko,en}` 값 fallback | 재사용 가능. 실제 `/en/` 파일 트리는 없어 영어 라우팅은 **미완성**. |
| `portal-data.js` | 11개 지도 지역과 터미널·항로·운영자 데이터 | 개요/지도 데이터로 부분 재사용 가능. 상세 page 단독 소스로는 부족. |
| `portal-map.js` | 지도·지역 버튼·summary의 정적 마크업 생성 | 지도/포털에 재사용 |
| `portal.js` | hero carousel, map selection/zoom/filter/card, 최신 공지 | 포털 전용 로직. 지역 hero로 분리 시 carousel만 추출 가능. |
| `terminal-regions.js` | 목록·운항 필터용 한글 지역명 9개 정렬 배열 | 재사용 가능하지만 portal-data의 region 목록과 별도 관리됨. |
| `terminal-directory.js` | 24개 터미널의 검색·표/모바일 카드·홈페이지 링크·pagination | UI 로직 재사용 가능. 데이터가 파일 내부에 하드코딩되어 중복. |
| `schedule.js` | 지역별 scheduleData의 탭·출도착 표·상태 렌더링 | 지역 데이터와 함께 재사용 가능. portal table 스타일로 리팩터링 필요. |
| `terminal-guide.js`, `guide.js` | 지역 terminalGuide를 카드/상세 안내로 렌더링 | 데이터·렌더링 구조 재사용 가치 높음 |
| `pagination.js` | 5개 번호 window와 이전/다음 버튼 | 범용 재사용 가능 |
| `weather-data.js` | 9개 해역 fallback 기상 데이터 생성 | 지역 기상 카드 연결 가능하나 실제 API 사실성은 미확인 |
| `portal-weather.js` | API endpoint가 있으면 fetch/cache, 아니면 fallback 렌더링 | 재사용 가능. API endpoint 설정 여부는 현재 기본 코드에서 **미확인** |
| `operation-data.js`, `operation-info.js` | 운항정보 데이터와 검색/필터/표·카드 렌더링 | 지역 schedule과 별개 데이터 계열 |

### 4.2 `portal-data.js` 스키마

기본 구조는 다음과 같다(`common/portal-data.js:4-180`).

```js
window.PORTAL_DATA = {
  initialRegionId: "incheon",
  regions: {
    incheon: {
      id: "incheon",
      region: { ko: "인천광역시", en: "" },
      label: { ko: "인천", en: "" },
      summaryName: { ko: "인천 여객선 터미널", en: "" },
      cssPos: "marker-incheon",
      phone: "1599-5985",
      "region-home-link": "https://...", // 현재 소비 위치는 확인되지 않음
      terminals: [{
        id: "incheon-coastal",
        type: "coastal",
        name: { ko: "연안여객터미널", en: "" },
        shortName: { ko: "인천항", en: "" },
        description: { ko: "...", en: "" },
        address: { ko: "...", en: "" },
        hours: { ko: "06:00 - 21:00", en: "" },
        hoursNote: { ko: "...", en: "" },
        routes: [{
          id: "baengnyeongdo",
          name: { ko: "인천 → 백령도", en: "" },
          duration: { ko: "03:40", en: "" },
          frequency: { ko: "1회", en: "" }
        }],
        folder: "incheon",
        source: { ko: "터미널 공식 홈페이지", en: "" }
      }],
      operators: [{ name: { ko: "고려고속훼리", en: "" }, url: "https://..." }]
    }
  }
};
```

하단 `common/portal-data.js:1387-1489`는 지도 확대 마커용 미완성 터미널을 `createPendingPortalTerminal()`로 추가한다. 주소 외 운영시간·항로가 비어 있거나 SAMPLE이며, `:1491-1533`에서 지역별 운영자를 후처리로 붙인다. 데이터가 선언부와 후처리부로 나뉘어 스키마를 한눈에 파악하기 어렵다.

### 4.3 `terminal-regions.js` 스키마

```js
window.PORTAL_TERMINAL_REGIONS = Object.freeze([
  "보령", "군산", "목포", "완도", "여수", "제주", "통영", "포항", "동해"
].sort(...));
```

단순 문자열 배열이다(`common/terminal-regions.js:4-14`). `portal-data.js`에는 인천·부산도 있지만 이 배열에는 없다. 반대로 목록/운항 필터는 이 배열을 사용한다. 같은 “지역” 개념의 범위가 서로 달라 단일 소스로 보기 어렵다.

### 4.4 `terminal-directory.js` 스키마

```js
const terminals = [
  { region: "보령", name: "오천항 여객터미널", address: "충남 ..." },
  // 총 24개
];
const homepageByRegion = {
  "보령": "https://...",
  "군산": "http://..."
};
```

데이터는 모듈 내부 지역변수라 다른 페이지에서 import/reuse할 수 없다(`common/terminal-directory.js:16-52`). 전화, terminal id, type, folder가 없고 홈페이지는 지역 단위 별도 map이다. `portal-data.js`와 주소도 일부 다르다. 예를 들어 군산은 portal-data가 `임해로 378-8`, directory가 연안 `소룡동 1668`/국제 `임해로 378-14`로 분리한다. 어느 값이 공식인지 이번 감사에서는 **미확인**이다.

### 4.5 지역별 `terminal-data.js` / `schedule-data.js`

지역 상세 데이터는 별도 스키마다.

```js
window.terminalData = {
  name, englishName, phone, address, hours, parking,
  terminalGuide: {
    address, transit: { bus, car }, mapQuery,
    parking: { free, rate, dailyMax, capacity, hours },
    ticketing: { location, hours, deadline, notice },
    facilities: []
  },
  heroTitle, heroDescription, routeIntro?, boardingIntro,
  boardingCards: [{ title, description }],
  notices: [{ category, title, date }]
};

window.scheduleData = {
  referenceTime,
  notice,
  filters,
  items: [{
    type, time, duration, arrivalTime?, origin/originId,
    destination/destinationId, operator?, vessel,
    terminalId, terminalLabel?, routeType?, status, note?
  }]
};
```

Jeju는 `filters`가 문자열 배열이고 status가 `normal/controlled/cancelled/inquiry`, 다른 지역은 `{id,label}` 필터와 한글 상태를 쓴다. `schedule.js`가 두 형태를 흡수하지만 데이터 계약은 일관되지 않다.

### 4.6 그대로 재사용 가능한가

| 데이터 | 판단 |
|---|---|
| `portal-data.js` 지역/터미널/항로 | **부분 가능**. 지도, 지역 대표 정보, 연락처, 간단 항로에 적합하다. |
| `portal-data.js`를 지역 상세의 유일 소스로 사용 | **불가**. hero, 주차 상세, 교통, 발권, 편의시설, 공지, 상세 schedule이 없다. TODO/SAMPLE도 많다. |
| `terminal-data.js` | **살려서 통합 권장**. 상세 페이지가 필요한 필드를 이미 가진다. 단, 현행 placeholder를 공식 데이터로 간주하면 안 된다. |
| `schedule-data.js` | **스키마 정규화 후 재사용**. 지역별 항목 수와 필드가 크게 다르다. |
| `terminal-directory.js` 하드코딩 배열 | **직접 재사용 곤란**. `portal-data.js` 또는 새 공통 catalog에서 파생하도록 바꾸는 편이 낫다. |
| `terminal-regions.js` | **필터 상수로는 가능**, 단 canonical region catalog에서 파생하는 것이 바람직하다. |

권장 데이터 방향은 `regions → terminals → detail/schedules`의 한 공통 catalog를 만들고, 지도·directory·지역 페이지가 필요한 view model을 파생하는 것이다. 현재 세 데이터 계열 중 어느 값이 공식 최신값인지는 **미확인**이므로 통합 전 운영 주체 확인이 필요하다.

## 5. 지역 폴더 7개 현재 상태

### 5.1 공통 구조

모든 지역 폴더는 `index.html`, `guide.html`, `terminal-data.js`, `schedule-data.js` 네 파일이다. `index.html`은 25줄, `guide.html`은 22줄의 얇은 셸이다. 6개 지역의 `index.html`은 byte-for-byte 동일하고 Jeju만 줄바꿈 차이 수준이다. 실제 화면은 `common/layout.js:704-770`이 생성한다.

완성도는 다음 가중치로 추정했다: 화면/내비게이션 골격 30%, 상세 데이터 30%, schedule 20%, 통합 포털 디자인 일치 20%. 이는 코드 기반 재작업 준비도이며, 실제 사용자 검수·공식 데이터 검증을 포함하지 않는다.

| 지역 | 파일·데이터 상태 | 추정 완성도 | 포털 스타일과 어긋나는 점 | 분류 |
|---|---|---:|---|---|
| 군산 | 4파일; 4 schedule, 5 notice; placeholder/TODO 11건 | 38% | legacy hero/quick/footer, 공통 ferry 배경, 주차·가이드 예시 | **데이터 구조·문안 살림 / 화면 버림** |
| 인천 | 4파일; 8 schedule, 5 notice; placeholder/TODO 10건; 유일하게 `routeIntro` 있음 | 50% | 위와 같음. 데이터 양은 상대적으로 많지만 운영시간·주차가 sample | **데이터 구조·일부 문안 살림 / 화면 버림** |
| 제주 | 4파일; 18 schedule, 5 notice; 명시적 placeholder 0건 | 68% | legacy 화면은 동일. filter/status/항구 ID 스키마가 다른 지역과 다름 | **데이터 적극 재사용 / 화면 버림** |
| 포항 | 4파일; 4 schedule, 5 notice; placeholder/TODO 11건 | 38% | legacy 화면, 주차 준비 중, sample schedule | **데이터 구조 살림 / 화면 버림** |
| 통영 | 4파일; 4 schedule, 5 notice; placeholder/TODO 11건 | 36% | legacy 화면, 공통형 문안·sample 데이터 비중 높음 | **데이터 구조 살림 / 화면 버림** |
| 완도 | 4파일; 4 schedule, 5 notice; placeholder/TODO 11건 | 36% | legacy 화면, 공통형 문안·sample 데이터 비중 높음 | **데이터 구조 살림 / 화면 버림** |
| 여수 | 4파일; 4 schedule, 5 notice; placeholder/TODO 11건 | 38% | legacy 화면, 일부 note는 있으나 sample 데이터 중심 | **데이터 구조 살림 / 화면 버림** |

### 5.2 공통으로 버릴 것

- `common/layout.js:735-766`의 지역 메인 화면 조합 자체: `.hero`, `.quick-wrap`, legacy notice/contact/terminal 섹션
- `common/layout.js:166-171`의 `.terminal-footer`
- 모든 지역이 같은 `hero-ferry.png`를 사용하는 구형 hero 표현(`common/style.css:453-523`, `2706-2727`)
- “현재 포털과 유사하게 보이게 하기 위한” legacy selector의 추가 override 방식

### 5.3 살려 쓸 것

- 네 파일짜리 지역 진입 구조와 공통 스크립트 로딩 개념
- `terminalData`의 hero 문안, 연락처, 교통, 주차, 발권, 편의시설, boarding cards, notice 필드
- `scheduleData`와 `schedule.js`의 필터·출도착·상태 처리 로직
- 공통 Header/GNB/mobile drawer와 포털 footer
- `terminal-guide.js`, `guide.js`, `guide-icons.js`의 접근 가능한 구조
- `section-title.js`, 공통 `.btn`, pagination, i18n fallback

명시적 TODO가 없는 제주 데이터도 공식성은 이번 감사에서 검증하지 않았으므로 “완료”로 단정할 수 없다.

## 6. 경로 전략 진단

### 6.1 현재 패턴

- 루트 페이지: `common/...`, `boarding/...`, `customer/...` 등 현재 문서 기준 상대경로
- 1단계 하위 페이지: `../common/...`, `../privacy.html` 등 부모 상대경로
- 같은 지역 폴더: `terminal-data.js`, `schedule-data.js`, `./guide.html`
- Portal subpage: `window.PORTAL_SUBPAGE_DATA.rootPrefix`가 루트는 `''`, 하위는 `'../'`
- 지도: `data-root-prefix`를 `portal.js:87-88`이 읽고 지역 폴더 링크에 붙임
- 외부 링크: `https://` 중심이며 군산 선사 링크 한 곳은 `http://www.shidaoferry.com/`

정적 HTML의 로컬 `href`/`src`를 실제 파일로 resolve한 결과 누락은 **0건**이다. 루트 기준 `/...` 절대경로도 발견되지 않아 GitHub Pages의 `https://owner.github.io/repository/` 같은 프로젝트 경로에 유리하다.

### 6.2 위험 지점

1. `rootPrefix`가 문자열 수동 지정이다. 현재 모든 portal subpage가 한 단계 깊이라 작동하지만 2단계 페이지가 생기면 `'../../'`를 각 페이지에서 정확히 넣어야 한다.
2. `renderPortalQuickMenu()`는 `rootPrefix`를 받지 않고 메뉴의 `item.href`를 그대로 쓴다(`common/layout.js:31-33`). 지금은 quick root가 메인 `index.html`에만 있어 문제없지만 하위 페이지에서 재사용하면 잘못된 상대경로가 된다.
3. `portal.js:325`의 최신 공지 링크 `customer/notice-detail.html`도 메인 포털 위치를 전제로 한다. 현재 하위 지도 페이지에는 해당 목록 DOM이 없어 실행되지 않지만 컴포넌트 재사용 시 위험하다.
4. CSS cache busting은 메인 `index.html`만 `?v=20260929-1`을 쓰고 다른 페이지는 없다. 배포 캐시가 페이지별로 다르게 남을 수 있다.
5. URL 경로에 `/en/`이 있으면 영어로 판정하지만 실제 `en/` 페이지 트리는 없다. GitHub Pages에서 영어 URL을 직접 열 수 있는지는 **미확인/미구현**이다.
6. 대소문자 충돌은 정적 검사에서 발견하지 못했지만 Windows 파일시스템만으로 GitHub Pages의 Linux case sensitivity를 완전히 검증한 것은 아니다.

### 6.3 GitHub Pages 판정

현재 깊이와 파일 구성 그대로라면 프로젝트 Pages 배포에 치명적인 root-absolute 경로 문제는 확인되지 않았다. 다만 SPA fallback, clean URL, 404 처리, base URL 자동 계산 기능은 없으므로 파일 경로를 정확히 포함한 정적 URL만 보장된다. GitHub Pages 설정·실제 배포 테스트는 **미확인**이다.

## 7. 리포지토리 위생

### 7.1 `.gitignore`

`.gitignore`가 없다. 최소한 다음 범주는 향후 제외해야 한다.

```gitignore
.codex/
node_modules/
dist/
coverage/
*.log
```

단, `.gitignore` 추가만으로 이미 추적된 `.codex/` 파일은 Git 기록에서 빠지지 않는다. 별도의 추적 해제 커밋이 필요하다. 이번 감사에서는 수행하지 않았다.

### 7.2 추적된 불필요 대용량 파일

| 범주 | 파일 수 | 크기 | 판정 |
|---|---:|---:|---|
| `.codex/` Chromium 검증 프로필 | 2,609 | 254.58MiB | 배포 소스에 불필요, 제거 최우선 |
| 그 외 서비스 파일 | 124 | 42.82MiB | 실제 코드·폰트·이미지 포함 |

`.codex/` 하위별 크기:

| 폴더 | 파일 수 | 크기 |
|---|---:|---:|
| `mobile-final-verify-node` | 524 | 43.00MiB |
| `mobile-overflow-verify` | 192 | 38.40MiB |
| `terminal-card-verify` | 372 | 36.81MiB |
| `toolbar-verify` | 331 | 36.01MiB |
| `dropdown-hover-verify` | 180 | 34.93MiB |
| `mobile-final-verify-http` | 505 | 32.72MiB |
| `mobile-final-verify` | 505 | 32.71MiB |

14개의 추적 파일이 각각 약 10.94MiB다. 브라우저 사전/캐시(`ko-3-0.bdic`, `Cache_Data/f_*`)이며 서비스 자산이 아니다. `node_modules`는 Git 추적 목록에서 발견되지 않았다.

### 7.3 이미지 중복·미사용 후보

서비스 이미지끼리 SHA-256이 완전히 같은 exact duplicate는 **0건**이다. 그러나 버전 접미사와 “복사본” 파일이 많고, 현재 런타임 참조 0건인 대용량 후보가 있다.

| 파일 | 크기 | 현재 런타임 참조 | 판단 |
|---|---:|---:|---|
| `portal-hero-terminal.png` | 2.92MiB | 0; 과거 백업 CSS만 참조 | 삭제 후보 |
| `portal-hero-terminal - 복사본.png` | 1.95MiB | 0 | 강한 삭제 후보 |
| `common/images/portal-guide-icons.png` | 2.53MiB | 0 | 삭제 후보 |
| `portal-hero-mokpo-coastal-outpaint-v2.png` | 2.39MiB | 0 | 삭제 후보 |
| `portal-guide-vehicle-v3.png` | 2.09MiB | 0 | v1만 현재 사용 |
| `portal-guide-vehicle-v2.png` | 2.08MiB | 0 | v1만 현재 사용 |
| `portal-hero-harbor-v2.png` | 2.01MiB | 0 | 삭제 후보 |
| `portal-guide-vehicle-v4.png` | 1.82MiB | 0 | v1만 현재 사용 |
| `portal-guide-id-v3.png` | 1.65MiB | 0 | v4가 현재 사용 |
| `portal-hero-jeju-coastal.jpg` | 1.22MiB | 0 | wide PNG가 현재 사용 |
| `portal-hero-mokpo-coastal.png` | 1.17MiB | 0 | 삭제 후보 |
| `portal-hero-pohang-international.jpg` | 0.64MiB | 0 | v2가 현재 사용 |
| `portal-guide-baggage-v2.jpg` | 0.14MiB | 0 | 삭제 후보 |
| `ksa-wordmark-white.png`, `ksa-wordmark-color.png` | 각 약 0.01MiB | 0 | 삭제 후보 |

반대로 `hero-ferry.png`(1.86MiB)는 지역 legacy hero가 실제 사용하므로 현재는 미사용 파일이 아니다. 유사 버전 이미지가 시각적으로 중복인지, 고해상도 원본 보관 목적인지는 **미확인**이다. 위 표는 런타임 참조 기준 정리 후보이지 즉시 삭제 지시가 아니다.

## 8. 추가 관찰 사항

- 루트 `boarding.html`, `customer.html`, `schedule.html`은 이전 hash URL을 새 하위 페이지로 보내는 호환 리다이렉트다. 삭제하지 않는 편이 좋다.
- `privacy.html`, `terms.html`, `sitemap.html`은 `PORTAL_SUBPAGE_DATA`와 공통 layout을 사용하므로 통합 포털 계열에 잘 맞는다.
- `booking/fare.html`, `booking/refund.html`은 메뉴에서 `hidden: true`이고 준비 상태다. 새 지역 페이지 IA에서 노출하지 않는 것이 현 상태와 일치한다.
- `portal-data.js`의 다수 `en` 값이 빈 문자열이고 i18n은 한국어 fallback을 사용한다. 영어 모드는 UI key 일부만 영어가 되고 지역 데이터는 한국어로 남을 가능성이 높다.
- `terminal-directory.js`의 일부 주소에는 `전남광주통합특별시`가 들어가며 `portal-data.js`와 표기가 다르다. 2026년 행정구역 사실성은 이번 오프라인 코드 감사에서 **미확인**이다.

## 9. 지역 페이지 재작업 권장 구조

### 안 A — 현행 지역 셸 유지 + `layout.js`의 지역 compositor만 포털 스타일로 교체

각 지역의 4파일 구조를 유지하고, `layout.js`가 `terminalData`/`scheduleData`를 읽어 포털 스타일 클래스의 새 region template을 렌더링한다.

### 안 B — 공통 region shell + 하나의 canonical catalog에서 지역을 URL로 선택

예: `terminal/region.html?id=jeju` 또는 하나의 공통 HTML을 각 폴더에서 얇게 호출한다. `portal-data`, directory, 상세 데이터를 하나의 catalog로 합치고 모든 화면이 이를 파생 사용한다.

### 안 C — 각 지역 HTML을 독립 정적 페이지로 완전 작성

각 폴더의 `index.html`/`guide.html`에 완성 마크업을 직접 두고 공통 CSS/JS만 공유한다.

| 안 | 장점 | 단점 | 마이그레이션 위험 |
|---|---|---|---|
| A. 현행 셸 + 새 compositor | URL 유지, 데이터·공통 모듈 재사용, 변경 범위가 가장 작음, GitHub Pages 친화적 | `layout.js`가 더 커질 수 있음, 데이터 중복 문제는 별도 해결 필요 | 낮음~보통 |
| B. canonical catalog + 공통 shell | 데이터 단일 소스, 지도/directory/지역 페이지 불일치 제거, 신규 지역 추가가 가장 쉬움 | 초기 스키마 설계·데이터 검증 비용 큼, query URL/SEO/직접 링크 정책 결정 필요 | 보통~높음 |
| C. 지역별 완전 정적 HTML | 페이지별 자유도, JS 실패에도 본문 노출, 소스 가독성 | 7개 이상 화면 중복, header/section 수정 누락 위험, 데이터·스타일 drift 재발 | 높음 |

### 추천: 안 A를 즉시 적용하되, 데이터는 안 B 방향으로 단계 통합

이 저장소에는 **안 A**가 가장 적합하다.

근거:

1. 7개 지역 URL과 4파일 구조가 이미 안정적으로 존재하고 정적 경로도 모두 유효하다.
2. Header/GNB/mobile drawer/footer, schedule, terminal guide, i18n 등 재사용 가능한 공통 모듈이 충분하다.
3. 현재 가장 큰 문제는 데이터 파일 자체보다 `layout.js:735-766`이 구형 시각 컴포넌트를 조합한다는 점이다. 이 조합부를 새 포털 스타일 region template로 바꾸면 가장 작은 범위로 시각 일치를 얻을 수 있다.
4. 동시에 `portal-data.js`를 곧바로 유일 데이터 소스로 삼으면 상세 필드 누락과 SAMPLE 값 때문에 품질이 떨어진다.
5. 따라서 첫 단계는 현행 `terminalData`/`scheduleData`를 유지하고 새 compositor에서 정규화 adapter를 두는 방식이 안전하다. 이후 검증된 필드부터 canonical catalog로 옮겨 directory와 map도 같은 데이터를 쓰게 하면 안 B의 장점을 점진적으로 얻을 수 있다.

권장 구현 순서는 다음과 같다.

1. 포털 Header/mobile drawer/footer를 새 지역 template의 고정 shell로 결정한다.
2. `terminalData`와 Jeju/기타 `scheduleData` 차이를 흡수하는 명시적 normalize 함수를 만든다.
3. hero, quick nav, guide cards, schedule table, contact/terminal info를 포털 토큰·컴포넌트로 재조합한다.
4. 7개 폴더의 HTML은 데이터 로더 역할만 유지한다.
5. 공식 확인이 끝난 필드부터 `portal-data.js`, `terminal-directory.js`, 지역 데이터를 하나의 catalog로 병합한다.
6. 마지막에 legacy `.hero`, `.quick-*`, `.terminal-footer` 및 미사용 이미지·백업 파일을 coverage 확인 후 제거한다.

이 추천은 코드 구조 감사에 근거한다. 실제 디자인 시안, 운영기관의 필수 콘텐츠, 공식 터미널·운항 데이터 원천이 제공되면 스키마와 완성도 평가는 다시 갱신해야 한다.
