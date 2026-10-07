(function definePortalNoticeData() {
  'use strict';

  const standardNotices = (terminalName, regionName) => [
    { category: '중요', title: `${regionName} 여객선 운항 안내`, date: '2026.07.18' },
    { category: '공지', title: '기상 악화 시 운항 확인 방법 안내', date: '2026.07.14' },
    { category: '안내', title: '터미널 주차장 이용 안내', date: '2026.07.08' },
    { category: '공지', title: '신분증 미소지 승객 본인확인 절차 안내', date: '2026.07.02' },
    { category: '채용', title: `${terminalName} 기간제 근로자 채용 공고`, date: '2026.06.25' }
  ];

  window.PORTAL_NOTICE_DATA = {
    terminals: [
      {
        id: 'common', label: '공통', name: '전국 여객선터미널', team: '운영지원팀',
        notices: [
          { category: '중요', title: '여객선 이용 전 신분증 지참 안내', date: '2026.07.24' },
          { category: '공지', title: '기상 악화 시 운항정보 확인 안내', date: '2026.07.23' },
          { category: '안내', title: '여객선 승선권 예매 및 환불 유의사항', date: '2026.07.20' }
        ]
      },
      {
        id: 'incheon', label: '인천항', name: '인천항 연안여객터미널', team: '인천터미널팀',
        notices: [
          { category: '중요', title: '당일 운항 여부는 매일 아침 06:30에 최초 결정됩니다', date: '2026.07.22' },
          { category: '공지', title: '기상 특보 시 여객선 결항 및 운항 변경 안내', date: '2026.07.21' },
          { category: '항로', title: '백령·덕적·연평 주요 항로 이용 안내', date: '2026.07.18' },
          { category: '안내', title: '연안여객터미널 주차장 이용 안내', date: '2026.07.14' },
          { category: '공지', title: '신분증 미소지 승객 본인확인 절차 안내', date: '2026.07.08' }
        ]
      },
      {
        id: 'jeju', label: '제주항', name: '제주항여객터미널', team: '연안터미널팀',
        notices: [
          { category: '중요', title: '제주 여객선 운항 안내', date: '2026.07.18' },
          { category: '공지', title: '기상 악화 시 운항 확인 방법 안내', date: '2026.07.14' },
          { category: '안내', title: '터미널 주차장 이용 안내', date: '2026.07.08' },
          { category: '공지', title: '신분증 미소지 승객 본인확인 절차 안내', date: '2026.07.02' },
          { category: '채용', title: '제주항여객터미널 기간제 근로자 채용 공고', date: '2026.06.25' }
        ]
      },
      { id: 'gunsan', label: '군산항', name: '군산항여객터미널', team: '군산터미널팀', notices: standardNotices('군산항여객터미널', '군산') },
      { id: 'yeosu', label: '여수항', name: '여수항여객터미널', team: '여수터미널팀', notices: standardNotices('여수항여객터미널', '여수') },
      { id: 'tongyeong', label: '통영항', name: '통영항여객터미널', team: '통영터미널팀', notices: standardNotices('통영항여객터미널', '통영') },
      { id: 'pohang', label: '포항항', name: '포항항여객터미널', team: '포항터미널팀', notices: standardNotices('포항항여객터미널', '포항') },
      { id: 'wando', label: '완도항', name: '완도항여객터미널', team: '완도터미널팀', notices: standardNotices('완도항여객터미널', '완도') }
    ]
  };
}());
