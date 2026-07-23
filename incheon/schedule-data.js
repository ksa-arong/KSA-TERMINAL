// TODO: 실제 선박명 확인 필요
window.scheduleData = {
  referenceTime: "08:30",
  notice: "해상 기상 상황에 따라 운항 여부가 당일 아침 결정됩니다. 반드시 출항 전 여객선사에 확인 바랍니다. 전국여객선운항안내 1544-1114",
  filters: [
    { id: "coastal", label: "연안터미널" }
  ],
  items: [
    {
      type: "departure",
      time: "08:00",
      origin: "인천항",
      destination: "덕적도",
      vessel: "코리아나호",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "departure",
      time: "08:30",
      origin: "인천항",
      destination: "덕적도",
      vessel: "대부고속페리",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "departure",
      time: "08:30",
      origin: "인천항",
      destination: "백령도",
      vessel: "하모니플라워",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "departure",
      time: "09:30",
      origin: "인천항",
      destination: "대연평도",
      vessel: "코리아나호",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "지연",
      note: "10:30 출발 예정"
    },
    {
      type: "departure",
      time: "12:30",
      origin: "인천항",
      destination: "백령도",
      vessel: "하모니플라워",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "departure",
      time: "14:30",
      origin: "인천항",
      destination: "덕적도",
      vessel: "대부고속페리",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "결항",
      note: "기상악화"
    },
    {
      type: "arrival",
      time: "10:20",
      origin: "덕적도",
      destination: "인천항",
      vessel: "코리아나호",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "arrival",
      time: "11:30",
      origin: "덕적도",
      destination: "인천항",
      vessel: "대부고속페리",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "arrival",
      time: "12:40",
      origin: "백령도",
      destination: "인천항",
      vessel: "하모니플라워",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "arrival",
      time: "14:30",
      origin: "대연평도",
      destination: "인천항",
      vessel: "코리아나호",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "지연",
      note: "15:30 도착 예정"
    },
    {
      type: "arrival",
      time: "17:00",
      origin: "백령도",
      destination: "인천항",
      vessel: "하모니플라워",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "정상운항"
    },
    {
      type: "arrival",
      time: "18:30",
      origin: "덕적도",
      destination: "인천항",
      vessel: "대부고속페리",
      terminalId: "coastal",
      terminalLabel: "연안터미널",
      status: "결항",
      note: "기상악화"
    }
  ]
};
