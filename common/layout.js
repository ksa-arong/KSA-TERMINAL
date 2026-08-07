(function () {
  'use strict';

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
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>보령(대천항)</span><small>준비중</small></span>
      <a href="${terminalRoot}gunsan/index.html"><span>군산항</span><i aria-hidden="true">→</i></a>
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>목포항</span><small>준비중</small></span>
      <a href="${terminalRoot}wando/index.html"><span>완도항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}yeosu/index.html"><span>여수항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}tongyeong/index.html"><span>통영항</span><i aria-hidden="true">→</i></a>
      <span class="terminal-switcher-disabled" aria-disabled="true"><span>부산항</span><small>준비중</small></span>
      <a href="${terminalRoot}pohang/index.html"><span>포항항</span><i aria-hidden="true">→</i></a>
      <a href="${terminalRoot}jeju/index.html"><span>제주항</span><i aria-hidden="true">→</i></a>`;

    return `
      <header class="site-header" id="site-header">
        <div class="header-inner">
          <a class="brand-logo${portal ? ' portal-brand-logo' : ''}" href="${homeLink}" aria-label="${escapeHtml(brandName)} 홈">${brandContent}</a>
          <nav class="gnb" id="main-nav" aria-label="주요 메뉴">
            <ul class="gnb-list">
              <li class="gnb-item"><a class="gnb-link${currentClass('home')}" href="${homeLink}">홈</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('schedule')}" data-mega="schedule" href="${link('schedule')}">운항 안내</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('boarding')}" data-mega="boarding" href="${link('boarding')}">승선 안내</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('terminal')}" data-mega="terminal" href="${portal ? 'index.html#terminal-list-title' : guidePage ? '#main' : './guide.html'}">터미널 안내</a></li>
              <li class="gnb-item"><a class="gnb-link${currentClass('customer')}" data-mega="contact" href="${portal ? portalPages.customer : link('contact')}">고객센터</a></li>
            </ul>
            <div class="mobile-menu-detail" aria-label="모바일 세부 메뉴">
              <strong>빠른 메뉴</strong>
              <a href="${link('schedule')}">실시간 운항정보</a><a href="${link('boarding')}">승선 절차</a>
              <a href="${guideLink('directions')}">오시는 길</a><a href="${link('notice')}">공지사항</a>
              <a href="${portalLink}">전체 터미널 보기</a>
            </div>
          </nav>
          <div class="header-utils">
            <div class="terminal-switcher">
              <button class="all-terminals-link" id="terminal-switcher-button" type="button" aria-expanded="false" aria-controls="terminal-switcher-menu"><span class="utility-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>전체 터미널<span class="terminal-switcher-chevron" aria-hidden="true"></span></button>
              <div class="terminal-switcher-menu" id="terminal-switcher-menu" aria-hidden="true">
                <div class="terminal-switcher-head"><div><span>TERMINAL NETWORK</span><strong>터미널 홈페이지</strong></div><a href="${terminalOverviewLink}">전체 지도 보기</a></div>
                <div class="terminal-switcher-grid">${terminalMenuItems}</div>
              </div>
            </div>
            ${portal ? '' : '<button class="icon-button search-button" type="button" aria-label="검색"><span class="search-icon" aria-hidden="true"></span></button>'}
            <button class="language-button" type="button" aria-label="언어 선택">KOR<span class="chevron" aria-hidden="true"></span></button>
            <button class="menu-button" type="button" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="main-nav"><span></span></button>
          </div>
        </div>
        <div class="mega-menu" id="mega-menu" aria-hidden="true">
          <div class="mega-menu-inner">
            <div class="mega-intro"><span>MENU GUIDE</span><strong>여객선 이용에 필요한<br>정보를 한눈에 확인하세요.</strong></div>
            <div class="mega-column"><h2>운항 안내</h2><a href="${detailLink('schedule', '#realtime')}">실시간 운항정보</a><a href="${detailLink('schedule', '#planning')}">운항계획 확인</a><a href="${detailLink('schedule', '#cancellation')}">결항 안내</a></div>
            <div class="mega-column"><h2>승선 안내</h2><a href="${detailLink('boarding', '#process')}">승선 절차</a><a href="${detailLink('boarding', '#identity')}">신분증 안내</a><a href="${detailLink('boarding', '#baggage')}">수하물 안내</a><a href="${detailLink('boarding', '#vehicle')}">차량 선적</a></div>
            <div class="mega-column"><h2>터미널 안내</h2><a href="${guideLink('directions')}">오시는 길</a><a href="${guideLink('facilities')}">편의시설</a><a href="${guideLink('parking')}">주차 안내</a></div>
            <div class="mega-column"><h2>고객센터</h2><a href="${link('notice')}">공지사항</a><a href="${guideLink('faq')}">자주 묻는 질문</a><a href="${link('contact')}">문의하기</a></div>
          </div>
        </div>
      </header>`;
  }

  function sharedFooter(data, guidePage = false) {
    const directionsLink = guidePage ? '#directions' : './guide.html#directions';
    return `
      <footer><div class="container footer-inner"><div><div class="footer-logo">${escapeHtml(data.name)}</div><div>대표전화 ${escapeHtml(data.phone)}</div><div>© 2026 ${escapeHtml(data.englishName)}. All Rights Reserved.</div></div><div class="footer-links"><a href="#privacy">개인정보처리방침</a><a href="#terms">이용약관</a><a href="${directionsLink}">찾아오시는 길</a><a href="../index.html">전체 터미널 보기</a></div></div></footer>`;
  }

  function sharedPortalFooter() {
    return `
      <footer class="portal-footer">
        <div class="container footer-inner">
          <div>
            <a class="footer-logo portal-footer-logo" href="index.html"><span class="portal-brand-assets" aria-hidden="true"><img class="portal-brand-image portal-brand-image--white" src="common/images/ksa-wordmark-white.png" alt=""><img class="portal-brand-image portal-brand-image--color" src="common/images/ksa-wordmark-color.png" alt=""></span><span>전국여객선터미널</span></a>
            <div>안전하고 편리한 바닷길 통합 안내</div>
            <div>© 2026 Passenger Terminal Guide. All Rights Reserved.</div>
          </div>
          <div class="footer-links"><a href="schedule.html">운항정보</a><a href="boarding.html">승선 안내</a><a href="index.html#terminal-list-title">터미널 안내</a><a href="customer.html">고객센터</a></div>
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
      menuButton.setAttribute('aria-label', open ? '전체 메뉴 닫기' : '전체 메뉴 열기');
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
    const portalHeaderRoot = document.getElementById('portal-header-root');
    const portalFooterRoot = document.getElementById('portal-footer-root');
    const portalSection = document.body.dataset.portalSection || '';
    if (portalHeaderRoot) {
      portalHeaderRoot.outerHTML = sharedHeader({ brandName: '전국여객선터미널', portal: true, portalSection });
      initializeHeader();
    }
    if (portalFooterRoot) portalFooterRoot.outerHTML = sharedPortalFooter();
    return;
  }

  const data = window.terminalData;
  const app = document.getElementById('app');
  if (!data || !app) throw new Error('terminalData와 #app 요소가 필요합니다.');

  if (document.body.classList.contains('guide-page')) {
    document.title = `터미널 이용안내 | ${data.name}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${data.name} 오시는 길, 주차, 발권, 편의시설 등 터미널 이용안내입니다.`;
    app.innerHTML = `
      <a class="skip-link" href="#main">본문 바로가기</a>
      ${sharedHeader({ brandName: data.name, guidePage: true })}
      <main id="main"><div id="terminal-guide-page"></div></main>
      ${sharedFooter(data, true)}`;
    initializeHeader();
    return;
  }

  const boardingCards = data.boardingCards.map((card, index) => `
    <article class="guide-card"><span class="guide-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.description)}</p></article>`).join('');
  const notices = data.notices.map((notice, index) => `
    <li><a href="#notice"><span class="news-tag${index === 0 ? ' important' : ''}">${escapeHtml(notice.category)}</span><span class="news-title">${escapeHtml(notice.title)}</span><time class="news-date" datetime="${escapeHtml(notice.date.replaceAll('.', '-'))}">${escapeHtml(notice.date)}</time></a></li>`).join('');

  document.title = data.name;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${data.name} 운항 정보, 승선 안내, 터미널 이용 정보를 확인하세요.`;

  app.innerHTML = `
    <a class="skip-link" href="#main">본문 바로가기</a>
    ${sharedHeader({ brandName: data.name })}
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title"><div class="container"><div class="hero-content">
        <span class="eyebrow">WELCOME TO ${escapeHtml(data.englishName)}</span><h1 id="hero-title">${escapeHtml(data.heroTitle).replaceAll('\n', '<br>')}</h1>
        <p>${escapeHtml(data.heroDescription).replaceAll('\n', '<br>')}</p><a class="button button-primary" href="#schedule">오늘의 운항 현황 보기</a>
      </div></div></section>
      <div class="quick-wrap" aria-label="주요 바로가기"><div class="container quick-grid">
        <a class="quick-card" href="#schedule"><span class="quick-icon" aria-hidden="true">◷</span><span><strong>운항 시간표</strong><small>항로별 출발 시간을 확인하세요</small></span></a>
        <a class="quick-card" href="#fare"><span class="quick-icon" aria-hidden="true">₩</span><span><strong>요금 안내</strong><small>승객·차량 요금을 안내합니다</small></span></a>
        <a class="quick-card" href="#boarding"><span class="quick-icon" aria-hidden="true">✓</span><span><strong>승선 절차 안내</strong><small>출항 전 절차를 확인하세요</small></span></a>
        <a class="quick-card" href="./guide.html#directions"><span class="quick-icon" aria-hidden="true">⌖</span><span><strong>오시는 길</strong><small>교통편과 위치를 안내합니다</small></span></a>
      </div></div>
      <section id="schedule" class="section-soft" aria-labelledby="schedule-title"></section>
      ${data.terminalGuide ? '<section id="terminal-guide" aria-labelledby="terminal-guide-title"></section>' : ''}
      <section id="boarding" aria-labelledby="boarding-title"><div class="container guide-layout">
        <div class="guide-intro"><p class="section-kicker">BOARDING GUIDE</p><h2 id="boarding-title">편안한 여행을 위한<br>승선 안내</h2><p>${escapeHtml(data.boardingIntro)}</p><a class="button button-outline" href="#boarding-detail">승선안내 자세히 보기</a></div>
        <div class="guide-grid" id="boarding-detail">${boardingCards}</div>
      </div></section>
      <section id="notice" class="section-soft" aria-labelledby="notice-title"><div class="container">
        <div class="section-head"><div><p class="section-kicker">NEWS & NOTICE</p><h2 id="notice-title">공지사항</h2></div><a href="#notice" aria-label="공지사항 전체 보기">전체 보기 ＋</a></div>
        <div class="news-layout"><ul class="news-list">${notices}</ul><aside class="contact-card" id="contact" aria-labelledby="contact-title">
          <span class="label">CUSTOMER CENTER</span><h3 id="contact-title">고객센터</h3><p class="contact-number">${escapeHtml(data.phone)}</p><p>운항 및 터미널 이용에 궁금한 점이 있으시면 편하게 문의해 주세요.</p><hr><p><strong>상담시간</strong><br>${escapeHtml(data.hours)}</p>
        </aside></div>
      </div></section>
      <section class="terminal" id="terminal" aria-labelledby="terminal-title"><div class="container terminal-grid">
        <div><p class="section-kicker">TERMINAL INFO</p><h2 id="terminal-title">${escapeHtml(data.name)} 안내</h2>${data.routeIntro ? `<p class="section-desc">${escapeHtml(data.routeIntro)}</p>` : ''}</div>
        <div class="info-block"><strong>주소</strong><p>${escapeHtml(data.address).replaceAll('\n', '<br>')}</p></div><div class="info-block"><strong>운영시간</strong><p>${escapeHtml(data.hours).replaceAll('\n', '<br>')}</p></div><div class="info-block" id="fare"><strong>주차 안내</strong><p>${escapeHtml(data.parking).replaceAll('\n', '<br>')}</p></div>
      </div></section>
    </main>
    ${sharedFooter(data)}`;

  initializeHeader();
})();
