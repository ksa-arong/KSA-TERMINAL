// TODO: 실제 선박명 확인 필요
window._legacyScheduleData = {
  "referenceTime": "08:30",
  "filters": [
    {
      "id": "main",
      "label": "군산항"
    },
    {
      "id": "island",
      "label": "섬 항로"
    }
  ],
  "items": [
    {
      "type": "departure",
      "time": "09:30",
      "duration": "1:00",
      "origin": "군산항",
      "destination": "선유도",
      "vessel": "군산바다호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "정상운항"
    },
    {
      "type": "departure",
      "time": "14:40",
      "duration": "2:30",
      "origin": "군산항",
      "destination": "어청도",
      "vessel": "서해드림호",
      "terminalId": "main",
      "terminalLabel": "군산항",
      "status": "통제"
    },
    {
      "type": "arrival",
      "time": "11:50",
      "duration": "1:00",
      "origin": "선유도",
      "destination": "군산항",
      "vessel": "군산바다호",
      "terminalId": "island",
      "terminalLabel": "섬 항로",
      "status": "결항"
    },
    {
      "type": "arrival",
      "time": "18:00",
      "duration": "2:30",
      "origin": "어청도",
      "destination": "군산항",
      "vessel": "서해드림호",
      "terminalId": "main",
      "terminalLabel": "군산항",
      "status": "선사문의"
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
