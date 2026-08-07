// TODO: 실제 선박명 확인 필요
window.scheduleData = {
  "referenceTime": "08:30",
  "filters": [
    {
      "id": "main",
      "label": "여수항"
    },
    {
      "id": "island",
      "label": "섬 항로"
    }
  ],
  "items": [
    {
      "type": "departure",
      "time": "09:20",
      "duration": "1:10",
      "origin": "여수항",
      "destination": "금오도",
      "vessel": "다도해호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "정상운항"
    },
    {
      "type": "departure",
      "time": "14:00",
      "duration": "2:20",
      "origin": "여수항",
      "destination": "거문도",
      "vessel": "여수누리호",
      "terminalId": "main",
      "terminalLabel": "여수항",
      "status": "통제",
      "note": "14:20 출발 예정"
    },
    {
      "type": "arrival",
      "time": "11:10",
      "duration": "1:10",
      "origin": "금오도",
      "destination": "여수항",
      "vessel": "다도해호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "결항"
    },
    {
      "type": "arrival",
      "time": "17:30",
      "duration": "2:20",
      "origin": "거문도",
      "destination": "여수항",
      "vessel": "여수누리호",
      "terminalId": "main",
      "terminalLabel": "여수항",
      "status": "선사문의"
    }
  ]
};
