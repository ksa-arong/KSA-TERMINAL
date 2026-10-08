# 전국 여객선터미널 통합 포털·지역 사이트 정보구조(IA)

- 작성 기준일: 2026-10-08
- 대상 저장소: 한국해운조합 전국 여객선터미널 통합 홈페이지
- 문서 상태: 구현 전 설계 기준선
- 이번 변경 범위: 이 문서만 생성. HTML/CSS/JS/데이터는 변경하지 않음

## 0. 결정 요약

1. **통합 포털과 지역 터미널 사이트의 내비게이션을 분리한다.** 디자인 토큰, header/footer의 렌더링 기반, 접근성 동작은 공유하되 메뉴 데이터와 정보구조는 `PORTAL_MENU`와 `REGION_MENU`로 나눈다.
2. 지역 사이트의 GNB는 `터미널 안내 / 운항 정보 / 승선 안내 / 이용 안내`의 4개 1depth와 11개 2depth를 기준으로 한다.
3. 지역 사이트에서 브랜드는 해당 터미널 홈으로 연결한다. `통합포털` 복귀 링크를 항상 노출하고, 지역 전환은 별도 드롭다운으로 제공한다.
4. 지역 간 이동은 **동일한 의미의 페이지가 대상 지역에 실제 존재할 때만 문맥을 유지**하고, 그렇지 않으면 대상 지역 홈으로 보낸다. 빈 페이지 또는 깨진 링크로 이동시키지 않는다.
5. 공개 GNB에는 이용할 수 있는 링크만 노출한다. 준비되지 않은 2depth를 회색 비활성 링크로 나열하지 않는다. 준비 현황을 알려야 할 경우 지역 홈의 안내 영역에서만 `준비 중` 배지를 사용한다.
6. 지역 URL은 `/jeju/schedule.html` 같은 **지역 폴더 내 플랫 HTML**을 권고한다. GitHub Pages의 정적 배포와 현재 `../common/` 상대경로를 유지하기 가장 안전하다.
7. 11개 페이지를 사람이 복제하지 않는다. 얇은 HTML loader는 manifest에서 생성하고, 본문은 공통 `region-page.js` 계열 렌더러가 지역 데이터와 page key를 받아 그린다.
8. `portal-data.js`와 `terminal-directory.js`는 전국 탐색·요약용이다. 지역 상세 페이지의 정본은 검증된 `terminal-data.js`와 `schedule-data.js`로 둔다. 공통 데이터의 SAMPLE/TODO 값을 지역 페이지에 자동 승격하지 않는다.
9. 현재 `ready`인 제주는 기존 한 페이지 기준으로는 완성됐지만, 본 문서의 11페이지 `ready` 요건에는 데이터가 부족하다. 구현 전에 필요한 데이터를 보강하거나 일시적으로 `partial`로 재평가해야 한다. 이는 **결정 필요** 항목이다.

## 1. 조사 기준과 용어

### 1.1 조사 범위

- Git 추적 HTML 42개 전수
- `common/menu-data.js`, `common/layout.js`, `common/locales/ko.js`
- 8개 지역의 `terminal-data.js`, `schedule-data.js`
- `common/portal-data.js`, `common/terminal-directory.js`
- HTML의 정적 링크, `MENU_DATA`의 동적 링크, 목록→상세 및 작성 흐름에서 생성되는 링크

### 1.2 완성도 표기

| 표기 | 의미 |
|---|---|
| 완료 | 사용자 흐름과 본문이 구현되어 있음. 운영 데이터의 최신성·공식성까지 보증한다는 뜻은 아님 |
| 부분 | 화면은 있으나 데이터 최신성, 출처, 일부 기능 또는 콘텐츠가 부족함 |
| 준비 중 | 의도된 placeholder이며 확정 콘텐츠를 제공하지 않음 |
| 호환 | 구 URL·hash를 새 URL로 넘기기 위한 리다이렉트 전용 |
| 흐름 전용 | 목록이나 작성 화면에서만 들어오는 상세·편집 페이지 |

## 2. 현황 인벤토리

### 2.1 전체 HTML 목록

#### 루트·정책 페이지

| 경로 | 역할 | GNB 노출 | 현재 진입 경로 | 완성도 |
|---|---|---|---|---|
| `/index.html` | 통합 포털 홈, 지역 탐색·공통 안내 | 브랜드 홈 | 직접 진입, 모든 포털 페이지 브랜드 | 완료(일부 공통 데이터 최신성 별도 검증) |
| `/boarding.html` | 과거 hash URL 호환 | 없음 | 기존 북마크; `#process/#identity/#vehicle/#baggage` | 호환 리다이렉트 |
| `/customer.html` | 과거 고객센터 hash URL 호환 | 없음 | 기존 북마크; `#notice/#faq/#inquiry` | 호환 리다이렉트 |
| `/schedule.html` | 과거 운항정보 hash URL 호환 | 없음 | 기존 북마크; `#realtime/#planning/#cancellation` | 호환 리다이렉트 |
| `/privacy.html` | 개인정보처리방침 | GNB hidden, footer/mobile utility | footer, 모바일 유틸리티 | 완료 |
| `/terms.html` | 이용약관 | GNB hidden, footer/mobile utility | footer, 모바일 유틸리티 | 완료 |
| `/sitemap.html` | 포털 전체 메뉴 | GNB hidden, footer | footer | 완료. hidden·지역 메뉴는 포함하지 않음 |

#### 터미널 탐색·운항 정보

| 경로 | 역할 | GNB 노출 | 현재 진입 경로 | 완성도 |
|---|---|---|---|---|
| `/terminal/terminal-list.html` | 전국 터미널 목록·검색 | 터미널 안내 > 전국 터미널 안내 | 포털 GNB, hero quick | 완료(목록 데이터의 사실성은 별도 검증) |
| `/terminal/map.html` | 지도 기반 지역·터미널 탐색 | 터미널 안내 > 지도로 찾기 | 포털 GNB | 완료(요약 데이터의 사실성은 별도 검증) |
| `/schedule/operation.html` | 전국 운항정보 검색·필터 | 운항 정보 > 운항 정보 | 포털 GNB, quick, legacy redirect | 부분. UI는 구현됐으나 데이터 갱신시각·공식 source metadata가 없음 |
| `/schedule/weather.html` | 터미널별 기상·특보 | 운항 정보 > 기상·특보 안내 | 포털 GNB | 완료(데이터 갱신 정책은 별도 확인 필요) |
| `/schedule/cancellation.html` | 지연·결항 시 확인 절차 | `hidden:true` | `/schedule.html#cancellation`, 직접 URL | 부분. 정적 안내는 있으나 실시간 결항 조회가 아님 |

#### 예매·승선 안내

| 경로 | 역할 | GNB 노출 | 현재 진입 경로 | 완성도 |
|---|---|---|---|---|
| `/booking/fare.html` | 운임 안내 placeholder | `hidden:true` | 직접 URL 외 공개 진입 없음 | 준비 중, 운영상 고아 |
| `/booking/refund.html` | 환불 규정 placeholder | `hidden:true` | 직접 URL 외 공개 진입 없음 | 준비 중, 운영상 고아 |
| `/boarding/procedure.html` | 공통 승선 절차 | 승선 안내 > 승선 절차 | 포털 GNB, 홈 카드, sitemap, legacy redirect | 완료 |
| `/boarding/id.html` | 공통 신분증 인정범위 | 승선 안내 > 신분증 안내 | 포털 GNB, 홈 카드, sitemap, legacy redirect | 완료 |
| `/boarding/vehicle.html` | 공통 차량 선적 절차 | 승선 안내 > 차량 선적 안내 | 포털 GNB, 홈 카드, sitemap, legacy redirect | 완료 |
| `/boarding/safety.html` | 공통 안전 수칙 | 승선 안내 > 안전 수칙 | 포털 GNB, sitemap | 완료 |
| `/boarding/baggage.html` | 공통 수하물 규정 | GNB 미노출 | `/boarding.html#baggage`, 직접 URL | 완료 콘텐츠이나 현대 IA에서 사실상 비노출 |

#### 고객센터

| 경로 | 역할 | GNB 노출 | 현재 진입 경로 | 완성도 |
|---|---|---|---|---|
| `/customer/notice.html` | 공지 목록 | 고객센터 > 공지사항 | 포털 GNB, footer/quick, legacy redirect | 완료(공지 데이터 공식성·갱신 정책은 미확인) |
| `/customer/notice-detail.html` | 공지 상세 | 직접 노출 없음 | 공지 목록·포털 최신공지의 동적 링크 | 흐름 전용 |
| `/customer/faq.html` | 공통 FAQ | 고객센터 > 자주 묻는 질문 | 포털 GNB, sitemap, 결항 안내 | 완료 |
| `/customer/inquiry.html` | 로컬 문의 목록 | 고객센터 > 문의게시판 | 포털 GNB, legacy redirect | 완료(브라우저 localStorage 기반) |
| `/customer/inquiry-write.html` | 문의 등록·수정 | 직접 노출 없음 | 문의 목록의 등록 버튼, 문의 상세의 수정 버튼 | 흐름 전용 |
| `/customer/inquiry-detail.html` | 문의 상세 | 직접 노출 없음 | 문의 목록의 동적 링크 | 흐름 전용 |
| `/customer/lost-found.html` | 공통 유실물 안내 | 고객센터 > 유실물 안내 | 포털 GNB, 홈 quick, sitemap, FAQ | 완료 |

#### 지역 사이트

| 경로 | 역할 | GNB 노출 | 현재 진입 경로 | 완성도 |
|---|---|---|---|---|
| `/jeju/index.html` | 제주 지역 홈·운항표·부두·연락처 | 현재 지역 GNB의 다수 anchor 대상 | 포털 지역 카드/지도/지역 전환 | 완료(2026-10 확정 자료 기준) |
| `/jeju/guide.html` | 제주 이용안내 placeholder | 터미널 이용 안내 및 일부 2depth | 제주 GNB | 준비 중 |
| `/mokpo/index.html` | 목포 지역 홈·기항지형 운항표·연락처 | 현재 지역 GNB의 다수 anchor 대상 | 포털 지역 카드/지도/지역 전환 | 부분(2026-07 기준 자료로 현재 기준월 경과) |
| `/mokpo/guide.html` | 목포 이용안내 placeholder | 터미널 이용 안내 및 일부 2depth | 목포 GNB | 준비 중 |
| `/incheon/index.html` | 인천 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/incheon/guide.html` | 인천 이용안내 placeholder | 현재 지역 GNB | 인천 GNB | 준비 중 |
| `/gunsan/index.html` | 군산 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/gunsan/guide.html` | 군산 이용안내 placeholder | 현재 지역 GNB | 군산 GNB | 준비 중 |
| `/pohang/index.html` | 포항 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/pohang/guide.html` | 포항 이용안내 placeholder | 현재 지역 GNB | 포항 GNB | 준비 중 |
| `/tongyeong/index.html` | 통영 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/tongyeong/guide.html` | 통영 이용안내 placeholder | 현재 지역 GNB | 통영 GNB | 준비 중 |
| `/wando/index.html` | 완도 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/wando/guide.html` | 완도 이용안내 placeholder | 현재 지역 GNB | 완도 GNB | 준비 중 |
| `/yeosu/index.html` | 여수 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/yeosu/guide.html` | 여수 이용안내 placeholder | 현재 지역 GNB | 여수 GNB | 준비 중 |

### 2.2 포털 GNB의 현재 구조

`common/menu-data.js`의 `MENU_DATA`와 `common/locales/ko.js`의 라벨을 합치면 현재 공개 구조는 다음과 같다.

```text
터미널 안내
├─ 전국 터미널 안내
└─ 지도로 찾기

운항 정보
├─ 운항 정보
├─ 지연·결항 안내          [hidden:true]
└─ 기상·특보 안내

예매 안내                  [1depth 자체가 외부 KSA 예매 사이트]
├─ 여객선 예매             [외부]
├─ 운임 안내               [hidden:true]
├─ 이벤트 정보             [hidden:true, HTML 파일 없음]
└─ 환불 규정               [hidden:true]

승선 안내
├─ 승선 절차
├─ 신분증 안내
├─ 차량 선적 안내
└─ 안전 수칙

고객센터
├─ 공지사항
├─ 자주 묻는 질문
├─ 문의게시판
├─ 유실물 안내
├─ 개인정보처리방침        [hidden:true, footer 노출]
├─ 이용약관                [hidden:true, footer 노출]
└─ 사이트맵                [hidden:true, footer 노출]
```

`boarding/baggage.html`은 실제 콘텐츠가 있지만 위 GNB와 sitemap에는 없다. `booking/events.html`은 menu record만 있고 파일은 없다. hidden 상태라 현재 죽은 링크는 발생하지 않지만, 파일을 만들지 않고 hidden을 해제하면 즉시 404가 된다.

### 2.3 현재 지역 헤더의 정확한 구조

- `common/layout.js:42-169`의 `sharedHeader(options)` 하나가 포털과 지역을 모두 렌더링한다.
- 지역 main은 `common/layout.js:756`, guide는 `common/layout.js:806`에서 다음 조합을 사용한다.
  - `portal: true`
  - `menuMode: 'terminal'`
  - `portalSection: 'terminal'`
  - `rootPrefix: '../'`
- `portal:true` 때문에 포털형 로고·스타일과 terminal switcher를 사용한다.
- `menuMode:'terminal'` 때문에 `MENU_DATA[i].terminal`을 GNB 데이터로 선택한다.
- 즉, 현재 지역 헤더는 별도 지역 header가 아니라 **포털 header renderer에 terminal 메뉴 variant를 주입한 하이브리드**다.
- desktop에는 브랜드 이미지, terminal GNB, 전체 터미널 드롭다운, 언어 선택이 있고, 통합포털로 돌아가는 명시적 단일 링크는 없다.
- 모바일 drawer 상단에는 브랜드, 터미널 선택, 닫기 버튼이 있고 그 아래 terminal 메뉴 accordion과 개인정보/약관 링크가 이어진다.
- 지역 main과 guide 모두 `sharedSiteFooter('../')`를 사용하므로 footer는 현재 포털과 동일하다.

현재 terminal 메뉴의 링크 중 상당수는 새 region template의 실제 ID와 불일치한다.

| 현재 메뉴 링크 | 실제 상태 |
|---|---|
| `index.html#terminal` | ready 페이지는 `#terminals`를 사용. 목포에는 해당 section 자체가 없음 |
| `guide.html#facilities`, `#directions`, `#faq`, `#lost-found` | guide는 단일 placeholder만 렌더링하므로 대상 ID가 없음 |
| `index.html#fare` | region template에 `#fare` 없음 |
| `index.html#boarding`, `#boarding-detail` | region template에 해당 section 없음 |
| `index.html#notice` | 실제 ID는 `#notices` |
| `index.html#schedule` | 제주·목포에는 존재. preparing 페이지에는 없음 |

따라서 새 2depth IA는 기존 terminal 메뉴의 anchor를 늘리는 방식이 아니라 별도 페이지 manifest로 교체해야 한다.

### 2.4 고아·비노출 페이지 판정

| 분류 | 페이지 | 판정 |
|---|---|---|
| 공개 링크 0건 | `booking/fare.html`, `booking/refund.html` | `hidden:true`이고 sitemap에도 없음. 의도된 준비 중 고아 페이지 |
| 현대 IA 공개 링크 0건 | `boarding/baggage.html` | `/boarding.html#baggage` 호환 경로로만 들어옴. 콘텐츠는 있으므로 승선 GNB 편입 여부 결정 필요 |
| hidden이나 호환 진입 존재 | `schedule/cancellation.html` | `/schedule.html#cancellation`로 진입 가능. 완전한 고아는 아님 |
| 목록 흐름 전용 | `notice-detail`, `inquiry-detail`, `inquiry-write` | 각각 목록·상세 화면이 동적 링크를 만들므로 고아가 아님 |
| 파일 없는 hidden record | `booking/events.html` | HTML이 없으므로 인벤토리 대상 페이지는 아님. hidden 해제 전 생성 또는 record 삭제 필요 |

## 3. 목표 정보구조

### 3.1 포털과 지역 사이트의 경계

```text
통합 포털
├─ 터미널 안내       전국 목록·지도·지역 진입
├─ 운항 정보         전국 통합 검색·기상
├─ 예매 안내         외부 KSA 예매로 연결
├─ 승선 안내         전국 공통 규정·절차
└─ 고객센터          공통 공지·FAQ·문의·유실물

지역 터미널 사이트
├─ 터미널 안내
│  ├─ 터미널 소개
│  ├─ 오시는 길
│  └─ 시설 안내
├─ 운항 정보
│  ├─ 운항 시간표
│  ├─ 항로·선사 안내
│  └─ 결항·운항 현황
├─ 승선 안내
│  ├─ 승선 절차
│  ├─ 준비 서류
│  └─ 수하물·차량 선적
└─ 이용 안내
   ├─ 공지사항
   └─ 문의처
```

포털은 전국 단위 탐색과 공통 정책을 담당하고, 지역 사이트는 특정 터미널에서 실제 행동에 필요한 검증된 지역 정보만 제공한다.

## 4. 지역 내비게이션 분리 설계

### 4.1 desktop header

우선순위와 배치는 다음으로 확정한다.

1. **브랜드 영역**: 좌측. 지역 로고와 터미널명을 함께 표시하고 해당 지역 `/index.html`로 연결한다.
2. **지역 GNB**: 중앙. `터미널 안내 / 운항 정보 / 승선 안내 / 이용 안내`만 표시한다.
3. **통합포털 복귀**: 우측 utility의 첫 항목. 항상 노출하며 `/index.html`로 이동한다. 지역 사이트 바깥으로 나간다는 의미가 드러나는 라벨을 쓴다.
4. **지역 전환**: 통합포털 링크 다음. 현재 지역명을 trigger로 표시하고, 페이지가 있는 지역만 링크로 제공한다. 폴더가 없는 계획 지역은 비활성 항목 또는 별도 `준비 중` 그룹으로 분리한다.
5. **언어·모바일 menu trigger**: 가장 우측. 영어가 실제 준비되기 전에는 현재처럼 비활성 상태를 유지한다.

`통합포털`은 상위 서비스로 나가는 안전한 탈출구이므로 지역 전환보다 앞에 둔다. 지역 전환은 같은 계층의 다른 사이트로 이동하는 보조 기능이다.

### 4.2 mobile drawer 순서

1. 지역 브랜드·지역 홈 링크
2. `통합포털로 돌아가기`
3. 현재 지역 표시 + 지역 전환 accordion
4. 지역 GNB 4개 그룹과 이용 가능한 2depth
5. 공통 빠른 링크: 전국 운항정보, KSA 예매, 1544-1114
6. 언어, 개인정보처리방침, 이용약관
7. 닫기 버튼은 drawer header에서 항상 접근 가능하게 유지

모바일에서 지역 전환 목록을 GNB보다 먼저 두되 기본은 접힌 상태로 한다. 긴 지역 목록이 핵심 지역 메뉴를 밀어내지 않아야 한다.

### 4.3 footer 권고

**renderer와 디자인 컴포넌트는 공유하되 콘텐츠 variant는 분리**한다.

| 안 | 장점 | 단점 | 판정 |
|---|---|---|---|
| 포털 footer 그대로 공유 | 구현 비용이 가장 낮음 | 지역 정체성이 약하고 portal 메뉴로 갑자기 전환됨 | 비권고 |
| 지역마다 완전 별도 footer 구현 | 지역 연락처를 자유롭게 구성 | 8개 구현 drift, 접근성·법적 링크 누락 위험 | 비권고 |
| `sharedFooter({ mode: 'portal'|'region' })` | 구조·토큰·법적 링크를 공유하면서 지역 연락처·복귀 링크를 분리 | renderer 조건이 추가됨 | **권고** |

지역 footer에는 지역명, 검증된 대표 연락처, 전국 운항안내, 통합포털 링크, 지역 전환, 개인정보/약관을 둔다. 값이 없는 대표번호 행은 만들지 않는다.

### 4.4 breadcrumb

2depth 페이지에 도입한다.

```text
통합포털 > 제주항 > 운항 정보 > 운항 시간표
```

- `통합포털`: 포털 홈 링크
- `제주항`: 지역 홈 링크
- `운항 정보`: 별도 category landing을 만들지 않는 동안 일반 텍스트
- `운항 시간표`: `aria-current="page"`
- 지역 홈에는 breadcrumb를 넣지 않는다.
- 화면용 breadcrumb와 구조화 데이터가 필요하면 같은 manifest에서 파생한다.

### 4.5 메뉴 데이터 구조

디자인 토큰, focus trap, mega menu/drawer 동작은 공유한다. 메뉴 데이터와 URL 해석만 분리한다.

```js
PORTAL_MENU = [/* 전국 터미널, 전국 운항, 외부 예매, 공통 승선, 고객센터 */]

REGION_MENU = [
  {
    id: 'terminal',
    label: '터미널 안내',
    children: [
      { page: 'about', requires: ['terminal.identity'] },
      { page: 'directions', requires: ['terminal.access'] },
      { page: 'facilities', requires: ['terminal.facilities'] }
    ]
  }
  // operation, boarding, service
]
```

- `PORTAL_REGION_REGISTRY`: 지역의 key/folder/status/hasPage/order를 계속 담당한다.
- `REGION_MENU`: 지역 공통 IA와 page requirement를 담당한다.
- 지역별 메뉴 배열을 복제하지 않는다. `REGION_MENU × pageAvailability(regionData)`로 노출 메뉴를 계산한다.
- `MENU_DATA[i].terminal`처럼 포털 menu record 안에 지역 menu를 중첩하는 현재 방식은 폐기한다.

### 4.6 지역 전환 시 목적지

**조건부 문맥 유지**를 권고한다.

1. 제주 `schedule.html`에서 목포로 전환하고 목포 schedule이 공개 상태면 `/mokpo/schedule.html`로 이동한다.
2. 대상 지역에 같은 page key가 없으면 `/mokpo/index.html`로 이동한다.
3. 준비 중 지역으로 이동하면 해당 지역의 현행 준비 중 홈으로 이동한다.
4. URL을 억지로 유지해 빈 페이지로 보내지 않는다.

항상 홈으로 보내는 방식보다 사용자의 의도를 보존하면서도, capability 확인으로 죽은 링크를 막을 수 있다.

## 5. 지역 2depth 페이지 명세

평가 기호: `가능`은 현재 검증 데이터로 독립 페이지를 구성 가능, `부분`은 일부 section만 가능, `불가`는 필수 데이터가 없음이다.

| 1depth / 페이지 | 목적 | 섹션 순서 | 주 데이터 소스 | 제주 | 목포 |
|---|---|---|---|---|---|
| 터미널 안내 / 터미널 소개 (`about`) | 터미널·부두의 역할과 기본정보 안내 | 개요 → 부두별 카드 → 대표 연락처 → 운영 링크 → 유의사항 | `terminal-data.js`; 전국 탐색 링크만 `portal-data.js` | 부분: 2개 부두·주소·대표 연락처는 있으나 운영시간·소개문 부족 | 불가: 터미널 기본정보 없음 |
| 터미널 안내 / 오시는 길 (`directions`) | 부두별 위치와 접근수단 안내 | 부두 선택 → 주소·지도 → 대중교통 → 자가용·주차 → 접근성 유의 | `terminal-data.js`; 검증된 주소 대조에 한해 `terminal-directory.js` | 부분: 주소만 있음 | 불가 |
| 터미널 안내 / 시설 안내 (`facilities`) | 이용 가능한 편의·교통약자 시설 안내 | 부두 선택 → 층/구역 → 편의시설 → 교통약자 시설 → 운영 유의 | `terminal-data.js` | 불가 | 불가 |
| 운항 정보 / 운항 시간표 (`schedule`) | 기준월별 출발·도착·휴항 정보를 제공 | source/기준월 → 항로 filter → 시간표 → 패턴·휴항 → 공통 notice | `schedule-data.js` | 가능: 2026-10, 왕복·요일 패턴 포함 | 가능(과거자료): 2026-07 기항지형. 현재용 노출 전 갱신 필요 |
| 운항 정보 / 항로·선사 안내 (`routes`) | 목적지·기항지·선박·선사·연락처 설명 | 항로/방면 → 기항지 → 선박 제원(있을 때) → 선사 → 특이사항 | `schedule-data.js`, 보조 연락처는 `terminal-data.js` | 가능 | 가능: 제원·소요시간 빈 UI는 숨김 |
| 운항 정보 / 결항·운항 현황 (`status`) | 당일 운항 상태와 변경 사유 안내 | 최종 갱신시각 → 상태 요약 → 항로별 상태 → 결항 사유 → 확인 연락처 | 향후 `schedule-data.js`의 검증 status slot; 포털 전국 데이터는 링크만 | 부분: 계획 휴항은 있으나 당일 status 없음 | 부분: 토·일 휴항 일부만 있고 당일 status 없음 |
| 승선 안내 / 승선 절차 (`boarding`) | 해당 터미널 고유 동선·마감 안내 | 예매 → 도착 권장시간 → 발권 → 개찰 → 승선 → 부두별 차이 | `terminal-data.js`; 공통 규정은 포털 `/boarding` 링크 | 불가: 지역 고유 절차 없음 | 불가 |
| 승선 안내 / 준비 서류 (`documents`) | 해당 터미널에서 필요한 신분·차량 서류 안내 | 여객 → 미성년자/보호자 → 차량 → 국제선(해당 시) → 공통 규정 링크 | `terminal-data.js`; 공통 신분증은 포털 링크 | 불가 | 불가 |
| 승선 안내 / 수하물·차량 선적 (`cargo`) | 수하물 제한과 차량·화물 접수 안내 | 수하물 → 차량 예약 → 접수 위치·마감 → 화물 연락처 → 제한사항 | `terminal-data.js`, 노선 연결은 `schedule-data.js` | 부분: 화물 연락처는 있으나 절차·수하물 규정 없음 | 부분: 화물 연락처 1개와 차량선적 노선은 있으나 절차 없음 |
| 이용 안내 / 공지사항 (`notices`) | 검증된 지역 공지와 변경사항 제공 | 중요공지 → 목록/filter → 상세 링크 → source·게시일 | `terminal-data.js`의 구조화 notices 또는 검증된 공통 notice source | 부분: 문장형 유의사항 2개뿐 | 부분: 문장형 유의사항 4개뿐 |
| 이용 안내 / 문의처 (`contacts`) | 문의 목적별 연락처를 한곳에 제공 | 대표·전국 안내 → 선사 → 화물 → 크루즈 → 외부 링크 | `terminal-data.js`, `schedule-data.js` operators | 가능 | 부분: 선사·화물은 있으나 터미널 대표번호 없음 |

`portal-data.js`에는 일부 제주 운영시간·운항횟수에 SAMPLE/TODO가 있고, 목포 기본정보는 비어 있다. `terminal-directory.js`와 주소 표기가 다른 항목도 있으므로 두 파일을 지역 상세의 자동 fallback으로 쓰지 않는다.

## 6. status 연동 생성·노출 규칙

### 6.1 기본 규칙

| status | 파일 생성 | 지역 GNB | 지역 홈 |
|---|---|---|---|
| `ready` | 11개 2depth 전부 생성. 단, 필수 slot validator 통과가 전제 | 4개 1depth와 11개 2depth 모두 노출 | 전체 서비스 바로가기 노출 |
| `partial` | 필수 slot을 충족한 page만 생성 | 생성된 page만 노출. children이 0개인 1depth는 숨김 | 제공 중인 범위와 기준일을 명시 |
| `preparing` | 새 2depth를 만들지 않음 | 지역용 전체 GNB 대신 최소 header: 지역 홈·통합포털·지역 전환 | 현행 1페이지 준비 중 안내 유지 |

새 status 값은 추가하지 않는다. 대신 각 page 정의에 `requires`를 두고 데이터에서 `pageAvailability`를 계산한다. `status`는 지역 전체 성숙도, `pageAvailability`는 실제 링크 안전장치다.

### 6.2 미생성 메뉴 표현 비교

| 방식 | 장점 | 단점 |
|---|---|---|
| 숨김 | 빈 페이지·키보드 함정 없음, 메뉴가 간결함 | 전체 예정 IA를 사용자가 알기 어려움 |
| 비활성 회색 | 예정 구조가 보임 | 링크처럼 보이지만 작동하지 않으며 8개 지역에서 비활성 항목이 과다해짐 |
| `준비 중` 배지 | 상태를 명시적으로 설명 | GNB가 상태판이 되고 작은 화면이 복잡해짐 |

**권고:** 공개 GNB에서는 숨긴다. 지역 홈의 별도 `제공 정보` 영역에서만 향후 메뉴를 `준비 중` 배지로 알릴 수 있다. 한 1depth에 하나 이상의 공개 child가 있으면 1depth를 보여주고, 0개면 1depth 전체를 숨긴다.

### 6.3 승급 기준

- `preparing → partial`
  - 지역 identity(`regionId`, 한국어명, folder, source)가 확인됨
  - 최소 한 개 2depth의 필수 slot이 모두 채워짐
  - 시점 의존 데이터는 `period` 또는 `sourceDate/sourceLabel`이 있고 화면에 노출됨
  - `verified:false`, `_legacy`, SAMPLE/TODO 값은 충족으로 계산하지 않음
- `partial → ready`
  - 11개 페이지의 필수 slot이 모두 충족됨
  - 운항표와 운항현황의 최신성 기준 및 갱신 책임자가 정해짐
  - 주소·전화·운영시간 등 중복 source 간 충돌이 해소됨
  - 모든 page URL, breadcrumb, GNB, 지역 전환 contract test 통과

현재 제주 `ready`는 “터미널 기본정보 + 운항표 검증”이라는 이전 정의다. 새 정의를 적용하면 facilities, local boarding, documents, live status가 비어 있으므로 그대로 11페이지를 만들 수 없다. 데이터 보강 전 `ready`를 유지할지 `partial`로 재분류할지는 구현 전 결정해야 한다.

## 7. URL·파일 구조

### 7.1 권고 URL

```text
/jeju/index.html
/jeju/about.html
/jeju/directions.html
/jeju/facilities.html
/jeju/schedule.html
/jeju/routes.html
/jeju/status.html
/jeju/boarding.html
/jeju/documents.html
/jeju/cargo.html
/jeju/notices.html
/jeju/contacts.html
/jeju/guide.html          # 호환 redirect shell
```

### 7.2 플랫 파일과 하위 디렉터리 비교

| 안 | 장점 | 단점 | 판정 |
|---|---|---|---|
| `/jeju/schedule.html` | 현재 `../common/` 유지, GitHub Pages에서 직접 파일 매핑, loader가 단순 | 지역 폴더에 파일이 많아짐 | **권고** |
| `/jeju/schedule/index.html` | clean URL 운용 가능 | `../../common/` 필요, rootPrefix 단계 증가, 폴더·파일 수 증가 | 비권고 |
| `/region.html?region=jeju&page=schedule` | HTML 수 최소 | URL 가독성·SEO·직접 링크·fallback이 약함 | 비권고 |

GitHub Pages는 server rewrite나 동적 routing이 없으므로 플랫 HTML이 가장 예측 가능하다. 절대 `/common/...` 경로는 project site 배포에서 깨질 수 있으므로 쓰지 않는다.

### 7.3 `guide.html` 호환

- ready 지역: `guide.html`은 `noindex`·canonical을 가진 호환 shell로 유지한다.
- hash mapping 예:
  - 기본, `#main` → `about.html`
  - `#directions` → `directions.html`
  - `#facilities` → `facilities.html`
  - 과거 `#parking/#ticketing/#accessibility`는 실제 대응 section이 있는 페이지로만 매핑
- partial 지역: 대응 page가 있을 때만 redirect하고, 없으면 현재 안내 화면을 유지한다.
- preparing 지역: 현행 `guide.html` 준비 중 화면을 유지한다.
- GitHub Pages에서는 HTTP 301을 설정하기 어려우므로 `location.replace` + 수동 링크 + `noindex`를 사용한다. 실제 301 지원 hosting으로 이전하면 server redirect로 교체한다.

### 7.4 공통 renderer 확장

각 loader는 다음 정보만 가진다.

```html
<body class="region-template-page" data-region="jeju" data-region-page="schedule">
<!-- terminal-data.js, schedule-data.js, common region renderer 로드 -->
```

권고 모듈 책임:

- `region-shell.js`: 지역 header/footer/breadcrumb
- `region-page.js`: `data-region-page`에 맞는 page renderer 선택
- `region-page-manifest.js`: URL, label, category, required slots, cross-region page key
- 기존 `schedule.js`: 운항표 renderer로 유지하되 page renderer에서 호출
- 지역 `terminal-data.js`, `schedule-data.js`: 콘텐츠 정본

HTML loader는 manifest에서 생성해 커밋한다. 사람이 88개 shell을 따로 편집하지 않는다.

### 7.5 파일 수·유지비 추산

| 시나리오 | 지역 HTML | 지역 데이터 JS | 합계 | 비고 |
|---|---:|---:|---:|---|
| 현재 | 16 | 16 | 32 | 지역당 4파일 |
| 8개 모두 ready + guide 호환 | 104 | 16 | 120 | `index + 11 subpage + guide` = HTML 13개/지역 |
| 현재 status 기반 예시 | 약 30 | 16 | 약 46 | 제주 11개, 목포 권고 3개(schedule/routes/contacts), preparing 6개는 추가 없음 |

현재 status 기반 수치는 제주가 새 ready 요건을 충족한다는 가정의 상한 예시다. shell generator를 쓰면 유지 대상은 88개 마크업이 아니라 1개 template, 1개 manifest, 공통 renderer가 된다.

## 8. 포털 공통 기능과 지역 기능의 역할 분담

### 8.1 운항 정보

| 포털 `/schedule` | 지역 운항 시간표 |
|---|---|
| 전국 지역·항로를 가로지르는 검색과 비교 | 단일 지역·부두의 상세 시간표 |
| 빠른 현황 파악과 지역 사이트 진입 | source, 기준일/기준월, 휴항, 요일 패턴, 기항지 상세 |
| 상세 책임 source가 아님 | 검증된 지역 schedule data가 정본 |

포털 결과는 지역 상세로 deep link할 수 있지만, 지역 데이터가 없으면 지역 홈으로 보낸다.

### 8.2 승선 안내

| 포털 `/boarding` | 지역 승선 안내 |
|---|---|
| 전국 공통 신분증, 안전, 일반 절차 | 해당 터미널의 도착 권장시간, 발권 위치, 부두 동선, 차량·화물 접수 |
| 규정 공통 source | 지역별 예외·현장 절차 source |

지역 고유 정보가 없으면 공통 내용을 복제하지 않고 포털 공통 페이지 링크를 제공한다.

### 8.3 예매

현재 구현에서 예매 1depth와 `여객선 예매`는 `https://island.theksa.co.kr/` 외부 연결이다. 로컬 `booking/fare.html`, `booking/refund.html`은 hidden placeholder다.

**권고:** 예매 거래는 외부 KSA 사이트를 정본으로 유지한다. 지역 사이트는 외부 예매 링크와 선사 연락처를 제공하되 자체 결제·환불 페이지처럼 보이게 하지 않는다. 운임·환불을 내부에 게시하려면 소유 부서, 갱신 주기, 항로별 source가 먼저 확정되어야 한다.

### 8.4 창 전환 규칙

- 지역 → 포털 내부 기능: **동일 창**. 이동 후 포털 header로 완전히 전환하고 breadcrumb/페이지 제목으로 문맥을 알린다.
- 지역 → 다른 지역: 동일 창.
- 지역/포털 → 외부 KSA 예매·선사 사이트: 새 창, `noopener noreferrer`, 접근 가능한 “새 창 열림” 라벨.
- 전화 링크: 같은 문서에서 `tel:` 호출.

## 9. 데이터 슬롯 체크리스트

### 9.1 페이지별 필수·선택 slot

| page key | 필수 slot | 선택 slot | 빈 slot UI |
|---|---|---|---|
| `about` | `name`, `terminals[].id/name`, 한 개 이상의 검증된 기본정보, source | `hero`, `englishName`, 운영 링크, 대표번호 | 개별 행 숨김. 필수 묶음이 없으면 page 미생성 |
| `directions` | `terminals[].name/address`, 주소 source | 좌표, 지도 링크, 교통, 주차, 접근성 | 선택 section 숨김. 주소만 있을 때는 `부분` 표기 후 정책 결정 |
| `facilities` | `terminals[].facilities[]`와 source | 층별 지도, 운영시간, 접근성 시설, 이미지 | 필수 배열이 비면 page 미생성 |
| `schedule` | `period 또는 sourceDate/sourceLabel`, `routes[]`, route identity, `outbound[]`, source | inbound, duration, vessel, patterns, suspended, departurePort | 없는 열·card field 숨김. routes가 비면 page 미생성 |
| `routes` | destination 또는 group, operators, outbound.via 또는 목적지 | vessel, duration, berthId, note | 없는 제원 section 숨김. 필수 route가 없으면 미생성 |
| `status` | `updatedAt`, 항로별 status, source/contact | reason, recovery estimate, weather link, planned suspended | live slot 없으면 “정상”을 추정하지 않고 page 미생성 |
| `boarding` | 단계별 지역 절차, 발권/승선 위치 또는 마감 기준, source | 이미지, 부두별 variant, 소요 예상 | 공통 portal 링크만 남기고 지역 page는 미생성 |
| `documents` | 대상별 필요서류 목록과 source | 국제선, 미성년자, 차량 예외 | 공통 규정 링크만 제공; 지역 page 미생성 |
| `cargo` | 수하물 또는 차량·화물 절차 중 페이지 목적을 충족할 검증 정보 | `cargoContacts`, 제한품목, 차량규격, 접수위치 | 연락처만 있으면 contacts로 흡수하고 독립 page 미생성 |
| `notices` | 구조화 notice의 title/date/category/source 또는 공식 feed | 첨부, 만료일, 중요도 | 문장형 공통 notice만 있으면 홈 유의사항으로 유지 |
| `contacts` | 한 개 이상의 목적별 이름·전화번호, source | 대표/전국/선사/화물/크루즈/홈페이지 | 빈 category 숨김. 연락처 전체가 비면 미생성 |

모든 slot에 공통으로 `verified`, `sourceLabel/sourceDate`, `lastReviewed`를 둘 수 있다. 새 status가 아니라 데이터 신뢰성과 노출 판단을 위한 metadata다.

### 9.2 제주·목포 현재 충족 현황

| slot 묶음 | 제주 | 목포 |
|---|---|---|
| 지역 identity·hero | 채움 | 채움 |
| 터미널/부두명 | 2개 채움 | 비어 있음 |
| 주소 | 2개 채움 | 비어 있음 |
| 운영시간 | 비어 있음 | 비어 있음 |
| 대중교통·주차·지도 | 비어 있음 | 비어 있음 |
| 시설·접근성 | 비어 있음 | 비어 있음 |
| 운항 source/period | `2026-09-16`, `2026-10` | `sourceDate` 없음, `2026-07` label·period; 현재 기준월 경과 |
| routes | 9개 | 12개 |
| inbound/duration | 항로별 보유, 일부 nullable | 모두 없음. 기항지형 정상 |
| operators | 채움 | 채움, 일부 복수 선사 |
| vessel 제원 | 다수 채움 | 없음. 빈 UI 숨김 대상 |
| patterns/suspended | 요일 패턴·날짜 휴항 보유 | 일부 weekday 휴항 보유 |
| 실시간 status/updatedAt | 비어 있음 | 비어 있음 |
| 지역 승선 절차 | 비어 있음 | 비어 있음 |
| 준비 서류 | 비어 있음 | 비어 있음 |
| 수하물 규정 | 비어 있음 | 비어 있음 |
| 차량·화물 절차 | 화물 연락처 6개, 절차 없음 | 화물 연락처 1개, 절차 없음 |
| 대표/전국 연락처 | 채움 | 비어 있음 |
| 선사 연락처 | 채움 | 채움 |
| 크루즈 연락처 | 3개 | 없음 |
| 구조화 공지 | 없음. 문장형 notice 2개 | 없음. 문장형 notice 4개 |

## 10. 코드 반영 시 영향 범위

### 10.1 변경이 불가피한 파일

| 영역 | 파일 | 예상 변경 |
|---|---|---|
| 메뉴 source | `common/menu-data.js` | `PORTAL_MENU`, `REGION_MENU`, page requirement 분리. registry는 유지 |
| shell renderer | `common/layout.js` | portal/region header mode 명시화, portal return, region switch context, breadcrumb, region footer variant |
| 스타일 | `common/style.css` | 지역 header utility, breadcrumb, disabled/availability 상태. 기존 토큰 재사용 |
| 라벨 | `common/locales/ko.js`, `en.js` | 새 지역 IA key. 한국어 정본, 영어 빈 값 fallback 정책 유지 |
| page renderer | 신규 공통 JS 또는 현재 renderer 분리 | page key별 section 렌더링과 slot validator |
| 운항표 | `common/schedule.js` | 독립 `schedule.html` mount 지원. schema v2 유지 |
| 지역 data | 각 `terminal-data.js`, `schedule-data.js` | 검증된 신규 slot과 source metadata만 추가. `_legacy` 보존 |
| loader | 상태상 공개되는 지역 HTML | `data-region`, `data-region-page`, 공통 script 로드 |
| 호환 | 각 `guide.html` | status/page availability에 따른 redirect 또는 현행 placeholder |
| sitemap | `sitemap.html` 또는 동적 sitemap renderer | 공개 포털 IA와 준비된 지역 page만 반영 |

`portal-data.js`, `terminal-directory.js`는 전국 탐색용으로 남긴다. 지역 상세와 값을 동기화하려면 별도의 데이터 정합성 작업으로 분리하고, 이번 IA 구현에 억지로 결합하지 않는다.

### 10.2 회귀 검증 기준

- 지역 `<header>`와 drawer는 의도적으로 변경되므로 전체 DOM hash 동일성을 요구하면 안 된다.
- header 분리 단계에서는 **기존 지역 `<main>` SHA-256 동일성**을 기준으로 삼는다.
- footer variant 단계에서는 main 동일성 + footer 접근성 snapshot을 별도로 본다.
- 실제 2depth 본문을 추가하는 단계부터는 page별 승인 snapshot, source/slot contract test, 360/1920 visual test를 기준으로 전환한다.
- 포털 `index.html`의 `<main>`과 포털 GNB는 지역 header 분리 단계에서 변하지 않아야 한다.

### 10.3 되돌리기 어려운 변경과 대비책

| 위험 | 이유 | 대비책 |
|---|---|---|
| 공개 URL 확정 | 검색엔진·외부 북마크에 남음 | URL manifest 동결, `guide.html` 호환 유지, canonical/noindex 정책 |
| status 의미 변경 | 기존 ready/partial 화면과 충돌 | slot validator를 먼저 도입하고 registry status 변경은 별도 커밋 |
| 88개 loader 생성 | 수동 수정 시 drift가 큼 | generator와 생성물 검증, 생성물 직접 편집 금지 |
| 메뉴 데이터 분리 | header·drawer·sitemap이 동시에 영향 | portal menu snapshot test 후 region menu를 feature flag로 단계 전환 |
| 중복 데이터 통합 | 잘못 합치면 검증 데이터가 SAMPLE로 덮임 | 지역 정본 우선순위 문서화, field-level source/verified 보존 |
| 지역 전환 deep link | 대상 page 부재 시 404 | pageAvailability 기반 URL resolver와 링크 contract test |

## 11. 결정 필요 항목

| 항목 | 선택지 | 권고 |
|---|---|---|
| 제주의 새 status | A. 부족한 slot을 채운 뒤 ready 유지 / B. 구현 시 partial로 일시 하향 | **B**, 또는 데이터 확보를 선행. 빈 11페이지 생성은 금지 |
| 목포 공개 page 범위 | A. schedule/routes/contacts 3개 / B. notice·cargo도 얇게 분리 | **A**. notice는 홈 유의사항, cargo 연락처는 contacts에 흡수 |
| 실시간 결항 source | A. `schedule-data.js` 수동 갱신 / B. 공식 API/feed / C. 포털 링크만 | 운영 책임·SLA가 없으면 **C**. 확보 후 B |
| 지역 공지 source | A. 지역 data 수동 / B. 공통 notice feed filter / C. page 미생성 | 공식 소유자가 확인된 source만 사용. 현재는 **C** |
| category landing | A. 별도 4페이지 / B. 1depth가 첫 공개 child로 이동 | **B**. 88페이지 외의 빈 landing을 늘리지 않음 |
| 지역 전환 문맥 | A. 항상 홈 / B. 가능한 경우 동일 page | **B**, pageAvailability fallback 필수 |
| footer | A. 포털 그대로 / B. 완전 별도 / C. 공통 renderer의 region variant | **C** |
| baggage의 포털 GNB 편입 | A. 승선 안내에 추가 / B. 현행 호환 진입만 유지 | 콘텐츠가 유효하면 **A**. 본 IA 구현과 별도 포털 IA 변경으로 검토 |
| `booking/fare/refund` | A. 계속 hidden / B. 공식 데이터 후 공개 / C. 삭제 | 현 시점 **A**. 소유 source가 확정되면 B |
| 영문 URL·콘텐츠 | A. 한국어와 동시 / B. 한국어 IA 안정화 후 | **B**. 현재 en 값 다수가 비어 있음 |

## 12. 단계별 구현 순서 제안

이번 작업에서는 아래 단계를 실행하지 않는다.

1. **IA·URL 동결**: 11개 page key, 파일명, breadcrumb label, 지역 전환 fallback을 승인한다.
2. **데이터 계약 작성**: page별 필수 slot, `verified/sourceDate/lastReviewed`, 최신성 기준을 schema 문서와 validator로 만든다.
3. **현재 status 재평가**: 특히 제주 ready와 목포 partial을 새 승급 기준으로 검사한다. registry 변경은 검토 후 별도 커밋한다.
4. **메뉴 데이터 분리**: `PORTAL_MENU`는 출력 snapshot을 유지하고 `REGION_MENU`를 추가한다. 이 단계에서 포털 화면 변화가 없어야 한다.
5. **지역 header 분리**: 제주 한 곳에서 브랜드, 지역 GNB, 통합포털 복귀, 지역 전환, mobile 순서를 구현한다. 제주 `<main>` hash는 유지한다.
6. **region footer variant·breadcrumb**: 공통 renderer 안에서 mode만 분리하고 접근성·360/1920 회귀 검증을 한다.
7. **공통 page renderer와 manifest**: 11개 page type을 빈 UI 없이 렌더링하고 requirement 미충족 시 build/runtime 경고를 낸다.
8. **제주 pilot**: 실제 채울 수 있는 page부터 만들고, 새 ready 계약에 필요한 누락 데이터를 운영기관에서 확보한다.
9. **목포 partial 전개**: 우선 `schedule.html`, `routes.html`, `contacts.html`만 만들고 2026-07 기준월 경과를 명시한다.
10. **guide 호환 전환**: 생성된 page만 hash redirect하고 미생성 대상은 안전한 지역 홈으로 fallback한다.
11. **preparing 6개 검증**: 기존 한 페이지 출력·URL·포털 진입 링크가 변하지 않았는지 확인한다.
12. **loader 자동 생성**: 승인된 manifest만으로 공개 HTML을 생성하고 404·orphan·breadcrumb·canonical contract test를 CI에 추가한다.
13. **8개 지역 확대**: 데이터 입수와 검증이 끝난 지역만 `preparing → partial → ready` 순으로 승급한다.
14. **마지막 정리**: 사용되지 않는 기존 terminal menu variant, 깨진 anchor 호환 코드, 중복 문서만 coverage 확인 후 제거한다.
