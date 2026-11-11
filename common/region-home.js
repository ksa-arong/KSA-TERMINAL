(function () {
  'use strict';

  const escapeHtml = window.PortalDomUtils.escapeHtml;
  const localize = window.i18n
    ? window.i18n.localize
    : (value) => value && typeof value === 'object' ? value.ko || value.en || '' : value || '';
  const paths = window.KsaPathResolver.create({ location: 'region', regionId: window.terminalData.regionId });

  const quickIconPaths = {
    terminal: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    schedule: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    booking: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M12 8v2m0 4v2"/>',
    customer: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 1Zm16 0v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 1Z"/>'
  };

  function quickIcon(name) {
    const icon = quickIconPaths[name] ? name : 'terminal';
    return `<svg class="line-icon line-icon--large portal-quick-icon portal-quick-icon--${icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${quickIconPaths[icon]}</svg>`;
  }

  function regionalHeroImages(data, hero) {
    const configured = Array.isArray(hero.images) ? hero.images : [];
    const terminalPhotos = Array.isArray(data.terminalProfiles)
      ? data.terminalProfiles.flatMap((terminal) => Array.isArray(terminal.photo) ? terminal.photo : [])
      : [];
    const images = (configured.length ? configured : terminalPhotos)
      .map((image) => typeof image === 'string' ? { src: image, alt: '' } : image)
      .filter((image) => image?.src);
    return images.length ? images : [{ src: paths.portal('hero-ferry.png'), alt: '여객선과 바다 풍경' }];
  }

  function renderRegionalSlides(data, hero) {
    return regionalHeroImages(data, hero).map((image, index) => {
      const position = image.position ? ` style="object-position: ${escapeHtml(image.position)}"` : '';
      return `<span class="portal-hero-slide portal-hero-slide--regional${index === 0 ? ' active' : ''}"><img src="${escapeHtml(image.src)}" alt="" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${position}></span>`;
    }).join('');
  }

  function resolveRegionQuickHref(href) {
    return paths.regionPage(href || 'index.html');
  }

  function menuIcon(groupId) {
    return ({ terminal: 'terminal', operation: 'schedule', operators: 'customer', boarding: 'booking', customer: 'customer' })[groupId] || 'terminal';
  }

  function regionalQuickItems(data) {
    const configured = Array.isArray(data.quickNav) ? data.quickNav : [];
    const items = configured.map((item) => ({
      icon: item.icon || 'terminal',
      label: localize(item.title),
      detail: localize(item.description),
      href: resolveRegionQuickHref(item.href)
    })).filter((item) => item.label && item.href);
    const used = new Set(items.map((item) => item.href));

    for (const group of window.REGION_MENU || []) {
      const candidates = [...(group.pages || []), ...(group.children || [])];
      for (const item of candidates) {
        if (items.length >= 4) break;
        if (!item?.href || !item?.label) continue;
        if (window.getRegionPageState && window.getRegionPageState(item.page, data, window.scheduleData) === 'preparing') continue;
        const href = resolveRegionQuickHref(item.href);
        if (used.has(href)) continue;
        items.push({ icon: menuIcon(group.id), label: item.label, detail: `${item.label} 상세 안내`, href });
        used.add(href);
      }
      if (items.length >= 4) break;
    }
    return items.slice(0, 4);
  }

  function renderRegionalQuickCards(data) {
    return regionalQuickItems(data).map((item, index) => {
      const external = /^(?:https?:)?\/\//i.test(item.href);
      const attributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a class="portal-hero-service-card portal-hero-service-card--${index + 1}" href="${escapeHtml(item.href)}"${attributes}>${quickIcon(item.icon)}<strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></a>`;
    }).join('');
  }

  function renderHero(data = {}) {
    const hero = data.hero || {};
    const homePage = data.homePage || {};
    const regionalHero = homePage.regionalHero === true;
    const legacy = data._legacy || {};
    const eyebrow = regionalHero ? (localize(hero.eyebrow) || localize(data.name)) : localize(data.name);
    const title = (localize(hero.title) || legacy.heroTitle || localize(data.guideTitle) || localize(data.name))
      .replace(/\s*\r?\n\s*/g, ' ');
    const description = regionalHero ? localize(hero.description) : '';
    const quickItems = [
      ['terminal', '터미널 찾기', '전국 터미널 위치 안내', `${paths.portal()}#portal-terminals`, '', 'portal.findTerminal', 'portal.findTerminalDesc'],
      ['schedule', '운항 및 기상정보', '운항 현황과 해양기상', paths.portal('schedule/operation.html'), '', 'portal.schedule', 'portal.scheduleDesc'],
      ['booking', '승선권 예매', '여객선 승선권 예매', 'https://island.theksa.co.kr/', ' target="_blank" rel="noopener noreferrer" aria-label="승선권 예매 사이트 새 창 열림"', 'portal.bookingQuick', 'portal.bookingQuickDesc'],
      ['customer', '고객센터', '공지사항과 이용 문의', paths.portal('customer/notice.html'), '', 'portal.customer', 'portal.customerDesc']
    ];
    const cards = homePage.dataDrivenQuickNav === true
      ? renderRegionalQuickCards(data)
      : quickItems.map(([icon, label, detail, href, attributes, labelKey, detailKey], index) =>
        `<a class="portal-hero-service-card portal-hero-service-card--${index + 1}" href="${href}"${attributes}>${quickIcon(icon)}<strong data-i18n="${labelKey}">${label}</strong><small data-i18n="${detailKey}">${detail}</small></a>`
      ).join('');
    const slides = regionalHero
      ? renderRegionalSlides(data, hero)
      : `<span class="portal-hero-slide portal-hero-slide--jeju active"></span>
        <span class="portal-hero-slide portal-hero-slide--pohang"></span>
        <span class="portal-hero-slide portal-hero-slide--island-harbor"></span>
        <span class="portal-hero-slide portal-hero-slide--hongdo"></span>
        <span class="portal-hero-slide portal-hero-slide--gangjeong"></span>`;
    const slideCount = regionalHero ? regionalHeroImages(data, hero).length : 5;
    const controls = slideCount > 1 ? `
          <button class="btn btn--icon btn--sm btn--ghost" type="button" data-hero-previous data-dir="prev" aria-label="이전 히어로 이미지" data-i18n-attr="aria-label:portal.heroPrevious"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5"/></svg></button>
          <button class="portal-hero-playback btn btn--icon btn--sm btn--ghost" type="button" data-hero-playback aria-label="히어로 슬라이드 일시정지" aria-pressed="false"><svg class="portal-hero-playback-icon portal-hero-playback-icon--pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3v10M11.5 3v10"/></svg><svg class="portal-hero-playback-icon portal-hero-playback-icon--play" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 7 5-7 5Z"/></svg></button>
          <button class="btn btn--icon btn--sm btn--ghost" type="button" data-hero-next data-dir="next" aria-label="다음 히어로 이미지" data-i18n-attr="aria-label:portal.heroNext"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button>` : '';

    return `<section class="portal-hero${regionalHero ? ' portal-hero--regional' : ''}" id="home" aria-labelledby="portal-title">
      <div class="portal-hero-media" aria-hidden="true">
        ${slides}
      </div>
      <div class="container portal-hero-content">
        <h1 id="portal-title"><span>${escapeHtml(eyebrow)}</span><strong>${escapeHtml(title)}</strong></h1>
        ${description ? `<p>${escapeHtml(description)}</p>` : ''}
        <div class="portal-hero-pagination" role="group" aria-label="히어로 배경 선택" data-i18n-attr="aria-label:portal.heroPicker">
          <div class="portal-hero-pagination-status" aria-hidden="true"><strong data-hero-current>01</strong><span class="portal-hero-pagination-track" data-hero-progress></span><strong data-hero-total>${String(slideCount).padStart(2, '0')}</strong></div>${controls}
        </div>
      </div>
      <nav class="portal-hero-quick portal-hero-quick--cards" id="portal-hero-quick" aria-label="주요 서비스 바로가기" data-i18n-attr="aria-label:portal.quickAria">
        <div class="container portal-hero-service-grid">${cards}</div>
      </nav>
    </section>`;
  }

  function renderGuideSection(data = {}) {
    const regionalGuide = data.homePage?.regionalGuide === true;
    const configuredCards = regionalGuide && Array.isArray(data.homePage?.guideCards)
      ? new Map(data.homePage.guideCards.map((item) => [item.id, item]))
      : new Map();
    const cards = [
      {
        id: 'identity',
        title: '신분증 지참',
        description: '승선 가능한 신분증 종류를 확인하세요.',
        portalHref: 'boarding/id.html',
        imageSrc: paths.asset('images/portal-guide-id-v4.png'),
        width: 1536,
        height: 1024,
        titleAttribute: ' data-i18n="portal.guideIdTitle"'
      },
      {
        id: 'schedule',
        title: '운항 상태 확인',
        description: '출발 전 결항·지연 여부를 확인하세요.',
        portalHref: 'schedule/operation.html',
        imageSrc: paths.asset('images/portal-guide-status-v2.jpg'),
        width: 1200,
        height: 800
      },
      {
        id: 'procedure',
        title: '승선 마감 시간 확인',
        description: '출발 1시간 전까지 터미널에 도착하세요.',
        portalHref: 'boarding/procedure.html',
        imageSrc: paths.asset('images/portal-guide-time-v2.jpg'),
        width: 1200,
        height: 800
      },
      {
        id: 'vehicle',
        title: '차량 선적 확인',
        description: '차량 예약과 접수 조건을 미리 확인하세요.',
        portalHref: 'boarding/vehicle.html',
        imageSrc: paths.asset('images/portal-guide-vehicle-v1.png'),
        width: 1536,
        height: 1024
      }
    ].map((card) => {
      const configured = configuredCards.get(card.id);
      return {
        ...card,
        title: localize(configured?.title) || card.title,
        description: localize(configured?.description) || card.description,
        href: configured?.href ? paths.regionPage(configured.href) : paths.portal(card.portalHref),
        titleAttribute: configured?.title ? '' : card.titleAttribute || ''
      };
    });
    const guideTitle = regionalGuide
      ? localize(data.guideTitle) || '여객선 이용 필수 가이드'
      : '여객선 이용 필수 가이드';

    return `<section class="portal-guide-section" id="portal-guide" aria-labelledby="portal-guide-title">
      <div class="container">
        <div class="section-title section-title--light section-title--left">
          <span class="section-title__eyebrow">FERRY GUIDE</span>
          <h2 class="section-title__title terminal-main-title" id="portal-guide-title"${regionalGuide ? '' : ' data-i18n="portal.guideTitle"'}>${escapeHtml(guideTitle)}</h2>
        </div>
        <div class="portal-guide-grid">${cards.map((card) => `
          <a class="portal-guide-item portal-guide-item--photo" href="${escapeHtml(card.href)}">
            <span class="portal-guide-photo" aria-hidden="true"><img src="${card.imageSrc}" alt="" width="${card.width}" height="${card.height}" loading="lazy" decoding="async"></span>
            <div class="portal-guide-copy"><div class="portal-guide-heading"><h3${card.titleAttribute}>${escapeHtml(card.title)}</h3><span class="portal-guide-arrow" aria-hidden="true">→</span></div><p>${escapeHtml(card.description)}</p></div>
          </a>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function renderNationalTerminalSection() {
    return `<section class="portal-terminal-section" id="portal-terminals" aria-labelledby="terminal-list-title">
      <div class="container">
        <div data-portal-map-root data-root-prefix="../../"></div>
      </div>
    </section>`;
  }

  function terminalPhone(terminal) {
    if (typeof terminal.tel === 'string') return terminal.tel;
    return terminal.tel?.main || terminal.tel?.ars || '';
  }

  function renderTerminalCards(data) {
    const terminals = Array.isArray(data.terminalProfiles) ? data.terminalProfiles : [];
    if (!terminals.length) return '<p class="region-home-overview-empty">터미널 정보 준비 중</p>';

    return terminals.map((terminal) => {
      const name = localize(terminal.name);
      const address = localize(terminal.address);
      const phone = terminalPhone(terminal);
      const photo = Array.isArray(terminal.photo) ? terminal.photo.find((item) => item?.src) : null;
      const detailTarget = `terminal-introduction.html${terminal.id ? `#${encodeURIComponent(terminal.id)}` : ''}`;
      const media = photo
        ? `<span class="region-home-terminal-card__media"><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(localize(photo.alt))}" loading="lazy" decoding="async"></span>`
        : `<span class="region-home-terminal-card__media region-home-terminal-card__media--icon">${quickIcon('terminal')}</span>`;
      const phoneDigits = String(phone).replace(/[^0-9+]/g, '');

      return `<article class="region-home-terminal-card">
        ${media}
        <div class="region-home-terminal-card__body">
          <h3>${escapeHtml(name)}</h3>
          <dl>
            ${address ? `<div><dt>주소</dt><dd>${escapeHtml(address)}</dd></div>` : ''}
            ${phone ? `<div><dt>연락처</dt><dd><a href="tel:${escapeHtml(phoneDigits)}">${escapeHtml(phone)}</a></dd></div>` : ''}
          </dl>
          <a class="region-home-terminal-card__link" href="${escapeHtml(paths.regionPage(detailTarget))}">상세 안내 <span aria-hidden="true">→</span></a>
        </div>
      </article>`;
    }).join('');
  }

  function validTimetablePeriods(scheduleData) {
    const periods = Array.isArray(scheduleData?.timetablePeriods) ? scheduleData.timetablePeriods : [];
    return periods.filter((period) => {
      if (!/^\d{4}-\d{2}$/.test(period?.id || '')) return false;
      return Array.isArray(period.groups) && period.groups.some((group) =>
        Array.isArray(group.rows) && group.rows.some((row) => row?.departure && row?.ports)
      );
    }).sort((a, b) => b.id.localeCompare(a.id));
  }

  function representativeSchedules(period) {
    if (!period) return [];
    return period.groups.map((group) => {
      const row = Array.isArray(group.rows)
        ? group.rows.find((item) => item?.departure && item?.ports)
        : null;
      return row ? { departure: row.departure, ports: row.ports, vessel: row.vessel || '' } : null;
    }).filter(Boolean).slice(0, 4);
  }

  function periodLabel(period) {
    const label = localize(period?.label) || String(period?.id || '').replace(/^(\d{4})-(\d{2})$/, '$1년 $2월');
    return label ? `${label.replace(/\s*기준$/, '')} 기준` : '';
  }

  function renderScheduleSummary(data, scheduleData) {
    const period = validTimetablePeriods(scheduleData)[0];
    const schedules = representativeSchedules(period);
    const scheduleTitle = localize(data.homePage?.scheduleSummaryTitle) || '여객선 운항정보 요약';
    const content = schedules.length
      ? `<p class="region-home-schedule-period">${escapeHtml(periodLabel(period))}</p>
        <ul class="region-home-schedule-list">${schedules.map((item) => `<li class="region-home-schedule-item">
          <div><strong>${escapeHtml(item.ports)}</strong>${item.vessel ? `<span>${escapeHtml(item.vessel)}</span>` : ''}</div>
          <time>${escapeHtml(item.departure)}</time>
        </li>`).join('')}</ul>`
      : '<p class="region-home-overview-empty">운항정보 준비 중</p>';

    return `<section class="region-home-schedule-panel" aria-labelledby="region-home-schedule-title">
      <div class="region-home-overview-heading">
        <div><span>SCHEDULE</span><h2 id="region-home-schedule-title">${escapeHtml(scheduleTitle)}</h2></div>
        <a class="btn btn--md btn--outline" href="${escapeHtml(paths.regionPage('timetable.html'))}">전체 운항시간표</a>
      </div>
      ${content}
    </section>`;
  }

  function renderRegionalOverview(data, scheduleData) {
    const terminalSectionTitle = localize(data.homePage?.regionalOverviewTitle) || '지역 터미널 안내';
    return `<section class="portal-terminal-section region-home-overview" id="portal-terminals" aria-labelledby="region-home-terminal-title region-home-schedule-title">
      <div class="container region-home-overview-grid">
        <section class="region-home-terminal-panel" aria-labelledby="region-home-terminal-title">
          <div class="region-home-overview-heading">
            <div><span>TERMINAL GUIDE</span><h2 id="region-home-terminal-title">${escapeHtml(terminalSectionTitle)}</h2></div>
          </div>
          <div class="region-home-terminal-list">${renderTerminalCards(data)}</div>
        </section>
        ${renderScheduleSummary(data, scheduleData)}
      </div>
    </section>`;
  }

  function renderTerminalSection(data = {}, scheduleData = {}) {
    return data.homePage?.regionalOverview === true
      ? renderRegionalOverview(data, scheduleData)
      : renderNationalTerminalSection();
  }

  function normalizeNotices(data) {
    const portalTerminals = window.PORTAL_NOTICE_DATA?.terminals || [];
    if (data.homePage?.regionalNotices === true) {
      const dateKey = (value) => {
        const match = /^(\d{4})[.-](\d{2})[.-](\d{2})$/.exec(String(value || ''));
        if (!match) return '';
        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const parsed = new Date(Date.UTC(year, month - 1, day));
        if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return '';
        return `${match[1]}${match[2]}${match[3]}`;
      };
      const titleKey = (title) => title.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ko-KR');
      let sourceOrder = 0;
      const regionalData = Array.isArray(data.notices) ? data.notices.map((notice) => {
        const objectNotice = notice && typeof notice === 'object' && notice.ko === undefined && notice.en === undefined;
        const title = localize(objectNotice ? notice.title : notice);
        return {
          category: objectNotice ? localize(notice.category) || '안내' : '안내',
          title,
          date: objectNotice ? notice.date || '' : '',
          noticeId: '',
          href: objectNotice && notice.href ? paths.regionPage(notice.href) : paths.portal('customer/notice.html'),
          sourceId: data.regionId || '',
          priority: 0,
          sourceOrder: sourceOrder++
        };
      }) : [];
      const portalNotices = portalTerminals
        .filter((terminal) => terminal.id === data.regionId || terminal.id === 'common')
        .flatMap((terminal) => (terminal.notices || []).map((notice, index) => ({
          category: terminal.label,
          title: localize(notice.title),
          date: notice.date || '',
          noticeId: notice.id || `${terminal.id}-${index + 1}`,
          href: `${paths.portal('customer/notice-detail.html')}?id=${encodeURIComponent(notice.id || `${terminal.id}-${index + 1}`)}`,
          sourceId: terminal.id,
          priority: terminal.id === data.regionId ? 0 : 1,
          sourceOrder: sourceOrder++
        })));
      const sorted = [...regionalData, ...portalNotices]
        .filter((notice) => notice.title)
        .sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          const aDate = dateKey(a.date);
          const bDate = dateKey(b.date);
          if (aDate && bDate && aDate !== bDate) return bDate.localeCompare(aDate);
          if (aDate !== bDate) return aDate ? -1 : 1;
          return a.sourceOrder - b.sourceOrder;
        });
      const usedTitles = new Set();
      return sorted.filter((notice) => {
        const key = titleKey(notice.title);
        if (usedTitles.has(key)) return false;
        usedTitles.add(key);
        return true;
      }).slice(0, 5);
    }
    if (portalTerminals.length) {
      return portalTerminals.flatMap((terminal) => terminal.notices.map((notice, index) => ({
        category: terminal.label,
        title: notice.title,
        date: notice.date,
        noticeId: notice.id || `${terminal.id}-${index + 1}`
      }))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    }
    const source = data.notices?.length ? data.notices : data._legacy?.notices || [];
    return source.slice(0, 5).map((notice) => {
      if (typeof notice === 'string' || notice?.ko !== undefined || notice?.en !== undefined) {
        return { category: '안내', title: localize(notice), date: '', noticeId: '' };
      }
      return {
        category: notice.category || '안내',
        title: localize(notice.title),
        date: notice.date || '',
        noticeId: notice.id || ''
      };
    });
  }

  function renderNoticeItems(data) {
    const notices = normalizeNotices(data);
    if (!notices.length) {
      return `<li><a href="${paths.portal('customer/notice.html')}"><span><b>등록된 공지사항이 없습니다.</b></span></a></li>`;
    }
    return notices.map((notice) => {
      const dateTime = /^\d{4}[.-]\d{2}[.-]\d{2}$/.test(notice.date || '') ? notice.date.replaceAll('.', '-') : '';
      const href = notice.href || (notice.noticeId ? `${paths.portal('customer/notice-detail.html')}?id=${encodeURIComponent(notice.noticeId)}` : paths.portal('customer/notice.html'));
      const external = /^(?:https?:)?\/\//i.test(href);
      const linkAttributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      const badgeClass = notice.sourceId === 'common' || notice.category === '공통' ? ' portal-content-badge--common' : ' portal-content-badge--terminal';
      return `<li><a href="${escapeHtml(href)}"${linkAttributes}><span><span class="portal-content-badge${badgeClass}">${escapeHtml(notice.category)}</span><b>${escapeHtml(notice.title)}</b></span>${notice.date ? `<time${dateTime ? ` datetime="${escapeHtml(dateTime)}"` : ''}>${escapeHtml(notice.date)}</time>` : ''}</a></li>`;
    }).join('');
  }

  function renderQuickGuideCards(data = {}) {
    const defaults = [
      {
        id: 'booking', variant: 'booking', title: '승선권 예매', description: '한국해운조합 승선권예매로 이동하세요',
        href: 'https://island.theksa.co.kr/', ariaLabel: '승선권 예매 사이트 새 창 열림',
        icon: '<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="icon-line" d="M6 13h36v7a4 4 0 0 0 0 8v7H6v-7a4 4 0 0 0 0-8v-7Z"/><path class="icon-detail" d="M18 13v22"/></svg>'
      },
      {
        id: 'support', variant: 'lost', title: '유실물 안내', description: '유실물 접수와 보관 장소를 확인하세요',
        href: paths.portal('customer/lost-found.html'),
        icon: '<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="icon-line" d="M7 17h27v24H7V17Z"/><path class="icon-line" d="M14 17v-4a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v4"/><path class="icon-detail" d="M13 23v11"/></svg>'
      },
      {
        id: 'contacts', variant: 'phone', title: '여객선 운항안내', description: '운항 안내 1544-1114로 문의하세요',
        href: 'tel:15441114', ariaLabel: '여객선 운항안내 1544-1114 전화 연결',
        icon: '<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="icon-line" d="m14 7-7 7c0 15 12 27 27 27l7-7-9-8-5 5c-4.7-2.1-7.9-5.3-10-10l5-5-8-9Z"/><path class="icon-detail" d="M29 10a10 10 0 0 1 9 9"/><path class="icon-detail" d="M29 15a5 5 0 0 1 4 4"/></svg>'
      }
    ];
    const configured = data.homePage?.dataDrivenQuickGuide === true && Array.isArray(data.homePage.quickGuideCards)
      ? new Map(data.homePage.quickGuideCards.map((card) => [card.id, card]))
      : new Map();

    return defaults.map((card) => {
      const override = configured.get(card.id);
      const href = override?.href ? paths.regionPage(override.href) : card.href;
      const title = localize(override?.title) || card.title;
      const description = localize(override?.description) || card.description;
      const external = /^(?:https?:)?\/\//i.test(href);
      const linkAttributes = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      const ariaLabel = override
        ? localize(override.ariaLabel) || (external ? `${title} 새 창 열림` : '')
        : card.ariaLabel || (external ? `${title} 새 창 열림` : '');
      return `<a class="portal-quick-guide-card portal-quick-guide-card--feature portal-quick-guide-card--${card.variant}" href="${escapeHtml(href)}"${linkAttributes}${ariaLabel ? ` aria-label="${escapeHtml(ariaLabel)}"` : ''}><span class="portal-quick-guide-copy"><span class="portal-quick-guide-title-row"><strong>${escapeHtml(title)}</strong></span><small>${escapeHtml(description)}</small></span><span class="portal-quick-guide-visual" aria-hidden="true">${card.icon}</span></a>`;
    }).join('');
  }

  function renderBottomInfo(data) {
    return `<section class="portal-guide-links portal-bottom-info" aria-labelledby="portal-latest-notice-title portal-quick-guide-title">
      <div class="container portal-bottom-info-grid">
        <div class="portal-bottom-column portal-bottom-column--notice">
          <div class="portal-info-card-head">
            <h2 class="terminal-main-title" id="portal-latest-notice-title">공지사항</h2>
            <a class="btn btn--md btn--outline" href="${paths.portal('customer/notice.html')}"><span>전체 보기</span><svg class="line-icon terminal-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></a>
          </div>
          <div class="portal-home-notice-card"><ul class="portal-home-notice-list" id="portal-latest-notice-list" aria-label="최신 공지사항 5건">${renderNoticeItems(data)}</ul></div>
        </div>
        <div class="portal-bottom-column">
          <h2 class="terminal-main-title sr-only" id="portal-quick-guide-title">빠른 안내</h2>
          <div class="portal-quick-guide-list">${renderQuickGuideCards(data)}</div>
        </div>
      </div>
    </section>`;
  }

  function renderFloatingQuick() {
    return `<aside class="portal-floating-quick" data-portal-floating-quick aria-label="빠른 메뉴">
      <div class="portal-floating-quick__panel" id="portal-floating-quick-panel">
        <strong class="portal-floating-quick__title">QUICK MENU</strong>
        <nav class="portal-floating-quick__links" aria-label="주요 서비스 바로가기">
          <a class="portal-floating-quick__link portal-floating-quick__link--booking" href="https://island.theksa.co.kr/" target="_blank" rel="noopener" aria-label="승선권 예매 사이트 새 창 열림"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5h16v4a2.5 2.5 0 0 0 0 5v2H4v-2a2.5 2.5 0 0 0 0-5v-4Z"/><path d="M9 6.5v11"/></svg><span>승선권 예매</span></a>
          <a class="portal-floating-quick__link" href="${paths.portal('schedule/operation.html')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v12H5z"/><path d="M8 4v5M16 4v5M5 11h14"/></svg><span>운항정보</span></a>
          <a class="portal-floating-quick__link" href="${paths.portal()}#portal-terminals"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg><span>터미널 찾기</span></a>
          <a class="portal-floating-quick__link" href="${paths.portal('customer.html')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13v-2a7 7 0 0 1 14 0v2"/><path d="M5 13H3v5h4v-5H5ZM19 13h2v5h-4v-5h2ZM17 18c0 2-2 3-5 3"/></svg><span>고객지원</span></a>
          <button class="portal-floating-quick__link portal-floating-quick__top" type="button" data-portal-quick-top aria-label="페이지 맨 위로 이동"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg><span>TOP</span></button>
        </nav>
      </div>
      <button class="portal-floating-quick__toggle" type="button" data-portal-quick-toggle aria-expanded="true" aria-controls="portal-floating-quick-panel"><span>퀵메뉴</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 5 5-5 5"/></svg></button>
    </aside>`;
  }

  window.RegionHome = { renderHero, renderTerminalSection, renderGuideSection, renderBottomInfo, renderFloatingQuick };
}());
