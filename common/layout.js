(function bootstrapI18n() {
  if (window.i18n) return;
  const source = document.currentScript && document.currentScript.src;
  if (!source || document.readyState !== 'loading') return;
  const base = source.slice(0, source.lastIndexOf('/') + 1);
  document.write(`<script src="${base}locales/ko.js"><\/script><script src="${base}locales/en.js"><\/script><script src="${base}i18n.js"><\/script>`);
}());

function renderSharedLayout() {
  'use strict';

  const t = window.i18n ? window.i18n.t : (key) => key;
  const localize = window.i18n ? window.i18n.localize : (value) => value && value.ko !== undefined ? value.ko : value;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function sharedHeader(options) {
    const { brandName, portal = false, guidePage = false, portalSection = '' } = options;
    const portalPages = {
      schedule: 'schedule.html',
      boarding: 'boarding.html',
      customer: 'customer.html'
    };
    const link = (section) => {
      if (portal) {
        if (section === 'schedule') return portalPages.schedule;
        if (section === 'boarding') return portalPages.boarding;
        if (section === 'notice') return `${portalPages.customer}#notice`;
        if (section === 'contact') return `${portalPages.customer}#contact`;
      }
      return guidePage ? `./index.html#${section}` : `#${section}`;
    };
    const detailLink = (section, anchor = '') => portal ? `${portalPages[section]}${anchor}` : link(section);
    const guideLink = (section) => {
      if (portal) return section === 'faq' ? `${portalPages.customer}#faq` : 'index.html#terminal-list-title';
      return guidePage ? `#${section}` : `./guide.html#${section}`;
    };
    const homeLink = portal ? 'index.html' : guidePage ? './index.html' : '#home';
    const portalLink = portal ? 'index.html#terminal-list-title' : '../index.html';
    const terminalRoot = portal ? '' : '../';
    const terminalOverviewLink = portal ? 'index.html#terminal-list-title' : '../index.html#terminal-list-title';
    const currentClass = (section) => {
      if (portal) {
        if (section === 'home' && !portalSection) return ' current';
        return portalSection === section ? ' current' : '';
      }
      if (section === 'home' && !guidePage) return ' current';
      if (section === 'terminal' && guidePage) return ' current';
      return '';
    };
    const brandContent = portal
      ? `<span class="portal-brand-assets" aria-hidden="true"><img class="portal-brand-image portal-brand-image--white" src="common/images/ksa-wordmark-white.png" alt=""><img class="portal-brand-image portal-brand-image--color" src="common/images/ksa-wordmark-color.png" alt=""></span><span class="portal-brand-wordmark">${escapeHtml(brandName)}</span>`
      : escapeHtml(brandName);
    const terminalMenuItems = `
      <a href="${terminalRoot}incheon/index.html"><span>인천항</span><i aria-hidden="true">→</i></a>
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>보령(대천항)</span><small>${t('common.ready')}</small></span>
      <a href="${terminalRoot}gunsan/index.html"><span>군산항</span><i aria-hidden="true">→</i></a>
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>목포항</span><small>${t('common.ready')}</small></span>
      <a href="${terminalRoot}wando/index.html"><span>완도항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}yeosu/index.html"><span>여수항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}tongyeong/index.html"><span>통영항</span><i aria-hidden="true">→</i></a>
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>부산항</span><small>${t('common.ready')}</small></span>
      <a href="${terminalRoot}pohang/index.html"><span>포항항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}jeju/index.html"><span>제주항</span><i aria-hidden="true">→</i></a>`;

    return `
      <header class="site-header" id="site-header">
        <div class="header-inner">
          <a class="brand-logo${portal ? ' portal-brand-logo' : ''}" href="${homeLink}" aria-label="${escapeHtml(brandName)} ${t('common.homeSuffix')}">${brandContent}</a>
          <nav class="gnb" id="main-nav" aria-label="${t('header.mainMenu')}">
            <ul class="gnb-list">
              <li class="gnb-item"><a class="gnb-link${currentClass('home')}" href="${homeLink}">${t('nav.home')}</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('schedule')}" data-mega="schedule" href="${link('schedule')}">${t('nav.schedule')}</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('boarding')}" data-mega="boarding" href="${link('boarding')}">${t('nav.boarding')}</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('terminal')}" data-mega="terminal" href="${portal ? 'index.html#terminal-list-title' : guidePage ? '#main' : './guide.html'}">${t('nav.terminal')}</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('customer')}" data-mega="contact" href="${portal ? portalPages.customer : link('contact')}">${t('nav.customer')}</a></li>
            </ul>
            <div class="mobile-menu-detail" aria-label="${t('header.mobileDetail')}">
              <strong>${t('header.quickMenu')}</strong>
              <a href="${link('schedule')}">${t('mega.realtime')}</a><a href="${link('boarding')}">${t('mega.process')}</a>
              <a href="${guideLink('directions')}">${t('mega.directions')}</a><a href="${link('notice')}">${t('mega.notices')}</a>
              <a href="${portalLink}">${t('footer.allTerminals')}</a>
            </div>
          </nav>
          <div class="header-utils">
            <div class="terminal-switcher">
              <button class="all-terminals-link" id="terminal-switcher-button" type="button" aria-expanded="false" aria-controls="terminal-switcher-menu"><span class="utility-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${t('header.allTerminals')}<span class="terminal-switcher-chevron" aria-hidden="true"></span></button>
              <div class="terminal-switcher-menu" id="terminal-switcher-menu" aria-hidden="true">
                <div class="terminal-switcher-head"><div><span>${t('header.network')}</span><strong>${t('header.terminalHomepage')}</strong></div><a href="${terminalOverviewLink}">${t('header.allMap')}</a></div>
                <div class="terminal-switcher-grid">${terminalMenuItems}</div>
              </div>
            </div>
            ${portal ? '' : `<button class="icon-button search-button" type="button" aria-label="${t('header.search')}"><span class="search-icon" aria-hidden="true"></span></button>`}
            <button class="language-button" type="button" aria-label="${t('header.language')}">KOR<span class="chevron" aria-hidden="true"></span></button>
            <button class="menu-button" type="button" aria-label="${t('header.menuOpen')}" aria-expanded="false" aria-controls="main-nav"><span></span></button>
          </div>
        </div>
        <div class="mega-menu" id="mega-menu" aria-hidden="true">
          <div class="mega-menu-inner">
            <div class="mega-intro"><span>MENU GUIDE</span><strong>${t('mega.intro').replaceAll('\n', '<br>')}</strong></div>
            <div class="mega-column"><h2>${t('nav.schedule')}</h2><a href="${detailLink('schedule', '#realtime')}">${t('mega.realtime')}</a><a href="${detailLink('schedule', '#planning')}">${t('mega.plan')}</a><a href="${detailLink('schedule', '#cancellation')}">${t('mega.cancellation')}</a></div>
            <div class="mega-column"><h2>${t('nav.boarding')}</h2><a href="${detailLink('boarding', '#process')}">${t('mega.process')}</a><a href="${detailLink('boarding', '#identity')}">${t('mega.identity')}</a><a href="${detailLink('boarding', '#baggage')}">${t('mega.baggage')}</a><a href="${detailLink('boarding', '#vehicle')}">${t('mega.vehicle')}</a></div>
            <div class="mega-column"><h2>${t('nav.terminal')}</h2><a href="${guideLink('directions')}">${t('mega.directions')}</a><a href="${guideLink('facilities')}">${t('mega.facilities')}</a><a href="${guideLink('parking')}">${t('mega.parking')}</a></div>
            <div class="mega-column"><h2>${t('nav.customer')}</h2><a href="${link('notice')}">${t('mega.notices')}</a><a href="${guideLink('faq')}">${t('mega.faq')}</a><a href="${link('contact')}">${t('mega.inquiry')}</a></div>
          </div>
        </div>
      </header>`;
  }

  function sharedFooter(data, guidePage = false) {
    const directionsLink = guidePage ? '#directions' : './guide.html#directions';
    const name = localize(data.name);
    return `
      <footer><div class="container footer-inner"><div><div class="footer-logo">${escapeHtml(name)}</div><div>${t('footer.phone')} ${escapeHtml(data.phone)}</div><div>© 2026 ${escapeHtml(data.englishName)}. All Rights Reserved.</div></div><div class="footer-links"><a href="#privacy">${t('footer.privacy')}</a><a href="#terms">${t('footer.terms')}</a><a href="${directionsLink}">${t('footer.directions')}</a><a href="../index.html">${t('footer.allTerminals')}</a></div></div></footer>`;
  }

  function sharedPortalFooter() {
    return `
      <footer class="portal-footer">
        <div class="container footer-inner">
          <div>
            <a class="footer-logo portal-footer-logo" href="index.html"><span class="portal-brand-assets" aria-hidden="true"><img class="portal-brand-image portal-brand-image--white" src="common/images/ksa-wordmark-white.png" alt=""><img class="portal-brand-image portal-brand-image--color" src="common/images/ksa-wordmark-color.png" alt=""></span><span>전국여객선터미널</span></a>
            <div>${t('footer.slogan')}</div>
            <div>© 2026 Passenger Terminal Guide. All Rights Reserved.</div>
          </div>
          <div class="footer-links"><a href="schedule.html">${t('portal.schedule')}</a><a href="boarding.html">${t('nav.boarding')}</a><a href="index.html#terminal-list-title">${t('nav.terminal')}</a><a href="customer.html">${t('nav.customer')}</a></div>
        </div>
      </footer>`;
  }

  function initializeHeader() {
    const header = document.querySelector('.site-header');
    const nav = header.querySelector('.gnb');
    const menuButton = header.querySelector('.menu-button');
    const megaMenu = header.querySelector('.mega-menu');
    const megaTriggers = [...header.querySelectorAll('.gnb-link[data-mega]')];
    const terminalSwitcher = header.querySelector('.terminal-switcher');
    const terminalSwitcherButton = header.querySelector('#terminal-switcher-button');
    const terminalSwitcherMenu = header.querySelector('#terminal-switcher-menu');

    function setTerminalSwitcher(open) {
      terminalSwitcher.classList.toggle('open', open);
      terminalSwitcherButton.setAttribute('aria-expanded', String(open));
      terminalSwitcherMenu.setAttribute('aria-hidden', String(!open));
    }

    function setMegaMenu(open) {
      if (window.innerWidth <= 1000) return;
      if (open) setTerminalSwitcher(false);
      header.classList.toggle('mega-open', open);
      megaMenu.setAttribute('aria-hidden', String(!open));
    }

    megaTriggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', () => setMegaMenu(true));
      trigger.addEventListener('focus', () => setMegaMenu(true));
    });
    header.addEventListener('mouseleave', () => setMegaMenu(false));
    header.addEventListener('focusout', () => window.setTimeout(() => {
      if (!header.contains(document.activeElement)) {
        setMegaMenu(false);
        setTerminalSwitcher(false);
      }
    }, 0));

    terminalSwitcherButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = !terminalSwitcher.classList.contains('open');
      setMegaMenu(false);
      setTerminalSwitcher(open);
    });
    terminalSwitcherMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setTerminalSwitcher(false);
    });
    document.addEventListener('click', (event) => {
      if (!terminalSwitcher.contains(event.target)) setTerminalSwitcher(false);
    });

    menuButton.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? t('header.menuClose') : t('header.menuOpen'));
      document.body.classList.toggle('menu-open', open);
    });

    nav.addEventListener('click', (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) return;
      header.querySelectorAll('.gnb-link').forEach((item) => item.classList.remove('current'));
      if (anchor.classList.contains('gnb-link')) anchor.classList.add('current');
      if (window.innerWidth <= 1000) {
        nav.classList.remove('open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      setMegaMenu(false);
      setTerminalSwitcher(false);
      nav.classList.remove('open');
      menuButton.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });

    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) {
        nav.classList.remove('open');
        menuButton.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      } else {
        setMegaMenu(false);
        setTerminalSwitcher(false);
      }
    });
  }

  if (document.body.classList.contains('portal-page')) {
    if (window.i18n) window.i18n.translateDocument(document);
    const portalHeaderRoot = document.getElementById('portal-header-root');
    const portalFooterRoot = document.getElementById('portal-footer-root');
    const portalSection = document.body.dataset.portalSection || '';
    if (portalHeaderRoot) {
      portalHeaderRoot.outerHTML = sharedHeader({ brandName: t('portal.metaTitle').replace(' 안내', ''), portal: true, portalSection });
      initializeHeader();
    }
    if (portalFooterRoot) portalFooterRoot.outerHTML = sharedPortalFooter();
    return;
  }

  const data = window.terminalData;
  const app = document.getElementById('app');
  if (!data || !app) throw new Error('terminalData와 #app 요소가 필요합니다.');

  const terminalName = localize(data.name);

  if (document.body.classList.contains('guide-page')) {
    // guide.js is intentionally outside the first i18n migration scope.
    data.name = terminalName;
    document.title = `터미널 이용안내 | ${terminalName}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${terminalName} 오시는 길, 주차, 발권, 편의시설 등 터미널 이용안내입니다.`;
    app.innerHTML = `
      <a class="skip-link" href="#main">${t('common.skip')}</a>
      ${sharedHeader({ brandName: terminalName, guidePage: true })}
      <main id="main"><div id="terminal-guide-page"></div></main>
      ${sharedFooter(data, true)}`;
    initializeHeader();
    return;
  }

  const boardingCards = data.boardingCards.map((card, index) => `
    <article class="guide-card"><span class="guide-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(localize(card.title))}</h3><p>${escapeHtml(localize(card.description))}</p></article>`).join('');
  const notices = data.notices.map((notice, index) => `
    <li><a href="#notice"><span class="news-tag${index === 0 ? ' important' : ''}">${escapeHtml(localize(notice.category))}</span><span class="news-title">${escapeHtml(localize(notice.title))}</span><time class="news-date" datetime="${escapeHtml(notice.date.replaceAll('.', '-'))}">${escapeHtml(notice.date)}</time></a></li>`).join('');

  document.title = terminalName;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${terminalName} 운항 정보, 승선 안내, 터미널 이용 정보를 확인하세요.`;

  app.innerHTML = `
    <a class="skip-link" href="#main">${t('common.skip')}</a>
    ${sharedHeader({ brandName: terminalName })}
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title"><div class="container"><div class="hero-content">
        <span class="eyebrow">WELCOME TO ${escapeHtml(data.englishName)}</span><h1 id="hero-title">${escapeHtml(localize(data.heroTitle)).replaceAll('\n', '<br>')}</h1>
        <p>${escapeHtml(localize(data.heroDescription)).replaceAll('\n', '<br>')}</p><a class="button button-primary" href="#schedule">${t('terminalPage.heroButton')}</a>
      </div></div></section>
      <div class="quick-wrap" aria-label="${t('terminalPage.quickAria')}"><div class="container quick-grid">
        <a class="quick-card" href="#schedule"><span class="quick-icon" aria-hidden="true">◷</span><span><strong>${t('terminalPage.timetable')}</strong><small>${t('terminalPage.timetableDesc')}</small></span></a>
        <a class="quick-card" href="#fare"><span class="quick-icon" aria-hidden="true">₩</span><span><strong>${t('terminalPage.fare')}</strong><small>${t('terminalPage.fareDesc')}</small></span></a>
        <a class="quick-card" href="#boarding"><span class="quick-icon" aria-hidden="true">✓</span><span><strong>${t('terminalPage.boarding')}</strong><small>${t('terminalPage.boardingDesc')}</small></span></a>
        <a class="quick-card" href="./guide.html#directions"><span class="quick-icon" aria-hidden="true">⌖</span><span><strong>${t('terminalPage.directions')}</strong><small>${t('terminalPage.directionsDesc')}</small></span></a>
      </div></div>
      <section id="schedule" class="section-soft" aria-labelledby="schedule-title"></section>
      ${data.terminalGuide ? '<section id="terminal-guide" aria-labelledby="terminal-guide-title"></section>' : ''}
      <section id="boarding" aria-labelledby="boarding-title"><div class="container guide-layout">
        <div class="guide-intro"><p class="section-kicker">BOARDING GUIDE</p><h2 id="boarding-title">${t('terminalPage.boardingTitle').replaceAll('\n', '<br>')}</h2><p>${escapeHtml(localize(data.boardingIntro))}</p><a class="button button-outline" href="#boarding-detail">${t('terminalPage.boardingMore')}</a></div>
        <div class="guide-grid" id="boarding-detail">${boardingCards}</div>
      </div></section>
      <section id="notice" class="section-soft" aria-labelledby="notice-title"><div class="container">
        <div class="section-head"><div><p class="section-kicker">NEWS & NOTICE</p><h2 id="notice-title">${t('terminalPage.notices')}</h2></div><a href="#notice" aria-label="${t('terminalPage.noticeAll')}">${t('terminalPage.allView')}</a></div>
        <div class="news-layout"><ul class="news-list">${notices}</ul><aside class="contact-card" id="contact" aria-labelledby="contact-title">
          <span class="label">CUSTOMER CENTER</span><h3 id="contact-title">${t('terminalPage.customer')}</h3><p class="contact-number">${escapeHtml(data.phone)}</p><p>${t('terminalPage.customerHelp')}</p><hr><p><strong>${t('terminalPage.counselingHours')}</strong><br>${escapeHtml(localize(data.hours))}</p>
        </aside></div>
      </div></section>
      <section class="terminal" id="terminal" aria-labelledby="terminal-title"><div class="container terminal-grid">
        <div><p class="section-kicker">TERMINAL INFO</p><h2 id="terminal-title">${escapeHtml(terminalName)} ${t('terminalPage.infoSuffix')}</h2>${data.routeIntro ? `<p class="section-desc">${escapeHtml(localize(data.routeIntro))}</p>` : ''}</div>
        <div class="info-block"><strong>${t('terminalPage.address')}</strong><p>${escapeHtml(localize(data.address)).replaceAll('\n', '<br>')}</p></div><div class="info-block"><strong>${t('terminalPage.hours')}</strong><p>${escapeHtml(localize(data.hours)).replaceAll('\n', '<br>')}</p></div><div class="info-block" id="fare"><strong>${t('terminalPage.parking')}</strong><p>${escapeHtml(localize(data.parking)).replaceAll('\n', '<br>')}</p></div>
      </div></section>
    </main>
    ${sharedFooter(data)}`;

  initializeHeader();
}

if (window.i18n) renderSharedLayout();
else document.addEventListener('i18n:ready', renderSharedLayout, { once: true });
