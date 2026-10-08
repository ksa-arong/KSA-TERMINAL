(function defineMenuData() {
  'use strict';

  const regionRegistry = [
    { key: 'gunsan', nameKo: '군산', portalLabelKo: '군산', gnbLabelKo: '군산항', folder: 'gunsan', logo: 'gunsan.png', status: 'preparing', hasPage: true, order: 1 },
    { key: 'boryeong', nameKo: '보령', portalLabelKo: '대천', gnbLabelKo: '보령(대천항)', folder: null, logo: 'boryeong.png', status: 'preparing', hasPage: false, order: 2 },
    { key: 'donghae', nameKo: '동해', portalLabelKo: '동해', gnbLabelKo: '동해항', folder: null, logo: 'donghae.png', status: 'preparing', hasPage: false, order: 3 },
    { key: 'mokpo', nameKo: '목포', portalLabelKo: '목포', gnbLabelKo: '목포항', folder: 'mokpo', logo: 'mokpo.png', status: 'partial', hasPage: true, order: 4 },
    { key: 'busan', nameKo: '부산', portalLabelKo: '부산', gnbLabelKo: '부산항', folder: null, status: 'preparing', hasPage: false, order: 5 },
    { key: 'yeosu', nameKo: '여수', portalLabelKo: '여수', gnbLabelKo: '여수항', folder: 'yeosu', logo: 'yeosu.png', status: 'preparing', hasPage: true, order: 6 },
    { key: 'wando', nameKo: '완도', portalLabelKo: '완도', gnbLabelKo: '완도항', folder: 'wando', logo: 'wando.png', status: 'preparing', hasPage: true, order: 7 },
    { key: 'incheon', nameKo: '인천', portalLabelKo: '인천', gnbLabelKo: '인천항', folder: 'incheon', status: 'preparing', hasPage: true, order: 8, isDefault: true },
    { key: 'jeju', nameKo: '제주', portalLabelKo: '제주', gnbLabelKo: '제주항', folder: 'jeju', logo: 'jeju.png', status: 'ready', hasPage: true, order: 9 },
    { key: 'tongyeong', nameKo: '통영', portalLabelKo: '통영', gnbLabelKo: '통영항', folder: 'tongyeong', logo: 'tongyeong.png', status: 'preparing', hasPage: true, order: 10 },
    { key: 'pohang', nameKo: '포항', portalLabelKo: '포항', gnbLabelKo: '포항항', folder: 'pohang', logo: 'pohang.png', status: 'preparing', hasPage: true, order: 11 }
  ].sort((a, b) => a.order - b.order).map(Object.freeze);
  const regionByKey = Object.freeze(Object.fromEntries(regionRegistry.map((region) => [region.key, region])));
  const regionByNameKo = Object.freeze(Object.fromEntries(regionRegistry.map((region) => [region.nameKo, region])));
  const regionStatuses = Object.freeze(Object.fromEntries(regionRegistry.map((region) => [region.key, region.status])));

  window.PORTAL_REGION_REGISTRY = Object.freeze(regionRegistry);
  window.PORTAL_REGION_BY_KEY = regionByKey;
  window.PORTAL_REGION_BY_NAME_KO = regionByNameKo;
  window.PORTAL_REGION_STATUSES = regionStatuses;
  window.getPortalRegionDefinition = (regionId) => regionByKey[regionId] || null;
  window.getPortalRegionStatus = (regionId, fallback = null) => regionByKey[regionId]?.status || fallback;
  window.validatePortalRegionKeys = (source, regionIds) => {
    const unknown = [...new Set(regionIds)].filter((regionId) => regionId && !regionByKey[regionId]);
    if (unknown.length) {
      console.warn(`[지역 레지스트리] ${source}에 미등록 지역이 있습니다: ${unknown.join(', ')}`);
    }
    return unknown;
  };

  window.MENU_DATA = [
    {
      id: 'terminal', labelKey: 'portalNav.terminal', href: 'terminal/terminal-list.html', currentSection: 'terminal',
      children: [
        { id: 'terminal-list', labelKey: 'portalNav.allTerminals', href: 'terminal/terminal-list.html' },
        { id: 'map-search', labelKey: 'portalNav.mapSearch', href: 'terminal/map.html' }
      ],
      terminal: {
        id: 'terminal-info', labelKey: 'terminalNav.terminalInfo', href: '{terminal}/guide.html#main', currentSection: 'terminal',
        children: [
          { id: 'introduction', labelKey: 'terminalNav.introduction', href: '{terminal}/index.html#terminal' },
          { id: 'facilities', labelKey: 'terminalNav.facilities', href: '{terminal}/guide.html#facilities' },
          { id: 'directions', labelKey: 'terminalNav.directions', href: '{terminal}/guide.html#directions' }
        ]
      },
      quick: { order: 1, labelKey: 'portal.findTerminal', descriptionKey: 'portal.findTerminalDesc', href: 'index.html#portal-terminals', icon: 'terminal' },
      footer: { order: 3, labelKey: 'nav.terminal', href: 'index.html#portal-terminals' }
    },
    {
      id: 'schedule', labelKey: 'portalNav.operation', href: 'schedule/operation.html', currentSection: 'schedule',
      children: [
        { id: 'operation-info', labelKey: 'portalNav.operation', href: 'schedule/operation.html' },
        // 기존 결항 안내 콘텐츠 보존용 비노출 페이지
        { id: 'cancellation', labelKey: 'mega.cancellation', href: 'schedule/cancellation.html', hidden: true },
        { id: 'weather', labelKey: 'portalNav.weather', href: 'schedule/weather.html' }
      ],
      terminal: {
        id: 'operation', labelKey: 'terminalNav.operation', href: '{terminal}/index.html#schedule', currentSection: 'schedule',
        children: [
          { id: 'arrivals', labelKey: 'terminalNav.arrivals', href: '{terminal}/index.html#schedule' },
          { id: 'timetable', labelKey: 'terminalNav.timetable', href: '{terminal}/index.html#schedule' },
          { id: 'fare', labelKey: 'terminalNav.fare', href: '{terminal}/index.html#fare' },
          { id: 'routes', labelKey: 'terminalNav.routes', href: '{terminal}/index.html#schedule' },
          { id: 'weather', labelKey: 'terminalNav.weather', href: '{terminal}/index.html#schedule' }
        ]
      },
      quick: { order: 2, labelKey: 'portal.schedule', descriptionKey: 'portal.scheduleDesc', href: 'schedule/operation.html', icon: 'schedule' },
      footer: { order: 1, labelKey: 'portal.schedule', href: 'schedule/operation.html' }
    },
    {
      id: 'booking', labelKey: 'portalNav.booking', href: 'https://island.theksa.co.kr/', currentSection: 'booking', external: true,
      children: [
        { id: 'ticket', labelKey: 'portalNav.ticket', href: 'https://island.theksa.co.kr/', external: true },
        // 확정 콘텐츠 준비 전까지 비노출
        { id: 'fare', labelKey: 'portalNav.fare', href: 'booking/fare.html', hidden: true },
        // TODO: 실제 이벤트 데이터 확보 후 hidden 플래그 해제 및 페이지 생성
        { id: 'events', labelKey: 'portalNav.events', href: 'booking/events.html', hidden: true },
        // 확정 콘텐츠 준비 전까지 비노출
        { id: 'refund', labelKey: 'portalNav.refund', href: 'booking/refund.html', hidden: true }
      ],
      quick: { order: 3, labelKey: 'portal.bookingQuick', descriptionKey: 'portal.bookingQuickDesc', href: 'https://island.theksa.co.kr/', icon: 'booking', external: true },
      terminal: {
        id: 'operators', labelKey: 'terminalNav.operators', href: '{terminal}/index.html#schedule',
        children: [
          { id: 'operator-guide', labelKey: 'terminalNav.operatorGuide', href: '{terminal}/index.html#schedule' },
          { id: 'ship-guide', labelKey: 'terminalNav.shipGuide', href: '{terminal}/index.html#schedule' }
        ]
      }
    },
    {
      id: 'boarding', labelKey: 'portalNav.boarding', href: 'boarding/procedure.html', currentSection: 'boarding',
      children: [
        { id: 'process', labelKey: 'portalNav.process', href: 'boarding/procedure.html' },
        { id: 'identity', labelKey: 'portalNav.identity', href: 'boarding/id.html' },
        { id: 'vehicle', labelKey: 'portalNav.vehicle', href: 'boarding/vehicle.html' },
        { id: 'safety', labelKey: 'portalNav.safety', href: 'boarding/safety.html' }
      ],
      terminal: {
        id: 'boarding', labelKey: 'terminalNav.boarding', href: '{terminal}/index.html#boarding', currentSection: 'boarding',
        children: [
          { id: 'process', labelKey: 'terminalNav.process', href: '{terminal}/index.html#boarding' },
          { id: 'identity', labelKey: 'terminalNav.identity', href: '{terminal}/index.html#boarding-detail' },
          { id: 'safety', labelKey: 'terminalNav.safety', href: '{terminal}/index.html#boarding' }
        ]
      },
      footer: { order: 2, labelKey: 'nav.boarding', href: 'boarding/procedure.html' }
    },
    {
      id: 'customer', labelKey: 'portalNav.customer', href: 'customer/notice.html', currentSection: 'customer',
      children: [
        { id: 'notices', labelKey: 'portalNav.notices', href: 'customer/notice.html' },
        { id: 'faq', labelKey: 'portalNav.faq', href: 'customer/faq.html' },
        { id: 'inquiry', labelKey: 'portalNav.inquiryBoard', href: 'customer/inquiry.html' },
        { id: 'lost-found', labelKey: 'portalNav.lostFound', href: 'customer/lost-found.html' },
        { id: 'privacy', labelKey: 'footer.privacy', href: 'privacy.html', hidden: true },
        { id: 'terms', labelKey: 'footer.terms', href: 'terms.html', hidden: true },
        { id: 'sitemap', labelKey: 'footer.sitemap', href: 'sitemap.html', hidden: true }
      ],
      terminal: {
        id: 'customer', labelKey: 'terminalNav.customer', href: '{terminal}/index.html#notice', currentSection: 'customer',
        children: [
          { id: 'notices', labelKey: 'terminalNav.notices', href: '{terminal}/index.html#notice' },
          { id: 'faq', labelKey: 'terminalNav.faq', href: '{terminal}/guide.html#faq' },
          { id: 'lost-found', labelKey: 'terminalNav.lostFound', href: '{terminal}/guide.html#lost-found' },
          { id: 'tourism', labelKey: 'terminalNav.tourism', href: '{terminal}/index.html#terminal' }
        ]
      },
      quick: { order: 4, labelKey: 'portal.customer', descriptionKey: 'portal.customerDesc', href: 'customer/notice.html', icon: 'customer' },
      footer: { order: 4, labelKey: 'nav.customer', href: 'customer/notice.html' }
    }
  ];
}());
