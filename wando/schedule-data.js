// TODO: 실제 선박명 확인 필요
window.scheduleData = {
  "referenceTime": "08:30",
  "filters": [
    {
      "id": "main",
      "label": "완도항"
    },
    {
      "id": "island",
      "label": "섬 항로"
    }
  ],
  "items": [
    {
      "type": "departure",
      "time": "08:40",
      "duration": "2:40",
      "origin": "완도항",
      "destination": "제주항",
      "vessel": "완도블루호",
      "terminalId": "main",
      "terminalLabel": "완도항",
      "status": "정상운항"
    },
    {
      "type": "departure",
      "time": "13:10",
      "duration": "0:50",
      "origin": "완도항",
      "destination": "청산도",
      "vessel": "청산누리호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "통제"
    },
    {
      "type": "arrival",
      "time": "12:00",
      "duration": "2:40",
      "origin": "제주항",
      "destination": "완도항",
      "vessel": "완도블루호",
      "terminalId": "main",
      "terminalLabel": "완도항",
      "status": "결항"
    },
    {
      "type": "arrival",
      "time": "16:20",
      "duration": "0:50",
      "origin": "청산도",
      "destination": "완도항",
      "vessel": "청산누리호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "선사문의"
    }
  ]
};
