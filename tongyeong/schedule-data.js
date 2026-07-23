// TODO: 실제 선박명 확인 필요
window.scheduleData = {
  "referenceTime": "08:30",
  "filters": [
    {
      "id": "main",
      "label": "통영항"
    },
    {
      "id": "island",
      "label": "섬 항로"
    }
  ],
  "items": [
    {
      "type": "departure",
      "time": "09:10",
      "origin": "통영항",
      "destination": "욕지도",
      "vessel": "통영바다호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "정상운항"
    },
    {
      "type": "departure",
      "time": "15:10",
      "origin": "통영항",
      "destination": "한산도",
      "vessel": "한려수도호",
      "terminalId": "main",
      "terminalLabel": "통영항",
      "status": "정상운항"
    },
    {
      "type": "arrival",
      "time": "11:40",
      "origin": "욕지도",
      "destination": "통영항",
      "vessel": "통영바다호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "정상운항"
    },
    {
      "type": "arrival",
      "time": "17:20",
      "origin": "한산도",
      "destination": "통영항",
      "vessel": "한려수도호",
      "terminalId": "main",
      "terminalLabel": "통영항",
      "status": "정상운항"
    }
  ]
};
