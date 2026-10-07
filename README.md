# 전국 여객선터미널 사이트

여러 터미널이 하나의 디자인과 화면 생성 코드를 공유하는 정적 웹사이트입니다. 터미널별 폴더에는 콘텐츠와 운항 데이터만 두고, 화면 수정은 `common` 폴더에서 한 번만 하면 모든 터미널에 반영됩니다.

## 구조

```text
KSA-TERMINAL/
├─ index.html                 # 전체 터미널 포털
├─ hero-ferry.png             # 공통 메인 이미지
├─ common/
│  ├─ style.css               # 포털 및 터미널 공통 디자인
│  ├─ layout.js               # 헤더·배너·승선·공지·안내·푸터 생성
│  └─ schedule.js             # 운항표·필터·상태 배지·접기/펼치기
└─ {terminal}/
   ├─ index.html              # 공통 파일과 데이터 파일만 불러오는 진입점
   ├─ terminal-data.js        # 터미널 콘텐츠
   └─ schedule-data.js        # 운항 시간표
```

현재 터미널 폴더는 `jeju`, `incheon`, `yeosu`, `tongyeong`, `pohang`, `wando`, `gunsan`입니다.

## 터미널 정보 수정

해당 폴더의 `terminal-data.js`를 수정합니다.

- `name`, `englishName`: 터미널 이름
- `phone`, `address`, `hours`, `parking`: 이용 정보
- `heroTitle`, `heroDescription`: 메인 배너 문구
- `boardingIntro`, `boardingCards`: 승선 안내
- `notices`: 공지사항의 분류·제목·날짜

배열 항목의 쉼표와 따옴표를 유지해야 합니다.

## 운항 시간표 수정

해당 폴더의 `schedule-data.js`를 수정합니다.

- `referenceTime`: 지난 편을 판단하는 기준 시각
- `filters`: 표 상단 터미널/부두 필터
- `items`: 출항·입항 운항편 목록

운항편의 주요 필드는 다음과 같습니다.

```js
{
  type: "departure",          // departure 또는 arrival
  time: "09:00",
  origin: "출발항",
  destination: "도착항",
  vessel: "선박명",
  terminalId: "main",        // filters의 id와 일치
  terminalLabel: "터미널명",
  status: "정상운항",         // 정상운항, 지연, 결항
  note: "변경 사유"           // 선택 항목
}
```

상태를 `정상운항`, `지연`, `결항`으로 변경하면 공통 스크립트가 각각 초록, 주황, 빨강 배지를 자동 적용합니다.

## 새 터미널 추가

1. 기존 터미널 폴더 하나를 새 영문 폴더명으로 복사합니다.
2. 새 폴더의 `terminal-data.js`와 `schedule-data.js`만 수정합니다.
3. 최상위 `index.html`의 `.portal-grid`에 새 터미널 카드를 추가합니다.
4. 새 폴더의 `index.html`에서 공통 파일 경로가 `../common/`으로 유지되는지 확인합니다.

터미널 페이지의 HTML 구조를 직접 복제하거나 수정할 필요는 없습니다. 레이아웃은 `common/layout.js`, 운항표는 `common/schedule.js`, 디자인은 `common/style.css`에서 관리합니다.

## 타이포그래피 시스템

사이트의 모든 글자 크기, 굵기, 줄간격은 `common/style.css`의 `:root`에 정의된 다음 변수를 사용합니다.

```css
--font-hero: clamp(38px, 4.2vw, 52px); /* 메인 히어로 제목 */
--font-display: 32px;    /* 페이지·큰 섹션 대제목 */
--font-h1: clamp(40px, 3.2vw, 44px);   /* 섹션 대제목 */
--font-h2: 24px;         /* 메인 배너 문구·큰 블록 제목 */
--font-h3: 20px;         /* 카드·블록 제목 */
--font-body-lg: 18px;    /* 본문·표 데이터 */
--font-body: 16px;       /* 보조 설명·메뉴·필터 */
--font-small: 13px;      /* 날짜·카테고리·상태 배지 */
--font-caption: 11px;    /* 오버라인·작은 태그 */

--global-font-weight-regular: 400;
--global-font-weight-medium: 500;
--global-font-weight-semibold: 600;
--global-font-weight-bold: 700;
--global-font-weight-extrabold: 800;

--global-line-height-tight: 1.3;
--global-line-height-normal: 1.5;
```

| 용도 | 크기 | 굵기 | 줄간격 | 대표 사용처 |
|---|---:|---:|---:|---|
| Hero | `--font-hero` | `--global-font-weight-semibold` | `--global-line-height-tight` | 메인 히어로 제목 |
| Display | `--font-display` | `--global-font-weight-semibold` | `--global-line-height-tight` | 실시간 운항정보, 승선 안내, 공지사항 |
| H1 | `--font-h1` | `--global-font-weight-bold` | `--global-line-height-tight` | 섹션 대제목 |
| H2 | `--font-h2` | `--global-font-weight-semibold` | `--global-line-height-tight` | 메인 배너 문구, 큰 블록 제목 |
| H3 | `--font-h3` | `--global-font-weight-semibold` | `--global-line-height-tight` | 승선 안내 카드, 고객센터 제목 |
| Body Large | `--font-body-lg` | `--global-font-weight-regular` | `--global-line-height-normal` | 본문, 공지 제목, 표 데이터 |
| Body | `--font-body` | `--global-font-weight-medium` | `--global-line-height-normal` | GNB, 카드 부제, 필터 버튼 |
| Small | `--font-small` | `--global-font-weight-regular` | `--global-line-height-normal` | 날짜, 카테고리, 하단 안내 문구 |
| Caption | `--font-caption` | `--global-font-weight-medium` | `--global-line-height-normal` | 영문 오버라인, 작은 태그 |

운항 현황 표는 데이터 셀에 Body Large/Regular, 헤더에 Body/Medium, 상태 배지에 `--font-small`/Medium을 적용합니다.

**코딩 규칙:** 새 요소를 포함한 모든 `font-size`, `font-weight`, `line-height` 변경은 반드시 위 CSS 변수를 통해서만 적용합니다.

## 확인 방법

최상위 `index.html`을 브라우저에서 연 뒤 터미널 카드를 선택합니다. 각 페이지의 헤더와 푸터에 있는 `전체 터미널 보기` 링크로 포털에 돌아올 수 있습니다.

## 포털 공통 안내 페이지

최상위 포털의 주요 메뉴는 다음 독립 페이지로 연결됩니다.

- `schedule.html`: 터미널별 운항정보 진입, 운항계획 확인 방법, 지연·결항 안내
- `boarding.html`: 승선 절차, 신분증, 수하물, 차량 선적 안내
- `customer.html`: 전국 운항 안내 전화, 이용 공지, 자주 묻는 질문

세 페이지는 `common/layout.js`에서 공통 헤더와 푸터를 그리고 `common/style.css`를 공유합니다. 포털 로고, GNB, 메가메뉴 또는 공통 안내 페이지 스타일을 바꿀 때는 `common` 파일만 수정합니다.

## 운항 데이터 코드 규칙

새 터미널의 `schedule-data.js`는 화면용 한글 문자열 대신 아래 코드를 기준으로 작성합니다. `common/schedule.js`가 코드와 표시명을 연결합니다. 기존 터미널 데이터는 단계적으로 전환할 수 있도록 한글 상태값과 `origin`·`destination`·`terminalLabel`도 하위 호환됩니다.

### 상태 코드

| 코드 | 한글 표시 | CSS 상태 |
|---|---|---|
| `normal` | 정상운항 | `normal` |
| `delayed` | 지연 | `control` |
| `cancelled` | 결항 | `cancel` |
| `controlled` | 통제 | `control` |
| `inquiry` | 선사문의 | `inquiry` |

기본 공통 상태는 `normal`, `delayed`, `cancelled`입니다. 현재 제주 화면에 있는 `통제`, `선사문의`를 그대로 유지하기 위해 `controlled`, `inquiry`를 확장 코드로 사용합니다.

### 제주 항구 ID

| ID | 한글 표시 |
|---|---|
| `jeju` | 제주항 |
| `chuja_wando` | 추자·완도 |
| `wando` | 완도항 |
| `mokpo` | 목포항 |
| `samcheonpo` | 삼천포항 |
| `chuja_jindo` | 추자·진도 |
| `nokdong` | 녹동항 |
| `chuja_from_jindo` | 추자(진도발) |
| `chuja_from_wando` | 추자(완도발) |

### 제주 터미널 ID

| ID | 필터 표시 | 표 표시 |
|---|---|---|
| `coastal` | 연안 2부두 | 연안(2부두) |
| `international` | 국제 7부두 | 국제(7부두) |

각 운항편은 `originId`, `destinationId`, `terminalId`, `status`만 참조하고 선박명과 시각은 원문 데이터로 유지합니다.

## 다국어(i18n) 골격

공통 UI 문구는 `common/locales/ko.js`와 `common/locales/en.js`의 중첩 키로 관리합니다. `common/i18n.js`는 `window.i18n.t('nav.home')` 형태의 조회 함수와 터미널 고유 데이터용 `localize({ ko, en })`를 제공합니다. JSON이나 `fetch`를 사용하지 않으므로 `file://`로 연 페이지에서도 동작합니다.

- 언어 판정: URL 경로에 `/en/`이 포함되면 `en`, 아니면 `ko`
- 폴백 순서: 현재 언어 → 한국어 → 키 문자열
- 빈 영문 값은 화면에 출력하지 않고 한국어로 폴백
- 누락 경고: 기본값은 꺼짐. 개발 중 `window.i18n.setMissingWarnings(true)`로 활성화
- 번역 티어: T1 공통 UI·상태·항구명, T2 포털 메인, T3 제주 페이지, T4 포털 하위 페이지
- 영문 사전의 빈 값 옆 `TODO[Tn]` 주석은 후속 번역 작업의 우선순위를 뜻합니다.

터미널 고유 문구는 사전에 중복하지 않고 데이터 파일 안에서 `{ ko: '...', en: '' }` 짝으로 관리합니다. 시각, 선박명, 전화번호, 날짜처럼 번역하지 않는 값은 기존 문자열을 유지합니다. 제주 공지사항과 승선 안내 카드도 현재는 같은 파일의 짝 필드를 사용하므로 별도 언어 파일 간 키 불일치가 생기지 않습니다.

운항 상태는 `schedule.status.<code>`, 제주 항구명은 `ports.<id>` 사전 키로 표시합니다. 위에 정리한 상태 코드·항구 ID가 후속 터미널 전환의 기준입니다. 제주 터미널 표시명은 `schedule-data.js`의 `filterLabel`·`tableLabel` 짝 필드에서 관리합니다.

### 1단계 키 대조 결과

`ko.js`와 `en.js`는 동일한 최상위 영역(`common`, `nav`, `header`, `mega`, `footer`, `terminalPage`, `schedule`, `ports`, `facilities`, `portal`)을 갖습니다. 제주 장문 콘텐츠는 별도 locale 파일로 분리하지 않고 `terminal-data.js` 내부의 짝 필드로 관리하므로 별도 키 대조 대상이 없습니다. 이번 범위에서 제외한 `guide.js`, `terminal-guide.js`, 포털 하위 3개 페이지 문구는 후속 T4 작업에서 전환합니다.
