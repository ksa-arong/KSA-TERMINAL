window._legacyScheduleData = {
  referenceTime: "08:30",
  notice: "선사 사정 및 해상 기상 상황에 따라 운항 일정이 변동될 수 있으니, 출항 전 해당 여객선사에 반드시 확인하시기 바랍니다.",
  filters: [
    { id: "coastal", label: "연안(국내선)" },
    { id: "international", label: "국제선" }
  ],
  items: [
    {
      type: "departure",
      time: "08:30",
      duration: "1:26",
      arrivalTime: "09:56",
      origin: "인천",
      destination: "덕적",
      operator: "고려고속훼리",
      vessel: "코리아익스프레스카훼리",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "정상운항"
    },
    {
      type: "departure",
      time: "08:30",
      duration: "3:50",
      arrivalTime: "12:20",
      origin: "인천",
      destination: "백령",
      operator: "고려고속훼리",
      vessel: "코리아프라이드",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "통제"
    },
    {
      type: "departure",
      time: "08:30",
      duration: "1:42",
      arrivalTime: "10:12",
      origin: "인천",
      destination: "대이작",
      operator: "고려고속훼리",
      vessel: "코리아피스",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "결항"
    },
    {
      type: "arrival",
      time: "09:30",
      duration: "1:26",
      arrivalTime: "10:56",
      origin: "덕적",
      destination: "인천",
      operator: "케이에스해운",
      vessel: "웅진훼미리호",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "선사문의"
    },
    {
      type: "departure",
      time: "12:30",
      duration: "4:15",
      arrivalTime: "16:45",
      origin: "인천",
      destination: "백령",
      operator: "고려고속훼리",
      vessel: "코리아프린스",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "정상운항"
    },
    {
      type: "arrival",
      time: "13:30",
      duration: "3:50",
      arrivalTime: "17:20",
      origin: "백령",
      destination: "인천",
      operator: "고려고속훼리",
      vessel: "코리아프라이드",
      terminalId: "coastal",
      terminalLabel: "연안(국내선)",
      routeType: "편도",
      status: "통제"
    },
    {
      type: "departure",
      time: "18:30",
      origin: "인천",
      destination: "칭다오",
      operator: "위동항운",
      vessel: "NEW GOLDEN BRIDGE V",
      terminalId: "international",
      terminalLabel: "국제선",
      duration: "16:00",
      status: "선사문의"
    },
    {
      type: "departure",
      time: "19:00",
      origin: "인천",
      destination: "옌타이",
      operator: "한중훼리",
      vessel: "신향설란",
      terminalId: "international",
      terminalLabel: "국제선",
      duration: "14:00",
      status: "결항"
    }
  ]
};

window.scheduleData = {
  schemaVersion: "2.0",
  status: "preparing",
  verified: false,
  routes: [],
  _legacy: window._legacyScheduleData
};
