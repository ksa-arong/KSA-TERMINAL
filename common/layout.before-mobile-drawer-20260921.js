function renderSharedLayout() {
  'use strict';

  const t = window.i18n ? window.i18n.t : (key) => key;
  const localize = window.i18n ? window.i18n.localize : (value) => value && value.ko !== undefined ? value.ko : value;
  const currentYear = new Date().getFullYear();
  const resolveText = (value) => value && typeof value === 'object' && value.key ? t(value.key) : localize(value);
  const menuData = Array.isArray(window.MENU_DATA) ? window.MENU_DATA : [];

  const escapeHtml = window.PortalDomUtils.escapeHtml;

  const menuSurfaceItems = (surface) => menuData
    .filter((item) => !item.hidden && item[surface])
    .sort((a, b) => a[surface].order - b[surface].order)
    .map((item) => item[surface]);
  const portalExternalAttributes = (item) => item.external ? ` target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${t(item.labelKey)} (${t('common.newWindow')})`)}"` : '';
  const withRootPrefix = (href, rootPrefix = '') => {
    if (!rootPrefix || href.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(href)) return href;
    return `${rootPrefix}${href}`;
  };

  const portalQuickIconPaths = {
    terminal: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    schedule: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    booking: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M12 8v2m0 4v2"/>',
    customer: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 1Zm16 0v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 1Z"/>'
  };

  const renderPortalQuickIcon = (name) => `<svg class="line-icon line-icon--large portal-quick-icon portal-quick-icon--${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${portalQuickIconPaths[name] || portalQuickIconPaths.terminal}</svg>`;

  function renderPortalQuickMenu() {
    const quickItems = menuSurfaceItems('quick').map((item, index) => `<a class="portal-hero-service-card portal-hero-service-card--${index + 1}" href="${item.href}"${portalExternalAttributes(item)}>${renderPortalQuickIcon(item.icon)}<strong data-i18n="${item.labelKey}">${t(item.labelKey)}</strong><small data-i18n="${item.descriptionKey}">${t(item.descriptionKey)}</small></a>`).join('');
    return `<div class="container portal-hero-service-grid">${quickItems}</div>`;
  }

  function sharedHeader(options) {
    const { brandName, portal = false, guidePage = false, portalSection = '', rootPrefix = '' } = options;
    const homeLink = portal ? withRootPrefix('index.html', rootPrefix) : guidePage ? './index.html' : '#home';
    const terminalRoot = portal ? rootPrefix : '../';
    const terminalOverviewLink = portal ? withRootPrefix('terminal/terminal-list.html', rootPrefix) : '../terminal/terminal-list.html';
    const currentClass = (section) => {
      if (portal) {
        if (section === 'terminal' && !portalSection) return ' current';
        return portalSection === section ? ' current' : '';
      }
      if (section === 'home' && !guidePage) return ' current';
      if (section === 'terminal' && guidePage) return ' current';
      return '';
    };
    const menuItems = menuData.map((item) => portal ? item : item.terminal).filter((item) => item && !item.hidden);
    const resolveMenuHref = (href) => {
      if (portal) return withRootPrefix(href, rootPrefix);
      if (!href.startsWith('{terminal}/')) return href;
      const relative = href.slice('{terminal}/'.length);
      if (relative.startsWith('index.html#')) return guidePage ? `./${relative}` : `#${relative.split('#')[1]}`;
      if (relative === 'guide.html#main') return guidePage ? '#main' : './guide.html';
      if (relative.startsWith('guide.html#')) return guidePage ? `#${relative.split('#')[1]}` : `./${relative}`;
      return `./${relative}`;
    };
    const externalAttributes = (item) => portalExternalAttributes(item);
    const externalLinkIcon = '<svg class="mega-menu-external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"></path><path d="m10 14 11-11"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>';
    const renderGnbItems = () => menuItems.map((item) => {
      const current = Boolean(currentClass(item.currentSection || ''));
      return `
      <li class="gnb-item"><a class="gnb-link${current ? ' current' : ''}" data-mega="${item.id}" href="${resolveMenuHref(item.href)}"${externalAttributes(item)}${current ? ' aria-current="page"' : ''}>${t(item.labelKey)}</a></li>`;
    }).join('');
    const renderMobileDetail = () => `
      <div class="mobile-menu-detail" aria-label="${t('header.mobileDetail')}">
        ${menuItems.map((item) => `<section><strong>${t(item.labelKey)}</strong>${item.children.filter((child) => !child.hidden).map((child) => `<a href="${resolveMenuHref(child.href)}"${externalAttributes(child)}>${t(child.labelKey)}</a>`).join('')}</section>`).join('')}
      </div>`;
    const renderMobileUtility = () => `
      <nav class="mobile-menu-utility" aria-label="${t('header.quickMenu')}">
        <a href="${resolveMenuHref('privacy.html')}">${t('footer.privacy')}</a>
        <a href="${resolveMenuHref('terms.html')}">${t('footer.terms')}</a>
        <a href="${terminalOverviewLink}">${t('footer.allTerminals')}</a>
      </nav>`;
    const renderMegaMenu = () => `
      <div class="container mega-menu-inner ${portal ? 'portal-mega-menu-inner' : 'terminal-mega-menu-inner'}">
        ${menuItems.map((item) => `<div class="mega-column" role="group" aria-label="${escapeHtml(t(item.labelKey))}">${item.children.filter((child) => !child.hidden).map((child) => `<a${child.external ? ' class="mega-menu-external-link"' : ''} href="${resolveMenuHref(child.href)}"${externalAttributes(child)}><span>${t(child.labelKey)}</span>${child.external ? externalLinkIcon : ''}</a>`).join('')}</div>`).join('')}
      </div>`;
    const brandContent = portal
      ? `<span class="portal-header-brand-assets" aria-hidden="true"><img class="portal-header-brand-image" src="${withRootPrefix('common/images/logo.png', rootPrefix)}" alt="" width="954" height="196"></span>`
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

    const gnbItems = renderGnbItems();
    const mobileDetail = renderMobileDetail();
    const mobileUtility = renderMobileUtility();
    const megaMenuContent = renderMegaMenu();
    return `
      <header class="site-header" id="site-header">
        <div class="container header-inner">
          <a class="brand-logo${portal ? ' portal-brand-logo' : ''}" href="${homeLink}" aria-label="${escapeHtml(brandName)} ${t('common.homeSuffix')}">${brandContent}</a>
          <nav class="gnb" id="main-nav" aria-label="${t('header.mainMenu')}">
            <ul class="gnb-list">
              ${gnbItems}

            </ul>
            ${mobileDetail}
            ${mobileUtility}
          </nav>
          <div class="header-utils">
            <div class="terminal-switcher">
              <button class="all-terminals-link" id="terminal-switcher-button" type="button" aria-expanded="false" aria-controls="terminal-switcher-menu"><span class="utility-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${t('header.allTerminals')}<span class="terminal-switcher-chevron" aria-hidden="true"></span></button>
              <div class="terminal-switcher-menu" id="terminal-switcher-menu" aria-hidden="true">
                <div class="terminal-switcher-head"><strong>${t('header.terminalHomepage')}</strong></div>
                <div class="terminal-switcher-grid">${terminalMenuItems}</div>
              </div>
            </div>
            ${portal ? '' : `<button class="icon-button search-button" type="button" aria-label="${t('header.search')}"><span class="search-icon" aria-hidden="true"></span></button>`}
            <button class="menu-button" type="button" aria-label="${t('header.menuOpen')}" aria-expanded="false" aria-controls="main-nav"><span></span></button>
          </div>
        </div>
        <div class="mega-menu" id="mega-menu" aria-hidden="true">
          ${megaMenuContent}
        </div>
      </header>`;
  }

  function sharedTerminalFooter(data, guidePage = false) {
    const directionsLink = guidePage ? '#directions' : './guide.html#directions';
    const name = localize(data.name);
    return `
      <footer class="terminal-footer"><div class="container terminal-footer-inner"><div><div class="terminal-footer-logo">${escapeHtml(name)}</div><div>${t('footer.phone')} ${escapeHtml(data.phone)}</div><div>© ${currentYear} ${escapeHtml(data.englishName)}. All Rights Reserved.</div></div><div class="terminal-footer-links"><a href="../privacy.html">${t('footer.privacy')}</a><a href="../terms.html">${t('footer.terms')}</a><a href="../sitemap.html">${t('footer.sitemap')}</a><a href="${directionsLink}">${t('footer.directions')}</a><a href="../index.html">${t('footer.allTerminals')}</a></div></div></footer>`;
  }

  function sharedSiteFooter(rootPrefix = '') {
    const terminalOptions = [
      ['incheon/index.html', '인천항'], ['gunsan/index.html', '군산항'], ['wando/index.html', '완도항'],
      ['yeosu/index.html', '여수항'], ['tongyeong/index.html', '통영항'], ['pohang/index.html', '포항항'], ['jeju/index.html', '제주항']
    ].map(([href, label]) => `<option value="${withRootPrefix(href, rootPrefix)}">${label}</option>`).join('');
    const relatedOptions = [
      ['https://www.theksa.or.kr/', '한국해운조합'],
      ['https://island.theksa.co.kr/', 'KSA여객선예매'],
      ['https://www.mof.go.kr/', '해양수산부']
    ].map(([href, label]) => `<option value="${href}">${label}</option>`).join('');
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="site-footer-top">
            <nav class="site-footer-policy" aria-label="정책 및 이용 안내">
              <a class="is-emphasis" href="${withRootPrefix('privacy.html', rootPrefix)}">${t('footer.privacy')}</a>
              <a href="${withRootPrefix('terms.html', rootPrefix)}">${t('footer.terms')}</a>
              <a href="${withRootPrefix('sitemap.html', rootPrefix)}">${t('footer.sitemap')}</a>
            </nav>
          </div>
          <div class="site-footer-main">
            <div class="site-footer-company">
              <a class="site-footer-logo" href="${withRootPrefix('index.html', rootPrefix)}" aria-label="전국여객선터미널 홈">
                <img class="site-footer-brand-image" src="${withRootPrefix('common/images/logo.png', rootPrefix)}" alt="" width="954" height="196">
              </a>
              <p class="site-footer-contact"><strong>전국여객선운항안내</strong><a href="tel:1544-1114">1544-1114</a></p>
              <address class="site-footer-address">
                <span>[07590] 서울특별시 강서구 공항대로 379</span>
                <span>TEL : <a href="tel:02-6096-2000">02-6096-2000</a></span>
                <span>FAX : 02-6096-2259</span>
              </address>
              <p class="site-footer-copyright">COPYRIGHT(C)${currentYear} KOREA SHIPPING ASSOCIATION. ALL RIGHTS RESERVED.</p>
            </div>
            <div class="site-footer-selects">
              <label class="site-footer-select"><span class="sr-only">터미널 바로가기</span><select class="site-footer-terminal-select"><option value="">터미널 바로가기</option>${terminalOptions}</select></label>
              <label class="site-footer-select"><span class="sr-only">관련사이트</span><select class="site-footer-related-select"><option value="">관련사이트</option>${relatedOptions}</select></label>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function initializeSiteFooter() {
    const terminalSelect = document.querySelector('.site-footer-terminal-select');
    const relatedSelect = document.querySelector('.site-footer-related-select');
    terminalSelect?.addEventListener('change', () => {
      if (terminalSelect.value) window.location.href = terminalSelect.value;
    });
    relatedSelect?.addEventListener('change', () => {
      if (relatedSelect.value) window.open(relatedSelect.value, '_blank', 'noopener,noreferrer');
      relatedSelect.value = '';
    });
  }
  function getPortalMenuContext(menuId = '') {
    const [parentId, childId = ''] = String(menuId).split('/');
    const parent = menuData.find((item) => item.id === parentId);
    if (!parent) throw new Error(`MENU_DATA에서 ${menuId} 메뉴를 찾을 수 없습니다.`);
    const child = childId ? parent.children.find((item) => item.id === childId) : null;
    if (childId && !child) throw new Error(`MENU_DATA에서 ${menuId} 메뉴를 찾을 수 없습니다.`);
    return { parent, child };
  }

  function renderPortalPreparingBlock(options, rootPrefix = '') {
    if (!options) return '';
    const linkLabel = resolveText(options.linkLabel);
    const externalAttributes = options.external
      ? ` target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${linkLabel} (${t('common.newWindow')})`)}"`
      : '';
    return `<div class="portal-preparing-block" aria-labelledby="${escapeHtml(options.titleId || 'preparing-title')}">
      <div><span>${escapeHtml(resolveText(options.label))}</span><h3 id="${escapeHtml(options.titleId || 'preparing-title')}">${escapeHtml(resolveText(options.title))}</h3></div>
      <a href="${withRootPrefix(options.href, rootPrefix)}"${externalAttributes}>${escapeHtml(linkLabel)} <i aria-hidden="true">→</i></a>
    </div>`;
  }
  function renderPortalSubpage(data) {
    const app = document.getElementById('app');
    if (!app) throw new Error('포털 서브페이지에는 #app 요소가 필요합니다.');

    const { parent, child } = getPortalMenuContext(data.menuId);
    const rootPrefix = data.rootPrefix ?? '../';
    const indexPage = Boolean(data.indexPage || !child);
    const pageLabel = t((child || parent).labelKey);
    const parentLabel = t(parent.labelKey);
    const pageTitle = resolveText(data.title) || pageLabel;
    const pageDescription = resolveText(data.description) || '';
    const metaTitle = resolveText(data.metaTitle) || `${pageTitle} | ${t('portal.metaTitle').replace(' 안내', '')}`;
    const metaDescription = resolveText(data.metaDescription) || pageDescription;
    const resolvePortalLink = (item) => withRootPrefix(item.href, rootPrefix);
    const visibleChildren = parent.children.filter((item) => !item.hidden);
    const renderBreadcrumbItems = (items, activeId) => items.filter((item) => !item.hidden).map((item) => {
      const current = item.id === activeId;
      return `<li><a class="${current ? 'active' : ''}" href="${resolvePortalLink(item)}"${portalExternalAttributes(item)}${current ? ' aria-current="page"' : ''}>${t(item.labelKey)}</a></li>`;
    }).join('');
    const depthOneItems = renderBreadcrumbItems(menuData, parent.id);
    const depthTwoItems = renderBreadcrumbItems(visibleChildren, child ? child.id : '');
    const breadcrumb = `<nav class="portal-breadcrumb portal-subnav-breadcrumb" aria-label="현재 위치">
      <a class="portal-breadcrumb-home" href="${withRootPrefix('index.html', rootPrefix)}" aria-label="${t('nav.home')}"><svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.7h-6v-6h-5v6h-6z"/></svg></a>
      <span class="portal-breadcrumb-separator" aria-hidden="true"></span>
      <div class="portal-breadcrumb-dropdown">
        <button class="portal-breadcrumb-trigger" type="button" aria-expanded="false" aria-controls="portal-depth-one-menu"><span>${parentLabel}</span><i aria-hidden="true"></i></button>
        <ul class="portal-breadcrumb-menu" id="portal-depth-one-menu" hidden>${depthOneItems}</ul>
      </div>
      ${indexPage ? '' : `<span class="portal-breadcrumb-separator" aria-hidden="true"></span>
      <div class="portal-breadcrumb-dropdown">
        <button class="portal-breadcrumb-trigger" type="button" aria-expanded="false" aria-controls="portal-depth-two-menu"><span>${pageLabel}</span><i aria-hidden="true"></i></button>
        <ul class="portal-breadcrumb-menu" id="portal-depth-two-menu" hidden>${depthTwoItems}</ul>
      </div>`}
    </nav>`;
    const childCards = indexPage ? `<div class="portal-terminal-directory">${visibleChildren.map((item) => `<a class="portal-terminal-link-card" href="${resolvePortalLink(item)}"${portalExternalAttributes(item)}><span class="portal-card-region">${parentLabel}</span><h3>${t(item.labelKey)}</h3><strong>${t(item.labelKey)} <i aria-hidden="true">→</i></strong></a>`).join('')}</div>` : '';

    const content = (typeof data.content === 'function' ? data.content({ t, escapeHtml, rootPrefix }) : data.content) || renderPortalPreparingBlock(data.emptyState, rootPrefix);
    const renderSection = (section = {}) => {
      const sectionTitle = resolveText(section.title);
      const sectionClass = `portal-template-section${section.soft ? ' portal-template-section--soft' : ''}`;
      return `<section class="${sectionClass}"><div class="container">
        ${sectionTitle ? `<div class="portal-template-section-heading${section.accent ? ' has-accent' : ''}"><h2>${escapeHtml(sectionTitle)}</h2></div>` : ''}
        ${section.content || ''}
      </div></section>`;
    };
    const primaryContent = indexPage ? `${childCards}${content}` : content;
    const pageContent = Array.isArray(data.sections) && data.sections.length
      ? data.sections.map((section) => renderSection(section)).join('')
      : renderSection({ content: primaryContent });

    document.body.dataset.portalSection = parent.currentSection || parent.id;
    document.body.classList.add('portal-template-page');
    document.title = metaTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = metaDescription;

    app.innerHTML = `
      <a class="skip-link" href="#main">${t('common.skip')}</a>
      <div id="portal-header-root"></div>
      <main id="main">
        <div class="portal-subnav-bar"><div class="container">${breadcrumb}</div></div>
        <section class="portal-subhero" aria-labelledby="page-title"><div class="container">
          <div class="portal-subhero-title">
            <h1 id="page-title">${escapeHtml(pageTitle)}</h1>
          </div>
        </div></section>
        ${pageContent}
      </main>
      <div id="site-footer-root"></div>`;

    return rootPrefix;
  }

  function initializePortalBreadcrumb() {
    const breadcrumb = document.querySelector('.portal-subnav-breadcrumb');
    if (!breadcrumb) return;
    const dropdowns = [...breadcrumb.querySelectorAll('.portal-breadcrumb-dropdown')];

    function setDropdown(dropdown, open, returnFocus = false) {
      const trigger = dropdown.querySelector('.portal-breadcrumb-trigger');
      const menu = dropdown.querySelector('.portal-breadcrumb-menu');
      dropdown.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (!open && returnFocus) trigger.focus();
    }

    function closeOthers(current) {
      dropdowns.forEach((dropdown) => {
        if (dropdown !== current) setDropdown(dropdown, false);
      });
    }

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('.portal-breadcrumb-trigger');
      const menu = dropdown.querySelector('.portal-breadcrumb-menu');
      const links = [...menu.querySelectorAll('a')];

      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') !== 'true';
        closeOthers(dropdown);
        setDropdown(dropdown, open);
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          closeOthers(dropdown);
          setDropdown(dropdown, true);
          links[0]?.focus();
        }
        if (event.key === 'Escape') setDropdown(dropdown, false, true);
      });
      menu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setDropdown(dropdown, false, true);
          return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const currentIndex = links.indexOf(document.activeElement);
        const nextIndex = event.key === 'Home' ? 0
          : event.key === 'End' ? links.length - 1
            : event.key === 'ArrowDown' ? (currentIndex + 1) % links.length
              : (currentIndex - 1 + links.length) % links.length;
        links[nextIndex]?.focus();
      });
      menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setDropdown(dropdown, false);
      });
      dropdown.addEventListener('mouseleave', () => setDropdown(dropdown, false));
    });

    breadcrumb.addEventListener('focusout', () => window.setTimeout(() => {
      if (!breadcrumb.contains(document.activeElement)) dropdowns.forEach((dropdown) => setDropdown(dropdown, false));
    }, 0));
    document.addEventListener('click', (event) => {
      if (!breadcrumb.contains(event.target)) dropdowns.forEach((dropdown) => setDropdown(dropdown, false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const openDropdown = dropdowns.find((dropdown) => dropdown.classList.contains('open'));
      if (openDropdown) setDropdown(openDropdown, false, true);
    });
  }
  window.portalLayoutComponents = { renderPreparingBlock: renderPortalPreparingBlock };
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
      if (window.innerWidth < 1024) return;
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
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      nav.classList.toggle('open', open);
      nav.setAttribute('aria-hidden', String(!open));
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? t('header.menuClose') : t('header.menuOpen'));
      document.body.classList.toggle('menu-open', open);
    });

    nav.addEventListener('click', (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) return;
      header.querySelectorAll('.gnb-link').forEach((item) => {
        item.classList.remove('current');
        item.removeAttribute('aria-current');
      });
      if (anchor.classList.contains('gnb-link')) {
        anchor.classList.add('current');
        anchor.setAttribute('aria-current', 'page');
      }
      if (window.innerWidth < 1024) {
        nav.classList.remove('is-open', 'open');
        nav.setAttribute('aria-hidden', String(window.innerWidth < 1024));
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      setMegaMenu(false);
      setTerminalSwitcher(false);
      nav.classList.remove('is-open', 'open');
      nav.setAttribute('aria-hidden', String(window.innerWidth < 1024));
      menuButton.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });

    nav.setAttribute('aria-hidden', String(window.innerWidth < 1024));
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        nav.classList.remove('is-open', 'open');
        nav.setAttribute('aria-hidden', 'false');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      } else {
        nav.setAttribute('aria-hidden', String(!nav.classList.contains('is-open')));
        setMegaMenu(false);
        setTerminalSwitcher(false);
      }
    });
  }

  if (document.body.classList.contains('portal-page')) {
    const subpageData = window.PORTAL_SUBPAGE_DATA;
    const rootPrefix = subpageData ? renderPortalSubpage(subpageData) : '';
    if (window.i18n) window.i18n.translateDocument(document);
    const portalHeaderRoot = document.getElementById('portal-header-root');
    const siteFooterRoot = document.getElementById('site-footer-root');
    const portalQuickRoot = document.getElementById('portal-hero-quick');
    const portalSection = document.body.dataset.portalSection || '';
    if (portalHeaderRoot) {
      portalHeaderRoot.outerHTML = sharedHeader({ brandName: t('portal.metaTitle').replace(' 안내', ''), portal: true, portalSection, rootPrefix });
      initializeHeader();
    }
    if (siteFooterRoot) {
      siteFooterRoot.outerHTML = sharedSiteFooter(rootPrefix);
      initializeSiteFooter();
    }
    if (portalQuickRoot) portalQuickRoot.innerHTML = renderPortalQuickMenu();
    if (subpageData) initializePortalBreadcrumb();
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
      ${sharedTerminalFooter(data, true)}`;
    initializeHeader();
    return;
  }

  const boardingCards = data.boardingCards.map((card, index) => `
    <article class="guide-card"><span class="guide-number">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(localize(card.title))}</h3><p>${escapeHtml(localize(card.description))}</p></article>`).join('');
  const notices = data.notices.map((notice, index) => `
    <li><a href="#notice"><span class="portal-content-badge">${escapeHtml(localize(notice.category))}</span><span class="news-title">${escapeHtml(localize(notice.title))}</span><time class="news-date" datetime="${escapeHtml(notice.date.replaceAll('.', '-'))}">${escapeHtml(notice.date)}</time></a></li>`).join('');

  document.title = terminalName;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${terminalName} 운항 정보, 승선 안내, 터미널 이용 정보를 확인하세요.`;

  app.innerHTML = `
    <a class="skip-link" href="#main">${t('common.skip')}</a>
    ${sharedHeader({ brandName: terminalName })}
    <main id="main">
      <section class="hero" id="home" aria-labelledby="hero-title"><div class="container"><div class="hero-content">
        <span class="eyebrow">WELCOME TO ${escapeHtml(data.englishName)}</span><h1 id="hero-title">${escapeHtml(localize(data.heroTitle)).replaceAll('\n', '<br>')}</h1>
        <p>${escapeHtml(localize(data.heroDescription)).replaceAll('\n', '<br>')}</p><a class="btn btn--lg btn--solid btn--arrow" href="#schedule">${t('terminalPage.heroButton')}</a>
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
        <div class="guide-intro"><p class="section-kicker">BOARDING GUIDE</p><h2 id="boarding-title">${t('terminalPage.boardingTitle').replaceAll('\n', '<br>')}</h2><p>${escapeHtml(localize(data.boardingIntro))}</p><a class="btn btn--lg btn--outline" href="#boarding-detail">${t('terminalPage.boardingMore')}</a></div>
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
    ${sharedTerminalFooter(data)}`;

  initializeHeader();
}

if (window.i18n) renderSharedLayout();
else document.addEventListener('i18n:ready', renderSharedLayout, { once: true });
