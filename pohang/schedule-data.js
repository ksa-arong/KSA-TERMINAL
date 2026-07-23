// TODO: 실제 선박명 확인 필요
window.scheduleData = {
  "referenceTime": "08:30",
  "filters": [
    {
      "id": "main",
      "label": "포항항"
    },
    {
      "id": "island",
      "label": "울릉 항로"
    }
  ],
  "items": [
    {
      "type": "departure",
      "time": "09:50",
      "origin": "포항항",
      "destination": "울릉도",
      "vessel": "동해스타호",
      "terminalId": "island",
      "terminalLabel": "울릉 항로",
      "status": "정상운항"
    },
    {
      "type": "departure",
      "time": "18:00",
      "origin": "포항항",
      "destination": "울릉도",
      "vessel": "포항누리호",
      "terminalId": "main",
      "terminalLabel": "포항항",
      "status": "결항",
      "note": "기상악화"
    },
    {
      "type": "arrival",
      "time": "14:30",
      "origin": "울릉도",
      "destination": "포항항",
      "vessel": "동해스타호",
      "terminalId": "island",
      "terminalLabel": "울릉 항로",
      "status": "정상운항"
    },
    {
      "type": "arrival",
      "time": "20:10",
      "origin": "울릉도",
      "destination": "포항항",
      "vessel": "포항누리호",
      "terminalId": "main",
      "terminalLabel": "포항항",
      "status": "결항",
      "note": "기상악화"
    }
  ]
};
