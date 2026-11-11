window.scheduleData = {
  "schemaVersion": "2.0",
  "source": { "ko": "제주항 여객선 운항 시간표 2026년 10월 (09.16. 기준)", "en": "" },
  "sourceDate": "2026-09-16",
  "period": "2026-10",
  "terminals": {
    "coastal": { "name": { "ko": "연안여객터미널(2부두)", "en": "" }, "address": { "ko": "제주시 임항로 111", "en": "" } },
    "international": { "name": { "ko": "국제여객터미널(7부두)", "en": "" }, "address": { "ko": "제주시 임항로 191", "en": "" } }
  },
  "routes": [
    {
      "id": "mokpo-queen-zenobia",
      "route": {
        "group": null,
        "destination": { "ko": "목포", "en": "" },
        "vessel": { "name": { "ko": "퀸제누비아", "en": "" }, "tonnage": "27,391", "capacity": "1,284" },
        "operators": [{ "name": { "ko": "씨월드고속훼리㈜", "en": "" }, "tel": "1577-3567" }],
        "berthId": "coastal",
        "duration": null,
        "outbound": [],
        "inbound": [],
        "patterns": [],
        "suspended": { "dates": [], "weekdays": [], "note": { "ko": "선박검사, 05.28.~추후 일정 공지", "en": "" } },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "mokpo-queen-zenobia-2",
      "route": {
        "group": null,
        "destination": { "ko": "목포", "en": "" },
        "vessel": { "name": { "ko": "퀸제누비아 2", "en": "" }, "tonnage": "26,546", "capacity": "1,010" },
        "operators": [{ "name": { "ko": "씨월드고속훼리㈜", "en": "" }, "tel": "1577-3567" }],
        "berthId": "coastal",
        "duration": { "ko": "4시간 30분", "en": "" },
        "outbound": [{ "dep": "13:40", "arr": "18:10", "via": [] }],
        "inbound": [{ "dep": "01:00", "arr": "05:30", "via": [] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-12", "2026-10-17", "2026-10-24", "2026-10-26", "2026-10-31"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": { "ko": "10.19.은 국제여객터미널 출항(16:45)", "en": "" }
      }
    },
    {
      "id": "mokpo-queen-mary",
      "route": {
        "group": null,
        "destination": { "ko": "목포", "en": "" },
        "vessel": { "name": { "ko": "퀸 메 리", "en": "" }, "tonnage": "14,919", "capacity": "756" },
        "operators": [{ "name": { "ko": "씨월드고속훼리㈜", "en": "" }, "tel": "1577-3567" }],
        "berthId": "international",
        "duration": { "ko": "4시간 50분", "en": "" },
        "outbound": [{ "dep": "16:45", "arr": "21:35", "via": [] }],
        "inbound": [{ "dep": "08:30", "arr": "13:20", "via": [] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-19"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "chuja-jindo-santa-monica",
      "route": {
        "group": null,
        "destination": { "ko": "추자·진도", "en": "" },
        "vessel": { "name": { "ko": "산타모니카", "en": "" }, "tonnage": "3,500", "capacity": "606" },
        "operators": [{ "name": { "ko": "씨월드고속훼리㈜", "en": "" }, "tel": "1577-3567" }],
        "berthId": "coastal",
        "duration": null,
        "outbound": [],
        "inbound": [],
        "patterns": [
          {
            "days": ["mon", "tue", "wed", "thu"],
            "legs": [
              { "direction": "outbound", "trip": null, "from": { "ko": "제주", "en": "" }, "to": { "ko": "추자", "en": "" }, "dep": "16:20", "arr": "17:10", "duration": { "ko": "50분", "en": "" }, "via": [] },
              { "direction": "outbound", "trip": null, "from": { "ko": "추자", "en": "" }, "to": { "ko": "진도", "en": "" }, "dep": "17:35", "arr": "18:20", "duration": { "ko": "45분", "en": "" }, "via": [] },
              { "direction": "inbound", "trip": null, "from": { "ko": "진도", "en": "" }, "to": { "ko": "추자", "en": "" }, "dep": "08:00", "arr": "08:45", "duration": null, "via": [] },
              { "direction": "inbound", "trip": null, "from": { "ko": "추자", "en": "" }, "to": { "ko": "제주", "en": "" }, "dep": "09:10", "arr": "10:00", "duration": null, "via": [] }
            ]
          },
          {
            "days": ["fri", "sat", "sun"],
            "note": { "ko": "2항차 운항", "en": "" },
            "legs": [
              { "direction": "outbound", "trip": { "ko": "1항차", "en": "" }, "from": { "ko": "제주", "en": "" }, "to": { "ko": "진도", "en": "" }, "dep": "11:00", "arr": "12:30", "duration": { "ko": "1시간 30분", "en": "" }, "via": [] },
              { "direction": "inbound", "trip": { "ko": "1항차", "en": "" }, "from": { "ko": "진도", "en": "" }, "to": { "ko": "제주", "en": "" }, "dep": "08:10", "arr": "10:00", "duration": null, "via": [{ "port": { "ko": "추자", "en": "" }, "dep": "09:10" }] },
              { "direction": "outbound", "trip": { "ko": "2항차", "en": "" }, "from": { "ko": "제주", "en": "" }, "to": { "ko": "진도", "en": "" }, "dep": "16:20", "arr": "18:20", "duration": null, "via": [{ "port": { "ko": "추자", "en": "" }, "arr": "17:10", "dep": "17:35" }] },
              { "direction": "inbound", "trip": { "ko": "2항차", "en": "" }, "from": { "ko": "진도", "en": "" }, "to": { "ko": "제주", "en": "" }, "dep": "13:30", "arr": "15:00", "duration": null, "via": [] }
            ]
          }
        ],
        "suspended": { "dates": ["2026-10-07", "2026-10-21"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "chuja-wando-songrim-blue-ocean",
      "route": {
        "group": null,
        "destination": { "ko": "추자·완도", "en": "" },
        "vessel": { "name": { "ko": "송림블루오션", "en": "" }, "tonnage": "2,374", "capacity": "291" },
        "operators": [{ "name": { "ko": "㈜송림해운", "en": "" }, "tel": "064-758-8889" }],
        "berthId": "coastal",
        "duration": null,
        "outbound": [{ "dep": "08:00", "arr": "13:10", "via": [{ "port": { "ko": "추자", "en": "" }, "arr": "10:00", "dep": "10:30", "durationBefore": { "ko": "2시간", "en": "" }, "durationAfter": { "ko": "2시간 40분", "en": "" } }] }],
        "inbound": [{ "dep": "13:40", "arr": "18:40", "via": [{ "port": { "ko": "추자", "en": "" }, "arr": "16:20", "dep": "16:40" }] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-15", "2026-10-29"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "wando-gold-stella",
      "route": {
        "group": null,
        "destination": { "ko": "완도", "en": "" },
        "vessel": { "name": { "ko": "골드스텔라", "en": "" }, "tonnage": "21,989", "capacity": "1,029" },
        "operators": [{ "name": { "ko": "㈜한일고속", "en": "" }, "tel": "1688-2100" }],
        "berthId": "international",
        "duration": { "ko": "2시간 40분", "en": "" },
        "outbound": [
          { "trip": { "ko": "1항차", "en": "" }, "dep": "08:40", "arr": "11:20", "via": [] },
          { "trip": { "ko": "2항차", "en": "" }, "dep": "19:30", "arr": "22:10", "via": [] }
        ],
        "inbound": [
          { "trip": { "ko": "1항차", "en": "" }, "dep": "02:30", "arr": "05:10", "via": [] },
          { "trip": { "ko": "2항차", "en": "" }, "dep": "15:00", "arr": "17:40", "via": [] }
        ],
        "patterns": [],
        "suspended": { "dates": ["2026-10-17", "2026-10-18", "2026-10-24", "2026-10-25", "2026-10-31"], "weekdays": [], "note": { "ko": "1항차 휴항 18,25 / 2항차 휴항 17,24,31", "en": "" } },
        "departurePort": null,
        "note": { "ko": "크루즈 기항일 입항 및 차량선적 필히 문의", "en": "" }
      }
    },
    {
      "id": "wando-silver-cloud",
      "route": {
        "group": null,
        "destination": { "ko": "완도", "en": "" },
        "vessel": { "name": { "ko": "실버클라우드", "en": "" }, "tonnage": "20,263", "capacity": "1,180" },
        "operators": [{ "name": { "ko": "㈜한일고속", "en": "" }, "tel": "1688-2100" }],
        "berthId": "international",
        "duration": { "ko": "2시간 40분", "en": "" },
        "outbound": [{ "dep": "16:00", "arr": "18:40", "via": [] }],
        "inbound": [{ "dep": "09:20", "arr": "12:00", "via": [] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-24"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "nokdong-arion-jeju",
      "route": {
        "group": null,
        "destination": { "ko": "녹동", "en": "" },
        "vessel": { "name": { "ko": "아리온 제주", "en": "" }, "tonnage": "6,266", "capacity": "818" },
        "operators": [{ "name": { "ko": "㈜남해고속", "en": "" }, "tel": "064-723-9700" }],
        "berthId": "coastal",
        "duration": { "ko": "3시간 40분", "en": "" },
        "outbound": [{ "dep": "16:30", "arr": "21:10", "via": [] }],
        "inbound": [{ "dep": "09:00", "arr": "12:40", "via": [] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-17", "2026-10-24", "2026-10-31"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    },
    {
      "id": "samcheonpo-ocean-vista-jeju",
      "route": {
        "group": null,
        "destination": { "ko": "삼천포", "en": "" },
        "vessel": { "name": { "ko": "오션비스타 제주", "en": "" }, "tonnage": "20,500", "capacity": "891" },
        "operators": [{ "name": { "ko": "㈜현성MCT", "en": "" }, "tel": "064-759-8486" }],
        "berthId": "international",
        "duration": { "ko": "6시간 30분", "en": "" },
        "outbound": [{ "dep": "14:30", "arr": "21:00", "via": [] }],
        "inbound": [{ "dep": "23:40", "arr": "06:00", "via": [] }],
        "patterns": [],
        "suspended": { "dates": ["2026-10-17", "2026-10-24", "2026-10-31"], "weekdays": [], "note": null },
        "departurePort": null,
        "note": null
      }
    }
  ]
};
