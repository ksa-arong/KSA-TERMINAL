window._legacyTerminalData = {
  name: "인천항 연안여객터미널",
  englishName: "INCHEON COASTAL PASSENGER TERMINAL",
  phone: "1599-5985",
  address: "인천광역시 중구 연안부두로 70\n(항동7가 88)",

  // TODO: 실제 운영시간은 계절·운항일에 따라 확인 후 수정하세요.
  hours: "샘플 운영시간 06:00–21:00\n운항일 기준",

  // TODO: 실제 주차요금과 운영 기준 확인 후 수정하세요.
  parking: "연안여객터미널 주차장 이용\n요금 안내 준비 중",

  terminalGuide: {
    address: "인천광역시 중구 연안부두로 70",
    transit: {
      bus: "연안여객터미널 정류장 하차. 상세 노선은 현장 교통 안내를 확인해 주세요.",
      car: "제2경인고속도로 종점에서 연안부두·연안여객터미널 표지판을 따라 이동하세요."
    },
    mapQuery: "인천항 연안여객터미널",
    parking: {
      free: "최초 30분 무료 (예시)",
      rate: "이후 15분당 500원 (예시)",
      dailyMax: "일 최대 10,000원 (예시)",
      capacity: "약 200대 (예시)",
      hours: "05:30–22:00 (예시)"
    },
    ticketing: {
      location: "1층 선사별 매표소",
      hours: "06:00–20:00 (예시)",
      deadline: "출항 20분 전",
      notice: "신분증 필수"
    },
    facilities: ["대합실", "수유실", "편의점", "식당", "물품보관함", "무료 Wi-Fi", "교통약자 편의시설"]
  },

  heroTitle: "서해 5도로 떠나는 시작,\n인천항 연안여객터미널",
  heroDescription: "백령항로·덕적항로·연평항로를 따라\n안전하고 편안한 서해 섬 여행을 시작하세요.",
  routeIntro: "주요 항로: 백령항로 · 덕적항로 · 연평항로",
  boardingIntro: "서해 섬 여행 전 운항 여부와 신분증, 승선 마감시간을 미리 확인해 주세요.",
  boardingCards: [
    {
      title: "승선 절차 안내",
      description: "출항 30분 전까지 도착하여 매표 후 승선권과 신분증을 준비해 주세요."
    },
    {
      title: "신분증 지참 안내",
      description: "모든 승객은 주민등록증, 운전면허증 등 본인 확인용 신분증이 필요합니다."
    },
    {
      title: "운항 여부 확인",
      description: "당일 운항 여부는 기상 상황을 고려하여 오전 06:30에 최초 결정됩니다."
    },
    {
      title: "차량 선적 안내",
      description: "차량 선적 가능 여부와 마감시간은 이용 선사에 사전 확인해 주세요."
    }
  ],
  notices: [
    {
      category: "중요",
      title: "당일 운항 여부는 매일 아침 06:30에 최초 결정됩니다",
      date: "2026.07.22"
    },
    {
      category: "공지",
      title: "기상 특보 시 여객선 결항 및 운항 변경 안내",
      date: "2026.07.21"
    },
    {
      category: "항로",
      title: "백령·덕적·연평 주요 항로 이용 안내",
      date: "2026.07.18"
    },
    {
      category: "안내",
      title: "연안여객터미널 주차장 이용 안내",
      date: "2026.07.14"
    },
    {
      category: "공지",
      title: "신분증 미소지 승객 본인확인 절차 안내",
      date: "2026.07.08"
    }
  ]
};

window.terminalData = {
  template: "portal-region",
  schemaVersion: "2.0",
  regionId: "incheon",
  status: "preparing",
  verified: false,
  name: { ko: "인천항 연안여객터미널", en: "" },
  englishName: "INCHEON COASTAL PASSENGER TERMINAL",
  guideTitle: { ko: "인천항 연안여객터미널 운항 안내", en: "" },
  guideUnavailable: { ko: "검증된 터미널 기본정보와 운항 시간표를 준비하고 있습니다. 확인이 완료된 정보만 순차적으로 제공하겠습니다.", en: "" },
  guideActions: [
    { label: { ko: "전국여객선운항안내 1544-1114", en: "" }, href: "tel:15441114" },
    { label: { ko: "KSA 여객선 예매", en: "" }, href: "http://island.theksa.co.kr" }
  ],
  _legacy: window._legacyTerminalData
};
