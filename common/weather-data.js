(function definePortalWeatherData() {
  'use strict';

  const shortTermPeriods = [
    { label: '오늘', time: '오전', condition: '구름 많음', wave: -0.2, wind: -0.8, direction: '남동' },
    { label: '오늘', time: '오후', condition: '흐리고 한때 비', wave: 0.3, wind: 1.2, direction: '남동' },
    { label: '내일', time: '오전', condition: '흐림', wave: 0.1, wind: 0.5, direction: '남-남서' },
    { label: '내일', time: '오후', condition: '구름 많음', wave: -0.1, wind: -0.3, direction: '남-남서' },
    { label: '모레', time: '오전', condition: '구름 많음', wave: -0.3, wind: -1.1, direction: '서-남서' },
    { label: '모레', time: '오후', condition: '맑음', wave: -0.4, wind: -1.6, direction: '서' }
  ];

  const weeklyPeriods = [
    { label: '9.3 (목)', morning: '구름 많음', afternoon: '흐림', adjustment: 0.1 },
    { label: '9.4 (금)', morning: '흐리고 비', afternoon: '흐리고 비', adjustment: 0.4 },
    { label: '9.5 (토)', morning: '구름 많음', afternoon: '구름 많음', adjustment: 0.2 },
    { label: '9.6 (일)', morning: '맑음', afternoon: '구름 조금', adjustment: -0.2 },
    { label: '9.7 (월)', morning: '구름 많음', afternoon: '흐림', adjustment: 0 },
    { label: '9.8 (화)', morning: '흐림', afternoon: '구름 많음', adjustment: 0.3 },
    { label: '9.9 (수)', morning: '맑음', afternoon: '맑음', adjustment: -0.3 }
  ];

  const round = (value) => Math.round(Math.max(0.2, value) * 10) / 10;

  function statusFor(wave, wind) {
    if (wave >= 3 || wind >= 14) {
      return {
        level: 'danger',
        label: '높은 파고',
        message: '높은 파고 또는 강한 바람이 예상됩니다. 운항 여부를 반드시 선사에 확인하세요.'
      };
    }
    if (wave >= 2 || wind >= 10) {
      return {
        level: 'warning',
        label: '주의 필요',
        message: '파고와 풍속 변화 가능성이 있습니다. 출항 전 기상특보와 선사 안내를 확인하세요.'
      };
    }
    return {
      level: 'success',
      label: '비교적 안정',
      message: '현재 예시 예보는 비교적 안정적입니다. 실제 운항 여부는 선사 안내를 확인하세요.'
    };
  }

  function makeForecast(wave, wind, baseDirection) {
    return shortTermPeriods.map((period) => {
      const waveCenter = round(wave + period.wave);
      const windCenter = round(wind + period.wind);
      return {
        label: period.label,
        time: period.time,
        condition: period.condition,
        waveMin: round(waveCenter - 0.4),
        waveMax: round(waveCenter + 0.5),
        windMin: round(windCenter - 2),
        windMax: round(windCenter + 2),
        direction: period.direction || baseDirection
      };
    });
  }

  function makeWeekly(wave) {
    return weeklyPeriods.map((period) => {
      const center = round(wave + period.adjustment);
      return {
        label: period.label,
        morning: period.morning,
        afternoon: period.afternoon,
        waveMin: round(center - 0.4),
        waveMax: round(center + 0.6)
      };
    });
  }

  function makeAdvisories(label, status) {
    if (status.level === 'danger') {
      return [{
        level: 'danger',
        title: '강풍주의보·풍랑주의보 발표',
        issuedAt: '2026년 09월 02일 13시 00분',
        area: label,
        note: '강한 바람과 높은 물결이 예상됩니다. 출항 전 선사 운항정보를 반드시 확인해 주세요.'
      }];
    }
    if (status.level === 'warning') {
      return [{
        level: 'warning',
        title: '풍랑주의보 발표',
        issuedAt: '2026년 09월 02일 13시 00분',
        area: label,
        note: '풍랑주의보 발표 후 해제 예고: 3일 오전(09시~12시)'
      }];
    }
    return [{
      level: 'success',
      title: '풍랑주의보 해제',
      issuedAt: '2026년 09월 02일 11시 00분',
      area: label,
      note: '현재 발효 중인 기상특보가 없습니다.'
    }];
  }

  function sea(id, label, station, wave, wind, direction) {
    const temperature = Math.round((23.5 - wave * 0.55) * 10) / 10;
    const status = statusFor(wave, wind);
    return {
      id,
      label,
      station,
      current: {
        direction,
        temperature,
        rainfall: wave >= 2.6 ? 1.2 : 0,
        wind
      },
      observation: {
        visibility: wave >= 2.6 ? 12000 : 20000,
        temperature: Math.round((temperature - 0.7) * 10) / 10,
        wind: Math.round((wind * 0.94) * 10) / 10,
        pressure: Math.round((1018.2 - wave * 1.45) * 10) / 10
      },
      status,
      advisories: makeAdvisories(label, status),
      forecast: makeForecast(wave, wind, direction),
      weekly: makeWeekly(wave)
    };
  }

  window.PORTAL_WEATHER_FALLBACK_DATA = {
    sample: true,
    updatedAt: '2026년 9월 2일 13:37 기준',
    areas: [
      {
        id: 'gunsan',
        label: '군산',
        routes: [
          sea('jeonbuk-coast', '전북북부앞바다', '전북북부앞바다', 1.2, 7.4, '남동'),
          sea('west-south-north-offshore', '서해남부북쪽먼바다', '서해남부북쪽먼바다', 2.2, 11.1, '남동')
        ]
      },
      {
        id: 'donghae',
        label: '동해',
        routes: [
          sea('gangwon-central-coast', '강원중부앞바다', '강원중부앞바다', 1.1, 6.8, '동'),
          sea('east-central-offshore', '동해중부먼바다', '동해중부먼바다', 2.4, 11.7, '동-남동')
        ]
      },
      {
        id: 'mokpo',
        label: '목포',
        routes: [
          sea('west-south-coast', '서해남부앞바다', '서해남부앞바다', 1.5, 8.6, '남동'),
          sea('west-south-offshore', '서해남부먼바다', '서해남부먼바다', 2.6, 12.3, '남동-남')
        ]
      },
      {
        id: 'boryeong',
        label: '보령',
        routes: [
          sea('chungnam-coast', '충남북부앞바다', '충남북부앞바다', 1.0, 6.5, '남동'),
          sea('west-central-offshore', '서해중부먼바다', '서해중부먼바다', 2.0, 10.4, '남동')
        ]
      },
      {
        id: 'yeosu',
        label: '여수',
        routes: [
          sea('jeonnam-east-coast', '전남동부남해앞바다', '전남동부남해앞바다', 1.7, 9.2, '동-남동'),
          sea('south-west-east-offshore', '남해서부동쪽먼바다', '남해서부동쪽먼바다', 2.8, 13.1, '동-남동')
        ]
      },
      {
        id: 'wando',
        label: '완도',
        routes: [
          sea('jeonnam-west-coast', '전남서부남해앞바다', '전남서부남해앞바다', 1.4, 8.1, '동'),
          sea('south-west-offshore', '남해서부먼바다', '남해서부먼바다', 2.3, 11.5, '동-남동')
        ]
      },
      {
        id: 'jeju',
        label: '제주',
        routes: [
          sea('jeju-north', '제주도북부앞바다', '제주도북부앞바다', 1.2, 8.2, '동-남동'),
          sea('jeju-east', '제주도동부앞바다', '제주도동부앞바다', 2.1, 11.3, '동-남동'),
          sea('jeju-south', '제주도남부앞바다', '제주도남부앞바다', 2.7, 13.5, '남동'),
          sea('jeju-west', '제주도서부앞바다', '제주도서부앞바다', 1.8, 9.8, '남-남서')
        ]
      },
      {
        id: 'tongyeong',
        label: '통영',
        routes: [
          sea('gyeongnam-central-coast', '경남중부남해앞바다', '경남중부남해앞바다', 1.5, 8.7, '동'),
          sea('south-east-coast', '남해동부앞바다', '남해동부앞바다', 2.0, 10.2, '동-남동')
        ]
      },
      {
        id: 'pohang',
        label: '포항',
        routes: [
          sea('gyeongbuk-south-coast', '경북남부앞바다', '경북남부앞바다', 1.6, 8.9, '북동'),
          sea('east-south-offshore', '동해남부먼바다', '동해남부먼바다', 3.1, 14.8, '북동')
        ]
      }
    ]
  };
}());
