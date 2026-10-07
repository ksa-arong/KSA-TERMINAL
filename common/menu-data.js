(function defineMenuData() {
  'use strict';

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
