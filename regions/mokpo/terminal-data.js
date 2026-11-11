const MOKPO_PORT_PARKING = {
  type: 'paid',
  freeMinutes: 60,
  rates: [
    { until: 90, fee: 500, label: '30분(90분까지)' },
    { until: 100, fee: 700, label: '40분(100분까지)' },
    { until: 110, fee: 900, label: '50분(110분까지)' }
  ],
  extra: { per: 10, fee: 200, basis: '매 10분', label: '10분 200원' },
  dailyMax: { label: '하루 요금', basis: '24시간', fee: 5000 },
  discounts: [
    { target: '장애우, 유공자', rate: 50, note: '관련 증빙시 할인' },
    { target: '경차', rate: 50, note: '자동할인' },
    { target: '친환경 차량', rate: 50, note: '등록차량 여부 확인 후 할인', link: { label: '통합누리집', url: 'http://www.ev.or.kr' } }
  ],
  legal: '요금 및 요율은 목포지방해양수산청 제2021-67호 『목포연안 및 국제여객터미널 부설주차장 주차요금 징수에 관한 고시』의 규정에 따릅니다.'
};

const MOKPO_SOURCE = {
  name: '한국해운조합 목포지부 터미널 안내',
  url: 'http://company.haewoon.co.kr/CompanySite/View.aspx?CompanyID=MKPO&MenuCode=216',
  checkedAt: '2026-10-08'
};

window.MOKPO_TERMINALS = [
  {
    id: 'mokpo-coastal', name: '목포연안여객선터미널', shortName: '연안터미널', kind: 'departure', isPrimary: true,
    address: '전남 목포시 해안로 182', postalCode: '58759', coords: { lat: 34.781939, lng: 126.384216 },
    introduction: { ko: '목포에서 섬으로 향하는 여정이 시작되는 곳입니다. 전남광주통합특별시 서남권 도서와 다도해해상국립공원을 잇는 든든한 바닷길의 중심입니다.', en: '' },
    scale: { siteArea: 15175, buildingArea: 8165.59, totalFloorArea: 11600.692, hallArea: 3022, capacity: 1738 },
    floors: [
      {
        level: '1F', label: '1층', navSummary: '주차장', image: '../../common/images/terminal-mokpo-coastal-floor-1.png', items: ['주차장', '주차 사전무인정산기', '화장실'],
        guideGroups: [
          { label: '주차시설', items: ['주차장', '주차 사전무인정산기'] },
          { label: '편의시설', items: ['화장실'] }
        ]
      },
      {
        level: '2F', label: '2층', navSummary: '매표소, 대합실, 매점', image: '../../common/images/terminal-mokpo-coastal-floor-2.png', items: ['매표소', '대합실', '화장실', '안내실', '매점', '스낵코너', '현금지급기', '자판기', '정수기', '무인민원발급기', '승선권 자동발매기', '휴대폰 무인충전함', '해양안전문화센터', '수유실', '쉼터', '안마의자', '포토존', '신안군 농수특산품 홍보전시관', '한국해운조합 목포지부', '운항관리센터', '다도해여행사', '목포신안관광홍보관'],
        guideGroups: [
          { label: '여객지원', items: ['매표소', '대합실', '안내실', '승선권 자동발매기', '무인민원발급기'] },
          { label: '편의시설', items: ['화장실', '정수기', '휴대폰 무인충전함', '수유실', '쉼터', '안마의자', '매점', '스낵코너', '현금지급기', '자판기'] },
          { label: '문화시설', items: ['해양안전문화센터', '포토존', '신안군 농수특산품 홍보전시관'] },
          { label: '입주기관', items: ['한국해운조합 목포지부', '운항관리센터(KOMSA)', '다도해여행사', '목포신안관광홍보관'] }
        ]
      },
      {
        level: '3F', label: '3층', navSummary: '사무실', image: '../../common/images/terminal-mokpo-coastal-floor-3.png', items: ['입주업체 사무실'],
        guideGroups: [{
          rooms: [
            { room: '301호', name: '(유)해진해운' }, { room: '302호', name: '(유)다도해관광' },
            { room: '303호', name: '(사)한국섬주민연합중앙회' }, { room: '304호', name: '해사안전컨설턴트' },
            { room: '305호', name: '한국해양소년단 전남서부연맹' }, { room: '306~307호', name: '(주)동양훼리' },
            { room: '308호', name: '(유)신진해운' }, { room: '309호', name: '목포항도선사회' },
            { room: '310호', name: '(유)신진해운' }, { room: '311호', name: '목포선원노동조합' },
            { room: '312호', name: '해항회' }, { room: '313호', name: '(주)국제해운' },
            { room: '314호', name: '한국해운조합 목포지부' }, { room: '315호', name: '(주)남해고속' },
            { room: '316~318호', name: '한국선급 목포지부' }
          ]
        }]
      },
      {
        level: '4F', label: '4층', navSummary: '갤러리, 정원', image: '../../common/images/terminal-mokpo-coastal-floor-4.png', items: ['목포 종합문화예술 갤러리', '옥외정원'],
        guideGroups: [
          { label: '문화시설', items: ['목포 종합문화예술 갤러리'] },
          { label: '휴게공간', items: ['옥외정원'] }
        ]
      },
      {
        level: '별관', label: '별관', navSummary: '매표소, 대합실', image: '../../common/images/terminal-mokpo-coastal-annex.png', items: ['여객대합실', '매표소', '화장실', '자판기', '휴대폰 무인충전함'],
        guideGroups: [
          { label: '여객지원', items: ['여객대합실', '매표소'] },
          { label: '편의시설', items: ['화장실', '자판기', '휴대폰 무인충전함'] }
        ]
      }
    ],
    featuredAmenities: [
      { name: '수유실', description: '영유아 동반 승객이 수유와 기저귀 교환을 위해 이용할 수 있는 공간입니다.', location: '2층', image: '../../common/images/terminal-mokpo-amenity-nursing-room.jpg', imageAlt: '수유실 구성 예시 이미지' },
      { name: '쉼터·안마의자', description: '승선을 기다리는 동안 편안하게 휴식할 수 있는 공간입니다.', location: '2층', image: '../../common/images/terminal-mokpo-amenity-rest-area.jpg', imageAlt: '쉼터와 안마의자 구성 예시 이미지' },
      { name: '휴대폰 무인충전함', description: '휴대폰을 보관하며 충전할 수 있는 무인 충전 설비입니다.', location: '2층', image: '../../common/images/terminal-mokpo-amenity-phone-charging.jpg', imageAlt: '휴대폰 무인충전함 구성 예시 이미지' }
    ],
    parking: MOKPO_PORT_PARKING,
    transit: {
      car: { navKeyword: '목포연안여객선터미널', navAddress: '전남 목포시 해안로 182' },
      longDistance: [
        {
          mode: 'train', label: '기차', routes: [
            { badge: 'KTX', origin: '서울 용산', destination: '목포', direction: '↔', duration: '약 2시간 20분', frequency: '1일 왕복 18회' },
            { badge: 'SRT', origin: '서울 수서', destination: '목포', direction: '↔', duration: '약 2시간 20분', frequency: '1일 왕복 9회' }
          ],
          actions: [{ label: '열차 예매', url: '', todo: '열차 예매 공식 URL 확인 후 버튼 연결' }]
        },
        {
          mode: 'expressBus', label: '고속버스', routes: [
            { origin: '서울', destination: '목포', direction: '↔', duration: '약 4시간', frequency: '1일 왕복 24회' },
            { origin: '부산', destination: '목포', direction: '↔', duration: '약 4시간 30분', frequency: '1일 7회 운행' }
          ],
          actions: [{ label: '고속버스 예매', url: '', todo: '고속버스 예매 공식 URL 확인 후 버튼 연결' }]
        }
      ],
      pendingActions: [{ label: '대중교통 길찾기', url: '', todo: '대중교통 길찾기 공식 URL 확인 후 버튼 연결' }],
      notice: '운행 횟수와 소요 시간은 교통 상황 및 운행 일정에 따라 달라질 수 있습니다. 이용 전 해당 운영기관에서 최신 정보를 확인해 주세요.'
    },
    tel: { ars: '1666-0910', main: null }, hours: '06:00 ~ 18:00',
    photo: [
      { src: '../../common/images/terminal-mokpo-coastal-waterfront.jpg', alt: '바다에서 바라본 목포연안여객선터미널 전경' },
      { src: '../../common/images/terminal-mokpo-coastal-front.jpg', alt: '도로에서 바라본 목포연안여객선터미널 전경' }
    ],
    carriers: [
      { name: '(주)남해고속', tel: '061-244-9915' }, { name: '(주)동양훼리', tel: '061-243-2111' },
      { name: '(유)신진해운', tel: '061-244-0522' }, { name: '(유)쾌진해운', tel: '061-244-0803', verified: false, note: '흑산도 페이지에는 「해진해운」으로 표기됨. 상호 확인 필요' },
      { name: '(주)국제해운', tel: '061-245-5011' }, { name: '(유)다도해관광', tel: '061-242-1811' },
      { name: '(유)목포도선(목포항도선사회)', tel: '061-242-3721' }
    ],
    tenants: [
      { name: '(재)신안교통재단', tel: '061-242-0988' }, { name: '한국해운조합 목포지부 사업지원팀', tel: '061-240-6012' },
      { name: '한국해운조합 목포지부 터미널팀', tel: '061-240-6051' }, { name: '한국선급 목포지부', tel: '070-8799-7768' },
      { name: '목포운항관리센터', tel: '061-247-9466' }, { name: '한국해양소년단', tel: '061-242-1338' }
    ],
    source: MOKPO_SOURCE, verified: true
  },
  {
    id: 'mokpo-international', name: '목포국제여객선터미널', shortName: '국제터미널', kind: 'departure',
    address: '전남광주통합특별시 목포시 해안로148번길 14', coords: { lat: 34.780118, lng: 126.382181 },
    introduction: { ko: '목포에서 더 넓은 바다로 이어지는 여정을 준비하는 곳입니다. 쾌적한 대합 공간과 다양한 여객 지원시설이 편안한 출발을 돕습니다.', en: '' },
    scale: { siteArea: 8406, buildingArea: 2751.3, totalFloorArea: 6620.23, hallArea: 1636, capacity: 1068 },
    floors: [
      {
        level: '1F', label: '1층', navSummary: '매표소, 매점, VIP 라운지', image: '../../common/images/terminal-mokpo-international-floor-1.png', items: ['매표소', '화장실', '매점', '현금지급기', '자판기', '정수기', '주차 사전무인정산기', '무인민원발급기', '휴대폰 무인충전함', '해양안전체험관', 'VIP 라운지', '(유)CMS서비스'],
        guideGroups: [
          { label: '여객지원', items: ['매표소', '무인민원발급기', 'VIP 라운지'] },
          { label: '편의시설', items: ['화장실', '매점', '현금지급기', '자판기', '정수기', '주차 사전무인정산기', '휴대폰 무인충전함'] },
          { label: '문화시설', items: ['해양안전체험관'] },
          { label: '입주기관', items: ['(유)CMS서비스'] }
        ]
      },
      {
        level: '2F', label: '2층', navSummary: '사무실', image: '../../common/images/terminal-mokpo-international-floor-2.png', items: ['씨월드 고속훼리(주)', '한국어촌어항공단'],
        guideGroups: [
          { label: '입주기관', items: ['씨월드 고속훼리(주)', '한국어촌어항공단'] }
        ]
      }
    ],
    parking: MOKPO_PORT_PARKING,
    transit: {
      car: { navKeyword: '목포국제여객선터미널', navAddress: '전남광주통합특별시 목포시 해안로148번길 14' },
      routes: [
        { from: '목포종합버스터미널', board: 'KT(한솔엘레콤) 터미널점 앞 버스정류장 (21031)', bus: '1번', alight: '여객선터미널 정류장 (13017)', rideMinutes: 24, walkMinutes: 6 },
        { from: '목포역', board: 'MBC 앞 버스정류장 (14022)', bus: '1번', alight: '여객선터미널 정류장 (13017)', rideMinutes: 12, walkMinutes: 6 }
      ]
    },
    tel: { ars: '1666-0910', main: null }, hours: '운항 일정에 따라 운영',
    photo: [{ src: '../../common/images/terminal-mokpo-international.jpg', alt: '목포국제여객선터미널 전경' }],
    carriers: [{ name: '씨월드고속훼리(주)', tel: '061-243-1927' }],
    tenants: [{ name: '(유)CMS서비스', tel: '061-278-1927' }, { name: '한국어촌어항공단 서남해지사', tel: '061-245-8964' }],
    source: MOKPO_SOURCE, verified: true
  },
  {
    id: 'hongdo', name: '홍도여객선터미널', shortName: '홍도터미널', kind: 'island',
    address: '전남광주통합특별시 신안군 흑산면 홍도리 94-8', coords: { lat: 34.682726947546975, lng: 125.19275630676516 },
    introduction: { ko: '붉은 노을과 기암절벽이 아름다운 홍도, 그 특별한 섬 여행이 시작되는 곳입니다. 바다를 바라보는 전망 공간에서 여행의 설렘을 천천히 느껴보세요.', en: '' },
    scale: { siteArea: 1725, buildingArea: 998.36, totalFloorArea: 1098.03, hallArea: 442.6, capacity: 200 },
    floors: [
      {
        level: '1F', label: '1층', navSummary: '매표소, 대합실, 매점', image: '../../common/images/terminal-hongdo-floor-1.png', items: ['매표소 A', '매표소 B', '대합실', '화장실', '매점', '무인 휴대폰 충전함'],
        guideGroups: [
          { label: '여객지원', items: ['매표소 A', '매표소 B', '대합실'] },
          { label: '편의시설', items: ['화장실', '매점', '무인 휴대폰 충전함'] }
        ]
      },
      {
        level: '2F', label: '2층', navSummary: '사무실, 전망대', image: '../../common/images/terminal-hongdo-floor-2.png', items: ['전망대', '한국해운조합 목포지부'],
        guideGroups: [
          { label: '편의시설', items: ['전망대'] },
          { label: '입주기관', items: ['한국해운조합 목포지부'] }
        ]
      }
    ],
    parking: null,
    transit: {
      byShip: true,
      scheduleRef: 'timetable',
      shipRoutes: [
        { from: '홍도', to: '목포', times: ['10:30', '15:10'] },
        { from: '목포', to: '홍도', times: ['07:50', '12:30'] }
      ]
    },
    tel: { ars: null, main: null }, hours: null,
    photo: [{ src: '../../common/images/terminal-hongdo.jpg', alt: '홍도여객선터미널 전경' }],
    carriers: [{ name: '(주)남해고속', tel: '061-244-9915' }, { name: '(주)동양훼리', tel: '061-243-2111' }], tenants: [],
    source: MOKPO_SOURCE, verified: true
  },
  {
    id: 'heuksando', name: '흑산도여객선터미널', shortName: '흑산도터미널', kind: 'island',
    address: '전남광주통합특별시 신안군 흑산면 예리1길 41-19', coords: { lat: 34.68455549121842, lng: 125.44243730078597 },
    introduction: { ko: '짙푸른 바다와 섬의 일상이 가까워지는 곳입니다. 주민의 하루와 여행자의 발걸음을 이어주는 편안한 바닷길이 이곳에서 계속됩니다.', en: '' },
    scale: { siteArea: 5338.45, buildingArea: 893.76, totalFloorArea: 1168.8, hallArea: 799.89, capacity: 200 },
    floors: [
      {
        level: '1F', label: '1층', navSummary: '매표소, 대합실, 수유실', image: '../../common/images/terminal-heuksando-floor-1.png',
        items: ['매표소', '대합실', '화장실', '자판기', '정수기', '무인민원발급기', '휴대폰 무인충전함', '수유실', '(주)동양훼리', '(주)남해고속', '(유)해진해운'],
        guideGroups: [
          { label: '여객지원', items: ['매표소', '대합실', '무인민원발급기'] },
          { label: '편의시설', items: ['화장실', '자판기', '정수기', '휴대폰 무인충전함', '수유실'] },
          { label: '입주기관', items: ['(주)동양훼리', '(주)남해고속', '(유)해진해운'] }
        ]
      },
      {
        level: '2F', label: '2층', navSummary: '사무실', image: '../../common/images/terminal-heuksando-floor-2.png',
        items: ['화장실', '정수기', '한국해운조합 목포지부', '운항관리센터(KST)'],
        guideGroups: [
          { label: '편의시설', items: ['화장실', '정수기'] },
          { label: '입주기관', items: ['한국해운조합 목포지부', '운항관리센터(KST)'] }
        ]
      }
    ],
    parking: { type: 'free', area: 1182, capacity: { small: 30, large: 0 } },
    transit: {
      byShip: true,
      scheduleRef: 'timetable',
      shipRoutes: [
        { from: '흑산', to: '목포', times: ['09:00', '11:10', '15:50'] },
        { from: '목포', to: '흑산', times: ['07:50', '12:30', '16:00'] }
      ]
    },
    tel: { ars: null, main: null }, emergency: { fire: '흑산 소방서 지역대 061-280-0970' }, hours: null,
    photo: [{ src: '../../common/images/terminal-heuksando.jpg', alt: '흑산도여객선터미널 전경' }],
    carriers: [
      { name: '(주)남해고속', tel: '061-244-9915' }, { name: '(주)동양훼리', tel: '061-243-2111' },
      { name: '(유)해진해운', tel: '061-244-0803', verified: false, note: '연안터미널 페이지에는 「쾌진해운」으로 표기됨. 상호 확인 필요' }
    ],
    tenants: [], source: MOKPO_SOURCE, verified: true
  }
];

const MOKPO_VESSEL_DETAILS = [
  { route: '목포-제주', routeType: '일반', name: '퀸제누비아', operator: '씨월드고속훼리(주)', image: '../../common/images/vessels/queen-jenuvia.jpg', type: '카페리', speed: '22노트', tonnage: '27,391G/T', capacity: '1,284명', distance: '177.8km', duration: '05:00', stops: '목포-제주' },
  { route: '목포-제주', routeType: '일반', name: '퀸제누비아2', operator: '씨월드고속훼리(주)', image: '../../common/images/vessels/queen-jenuvia-2.jpg', type: '카페리', speed: '22.7노트', tonnage: '26,546G/T', capacity: '1,010명', distance: '177.8km', duration: '04:30', stops: '목포-제주' },
  { route: '진도-제주', routeType: '일반', name: '산타모니카', operator: '씨월드고속훼리(주)', image: '../../common/images/vessels/santa-monica.jpg', type: '쾌속카페리', speed: '42노트', tonnage: '3,321G/T', capacity: '606명', distance: '110.4km', duration: '02:00', stops: '진도-추자(상추자)-제주' },
  { route: '진도-제주', routeType: '일반', name: '엔젤호', operator: '씨월드고속훼리(주)', image: '../../common/images/vessels/angel.jpg', type: '쾌속선', speed: '23노트', tonnage: '280G/T', capacity: '252명', distance: '110.4km', duration: '03:25', stops: '진도-상추자-제주' },
  { route: '목포-홍도', routeType: '일반', name: '뉴돌핀', operator: '(주)남해고속', image: '../../common/images/vessels/new-dolphin.jpg', type: '쾌속선', speed: '34노트', tonnage: '375G/T', capacity: '340명', distance: '191.1km', duration: '04:30', stops: '목포-비금-도초-흑산-다물도(다촌)-상중태-하태-만재-가거도' },
  { route: '목포-홍도', routeType: '일반', name: '뉴엔젤', operator: '(주)남해고속', image: '../../common/images/vessels/new-angel.jpg', type: '쾌속선', speed: '33노트', tonnage: '320G/T', capacity: '337명', distance: '129.6km', duration: '04:30', stops: '목포-비금-도초-흑산-홍도-다물도-상중태-하태-만재-가거도' },
  { route: '목포-홍도', routeType: '일반', name: '뉴퀸', operator: '(주)남해고속', image: '../../common/images/vessels/new-queen.jpg', type: '쾌속선', speed: '34노트', tonnage: '254G/T', capacity: '337명', distance: '191.1km', duration: '04:30', stops: '목포-비금-도초-흑산-다물도-상중태-하태-만재-가거도-홍도' },
  { route: '목포-홍도', routeType: '일반', name: '동양골드', operator: '(주)동양훼리', image: '../../common/images/vessels/dongyang-gold.jpg', type: '초쾌속선', speed: '35노트', tonnage: '314G/T', capacity: '375명', distance: '①129.6km · ②233km', duration: '①02:30 · ②04:30', stops: '① 목포-비금/도초-흑산-홍도 · ② 목포-비금/도초-흑산-다물도(다촌)-상중태-하태-만재-가거도' },
  { route: '목포-홍도', routeType: '일반', name: '핑크돌핀', operator: '(주)남해고속', image: '../../common/images/vessels/pink-dolphin.jpg', type: '쾌속선', speed: '30노트', tonnage: '223G/T', capacity: '250명', distance: '191.1km', duration: '04:30', stops: '① 목포-비금/도초-흑산-홍도 · ② 비금-도초-흑산-다물도(다촌)-상중태-하태-만재-가거도(8개소)' },
  { route: '목포-상태서리', routeType: '일반', name: '천사1', operator: '(재)신안교통재단', image: '../../common/images/vessels/cheonsa-1.jpg', type: '차도선', speed: '14노트', tonnage: '486G/T', capacity: '357명', distance: '50km', duration: '02:20', stops: '목포-안좌-장산-옥도-장병-용곡(사업면허상 상태서리 미기항)' },
  { route: '목포-상태서리', routeType: '일반', name: '퍼스트엔젤', operator: '(유)신진해운', image: '../../common/images/vessels/first-angel.jpg', type: '쾌속선', speed: '23노트', tonnage: '170G/T', capacity: '200명', distance: '51.9km', duration: '01:13', stops: '목포-장산(북강)-하의(웅곡)-상태(서리)' },
  { route: '목포-외달', routeType: '일반', name: '슬로아일랜드', operator: '(유)신진해운', image: '../../common/images/vessels/slow-island.jpg', type: '차도선', speed: '12노트', tonnage: '223G/T', capacity: '160명', distance: '17km', duration: '00:54', stops: '목포-율도-장좌-달리-외달' },
  { route: '목포-상태동리', routeType: '일반', name: '천사3', operator: '(재)신안교통재단', image: '../../common/images/vessels/cheonsa-3.jpg', type: '차도선', speed: '14노트', tonnage: '720G/T', capacity: '429명', distance: '39.6km', duration: '02:00', stops: '목포-마진-장산(축강)-상태(동리)' },
  { route: '도초-목포', routeType: '일반', name: '도초카훼리', operator: '도초농업협동조합', image: '../../common/images/vessels/doche-kahweori.jpg', type: '차도선', speed: '13.5노트', tonnage: '466G/T', capacity: '250명', distance: '48.2km', duration: '02:10', stops: '도초(화도)-비금(가산)-안좌(읍동)-비금(수치)-암태(남강)-목포(북항)' },
  { route: '진도-서거차', routeType: '일반', name: '한림페리11', operator: '(주)에이치엘해운', image: '../../common/images/vessels/hanlim-ferry-11.jpg', type: '차도선', speed: '13노트', tonnage: '297G/T', capacity: '275명', distance: '48.2km', duration: '03:10', stops: '① 진도-창유 · ② 진도-창유-관사-소마-모도-대마-관매-동거차-서거차' },
  { route: '율목-진도', routeType: '일반', name: '새섬두레', operator: '서진도농업협동조합', image: '../../common/images/vessels/saeseom-dure.jpg', type: '차도선', speed: '15노트', tonnage: '562G/T', capacity: '300명', distance: '25km', duration: '01:20', stops: '율목-창유-관매-진도' },
  { route: '송공-병풍', routeType: '일반', name: '슬로시티5', operator: '신안군', image: '../../common/images/vessels/slow-city-5.jpg', type: '차도선', speed: '12노트', tonnage: '167G/T', capacity: '184명', distance: '17.2km', duration: '01:07', stops: '송공-당사-매화-소악-소기점-대기점-병풍' },
  { route: '송도-병풍', routeType: '일반', name: '슬로시티2', operator: '신안군', image: '../../common/images/vessels/slow-city-2.jpg', type: '차도선', speed: '10노트', tonnage: '162G/T', capacity: '145명', distance: '6.5km', duration: '00:25', stops: '송도-병풍' },
  { route: '송도-병풍', routeType: '일반', name: '슬로시티6', operator: '신안군', image: '../../common/images/vessels/slow-city-6.jpg', type: '차도선', speed: '12노트', tonnage: '337G/T', capacity: '250명', distance: '25km', duration: '01:20', stops: '송도-가룡-매화(기섬)-마산-선도-신월-고이-병풍' },
  { route: '우수영-상태동리', routeType: '일반', name: '해진고속카페리', operator: '(유)해진해운', image: '../../common/images/vessels/haejin-high-speed-car-ferry.jpg', type: '차도선', speed: '12노트', tonnage: '388G/T', capacity: '195명', distance: '22.2km', duration: '01:10', stops: '우수영-장산(축강)-상태(동리)' },
  { route: '증도-자은', routeType: '일반', name: '슬로시티', operator: '신안군', image: '../../common/images/vessels/slow-city.jpg', type: '차도선', speed: '12노트', tonnage: '281G/T', capacity: '150명', distance: '5.2km', duration: '00:15', stops: '증도(우전)-자은(고교)' },
  { route: '송공-흑산', routeType: '일반', name: '뉴드림', operator: '(유)해진해운', image: '../../common/images/vessels/new-dream.jpg', type: '카페리', speed: '13노트', tonnage: '2,103G/T', capacity: '270명', distance: '79.6km', duration: '03:40', stops: '송공-도초-흑산' },
  { route: '향화-송이', routeType: '일반', name: '영광사랑', operator: '(유)신진해운', image: '../../common/images/vessels/yeonggwang-sarang.jpg', type: '차도선', speed: '12노트', tonnage: '166G/T', capacity: '146명', distance: '25.9km', duration: '01:30', stops: '향화-송이' }
];

window.terminalData = {
  "template": "portal-region",
  "schemaVersion": "2.0",
  "regionId": "mokpo",
  "sourceDate": null,
  "sourceLabel": { "ko": "2026년 7월 기준", "en": "" },
  "period": "2026-07",
  "name": { "ko": "목포항 여객터미널", "en": "" },
  "englishName": "MOKPO PORT PASSENGER TERMINAL",
  "homePage": {
    "regionalHero": true,
    "dataDrivenQuickNav": true,
    "regionalOverview": true,
    "regionalOverviewTitle": { "ko": "목포 지역 터미널 안내", "en": "" },
    "scheduleSummaryTitle": { "ko": "주요 운항정보", "en": "" },
    "regionalGuide": true,
    "regionalNotices": true,
    "dataDrivenQuickGuide": true,
    "quickGuideCards": [
      { "id": "booking", "title": { "ko": "승선권 예매", "en": "" }, "description": { "ko": "한국해운조합 공식 예매 서비스로 이동하세요.", "en": "" }, "href": "https://island.theksa.co.kr/", "ariaLabel": { "ko": "승선권 예매 사이트 새 창 열림", "en": "" } },
      { "id": "support", "title": { "ko": "유실물·고객문의", "en": "" }, "description": { "ko": "목포 유실물 안내와 문의처를 확인하세요.", "en": "" }, "href": "lost-found.html" },
      { "id": "contacts", "title": { "ko": "터미널 연락처", "en": "" }, "description": { "ko": "터미널별 연락처를 확인하세요.", "en": "" }, "href": "terminal-introduction.html" }
    ],
    "guideCards": [
      { "id": "identity", "title": { "ko": "신분증 지참 안내", "en": "" }, "description": { "ko": "승선에 필요한 신분증과 인정 범위를 확인하세요.", "en": "" }, "href": "identity.html" },
      { "id": "schedule", "title": { "ko": "운항정보 확인", "en": "" }, "description": { "ko": "목포항 방면별 출항시간과 기항지를 확인하세요.", "en": "" }, "href": "timetable.html" },
      { "id": "procedure", "title": { "ko": "승선 절차", "en": "" }, "description": { "ko": "발권부터 개찰과 승선까지의 절차를 확인하세요.", "en": "" }, "href": "boarding-procedure.html" },
      { "id": "vehicle", "title": { "ko": "차량 선적 안내", "en": "" }, "description": { "ko": "차량 선적 절차와 터미널별 문의처를 확인하세요.", "en": "" }, "href": "vehicle-shipping.html" }
    ]
  },
  "hero": {
    "eyebrow": { "ko": "MOKPO PORT", "en": "" },
    "title": { "ko": "목포항 여객선 운항 안내", "en": "" },
    "description": { "ko": "목포항 여객선 운항정보와 터미널 이용안내를 확인하세요.", "en": "" },
    "images": [
      { "src": "../../common/images/portal-hero-mokpo-terminal.jpg", "alt": "목포항 여객터미널과 바다 전경" },
      { "src": "../../common/images/terminal-mokpo-coastal-waterfront.jpg", "alt": "바다에서 바라본 목포연안여객선터미널" },
      { "src": "../../common/images/terminal-mokpo-coastal-front.jpg", "alt": "도로에서 바라본 목포연안여객선터미널" },
      { "src": "../../common/images/terminal-mokpo-international.jpg", "alt": "목포국제여객선터미널 전경" },
      { "src": "../../common/images/terminal-hongdo.jpg", "alt": "홍도여객선터미널 전경" }
    ]
  },
  "quickNav": [
    { "icon": "terminal", "title": { "ko": "터미널 안내", "en": "" }, "description": { "ko": "목포항 터미널별 이용정보", "en": "" }, "href": "terminal-introduction.html" },
    { "icon": "schedule", "title": { "ko": "운항 스케쥴", "en": "" }, "description": { "ko": "방면별 출항시간·기항지", "en": "" }, "href": "timetable.html" },
    { "icon": "customer", "title": { "ko": "선사 안내", "en": "" }, "description": { "ko": "운항 선사와 연락처 확인", "en": "" }, "href": "operators.html" },
    { "icon": "booking", "title": { "ko": "차량 선적 안내", "en": "" }, "description": { "ko": "차량 선적 절차와 문의처", "en": "" }, "href": "vehicle-shipping.html" }
  ],
  "terminals": [],
  "terminalProfiles": window.MOKPO_TERMINALS,
  "terminalSource": MOKPO_SOURCE,
  "vesselDetails": MOKPO_VESSEL_DETAILS,
  "operatorDetails": [
    {
      "name": "(주)남해고속", "tel": "061-244-9915", "logo": "../../common/images/operators/namhae-express.png", "homepage": "http://www.namhaegosok.co.kr/", "ticketOffice": "연안 여객선 터미널 1F", "majorRoute": "비금, 도초, 홍도, 흑산도, 가거도",
      "vessels": [
        { "name": "뉴엔젤", "route": "목포-비금-도초-흑산-홍도-가거도", "type": "-", "capacity": "337명", "scale": "총톤수 320TON, 속력 35KTS" },
        { "name": "핑크돌핀", "route": "목포-비금-도초-흑산-홍도-가거도", "type": "-", "capacity": "250명", "scale": "총톤수 223TON, 속력 32KTS" },
        { "name": "뉴퀸", "route": "목포-비금-도초-흑산-홍도-가거도", "type": "-", "capacity": "337명", "scale": "총톤수 254TON, 속력 32KTS" },
        { "name": "뉴돌핀", "route": "목포-비금-도초-흑산-홍도-가거도", "type": "-", "capacity": "340명", "scale": "총톤수 320TON, 속력 35KTS" }
      ]
    },
    {
      "name": "(주)동양훼리", "tel": "061-243-2111", "logo": "../../common/images/operators/dongyang-ferry.png", "homepage": "http://www.ihongdo.co.kr/", "ticketOffice": "연안 여객선 터미널 1F", "majorRoute": "비금, 도초, 홍도, 흑산도, 가거도",
      "vessels": [
        { "name": "동양골드", "route": "목포-비금-도초-흑산-홍도-가거도", "type": "-", "capacity": "375명", "scale": "총톤수 309TON, 속력 35KTS" }
      ]
    },
    {
      "name": "(주)씨월드", "tel": "061-243-1927~8", "telHref": "061-243-1927", "logo": "../../common/images/operators/seaworld-express-ferry.png", "homepage": "https://www.seaferry.co.kr/", "ticketOffice": "국제항 여객터미널 1F", "majorRoute": "제주도",
      "vessels": [
        { "name": "퀸제누비아", "route": "목포-제주", "type": "카훼리여객선", "capacity": "1,284명", "scale": "길이 170M, 총톤수(국제) 27,391TON, 속력 24.25KTS" },
        { "name": "퀸제누비아2", "route": "목포-제주", "type": "카훼리여객선", "capacity": "1,010명", "scale": "길이 160.45M, 총톤수(국제) 26,546TON, 속력 22.7KTS" },
        { "name": "산타모니카", "route": "제주-추자도-진도", "type": "쾌속카훼리", "capacity": "606명", "scale": "길이 67.37M, 총톤수 3,500TON, 속력 42KTS" },
        { "name": "퀸메리", "route": "목포-제주", "type": "카훼리여객선", "capacity": "756명", "scale": "길이 143M, 총톤수 14,919TON, 속력 21KTS" }
      ]
    },
    {
      "name": "(유)신진해운", "tel": "061-244-0522", "logo": "../../common/images/operators/shinjin-shipping.png", "homepage": "https://shjin.kr/", "ticketOffice": "연안 여객선 터미널 1F", "majorRoute": "달리도, 장좌도, 눌도(율도), 외달도 · 장산, 하의도, 신의도",
      "vessels": [
        { "name": "슬로아일랜드호", "route": "목포-외달도", "type": "-", "capacity": "160명", "scale": "총톤수 223TON, 속력 11KTS" },
        { "name": "퍼스트엔젤호", "route": "목포-신의-하의", "type": "-", "capacity": "200명", "scale": "총톤수 170TON, 속력 23KTS" }
      ]
    },
    {
      "name": "(재)신안교통재단", "tel": "061-242-0888", "logo": "../../common/images/operators/shinan-transport-foundation.png", "homepage": "http://www.baetaja.kr/", "ticketOffice": "연안 여객선 터미널 1F", "majorRoute": "장산, 하의도, 신의도",
      "vessels": [
        { "name": "천사1호", "route": "목포-하의", "type": "-", "capacity": "357명", "scale": "총톤수 486TON, 속력 15KTS" },
        { "name": "천사2호", "route": "목포-하의", "type": "-", "capacity": "234명", "scale": "총톤수 364TON, 속력 16KTS" },
        { "name": "천사3호", "route": "목포-신의", "type": "-", "capacity": "429명", "scale": "총톤수 720TON, 속력 15KTS" }
      ]
    },
    {
      "name": "(주)해광운수", "tel": "061-283-9915", "logo": "../../common/images/operators/haegwang-shipping.png", "homepage": "http://www.xn--wk0br4bw3g3rj.kr/main/main.php", "ticketOffice": "연안 여객선 터미널 1F", "majorRoute": "조도, 우이도",
      "vessels": []
    }
  ],
  "contacts": {},
  "links": {},
  "specialContactsTitle": { "ko": "화물·차량선적 문의", "en": "" },
  "cargoContacts": [
    { "route": { "ko": "제주도 방면", "en": "" }, "name": { "ko": "대한통운", "en": "" }, "tel": "061-243-2413" }
  ],
  "cruiseContacts": [],
  "notices": [
    { "title": { "ko": "해상의 기상악화, 선박사정, 정기휴항일이 있으니 사전에 전화문의 후 이용", "en": "" }, "href": "marine-weather.html" },
    { "title": { "ko": "승선권 발권 시 신분증 및 본인확인 증빙서류 미제출 시 발권 불가", "en": "" }, "href": "identity.html" },
    { "title": { "ko": "모든 선박의 승선권 매표는 선박 출항 5분 전 마감", "en": "" }, "href": "boarding-procedure.html" },
    { "title": { "ko": "각 기항지 출·입항은 운항 선박회사에 문의", "en": "" }, "href": "operators.html" }
  ],
  "guideTitle": { "ko": "목포항 여객터미널 이용안내", "en": "" },
  "guideUnavailable": { "ko": "터미널 주소·대표번호·운영시간, 요금, 주차·대중교통, 시설 안내는 확인된 데이터가 없어 현재 제공하지 않습니다.", "en": "" },
  "guideBackLabel": { "ko": "운항 스케쥴로 돌아가기", "en": "" },
  "guideBackHref": "./index.html#schedule"
};
