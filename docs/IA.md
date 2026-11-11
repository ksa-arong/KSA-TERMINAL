# 전국 여객선터미널 통합 포털·지역 사이트 정보구조(IA)

- 작성 기준일: 2026-10-08
- 대상 저장소: 한국해운조합 전국 여객선터미널 통합 홈페이지
- 문서 상태: 목포 2depth pilot 반영 기준선
- 최근 갱신: 목포에 공통 renderer 기반 5×17 지역 IA를 우선 적용

## 0. 결정 요약

1. **통합 포털과 지역 터미널 사이트의 내비게이션을 분리한다.** 디자인 토큰, header/footer의 렌더링 기반, 접근성 동작은 공유하되 메뉴 데이터와 정보구조는 `PORTAL_MENU`와 `REGION_MENU`로 나눈다.
2. 지역 사이트의 GNB는 `터미널 이용 안내 / 운항정보 / 선사안내 / 승선안내 / 고객센터`의 5개 1depth와 17개 지역 2depth를 기준으로 한다. `선사안내`는 독립 1depth다.
3. 지역 사이트에서 브랜드는 해당 터미널 홈으로 연결한다. `통합포털` 복귀 링크를 항상 노출하고, 지역 전환은 별도 드롭다운으로 제공한다.
4. 지역 간 이동은 **동일한 의미의 페이지가 대상 지역에 실제 존재할 때만 문맥을 유지**하고, 그렇지 않으면 대상 지역 홈으로 보낸다. 빈 페이지 또는 깨진 링크로 이동시키지 않는다.
5. 준비 중 2depth는 `<span aria-disabled="true">`와 `준비 중` 배지로 표시한다. 검증 데이터가 있는 페이지와 포털 공통 링크만 실제 URL로 이동한다.
6. 지역 URL은 `/regions/mokpo/timetable.html` 같은 **지역 폴더 내 플랫 HTML**로 확정한다. GitHub Pages의 정적 배포와 현재 `../../common/` 상대경로를 유지하기 가장 안전하다.
7. 17개 페이지의 본문 HTML을 복제하지 않는다. 얇은 loader는 page key만 넘기고, 공통 `region-page.js`가 지역 데이터와 page key로 본문과 availability를 계산한다.
8. `portal-data.js`와 `terminal-directory.js`는 전국 탐색·요약용이다. 지역 상세 페이지의 정본은 검증된 `terminal-data.js`와 `schedule-data.js`로 둔다. 공통 데이터의 SAMPLE/TODO 값을 지역 페이지에 자동 승격하지 않는다.
9. 포털 공통 페이지로 이동하는 `신분증 안내 / 안전 수칙 / 자주 묻는 질문 / 유실물 안내`는 지역 HTML을 만들지 않는다. `REGION_MENU`의 `external:true`가 링크와 이동 아이콘을 결정하며 renderer에 URL을 하드코딩하지 않는다.

## 1. 조사 기준과 용어

### 1.1 조사 범위

- 기존 HTML 42개와 목포 pilot loader 17개(총 59개) 전수
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
| `/regions/jeju/index.html` | 제주 지역 홈·운항표·부두·연락처 | 현재 지역 GNB의 다수 anchor 대상 | 포털 지역 카드/지도/지역 전환 | 완료(2026-10 확정 자료 기준) |
| `/regions/jeju/guide.html` | 제주 이용안내 placeholder | 터미널 이용 안내 및 일부 2depth | 제주 GNB | 준비 중 |
| `/regions/mokpo/index.html` | 목포 지역 홈·기항지형 운항표·연락처 | 현재 지역 GNB의 다수 anchor 대상 | 포털 지역 카드/지도/지역 전환 | 부분(2026-07 기준 자료로 현재 기준월 경과) |
| `/regions/mokpo/guide.html` | 목포 이용안내 placeholder | 터미널 이용 안내 및 일부 2depth | 목포 GNB | 준비 중 |
| `/regions/mokpo/terminal-introduction.html` | 선택한 터미널의 소개·규모·입주기관 | 지역 GNB의 터미널별 링크 | 목포 지역 GNB | 있음 |
| `/regions/mokpo/facilities.html` | 선택한 터미널의 층별 시설 안내 | 터미널 상세 상단 탭 | 터미널 소개·오시는 길과 상호 이동 | 있음 |
| `/regions/mokpo/directions.html` | 선택한 터미널의 주소·교통·선박 접근 안내 | 터미널 상세 상단 탭 | 터미널 소개·시설 안내와 상호 이동 | 있음 |
| `/regions/mokpo/parking.html` | 선택한 터미널의 주차 요금·할인 안내 | 터미널 상세 상단 탭 | 터미널 소개·시설 안내·오시는 길과 상호 이동 | 있음 |
| `/regions/mokpo/timetable.html` | 기항지형 운항 시간표 | 지역 GNB | 목포 지역 GNB | 있음(2026-07 기준, 기준월 경과) |
| `/regions/mokpo/arrivals.html` | 출도착 조회 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/fares.html` | 지역 운임 안내 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/routes.html` | 12개 운항 항목·기항지 안내 | 지역 GNB | 목포 지역 GNB | 있음 |
| `/regions/mokpo/marine-weather.html` | 지역 해양기상정보 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/operators.html` | 선사·연락처·담당 노선 | 지역 GNB | 목포 지역 GNB | 있음(2개 잠정 매핑 표시) |
| `/regions/mokpo/vessels.html` | 선박명·담당 방면 | 지역 GNB | 목포 지역 GNB | 있음(제원 없음) |
| `/regions/mokpo/boarding-procedure.html` | 지역 승선 절차 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/documents.html` | 지역 준비 서류 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/baggage.html` | 지역 수하물 안내 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/vehicle-shipping.html` | 차량·화물 선적 문의 | 지역 GNB | 목포 지역 GNB | 부분(연락처만 있음) |
| `/regions/mokpo/notices.html` | 지역 공지사항 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/mokpo/contacts.html` | 선사·화물·전국 안내 연락처 | 지역 GNB | 목포 지역 GNB | 있음(터미널 대표번호 미확보) |
| `/regions/mokpo/tourism.html` | 연계 관광 정보 | 지역 GNB, 비활성 | 직접 URL | 준비 중 |
| `/regions/incheon/index.html` | 인천 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/incheon/guide.html` | 인천 이용안내 placeholder | 현재 지역 GNB | 인천 GNB | 준비 중 |
| `/regions/gunsan/index.html` | 군산 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/gunsan/guide.html` | 군산 이용안내 placeholder | 현재 지역 GNB | 군산 GNB | 준비 중 |
| `/regions/pohang/index.html` | 포항 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/pohang/guide.html` | 포항 이용안내 placeholder | 현재 지역 GNB | 포항 GNB | 준비 중 |
| `/regions/tongyeong/index.html` | 통영 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/tongyeong/guide.html` | 통영 이용안내 placeholder | 현재 지역 GNB | 통영 GNB | 준비 중 |
| `/regions/wando/index.html` | 완도 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/wando/guide.html` | 완도 이용안내 placeholder | 현재 지역 GNB | 완도 GNB | 준비 중 |
| `/regions/yeosu/index.html` | 여수 지역 준비 안내 | 현재 지역 GNB | 포털 지역 카드/지역 전환 | 준비 중 |
| `/regions/yeosu/guide.html` | 여수 이용안내 placeholder | 현재 지역 GNB | 여수 GNB | 준비 중 |

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

- `common/layout.js:42-217`의 `sharedHeader(options)` 하나가 포털과 지역을 모두 렌더링한다.
- 기존 지역 main은 `common/layout.js:803`, guide는 `common/layout.js:853`에서 다음 조합을 사용한다.
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
- 목포 2depth loader는 `common/layout.js:896-909`의 별도 `region-v2` 분기로 들어간다. 기존 index/guide의 `terminal` mode는 유지되므로 pilot 동안 두 구조가 병존한다.

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
│  ├─ 연안터미널 ─┬─ 터미널 소개
│  │              ├─ 시설 안내
│  │              ├─ 오시는 길
│  │              └─ 주차 안내
│  ├─ 국제터미널 ─┬─ 터미널 소개
│  │              ├─ 시설 안내
│  │              ├─ 오시는 길
│  │              └─ 주차 안내
│  ├─ 홍도터미널 ─┬─ 터미널 소개
│  │              ├─ 시설 안내
│  │              ├─ 오시는 길
│  │              └─ 주차 안내
│  └─ 흑산도터미널 ┬─ 터미널 소개
│                  ├─ 시설 안내
│                  ├─ 오시는 길
│                  └─ 주차 안내
├─ 운항정보
│  ├─ 운항 시간표
│  ├─ 출도착 조회
│  ├─ 운임 안내
│  ├─ 항로 안내
│  └─ 해양기상정보
├─ 선사안내
│  ├─ 선사 안내
│  └─ 선박 안내
├─ 승선안내
│  ├─ 승선 절차
│  ├─ 준비 서류
│  ├─ 수하물
│  ├─ 차량 선적
│  ├─ 신분증 안내       [포털 공통, external:true]
│  └─ 안전 수칙         [포털 공통, external:true]
└─ 고객센터
   ├─ 공지사항
   ├─ 문의처
   ├─ 연계 관광 정보
   ├─ 자주 묻는 질문    [포털 공통, external:true]
   └─ 유실물 안내       [포털 공통, external:true]
```

포털은 전국 단위 탐색과 공통 정책을 담당하고, 지역 사이트는 특정 터미널에서 실제 행동에 필요한 검증된 지역 정보만 제공한다.

## 4. 지역 내비게이션 분리 설계

### 4.1 desktop header

우선순위와 배치는 다음으로 확정한다.

1. **브랜드 영역**: 좌측. 지역 로고와 터미널명을 함께 표시하고 해당 지역 `/index.html`로 연결한다.
2. **지역 GNB**: 중앙. `터미널 이용 안내 / 운항정보 / 선사안내 / 승선안내 / 고객센터`의 5개 그룹을 표시한다.
3. **통합포털 복귀**: 우측 utility의 첫 항목. 항상 노출하며 `/index.html`로 이동한다. 지역 사이트 바깥으로 나간다는 의미가 드러나는 라벨을 쓴다.
4. **지역 전환**: 통합포털 링크 다음. 현재 지역명을 trigger로 표시하고, 페이지가 있는 지역만 링크로 제공한다. 폴더가 없는 계획 지역은 비활성 항목 또는 별도 `준비 중` 그룹으로 분리한다.
5. **언어·모바일 menu trigger**: 가장 우측. 영어가 실제 준비되기 전에는 현재처럼 비활성 상태를 유지한다.

`통합포털`은 상위 서비스로 나가는 안전한 탈출구이므로 지역 전환보다 앞에 둔다. 지역 전환은 같은 계층의 다른 사이트로 이동하는 보조 기능이다.

### 4.2 mobile drawer 순서

1. 지역 브랜드·지역 홈 링크
2. `통합포털로 돌아가기`
3. 현재 지역 표시 + 지역 전환 accordion
4. 지역 GNB 5개 그룹과 전체 2depth. 준비 중 항목은 비활성 span, 포털 공통 항목은 이동 아이콘이 있는 링크
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
통합포털 > 목포항 > 운항정보 > 운항 시간표
```

- `통합포털`: 포털 홈 링크
- `목포항`: 지역 홈 링크
- `운항정보`: 별도 category landing을 만들지 않는 동안 일반 텍스트
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
    label: '터미널 이용 안내',
    children: [
      { page: 'terminal-introduction', href: 'terminal-introduction.html' },
      { page: 'facilities', href: 'facilities.html' },
      { page: 'directions', href: 'directions.html' }
    ]
  },
  // operation, operators, boarding, customer
  // 포털 공통 항목 예: { page: 'identity', href: 'boarding/id.html', external: true }
]
```

- `PORTAL_REGION_REGISTRY`: 지역의 key/folder/status/hasPage/order를 계속 담당한다.
- `REGION_MENU`: 지역 공통 IA와 page requirement를 담당한다.
- 지역별 메뉴 배열을 복제하지 않는다. `REGION_MENU × pageAvailability(regionData)`로 노출 메뉴를 계산한다.
- `MENU_DATA[i].terminal`처럼 포털 menu record 안에 지역 menu를 중첩하는 현재 방식은 폐기한다.

### 4.6 지역 전환 시 목적지

**조건부 문맥 유지**를 권고한다.

1. 제주 `timetable.html`에서 목포로 전환하고 목포 timetable이 공개 상태면 `/regions/mokpo/timetable.html`로 이동한다.
2. 대상 지역에 같은 page key가 없으면 `/regions/mokpo/index.html`로 이동한다.
3. 준비 중 지역으로 이동하면 해당 지역의 현행 준비 중 홈으로 이동한다.
4. URL을 억지로 유지해 빈 페이지로 보내지 않는다.

항상 홈으로 보내는 방식보다 사용자의 의도를 보존하면서도, capability 확인으로 죽은 링크를 막을 수 있다.

## 5. 지역 2depth 페이지 명세

평가 기호: `가능`은 현재 검증 데이터로 독립 페이지를 구성 가능, `부분`은 일부 section만 가능, `불가`는 필수 데이터가 없음이다.

| 1depth / 페이지 | 목적 | 섹션 순서 | 주 데이터 소스 | 제주 | 목포 |
|---|---|---|---|---|---|
| 터미널 안내 / 터미널 소개 (`terminal-introduction`) | 선택한 터미널의 역할과 기본정보 안내 | 화면 탭 → 주소·규모 → 입주기관 | `terminal-data.js.terminalProfiles` | 부분 | 가능: 4개 터미널 |
| 터미널 안내 / 시설 안내 (`facilities`) | 선택한 터미널의 층별 시설 안내 | 화면 탭 → 층별 배치도 → 층별 안내 → 주요 편의시설 | `terminal-data.js.terminalProfiles` | 불가 | 가능: 실제 값이 있는 시설만 노출 |
| 터미널 안내 / 오시는 길 (`directions`) | 선택한 터미널의 위치와 접근수단 안내 | 화면 탭 → 주소 → 지도 → 자가용·대중교통 또는 선박 접근 | `terminal-data.js.terminalProfiles` | 부분: 주소만 있음 | 가능: 출발지형 2개·섬형 2개 |
| 터미널 안내 / 주차 안내 (`parking`) | 선택한 터미널의 주차 요금과 할인 정보 안내 | 화면 탭 → 주차 요금 → 할인 안내 | `terminal-data.js.terminalProfiles[].parking` | 불가 | 가능: 연안·국제 유료, 흑산도 무료 |
| 운항정보 / 운항 시간표 (`timetable`) | 기준월별 출항·도착·휴항 제공 | source/기준월 → 시간표 → 패턴·휴항 → notice | `schedule-data.js` | 가능 | 가능(2026-07 기준, 경과 표시 필수) |
| 운항정보 / 출도착 조회 (`arrivals`) | 현재 또는 지정일의 출도착 상태 조회 | 조회 조건 → 상태 → 갱신시각 → 문의 | 향후 공식 API/feed 또는 검증 status slot | 불가 | 불가 |
| 운항정보 / 운임 안내 (`fares`) | 지역 항로별 검증 운임 제공 | 기준일 → 대상/차종 → 운임 → 할증·면제 → 예매 | 향후 `terminal-data.js` 또는 별도 검증 fare source | 불가 | 불가. 7월 할증료 18%는 게시 금지 |
| 운항정보 / 항로 안내 (`routes`) | 출항시각과 경유 기항지 안내 | 방면 → 출항지 → 출항시각 → 기항지 → 특이사항 | `schedule-data.js` | 가능 | 가능: 12개 운항 항목 |
| 운항정보 / 해양기상정보 (`marine-weather`) | 지역 항로 운항 판단에 필요한 기상 제공 | 관측시각 → 해상예보 → 특보 → 출항 전 확인 | 향후 공식 기상 source | 불가 | 불가 |
| 선사안내 / 선사 안내 (`operators`) | 선사 연락처와 담당 노선 안내 | 선사명 → 전화 → 담당 노선 → 검증 상태 | `schedule-data.js.routes[].route.operators` | 가능 | 가능: 잠정 매핑 2건은 확인 필요 표시 |
| 선사안내 / 선박 안내 (`vessels`) | 확인된 선박과 담당 방면 안내 | 선박명 → 담당 방면 → 제원(있을 때만) | `schedule-data.js.routes[].route.vessel` | 가능 | 가능: 선박명만, 제원 UI 숨김 |
| 승선안내 / 승선 절차 (`boarding-procedure`) | 해당 터미널의 현장 절차 안내 | 예매 → 도착 → 발권 → 개찰 → 승선 | `terminal-data.js` | 불가 | 불가 |
| 승선안내 / 준비 서류 (`documents`) | 지역 고유 서류·예외 안내 | 여객 → 미성년자 → 차량 → 국제선 | `terminal-data.js` | 불가 | 불가 |
| 승선안내 / 수하물 (`baggage`) | 지역 수하물 제한·접수 안내 | 허용 기준 → 제한품목 → 접수 → 문의 | `terminal-data.js` | 불가 | 불가 |
| 승선안내 / 차량 선적 (`vehicle-shipping`) | 차량·화물 선적 절차와 문의 제공 | 가능 노선 → 접수 절차 → 요금 → 문의 | `terminal-data.js.cargoContacts`, `schedule-data.js` | 부분 | 부분: 연락처 1건, 절차·요금 준비 중 |
| 고객센터 / 공지사항 (`notices`) | 검증된 지역 공지 제공 | 중요공지 → 목록 → 상세 → source·게시일 | 향후 구조화 `terminal-data.js.notices` | 불가: 문장형 유의사항만 있음 | 불가: 문장형 유의사항만 있음 |
| 고객센터 / 문의처 (`contacts`) | 목적별 연락처 통합 | 전국 안내 → 선사 → 화물 → 대표번호(있을 때) | `terminal-data.js`, `schedule-data.js` | 가능 | 가능: 대표번호 대신 1544-1114임을 명시 |
| 고객센터 / 연계 관광 정보 (`tourism`) | 도착지의 검증 관광 정보 연결 | 지역 소개 → 공식 관광 링크 → 교통 연계 | 향후 공식 관광 source | 불가 | 불가 |

지역 HTML을 만들지 않는 공통 항목은 `identity`, `safety`, `faq`, `lost-found` 네 page key다. 각각 `/boarding/id.html`, `/boarding/safety.html`, `/customer/faq.html`, `/customer/lost-found.html`로 동일 창 이동하며 `external:true`로 지역 사이트 밖 이동 아이콘을 표시한다.

`portal-data.js`에는 일부 제주 운영시간·운항횟수에 SAMPLE/TODO가 있고, 목포 기본정보는 비어 있다. `terminal-directory.js`와 주소 표기가 다른 항목도 있으므로 두 파일을 지역 상세의 자동 fallback으로 쓰지 않는다.

## 6. status 연동 생성·노출 규칙

### 6.1 기본 규칙

| status | 파일 생성 | 지역 GNB | 지역 홈 |
|---|---|---|---|
| `ready` | 17개 지역 2depth loader 생성 | 데이터 page는 링크, 데이터 없는 page는 비활성 span+배지 | 전체 서비스 바로가기 노출 |
| `partial` | pilot 지역은 17개 loader 생성, 이후 지역은 승인 시점에 일괄 생성 | 데이터 page는 링크, 준비 중 page는 비활성 span+배지 | 제공 중인 범위와 기준일을 명시 |
| `preparing` | 새 2depth를 만들지 않음 | 지역용 전체 GNB 대신 최소 header: 지역 홈·통합포털·지역 전환 | 현행 1페이지 준비 중 안내 유지 |

새 status 값은 추가하지 않는다. 대신 각 page 정의에 `requires`를 두고 데이터에서 `pageAvailability`를 계산한다. `status`는 지역 전체 성숙도, `pageAvailability`는 실제 링크 안전장치다.

### 6.2 미생성 메뉴 표현 비교

| 방식 | 장점 | 단점 |
|---|---|---|
| 숨김 | 빈 페이지·키보드 함정 없음, 메뉴가 간결함 | 전체 예정 IA를 사용자가 알기 어려움 |
| 비활성 회색 | 예정 구조가 보임 | 링크처럼 보이지만 작동하지 않으며 8개 지역에서 비활성 항목이 과다해짐 |
| `준비 중` 배지 | 상태를 명시적으로 설명 | GNB가 상태판이 되고 작은 화면이 복잡해짐 |

**확정:** 목포 pilot에서는 예정 IA를 알 수 있도록 비활성 회색 + `준비 중` 배지를 사용한다. 비활성 항목은 `<span aria-disabled="true">`이며 링크·탭 포커스를 만들지 않는다. 데이터가 들어오면 `pageAvailability`가 해당 항목만 `<a>`로 전환한다.

### 6.3 승급 기준

- `preparing → partial`
  - 지역 identity(`regionId`, 한국어명, folder, source)가 확인됨
  - 최소 한 개 2depth의 필수 slot이 모두 채워짐
  - 시점 의존 데이터는 `period` 또는 `sourceDate/sourceLabel`이 있고 화면에 노출됨
  - `verified:false`, `_legacy`, SAMPLE/TODO 값은 충족으로 계산하지 않음
- `partial → ready`
  - 17개 지역 페이지의 필수 slot이 모두 충족됨
  - 운항표와 운항현황의 최신성 기준 및 갱신 책임자가 정해짐
  - 주소·전화·운영시간 등 중복 source 간 충돌이 해소됨
  - 모든 page URL, breadcrumb, GNB, 지역 전환 contract test 통과

현재 제주 `ready`는 “터미널 기본정보 + 운항표 검증”이라는 이전 정의다. 새 정의를 적용하면 facilities, local boarding, documents, arrivals, fares, marine weather 등이 비어 있으므로 17페이지 전체가 ready는 아니다. 목포 pilot 확인 후 제주 status와 pageAvailability를 별도로 재평가한다.

## 7. URL·파일 구조

### 7.1 권고 URL

```text
/regions/jeju/index.html
/regions/jeju/terminal-introduction.html
/regions/jeju/directions.html
/regions/jeju/facilities.html
/regions/jeju/timetable.html
/regions/jeju/arrivals.html
/regions/jeju/fares.html
/regions/jeju/routes.html
/regions/jeju/marine-weather.html
/regions/jeju/operators.html
/regions/jeju/vessels.html
/regions/jeju/boarding-procedure.html
/regions/jeju/documents.html
/regions/jeju/baggage.html
/regions/jeju/vehicle-shipping.html
/regions/jeju/notices.html
/regions/jeju/contacts.html
/regions/jeju/tourism.html
/regions/jeju/guide.html          # 호환 redirect shell
```

### 7.2 플랫 파일과 하위 디렉터리 비교

| 안 | 장점 | 단점 | 판정 |
|---|---|---|---|
| `/regions/jeju/timetable.html` | 현재 `../../common/` 유지, GitHub Pages에서 직접 파일 매핑, loader가 단순 | 지역 폴더에 파일이 많아짐 | **확정** |
| `/regions/jeju/timetable/index.html` | clean URL 운용 가능 | `../../common/` 필요, rootPrefix 단계 증가, 폴더·파일 수 증가 | 비권고 |
| `/region.html?region=jeju&page=timetable` | HTML 수 최소 | URL 가독성·SEO·직접 링크·fallback이 약함 | 비권고 |

GitHub Pages는 server rewrite나 동적 routing이 없으므로 플랫 HTML이 가장 예측 가능하다. 절대 `/common/...` 경로는 project site 배포에서 깨질 수 있으므로 쓰지 않는다.

### 7.3 `guide.html` 호환

- ready 지역: `guide.html`은 `noindex`·canonical을 가진 호환 shell로 유지한다.
- hash mapping 예:
  - 기본, `#main` → `terminal-introduction.html`
  - `#directions` → `directions.html`
  - `#facilities` → `facilities.html`
  - 과거 `#parking/#ticketing/#accessibility`는 실제 대응 section이 있는 페이지로만 매핑
- partial 지역: 대응 page가 있을 때만 redirect하고, 없으면 현재 안내 화면을 유지한다.
- preparing 지역: 현행 `guide.html` 준비 중 화면을 유지한다.
- GitHub Pages에서는 HTTP 301을 설정하기 어려우므로 `location.replace` + 수동 링크 + `noindex`를 사용한다. 실제 301 지원 hosting으로 이전하면 server redirect로 교체한다.

### 7.4 공통 renderer 확장

각 loader는 다음 정보만 가진다.

```html
<body class="region-template-page" data-region-page="timetable">
<!-- terminal-data.js, schedule-data.js, common region renderer 로드 -->
```

권고 모듈 책임:

- `layout.js`: 지역 header/footer/breadcrumb shell과 `region-v2` menu mode
- `region-page.js`: `data-region-page`에 맞는 page renderer와 availability 선택
- `menu-data.js`의 `REGION_MENU`: URL, label, category, external flag의 manifest
- 기존 `schedule.js`: 운항표 renderer로 유지하되 page renderer에서 호출
- 지역 `terminal-data.js`, `schedule-data.js`: 콘텐츠 정본

HTML loader는 동일 template로 생성해 커밋한다. 사람이 136개 shell의 본문을 따로 편집하지 않는다.

### 7.5 파일 수·유지비 추산

| 시나리오 | 지역 HTML | 지역 데이터 JS | 합계 | 비고 |
|---|---:|---:|---:|---|
| 현재 | 16 | 16 | 32 | 지역당 4파일 |
| 8개 모두 5×17 전개 + guide 호환 | 152 | 16 | 168 | `index + 17 subpage + guide` = HTML 19개/지역 |
| 목포 pilot 완료 시 | 33 | 16 | 49 | 기존 16 HTML + 목포 loader 17개 |

7개 지역에 전개하면 loader 119개가 추가된다. 각 파일의 유지 대상은 본문 마크업이 아니라 page key뿐이며, 실질 로직은 1개 manifest와 공통 renderer가 담당한다.

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

준비 중 페이지의 신규 자료는 지역 `terminal-data.js`(운항 성격이면 `schedule-data.js`)의 `pages[pageKey]`에 넣는다. `verified:false`이거나 `sections`가 비어 있으면 비활성 상태를 유지하고, 검증된 section이 하나 이상이면 그 page만 활성화된다.

```js
pages: {
  directions: {
    verified: true,
    status: 'ready', // 일부만 있으면 'partial'
    description: { ko: '...', en: '' },
    sections: [{ title: { ko: '...', en: '' }, items: [{ label: { ko: '...', en: '' }, value: { ko: '...', en: '' } }] }]
  }
}
```

| page key | 필수 slot | 선택 slot | 빈 slot UI |
|---|---|---|---|
| `terminal-introduction` | `name`, `terminals[].id/name`, 한 개 이상의 검증된 기본정보, source | `hero`, `englishName`, 운영 링크, 대표번호 | 준비 중 본문, 메뉴 비활성 |
| `directions` | `terminals[].name/address`, 주소 source | 좌표, 지도 링크, 교통, 주차, 접근성 | 선택 section 숨김. 주소만 있을 때는 `부분` 표기 후 정책 결정 |
| `facilities` | `terminals[].facilities[]`와 source | 층별 지도, 운영시간, 접근성 시설, 이미지 | 준비 중 본문, 메뉴 비활성 |
| `timetable` | `period 또는 sourceDate/sourceLabel`, `routes[]`, route identity, `outbound[]`, source | inbound, duration, vessel, patterns, suspended, departurePort | 없는 열 숨김. routes가 비면 준비 중 |
| `arrivals` | `updatedAt`, 항로별 출도착 status, source/contact | reason, 예상시각 | “정상” 추정 금지, 준비 중 |
| `fares` | 기준일, 항로·대상별 운임, source | 할증, 면제, 차량 규격 | 준비 중. 단편 할증률만으로 활성화 금지 |
| `routes` | destination 또는 group, outbound.via 또는 목적지 | vessel, departurePort, note | 없는 field 숨김 |
| `marine-weather` | 관측/예보 시각, 지역 해상예보, 공식 source | 특보, 파고, 풍속 | 준비 중 |
| `operators` | operators[].name/tel, 담당 route | verified, 홈페이지 | 미확인 매핑은 확인 필요 표시 |
| `vessels` | vessel.name, 담당 route | tonnage, capacity, duration | 없는 제원 행 숨김 |
| `boarding-procedure` | 단계별 지역 절차와 source | 이미지, 부두별 variant | 준비 중 |
| `documents` | 대상별 지역 필요서류와 source | 국제선, 미성년자, 차량 예외 | 준비 중. 공통 신분증은 external 메뉴 |
| `baggage` | 지역 수하물 기준과 source | 제한품목, 접수위치 | 준비 중 |
| `vehicle-shipping` | 절차 또는 검증 `cargoContacts` | 요금, 차량규격, 접수위치 | 연락처만 있으면 `부분`, 절차·요금 준비 중 명시 |
| `notices` | 구조화 title/date/category/source 또는 공식 feed | 첨부, 만료일, 중요도 | 문장형 notice만 있으면 준비 중 |
| `contacts` | 한 개 이상의 목적별 이름·전화번호 | 대표/전국/선사/화물/크루즈/홈페이지 | 빈 category 숨김, 대표번호 미확보를 전국 안내로 명시 |
| `tourism` | 공식 관광기관 label/url/source | 추천 동선, 교통 연계 | 준비 중 |

모든 slot에 공통으로 `verified`, `sourceLabel/sourceDate`, `lastReviewed`를 둘 수 있다. 새 status가 아니라 데이터 신뢰성과 노출 판단을 위한 metadata다.

### 9.2 제주·목포 현재 충족 현황

| slot 묶음 | 제주 | 목포 |
|---|---|---|
| 지역 identity·hero | 채움 | 채움 |
| 터미널/부두명 | 2개 채움 | 4개 채움 |
| 주소 | 2개 채움 | 4개 채움 |
| 운영시간 | 비어 있음 | 비어 있음 |
| 대중교통·주차·지도 | 비어 있음 | 연안·국제 버스/자가용, 연안·국제 유료주차, 흑산도 무료주차 채움; 좌표 없음 |
| 시설·접근성 | 비어 있음 | 층별 시설 일부 채움; 접근성 전용 정보 없음 |
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
| 대표/전국 연락처 | 채움 | 대표번호 없음, 운항정보 ARS 1666-0910·전국안내 1544-1114 제공 |
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
| 운항표 | `common/schedule.js` | 독립 `timetable.html` mount 지원. schema v2 유지 |
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
| 136개 지역 loader(8×17) | 수동 수정 시 drift가 큼 | 동일 loader template과 page key 계약 검증, 본문은 공통 renderer만 수정 |
| 메뉴 데이터 분리 | header·drawer·sitemap이 동시에 영향 | portal menu snapshot test 후 region menu를 feature flag로 단계 전환 |
| 중복 데이터 통합 | 잘못 합치면 검증 데이터가 SAMPLE로 덮임 | 지역 정본 우선순위 문서화, field-level source/verified 보존 |
| 지역 전환 deep link | 대상 page 부재 시 404 | pageAvailability 기반 URL resolver와 링크 contract test |

## 11. 결정 필요 항목

| 항목 | 선택지 | 권고 |
|---|---|---|
| 제주의 새 status | A. 기존 지역 status 유지 + page availability 분리 / B. partial로 일시 하향 | 목포 pilot 확인 전 **A**, 각 메뉴 상태는 데이터로 별도 계산 |
| 목포 공개 page 범위 | A. 데이터 page만 파일 생성 / B. 17개 loader 모두 생성하고 준비 중은 비활성 | **B로 확정**. 직접 URL도 의도된 준비 중 상태를 제공 |
| 실시간 결항 source | A. `schedule-data.js` 수동 갱신 / B. 공식 API/feed / C. 포털 링크만 | 운영 책임·SLA가 없으면 **C**. 확보 후 B |
| 지역 공지 source | A. 지역 data 수동 / B. 공통 notice feed filter / C. page 미생성 | 공식 소유자가 확인된 source만 사용. 현재는 **C** |
| category landing | A. 별도 5페이지 / B. 1depth가 첫 활성 child로 이동 | **B**. 별도 빈 landing을 늘리지 않음 |
| 지역 전환 문맥 | A. 항상 홈 / B. 가능한 경우 동일 page | **B**, pageAvailability fallback 필수 |
| footer | A. 포털 그대로 / B. 완전 별도 / C. 공통 renderer의 region variant | **C** |
| baggage의 포털 GNB 편입 | A. 승선 안내에 추가 / B. 현행 호환 진입만 유지 | 콘텐츠가 유효하면 **A**. 본 IA 구현과 별도 포털 IA 변경으로 검토 |
| `booking/fare/refund` | A. 계속 hidden / B. 공식 데이터 후 공개 / C. 삭제 | 현 시점 **A**. 소유 source가 확정되면 B |
| 영문 URL·콘텐츠 | A. 한국어와 동시 / B. 한국어 IA 안정화 후 | **B**. 현재 en 값 다수가 비어 있음 |

## 12. 단계별 구현 순서 제안

목포 pilot 이후 나머지 지역에 전개할 순서다.

1. **목포 승인**: 17개 URL, 5개 GNB, 준비 중 비활성 동작, 360/1920 결과와 2026-07 기준월 경과 표시를 확인한다.
2. **loader 계약 고정**: page key·파일명 1:1, 공통 script 순서, meta 기본값을 자동 검사한다.
3. **지역별 데이터 감사**: `_legacy`/`verified:false`를 제외하고 각 page slot의 실제 충족 여부를 계산한다.
4. **제주 전개**: 목포와 같은 loader를 복제하고 왕복형 timetable, 부두·연락처 데이터를 renderer에서 검증한다. 기존 index/guide는 별도 승인 전 유지한다.
5. **6개 preparing 지역 유지 검증**: 검증 데이터가 없으면 현행 1페이지를 유지하며 2depth를 만들지 않는다.
6. **부분 데이터 지역 전개**: 검증 자료가 들어온 지역부터 loader 17개를 일괄 생성하고 page별 availability만 활성화한다.
7. **지역 전환 문맥 유지**: 대상 지역에 같은 page가 활성일 때만 동일 page로, 아니면 지역 홈으로 보낸다.
8. **guide 호환 전환**: 승인된 대응 page만 hash redirect하고 나머지는 기존 안내 화면을 유지한다.
9. **sitemap 반영**: 활성 지역 page만 공개 sitemap에 포함하고 준비 중 direct URL은 검색 노출 정책을 별도 결정한다.
10. **CI 계약 추가**: 404, 잘못된 page key, console error, source/period, 포털·지역 main hash를 검사한다.
11. **마지막 정리**: 기존 terminal menu variant는 8개 지역 전환과 호환 URL coverage가 확보된 뒤 제거한다.
