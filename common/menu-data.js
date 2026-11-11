(function defineMenuData() {
  'use strict';

  const regionRegistry = [
    { key: 'gunsan', nameKo: '군산', portalLabelKo: '군산', gnbLabelKo: '군산', folder: 'gunsan', logo: 'gunsan.png', status: 'preparing', hasPage: true, order: 1 },
    { key: 'boryeong', nameKo: '보령', portalLabelKo: '대천', gnbLabelKo: '보령', folder: 'boryeong', logo: 'boryeong.png', status: 'preparing', hasPage: true, order: 2 },
    { key: 'donghae', nameKo: '동해', portalLabelKo: '동해', gnbLabelKo: '동해', folder: 'donghae', logo: 'donghae.png', status: 'preparing', hasPage: true, order: 3 },
    { key: 'mokpo', nameKo: '목포', portalLabelKo: '목포', gnbLabelKo: '목포', folder: 'mokpo', logo: 'mokpo.png', status: 'partial', hasPage: true, order: 4 },
    { key: 'busan', nameKo: '부산', portalLabelKo: '부산', gnbLabelKo: '부산', folder: 'busan', status: 'preparing', hasPage: true, order: 5 },
    { key: 'yeosu', nameKo: '여수', portalLabelKo: '여수', gnbLabelKo: '여수', folder: 'yeosu', logo: 'yeosu.png', status: 'preparing', hasPage: true, order: 6 },
    { key: 'wando', nameKo: '완도', portalLabelKo: '완도', gnbLabelKo: '완도', folder: 'wando', logo: 'wando.png', status: 'preparing', hasPage: true, order: 7 },
    { key: 'incheon', nameKo: '인천', portalLabelKo: '인천', gnbLabelKo: '인천', folder: 'incheon', status: 'preparing', hasPage: true, order: 8, isDefault: true },
    { key: 'jeju', nameKo: '제주', portalLabelKo: '제주', gnbLabelKo: '제주', folder: 'jeju', logo: 'jeju.png', status: 'ready', hasPage: true, order: 9 },
    { key: 'tongyeong', nameKo: '통영', portalLabelKo: '통영', gnbLabelKo: '통영', folder: 'tongyeong', logo: 'tongyeong.png', status: 'preparing', hasPage: true, order: 10 },
    { key: 'pohang', nameKo: '포항', portalLabelKo: '포항', gnbLabelKo: '포항', folder: 'pohang', logo: 'pohang.png', status: 'preparing', hasPage: true, order: 11 }
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

  // Regional 2depth information architecture. Page availability is derived at
  // runtime from each region's verified terminal/schedule data; the menu itself
  // stays region-agnostic so another region can reuse the same loaders.
  window.REGION_MENU = Object.freeze([
    {
      id: 'terminal', label: '터미널 안내', terminalDirectory: true,
      pages: [
        { page: 'terminal-introduction', label: '터미널 소개', href: 'terminal-introduction.html' },
        { page: 'directions', label: '오시는 길', href: 'directions.html' },
        { page: 'facilities', label: '시설 안내', href: 'facilities.html' },
        { page: 'parking', label: '주차 안내', href: 'parking.html' }
      ],
      children: []
    },
    {
      id: 'operation', label: '운항정보',
      children: [
        { page: 'timetable', label: '운항 스케쥴', href: 'timetable.html' },
        { page: 'arrivals', label: '출도착 조회', href: 'arrivals.html' },
        { page: 'marine-weather', label: '해양기상정보', href: 'marine-weather.html' }
      ]
    },
    {
      id: 'operators', label: '선사안내',
      children: [
        { page: 'operators', label: '선사 안내', href: 'operators.html' },
        { page: 'vessels', label: '선박 안내', href: 'vessels.html' }
      ]
    },
    {
      id: 'boarding', label: '승선안내',
      children: [
        { page: 'boarding-procedure', label: '승선 절차', href: 'boarding-procedure.html' },
        { page: 'identity', label: '신분증 안내', href: 'identity.html' },
        { page: 'baggage', label: '수화물 안내', href: 'baggage.html' },
        { page: 'vehicle-shipping', label: '차량 선적 안내', href: 'vehicle-shipping.html' },
        { page: 'safety', label: '안전 수칙', href: 'safety.html' }
      ]
    },
    {
      id: 'customer', label: '고객센터',
      children: [
        { page: 'notices', label: '공지사항', href: 'notices.html' },
        { page: 'contacts', label: '문의처', href: 'contacts.html' },
        { page: 'tourism', label: '연계 관광 정보', href: 'tourism.html' },
        { page: 'faq', label: '자주 묻는 질문', href: 'faq.html' },
        { page: 'lost-found', label: '유실물 안내', href: 'lost-found.html' }
      ]
    }
  ].map((group) => Object.freeze({
    ...group,
    pages: group.pages ? Object.freeze(group.pages.map(Object.freeze)) : undefined,
    children: Object.freeze(group.children.map(Object.freeze))
  })));

  window.getRegionMenuChildren = (group, terminalData = window.terminalData) => {
    if (!group?.terminalDirectory) return group?.children || [];
    const terminals = Array.isArray(terminalData?.terminalProfiles) ? terminalData.terminalProfiles : [];
    return terminals.filter((terminal) => terminal.verified !== false).map((terminal) => ({
      page: 'terminal-introduction',
      terminalId: terminal.id,
      label: terminal.shortName || terminal.name,
      href: `terminal-introduction.html#${terminal.id}`
    }));
  };

  window.getRegionPageState = (pageKey, terminalData = window.terminalData, scheduleData = window.scheduleData) => {
    const routes = Array.isArray(scheduleData?.routes) ? scheduleData.routes : [];
    const cargoContacts = Array.isArray(terminalData?.cargoContacts) ? terminalData.cargoContacts : [];
    const terminals = Array.isArray(terminalData?.terminalProfiles) ? terminalData.terminalProfiles : [];
    const record = terminalData?.pages?.[pageKey] || scheduleData?.pages?.[pageKey];
    if (record && record.verified !== false && Array.isArray(record.sections) && record.sections.length) {
      return record.status === 'partial' ? 'partial' : 'ready';
    }
    const hasOperators = routes.some((entry) => Array.isArray(entry.route?.operators) && entry.route.operators.length);
    const hasTerminalCarriers = terminals.some((terminal) => Array.isArray(terminal.carriers) && terminal.carriers.length);
    const hasVessels = routes.some((entry) => {
      const name = entry.route?.vessel?.name;
      return typeof name === 'string' ? Boolean(name) : Boolean(name?.ko || name?.en);
    });
    return ({
      'terminal-introduction': terminals.some((terminal) => terminal.name && (terminal.address || terminal.scale || terminal.tel)) ? 'ready' : 'preparing',
      facilities: terminals.some((terminal) => terminal.parking || terminal.floors?.some((floor) => floor.items?.length)) ? 'ready' : 'preparing',
      directions: terminals.some((terminal) => terminal.address || terminal.transit?.byShip || terminal.transit?.routes?.length || terminal.transit?.car) ? 'ready' : 'preparing',
      parking: terminals.some((terminal) => terminal.parking) ? 'ready' : 'preparing',
      timetable: routes.length ? 'ready' : 'preparing',
      routes: routes.length ? 'ready' : 'preparing',
      operators: (hasTerminalCarriers || hasOperators) ? 'ready' : 'preparing',
      vessels: hasVessels ? 'ready' : 'preparing',
      'vehicle-shipping': cargoContacts.length ? 'partial' : 'preparing',
      contacts: (hasTerminalCarriers || hasOperators || cargoContacts.length) ? 'ready' : 'preparing',
      identity: 'ready',
      safety: 'ready',
      faq: 'ready',
      'lost-found': 'ready'
    })[pageKey] || 'preparing';
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
