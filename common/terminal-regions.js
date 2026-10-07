(function defineTerminalRegions() {
  'use strict';

  window.PORTAL_TERMINAL_REGIONS = Object.freeze([
    '보령',
    '군산',
    '목포',
    '완도',
    '여수',
    '제주',
    '통영',
    '포항',
    '동해'
  ].sort((a, b) => a.localeCompare(b, 'ko-KR')));

  window.PORTAL_ACTIVE_TERMINAL_FOLDERS = Object.freeze([
    'incheon',
    'gunsan',
    'mokpo',
    'wando',
    'yeosu',
    'jeju',
    'tongyeong',
    'pohang'
  ]);
}());
