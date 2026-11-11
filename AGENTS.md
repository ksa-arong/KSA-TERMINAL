# KSA Terminal 디자인 작업 가이드

이 저장소는 전국 여객선터미널 포털과 터미널별 안내 화면을 위한 정적 웹사이트다. 화면 구조·상호작용·스타일은 공통 파일에서 관리하고, 터미널별 디렉터리에는 주로 콘텐츠와 운항 데이터만 둔다. 디자인을 변경하거나 새 화면을 만들 때에는 아래 규칙을 따른다.

향후 서비스 구현은 **Spring Boot 백엔드**와 **Thymeleaf 서버사이드 템플릿**을 기준으로 진행한다. 현재의 정적 HTML·CSS·JS는 디자인 및 화면 동작의 기준 자산이며, 전환 시 디자인 결과와 접근성을 유지해야 한다.

## 목표 아키텍처

```text
Browser
  └─ Spring MVC Controller
       ├─ Thymeleaf template (화면 렌더링)
       ├─ Service (업무 규칙·트랜잭션)
       ├─ Repository (데이터 접근)
       └─ DTO / Form object (입력·출력 모델)
```

- Controller는 요청 해석, 유효성 검증 결과 처리, view 또는 redirect 선택만 담당한다. 운항 규칙, 권한 판단, 데이터 조합을 Controller나 템플릿에 넣지 않는다.
- Service는 업무 규칙과 트랜잭션 경계를 소유한다. Repository는 영속성 조회·저장에만 집중한다.
- Entity를 화면 또는 API의 입출력 모델로 직접 노출하지 않는다. 화면에는 조회 DTO, 쓰기 요청에는 별도 Form/Request DTO를 사용한다.
- 공통 헤더, 푸터, 메뉴, 알림 등은 Thymeleaf fragment로 구성하고 모든 화면에서 재사용한다. 정적 사이트의 공통 `layout.js`를 페이지별 템플릿에 복제하지 않는다.
- 정적 자산은 Spring Boot의 `src/main/resources/static/` 아래에 두고, 템플릿은 `src/main/resources/templates/` 아래에 둔다. 화면별 CSS·JS가 필요하더라도 공통 디자인 토큰과 컴포넌트를 우선 재사용한다.

## Spring Boot 구현 기준

- 기능을 `controller`, `service`, `repository`, `domain`(또는 `entity`), `dto`/`form`, `config`로 역할에 맞춰 분리한다. 패키지 구조는 기능 중심 또는 계층 중심 중 하나를 일관되게 적용한다.
- 요청 데이터는 `@Valid`와 Bean Validation annotation으로 검증하고, 검증 오류는 사용자가 이해할 수 있는 문구로 필드 가까이에 표시한다. 클라이언트 검증은 보조 수단이며 서버 검증을 대체하지 않는다.
- 생성·수정·삭제 요청은 Post/Redirect/Get 패턴을 사용해 새로고침에 따른 중복 제출을 방지한다.
- 목록 조회에는 명시적인 정렬 기준과 pagination을 적용한다. 대량 운항·공지 데이터를 전부 메모리로 읽어 필터링하지 않는다.
- 날짜·시각은 `java.time`을 사용한다. 운항일, 출항 시각, 기준 시각, 시간대(기본 `Asia/Seoul`)를 명확히 분리하고 서버의 기본 시간대에 암묵적으로 의존하지 않는다.
- 예외는 전역 예외 처리로 일관되게 변환한다. 사용자에게 내부 예외 메시지·SQL·스택 트레이스를 노출하지 말고, 서버 로그에는 요청 식별자와 필요한 진단 정보를 남긴다.
- DB 변경은 Flyway 또는 Liquibase 같은 migration 도구로 이력 관리한다. 운영 환경에서 `ddl-auto`로 스키마를 임의 변경하지 않는다.
- 환경별 설정은 profile로 분리한다. 로컬·테스트·운영의 DB 주소, 외부 연동 endpoint, 로그 수준을 코드에서 분기하지 않는다.
- 단위 테스트는 Service의 업무 규칙과 검증을, 통합 테스트는 Controller 보안·검증·DB 연동을 우선 검증한다. 운영 화면의 핵심 경로는 MockMvc 등의 방식으로 최소한의 회귀 테스트를 둔다.

## Thymeleaf 템플릿 기준

- 화면 진입 템플릿은 `templates/`에 두고 `th:href`, `th:src`로 정적 자산 경로를 생성한다. 컨텍스트 경로가 있어도 동작하도록 하드코딩된 절대 경로에 의존하지 않는다.
- 공통 shell은 fragment로 분리한다. 예: `fragments/head`, `fragments/header`, `fragments/footer`, `fragments/navigation`, `fragments/messages`.
- 템플릿에는 표현 로직만 둔다. 복잡한 분기, 데이터 조회, 권한 규칙, 날짜 계산은 Controller 또는 View DTO에서 준비한다.
- 기본 텍스트 출력은 `th:text`를 사용한다. 사용자 입력이나 외부 데이터에 `th:utext`를 사용하지 않는다. HTML 허용 콘텐츠가 필요하면 서버에서 허용 목록 기반으로 정제한 값만 별도 모델로 제공한다.
- form은 `th:object`, `th:field`, `#fields.hasErrors()`를 사용해 binding 및 오류 표시를 일관되게 구현한다. label의 `for`, input의 `id`, 오류 메시지의 연결을 유지한다.
- 조건부 노출은 `th:if`/`th:unless`로 명시한다. 단, 권한 검사는 화면 숨김만으로 끝내지 말고 서버 endpoint에도 동일하게 적용한다.
- 반복 목록은 빈 상태, 로딩 실패 또는 데이터 없음 상태를 함께 제공한다. 운항표·공지·FAQ에는 현재 정적 화면의 정보 위계와 모바일 카드 변환 구조를 유지한다.
- 다국어 전환 시 공통 UI는 Spring MessageSource 메시지 키로 관리한다. 기존 `ko.js`/`en.js`의 키 체계와 문구를 이관할 때 누락·불일치가 없도록 관리한다. 터미널 고유 데이터는 언어별 필드를 DTO에서 명시적으로 제공한다.

## 보안 기본 원칙

보안은 UI의 숨김 처리만으로 구현하지 않는다. 모든 신뢰 경계는 서버에서 다시 검증하고, Spring Security 설정과 테스트로 보호한다.

- 인증이 필요한 기능(관리자, 문의 내역, 콘텐츠 관리 등)은 Spring Security로 보호하고, 익명 공개 범위와 인증 필요 범위를 URL·HTTP method 단위로 명시한다. 기본값은 최소 권한이다.
- 인가는 역할 이름만 확인하는 수준에 머물지 않는다. 특정 문의·공지·첨부파일처럼 소유권 또는 운영 권한이 필요한 리소스는 Service 계층에서 대상 리소스 기준으로 재검증한다.
- 상태를 변경하는 모든 요청은 CSRF 보호를 유지한다. Thymeleaf form에는 CSRF 토큰을 포함하고, AJAX 요청에는 Spring Security가 요구하는 헤더 또는 파라미터를 일관되게 전달한다. 특별한 이유 없이 CSRF를 전역 비활성화하지 않는다.
- 로그인·비밀번호·세션 처리에는 Spring Security의 검증된 기능을 사용한다. 비밀번호는 강한 단방향 password encoder로만 저장하며, 평문·복호화 가능한 암호·로그 출력은 금지한다.
- 세션 cookie에는 `HttpOnly`, `Secure`(HTTPS), 적절한 `SameSite` 정책을 적용한다. 로그인 성공·실패, 세션 만료, 권한 없음 화면의 동작을 명확히 정의한다.
- 모든 외부 입력(경로 변수, query string, form, JSON, 파일명, HTTP header)을 검증한다. 허용 목록·길이·형식·범위를 적용하고, 동적 쿼리는 parameter binding을 사용한다.
- 파일 업로드가 도입되면 파일 크기·개수·확장자·실제 MIME/시그니처를 제한하고, 사용자 제공 파일명·경로를 신뢰하지 않는다. 업로드 파일은 실행 가능한 정적 경로 밖에 저장하고 다운로드 시 권한을 검사한다.
- 비밀정보(DB 비밀번호, API key, SMTP credential, 토큰)는 소스, Thymeleaf 템플릿, 정적 JS, 로그, 오류 응답에 넣지 않는다. 환경 변수·배포 환경의 secret manager·암호화된 설정을 사용하고 `.env` 또는 실제 credential 파일은 커밋하지 않는다.
- 오류 응답은 사용자에게 필요한 안내만 제공한다. 운영 환경에서는 debug page, actuator의 민감 endpoint, 상세 예외 노출을 비활성화하거나 별도 접근 제어한다.
- HTTPS를 기본으로 하고, 보안 헤더(CSP, `X-Content-Type-Options: nosniff`, clickjacking 방지 정책, Referrer-Policy)를 서비스 특성에 맞게 설정한다. CSP 도입 시 인라인 script/style 의존을 줄이고 nonce 또는 외부 정적 파일 방식을 사용한다.
- 외부 API 호출에는 connect/read timeout, 응답 검증, 허용된 host, 실패 fallback을 둔다. 사용자 입력으로 외부 URL을 직접 요청하는 기능은 SSRF 위험을 검토한다.
- 개인정보(문의자 연락처, 이용 기록 등)는 최소 수집·최소 노출한다. 로그·분석 데이터·관리 화면에서 마스킹 기준과 접근 권한을 정하고, 응답 DTO에 불필요한 개인정보를 넣지 않는다.

## 보안 검증 체크리스트

- 공개/인증/관리자 URL 및 HTTP method별 접근 정책이 테스트로 검증되는가?
- POST·PUT·PATCH·DELETE 요청에서 CSRF 토큰 누락 시 거절되는가?
- 본인 소유가 아닌 문의·관리 리소스에 직접 URL을 입력해도 접근·수정할 수 없는가?
- 유효하지 않은 입력, 긴 입력, script 문자열, 예상 밖의 파일명이 사용자 화면과 서버 로그에서 안전하게 처리되는가?
- 로그인 정보, DB 연결 문자열, access token, 개인정보가 저장소·응답·로그에 노출되지 않는가?
- 운영 profile에서 HTTPS, cookie 속성, 에러 페이지, Actuator 노출 범위가 검토되었는가?

## TDD Rule

> **이 규칙은 Rigid — 상황에 맞게 변형하지 마라.**

이 섹션은 전역 기본값(fallback)이다. 하위 디렉터리에 `AGENTS.md`가 있고 TDD 규칙을 별도로 정의하면 **하위 디렉터리 규칙을 우선** 적용한다.

### 적용 기준

**반드시 TDD를 적용한다.**

- 비즈니스 로직: Service, 정책, 상태 전이, 권한·소유권 판단, 계산·변환
- API 및 Controller endpoint: 성공, 검증 실패, 인증·인가 실패, 예외 응답
- 재사용 유틸리티
- 버그 수정: 버그를 재현하는 실패 테스트를 먼저 작성한다.

**TDD가 불필요하다.**

- 타입 정의, DTO의 단순 필드 선언
- 설정 파일과 단순 환경 설정
- 순수 UI·스타일 변경과 Thymeleaf의 정적 마크업 변경
- SQL 자체 작성 또는 migration의 단순 스키마 선언

단, 불필요 대상이라도 로직·조건·동작을 포함하면 즉시 **TDD 적용 대상**으로 전환한다.

### RED → GREEN → REFACTOR

1. **RED**
   - **하나의 동작 = 하나의 테스트**로 작성한다.
   - 테스트를 **반드시 실행하여 실패를 확인**한다.
   - 실패 이유는 반드시 **기능 미구현**이어야 한다. 컴파일 오류, 잘못된 fixture, 환경 오류, 기존 테스트 실패를 RED로 인정하지 않는다.

2. **GREEN**
   - 테스트를 통과시키는 **최소한의 코드만** 작성한다.
   - **YAGNI**를 적용한다. 아직 요구되지 않은 추상화, 옵션, 예외 처리, 확장 기능을 추가하지 않는다.
   - 신규 테스트와 **기존 테스트 전체가 모두 통과**하는지 확인한다.

3. **REFACTOR**
   - 중복 제거, 이름 개선, 작은 헬퍼 추출만 수행한다.
   - 리팩터링 중에도 **green 상태를 유지**하고 테스트를 실행한다.
   - **새 동작을 추가하지 않는다.**

4. **반복**
   - 다음 동작을 위한 **RED**로 돌아간다.

### 삭제 강제 규칙

- 테스트 전에 프로덕션 코드를 먼저 작성했다면 해당 코드를 **삭제**하고 RED부터 다시 시작한다.
- 나중에 참고하려고 남겨 두는 행위도 금지한다. **“참고용” 보관은 허용하지 않는다.**

### 변명 차단표

| 변명 | 반론 |
| --- | --- |
| 너무 단순해서 테스트 불필요 | 단순한 동작도 계약이다. 테스트는 구현이 아니라 기대 동작을 고정한다. |
| 나중에 추가하겠다 | 나중은 보장되지 않는다. 지금 RED를 작성한다. |
| 시간이 없다 | 결함 조사와 회귀 수정 비용이 더 크다. 최소 동작부터 TDD로 구현한다. |
| 삭제하면 낭비 | 검증되지 않은 선행 코드는 매몰비용이다. 삭제 후 RED부터 시작한다. |
| 프로토타입이다 | 프로토타입도 동작 가설을 검증해야 한다. 적용 대상이면 TDD를 생략하지 않는다. |

## 우선 확인할 기준

- 디자인의 공식 구현 기준은 `common/style.css`이다.
- 디자인 토큰의 역할, 값, alias, breakpoint 현황은 `docs/design-tokens.md`를 따른다. 문서와 CSS가 다르면 현재 CSS를 우선으로 보고 문서를 함께 갱신한다.
- 화면 구성과 데이터 분리 원칙은 `README.md`를 따른다.
- 기존 화면을 참조할 때에는 비슷한 기능의 HTML과 `common/layout.js`가 생성하는 실제 마크업을 함께 확인한다. CSS 클래스 이름만 보고 새 구조를 추측하지 않는다.

## 구조와 수정 위치

| 목적 | 우선 수정 위치 | 주의점 |
| --- | --- | --- |
| 전 사이트 공통 스타일·토큰·반응형 | `common/style.css` | 가장 큰 단일 스타일 소스다. 기존 cascade와 media query 위치를 유지한다. |
| 공통 헤더, 푸터, 메가 메뉴, 공통 섹션 | `common/layout.js` | 터미널별 HTML에 중복 구현하지 않는다. |
| 포털 지도·히어로·터미널 탐색 | `common/portal.js`, `common/portal-map.js`, `index.html` | 지도 좌표와 선택 상태는 디자인 토큰이 아니라 컴포넌트 데이터다. |
| 터미널 공통 페이지·운항표 | `common/schedule.js`, `common/terminal-*.js` | 상태/필터 마크업 변경 시 모든 터미널 화면을 확인한다. |
| 터미널별 문구·이미지·운항 데이터 | `{terminal}/terminal-data.js`, `{terminal}/schedule-data.js` | 공통 UI를 복사하거나 터미널별 CSS를 새로 만들지 않는다. |
| 다국어 공통 문구 | `common/locales/ko.js`, `common/locales/en.js` | 공통 UI의 하드코딩 문구를 추가하지 않는다. |

## 디자인 원칙

- 브랜드 인상은 신뢰감 있는 해양·공공 서비스다. 기본 표면은 밝고 정돈되게 유지하고, 중요한 정보·헤더·히어로에는 남색 계열의 대비를 사용한다.
- 정보 위계는 **제목 → 핵심 수치/상태 → 보조 설명 → 행동** 순서로 명확히 만든다. 운항 상태, 시간, 출발·도착지 같은 운영 정보가 장식보다 우선한다.
- 기존 카드, 표, 필터, 안내 블록, 버튼의 시각 언어를 재사용한다. 한 화면을 위해 새로운 radius, 그림자, 색, 버튼 형태를 임의로 만들지 않는다.
- 사진 위 텍스트는 기존 overlay/inverse 토큰을 사용해 충분한 대비를 확보한다. 이미지 자체에 텍스트를 구워 넣지 않는다.
- 아이콘은 장식이 아니라 의미 전달을 위해 사용한다. 아이콘만으로 상태나 행동을 표현하지 말고 접근 가능한 이름 또는 텍스트를 제공한다.

## 토큰 사용 규칙

새 CSS에는 직접 색상값, 임의 spacing, 임의 font-weight를 늘리지 않는다. 다음 우선순위로 토큰을 사용한다.

```text
Primitive (--global-*) → Semantic (--text-*, --surface-*, --action-*, --status-*)
→ Component (--portal-*, --schedule-*, etc.) → CSS property
```

- 색상은 역할 기반 Semantic 토큰을 우선한다. 예: 본문은 `--text-body`, 강한 제목은 `--text-strong`, 기본 경계선은 `--border-default`, 기본 버튼은 `--action-primary`.
- 신규 spacing에는 `--global-space-4`부터 `--global-space-80`까지의 스케일을 사용한다. 섹션 기본 여백은 `--global-spacing-section`, 밀도 높은 구간은 `--global-spacing-section-tight`을 우선 검토한다.
- 배경에는 `--surface-*`, 텍스트에는 `--text-*`, action에는 `--action-*`을 사용한다. 한 역할의 토큰을 다른 CSS 속성에 기계적으로 전용하지 않는다.
- 새 전역 값이 필요하면 먼저 Primitive 또는 Semantic 토큰으로 승격할 가치가 있는지 검토한다. 특정 UI에만 필요한 값은 해당 컴포넌트 루트에 scoped custom property로 둔다.
- 기존 과도기 alias(`--spacing-*`, `--bg-*`, `--color-brand*` 등)는 한 번에 제거·치환하지 않는다. 변경 범위에서 canonical alias를 우선 사용하고, 기존 참조는 별도 마이그레이션으로 다룬다.

### 색상과 상태

- 기본 브랜드: `--global-color-blue-600` / `--text-brand` / `--action-primary`
- 기본 배경: `--surface-base`; 보조 배경: `--surface-subtle`, `--surface-muted`; 반전 배경: `--surface-inverse`
- 운항 상태는 의미 토큰으로만 표현한다: 정상 `--status-success`, 지연·통제 `--status-warning`, 결항 `--status-danger`, 문의·보조 상태는 `--text-muted`.
- 상태는 색상만으로 구분하지 않는다. 상태명과 배지, 아이콘 또는 설명을 함께 유지한다.

### 타이포그래피

- 본문 폰트는 Pretendard 계열, 히어로 제목은 Gmarket Sans 계열을 사용한다. 정의된 `@font-face`와 font-family 토큰을 재사용한다.
- 폰트 크기, 굵기, 줄간격은 `--font-*`, `--global-font-weight-*`, `--global-line-height-*` 토큰만 사용한다.
- 대표 역할: 히어로 `--font-hero`, 페이지/섹션 제목 `--font-page-title`·`--font-section-title`, 카드 제목 `--font-card-title`, 본문 `--font-body-lg` 또는 `--font-body`, 보조 정보 `--font-small`·`--font-caption`.
- 제목의 줄간격은 tight 계열, 일반 설명은 normal 이상을 사용한다. 작은 글자를 색 또는 얇은 굵기만으로 읽기 어렵게 만들지 않는다.

### 형태와 motion

- radius는 `--global-radius-sm`, `--global-radius-md`, `--global-radius-pill`을 우선 사용한다. 카드의 기존 `--radius-card-sm`은 호환성을 위해 유지한다.
- 그림자는 `--global-shadow-sm/md/lg` 또는 기존 semantic shadow 토큰을 사용하며, 카드와 패널에 과도한 부유감을 주지 않는다.
- hover/focus/expanded/selected 상태를 기본 상태와 함께 설계한다. 기존 transition 시간·easing을 재사용하고, `prefers-reduced-motion`에서 의미 전달이나 focus 표시가 사라지지 않게 한다.

## 컴포넌트 작성 규칙

- 공통 버튼은 기존 `.btn` 시스템과 크기/variant를 사용한다. 새 버튼은 텍스트, 아이콘, disabled, hover, `:focus-visible` 상태를 모두 정의한다.
- 카드에는 제목·설명·행동의 계층을 유지하고, 클릭 가능한 카드의 전체 hit area와 키보드 focus를 보장한다.
- 테이블은 데스크톱에서 스캔하기 쉽게 정렬하고, 작은 화면에서는 기존 stacked-card 변환 패턴을 따른다. `nth-child` 기반 라벨과 데이터 순서를 바꾸면 모바일 표현도 함께 수정한다.
- 필터, 탭, FAQ, 드롭다운은 ARIA 상태(`aria-selected`, `aria-pressed`, `aria-expanded`, `aria-current`)와 시각 상태가 일치해야 한다.
- 헤더/메가 메뉴/모바일 내비게이션은 상태와 breakpoint 의존성이 크다. 비슷한 selector를 병합하거나 source order를 이동하기 전에 open·scrolled·hero·subpage 상태를 모두 확인한다.
- 포털 지도 marker는 최소 44px 이상의 touch target, 숨김 상태의 `pointer-events: none`, focus-visible 표시를 유지한다. 좌표 변경은 데스크톱·태블릿·모바일에서 모두 검증한다.

## 반응형 기준

주요 전환점은 `700/701px`, `760px`, `1023/1024px`이며, 컴포넌트에 따라 `1180px`, `1200px`, `900px`, `800px`, `600px`, `480px`, `420px`, `371px`도 사용한다.

- `700/701px`: 일정표와 목록이 table에서 카드형으로 바뀌고, 지도·터미널 탐색기 레이아웃이 크게 전환된다.
- `1023/1024px`: 데스크톱 GNB와 모바일 fullscreen navigation, 데스크톱 탐색기와 모바일/태블릿 탐색기가 교체된다.
- 기존 breakpoint의 수치, selector 순서, shorthand를 정리 목적만으로 합치거나 이동하지 않는다. 여러 컴포넌트가 같은 media query에 있어도 cascade 의존성이 있다.
- 새 화면은 최소한 데스크톱(1024px 이상), 태블릿(701~1023px), 모바일(700px 이하)에서 검토한다. 구조 변화가 있는 컴포넌트는 700/701, 760/761, 1023/1024 양쪽을 각각 확인한다.
- 모바일에서 가로 스크롤을 숨겨 문제를 감추지 않는다. 긴 한국어/영문 문구, 버튼, 표, 지도 marker가 실제로 넘치지 않는지 확인한다.

## 접근성·콘텐츠 품질

- 모든 interactive element에 보이는 `:focus-visible` 상태를 제공하고, 마우스 hover만으로 기능을 숨기지 않는다.
- 색상 대비, 터치 대상 크기, heading 순서, label과 input 연결을 유지한다.
- 이미지에는 목적에 맞는 `alt`를 제공한다. 장식 이미지라면 빈 `alt`를 명시한다.
- 공통 UI 문구는 i18n 키를 사용한다. 터미널 고유 문구는 데이터 안의 `{ ko, en }` 짝 구조를 따르고, 비어 있는 영문은 기존 한국어 fallback을 깨지 않는다.
- 시간, 전화번호, 운항 상태, 경고 문구처럼 중요한 운영 콘텐츠를 시각 효과로 축소하거나 숨기지 않는다.

## 이미지와 자산

- 공통 자산은 `common/images/`, 폰트는 `common/fonts/`에 둔다. 기존 자산을 우선 재사용하고, 새 자산은 용도와 화면을 드러내는 이름을 쓴다.
- 히어로와 사진형 카드는 `object-fit`, focal point, overlay, 모바일 크롭을 함께 조정한다. 중요한 피사체나 텍스트가 breakpoint별로 잘리지 않아야 한다.
- 원본 고해상도 이미지를 UI 아이콘이나 작은 썸네일 용도로 그대로 추가하지 않는다. 적절한 크기와 형식을 준비한다.

## 변경 및 검증 절차

1. 영향 범위를 정한다. 공통 디자인 변경이면 포털, 공통 안내 페이지, 최소 한 개의 터미널 상세 페이지를 확인한다.
2. 기존 컴포넌트와 토큰을 재사용해 최소 범위로 구현한다. 범용 UI를 터미널별 파일에 복제하지 않는다.
3. 기본·hover·focus·active/selected·disabled(해당 시)와 빈 데이터·긴 텍스트 상태를 확인한다.
4. 데스크톱, 태블릿, 모바일 및 핵심 경계 viewport에서 시각 회귀를 확인한다.
5. 토큰 계약, 공통 컴포넌트 규칙 또는 breakpoint 동작을 바꿨다면 `docs/design-tokens.md`와 관련 README 설명을 업데이트한다.

## 피해야 할 변경

- `common/style.css`의 후반 override, 분산된 media query, 지도 좌표 규칙을 무관한 정리 목적으로 재배치하거나 대량 통합하는 작업
- 직접 hex/rgb 값, 임의 pixel spacing, 임의 font-weight를 신규 UI에 반복 추가하는 작업
- 공통 헤더·푸터·버튼·운항표를 페이지별 HTML로 복제하는 작업
- 상태 색상만으로 정상/지연/결항/통제를 구분하는 작업
- 모바일 오류를 `overflow: hidden` 또는 고정 높이로 가리는 작업
- keyboard focus, reduced-motion, ARIA 상태를 제거하거나 마우스 전용 상호작용을 만드는 작업
