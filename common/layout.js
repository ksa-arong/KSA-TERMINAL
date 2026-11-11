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
  const createPaths = (rootPrefix = '', regionId = '') => window.KsaPathResolver.create({
    location: regionId ? 'region' : rootPrefix ? 'portal-subpage' : 'portal-root',
    regionId: regionId || undefined
  });
  const resolveTerminalLogoSrc = (regionId) => {
    const logoFile = window.getPortalRegionDefinition?.(regionId)?.logo;
    const paths = createPaths('', regionId);
    return logoFile
      ? paths.asset(`images/logo/${encodeURIComponent(logoFile)}`)
      : paths.asset('images/logo.png');
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
    const { brandName, brandLogoSrc = '', portal = false, guidePage = false, portalSection = '', rootPrefix = '', regionId = '', menuMode = portal ? 'portal' : 'terminal' } = options;
    const terminalMenu = menuMode === 'terminal';
    const regionMenu = menuMode === 'region-v2';
    const regionalSite = menuMode === 'region-v2' || menuMode === 'terminal';
    const paths = createPaths(rootPrefix, regionalSite ? regionId || window.terminalData?.regionId : '');
    const currentLanguage = window.i18n?.language === 'en' ? 'en' : 'ko';
    const currentLanguageCode = currentLanguage === 'en' ? 'ENG' : 'KOR';
    const currentLanguageName = t(`header.${currentLanguage === 'en' ? 'english' : 'korean'}`);
    const homeLink = regionMenu
      ? './index.html'
      : terminalMenu
      ? (guidePage ? './index.html' : '#home')
      : paths.portal();
    const currentClass = (section) => {
      if (portal) {
        if (section === 'terminal' && !portalSection) return ' current';
        return portalSection === section ? ' current' : '';
      }
      if (section === 'home' && !guidePage) return ' current';
      if (section === 'terminal' && guidePage) return ' current';
      return '';
    };
    const menuItems = regionMenu
      ? (window.REGION_MENU || [])
      : menuData.map((item) => terminalMenu ? item.terminal : item).filter((item) => item && !item.hidden);
    const resolveMenuHref = (href) => {
      if (!terminalMenu) return paths.portal(href);
      if (!href.startsWith('{terminal}/')) return href;
      const relative = href.slice('{terminal}/'.length);
      if (relative.startsWith('index.html#')) return guidePage ? `./${relative}` : `#${relative.split('#')[1]}`;
      if (relative === 'guide.html#main') return guidePage ? '#main' : './guide.html';
      if (relative.startsWith('guide.html#')) return guidePage ? `#${relative.split('#')[1]}` : `./${relative}`;
      return `./${relative}`;
    };
    const externalAttributes = (item) => portalExternalAttributes(item);
    const externalLinkIcon = '<svg class="mega-menu-external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"></path><path d="m10 14 11-11"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>';
    const currentRegionPage = document.body.dataset.regionPage || '';
    const currentTerminalId = decodeURIComponent(window.location.hash.slice(1)) || 'mokpo-coastal';
    const resolveRegionHref = (item) => item.external ? paths.portal(item.href) : paths.regionPage(item.href);
    const regionGroupCurrent = (item) => (item.pages || item.children).some((child) => child.page === currentRegionPage);
    const regionChildren = (item) => window.getRegionMenuChildren ? window.getRegionMenuChildren(item, window.terminalData) : item.children;
    const regionLinkedChildren = (item) => regionChildren(item).filter((child) => child.href);
    const renderRegionChild = (child, surface) => {
      const current = child.terminalId
        ? child.terminalId === currentTerminalId && ['terminal-introduction', 'facilities', 'directions', 'parking'].includes(currentRegionPage)
        : child.page === currentRegionPage;
      const icon = child.external ? externalLinkIcon : '';
      const classNames = [];
      if (child.external) classNames.push(surface === 'mega' ? 'mega-menu-external-link region-menu-external' : 'region-menu-external');
      if (current) classNames.push('region-menu-current');
      const className = classNames.length ? ` class="${classNames.join(' ')}"` : '';
      return `<a${className} href="${resolveRegionHref(child)}"${current ? ' aria-current="page"' : ''}><span>${escapeHtml(child.label)}</span>${icon}</a>`;
    };
    const renderGnbItems = regionMenu ? () => menuItems.map((item) => {
      const current = regionGroupCurrent(item);
      const linkedChildren = regionLinkedChildren(item);
      const target = linkedChildren.find((child) => child.page === currentRegionPage) || linkedChildren[0];
      const content = target
        ? `<a class="gnb-link${current ? ' current' : ''}" data-mega="${item.id}" href="${resolveRegionHref(target)}"${current ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
        : `<span class="gnb-link region-menu-disabled" data-mega="${item.id}" aria-disabled="true">${escapeHtml(item.label)}</span>`;
      return `<li class="gnb-item">${content}</li>`;
    }).join('') : () => menuItems.map((item) => {
      const current = Boolean(currentClass(item.currentSection || ''));
      return `
      <li class="gnb-item"><a class="gnb-link${current ? ' current' : ''}" data-mega="${item.id}" href="${resolveMenuHref(item.href)}"${externalAttributes(item)}${current ? ' aria-current="page"' : ''}>${t(item.labelKey)}</a></li>`;
    }).join('');
    const renderMobileMenuGroups = regionMenu ? () => menuItems.map((item) => {
      const current = regionGroupCurrent(item);
      const linkedChildren = regionLinkedChildren(item);
      const target = linkedChildren.find((child) => child.page === currentRegionPage) || linkedChildren[0];
      const submenuId = `mobile-menu-submenu-${item.id}`;
      const title = target
        ? `<a class="mobile-menu-title${current ? ' current' : ''}" href="${resolveRegionHref(target)}"${current ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`
        : `<span class="mobile-menu-title region-menu-disabled" aria-disabled="true">${escapeHtml(item.label)}</span>`;
      return `<section class="mobile-menu-group${current ? ' is-open' : ''}"><div class="mobile-menu-primary"><h2>${title}</h2><button class="mobile-menu-toggle" type="button" aria-label="${escapeHtml(`${item.label} 상세 메뉴`)}" aria-expanded="${String(current)}" aria-controls="${submenuId}"><span aria-hidden="true"></span></button></div><ul class="mobile-menu-links" id="${submenuId}"${current ? '' : ' hidden'}>${regionChildren(item).map((child) => `<li>${renderRegionChild(child, 'mobile')}</li>`).join('')}</ul></section>`;
    }).join('') : () => menuItems.map((item) => {
      const visibleChildren = item.children.filter((child) => !child.hidden);
      if (!item.href && visibleChildren.length === 0) return '';
      const current = Boolean(currentClass(item.currentSection || ''));
      const submenuId = `mobile-menu-submenu-${item.id}`;
      const childLinks = visibleChildren.length > 0
        ? `<ul class="mobile-menu-links" id="${submenuId}"${current ? '' : ' hidden'}>${visibleChildren.map((child) => `<li><a href="${resolveMenuHref(child.href)}"${externalAttributes(child)}>${t(child.labelKey)}</a></li>`).join('')}</ul>`
        : '';
      const toggle = visibleChildren.length > 0
        ? `<button class="mobile-menu-toggle" type="button" aria-label="${escapeHtml(`${t(item.labelKey)} ${t('header.mobileDetail')}`)}" aria-expanded="${String(current)}" aria-controls="${submenuId}"><span aria-hidden="true"></span></button>`
        : '';
      return `<section class="mobile-menu-group${current ? ' is-open' : ''}"><div class="mobile-menu-primary"><h2><a class="mobile-menu-title${current ? ' current' : ''}" href="${resolveMenuHref(item.href)}"${externalAttributes(item)}${current ? ' aria-current="page"' : ''}>${t(item.labelKey)}</a></h2>${toggle}</div>${childLinks}</section>`;
    }).join('');
    const renderMobileUtility = regionalSite ? () => `
      <nav class="mobile-menu-utility" aria-label="지역 사이트 빠른 메뉴">
        <a href="${paths.portal()}">통합 홈페이지</a>
        <a href="${paths.portal('privacy.html')}">${t('footer.privacy')}</a>
        <a href="${paths.portal('terms.html')}">${t('footer.terms')}</a>
      </nav>` : () => `
      <nav class="mobile-menu-utility" aria-label="${t('header.quickMenu')}">
        <a href="${resolveMenuHref('privacy.html')}">${t('footer.privacy')}</a>
        <a href="${resolveMenuHref('terms.html')}">${t('footer.terms')}</a>
      </nav>`;
    const renderMegaMenu = regionMenu ? () => `
      <div class="container mega-menu-inner portal-mega-menu-inner region-mega-menu-inner">
        ${menuItems.map((item) => `<div class="mega-column" role="group" aria-label="${escapeHtml(item.label)}">${regionChildren(item).map((child) => renderRegionChild(child, 'mega')).join('')}</div>`).join('')}
      </div>` : () => `
      <div class="container mega-menu-inner ${portal ? 'portal-mega-menu-inner' : 'terminal-mega-menu-inner'}">
        ${menuItems.map((item) => `<div class="mega-column" role="group" aria-label="${escapeHtml(t(item.labelKey))}">${item.children.filter((child) => !child.hidden).map((child) => `<a${child.external ? ' class="mega-menu-external-link"' : ''} href="${resolveMenuHref(child.href)}"${externalAttributes(child)}><span>${t(child.labelKey)}</span>${child.external ? externalLinkIcon : ''}</a>`).join('')}</div>`).join('')}
      </div>`;
    const headerLogoSrc = brandLogoSrc || paths.asset('images/logo.png');
    const brandContent = portal
      ? `<span class="portal-header-brand-assets" aria-hidden="true"><img class="portal-header-brand-image" src="${headerLogoSrc}" alt="" width="954" height="196"></span>`
      : escapeHtml(brandName);
    const mobileMenuLogoSrc = brandLogoSrc || paths.asset('images/logo.png');
    const terminalMenuItems = (window.PORTAL_REGION_REGISTRY || []).map((region) => {
      const label = escapeHtml(region.gnbLabelKo || region.nameKo);
      if (!region.hasPage || !region.folder) {
        return `<span class="terminal-switcher-disabled" aria-disabled="true"><span>${label}</span><small>${t('common.ready')}</small></span>`;
      }
      return `<a href="${paths.region(region.folder)}"><span>${label}</span><i aria-hidden="true">→</i></a>`;
    }).join('');

    const gnbItems = renderGnbItems();
    const mobileMenuGroups = renderMobileMenuGroups();
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
          </nav>
          <div class="header-utils">
            ${regionalSite ? `<a class="btn btn--sm btn--portal-home regional-portal-link" data-integrated-home-link href="${paths.portal()}">통합 홈페이지</a>` : ''}
            <div class="terminal-switcher">
              <button class="all-terminals-link" id="terminal-switcher-button" type="button" aria-expanded="false" aria-controls="terminal-switcher-menu"><span class="utility-grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${t('header.allTerminals')}<span class="terminal-switcher-chevron" aria-hidden="true"></span></button>
              <div class="terminal-switcher-menu" id="terminal-switcher-menu" aria-hidden="true">
                <div class="terminal-switcher-head"><strong>${t('header.terminalHomepage')}</strong></div>
                <div class="terminal-switcher-grid">${terminalMenuItems}</div>
              </div>
            </div>
            <div class="language-switcher">
              <button class="language-button" id="language-switcher-button" type="button" aria-label="${escapeHtml(`${t('header.language')}: ${currentLanguageName}`)}" aria-expanded="false" aria-controls="language-switcher-menu"><svg class="language-globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12S9.6 18.5 12 21"></path></svg><span>${currentLanguageCode}</span><span class="chevron" aria-hidden="true"></span></button>
              <div class="language-switcher-menu" id="language-switcher-menu" aria-label="${t('header.language')}" hidden>
                <div class="language-switcher-grid">
                  <button class="language-switcher-option is-current" type="button" aria-current="true"><strong>KOR</strong><span>${t('header.korean')}</span></button>
                  <span class="language-switcher-option is-disabled" aria-disabled="true"><strong>ENG</strong><small>${t('common.ready')}</small></span>
                </div>
              </div>
            </div>
            ${portal ? '' : `<button class="icon-button search-button" type="button" aria-label="${t('header.search')}"><span class="search-icon" aria-hidden="true"></span></button>`}
            <button class="menu-button" type="button" aria-label="${t('header.menuOpen')}" aria-expanded="false" aria-controls="mobile-menu-panel"><span></span></button>
          </div>
        </div>
        <div class="mega-menu" id="mega-menu" aria-hidden="true">
          ${megaMenuContent}
        </div>
      </header>
      <aside class="mobile-menu-panel" id="mobile-menu-panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${escapeHtml(`${brandName} ${t('header.mainMenu')}`)}" inert>
        <div class="mobile-menu-header">
          <a class="mobile-menu-brand" href="${homeLink}" aria-label="${escapeHtml(brandName)} ${t('common.homeSuffix')}"><img src="${mobileMenuLogoSrc}" alt="" width="954" height="196"></a>
          <div class="mobile-terminal-selector">
            <button class="mobile-menu-terminal-button" type="button" aria-expanded="false" aria-controls="mobile-terminal-menu"><span>${t('header.mobileTerminal')}</span><i aria-hidden="true"></i></button>
            <div class="mobile-terminal-menu" id="mobile-terminal-menu" aria-label="${t('header.terminalHomepage')}" hidden>
              ${terminalMenuItems}
            </div>
          </div>
          <button class="mobile-menu-close" type="button" aria-label="${t('header.menuClose')}"><span aria-hidden="true"></span></button>
        </div>
        <div class="mobile-menu-scroll">
          <nav class="mobile-menu-nav" aria-label="${t('header.mainMenu')}">
            ${mobileMenuGroups}
          </nav>
          ${mobileUtility}
        </div>
      </aside>`;
  }

  function sharedSiteFooter(rootPrefix = '', regionId = '') {
    const paths = createPaths(rootPrefix, regionId);
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
              <a class="is-emphasis" href="${paths.portal('privacy.html')}">${t('footer.privacy')}</a>
              <a href="${paths.portal('terms.html')}">${t('footer.terms')}</a>
              <a href="${paths.portal('sitemap.html')}">${t('footer.sitemap')}</a>
            </nav>
          </div>
          <div class="site-footer-main">
            <div class="site-footer-company">
              <a class="site-footer-logo" href="${paths.portal()}" aria-label="전국여객선터미널 홈">
                <img class="site-footer-brand-image" src="${paths.asset('images/logo.png')}" alt="" width="954" height="196">
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
              <label class="site-footer-select"><span class="sr-only">관련사이트</span><select class="site-footer-related-select"><option value="">관련사이트</option>${relatedOptions}</select></label>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function initializeSiteFooter() {
    const relatedSelect = document.querySelector('.site-footer-related-select');
    relatedSelect?.addEventListener('change', () => {
      if (relatedSelect.value) window.open(relatedSelect.value, '_blank', 'noopener,noreferrer');
      relatedSelect.value = '';
    });
  }

  function initializeFloatingQuick() {
    let floatingQuick = document.querySelector('[data-portal-floating-quick]');
    if (!floatingQuick) {
      floatingQuick = document.createElement('aside');
      floatingQuick.className = 'portal-floating-quick portal-floating-quick--top-only';
      floatingQuick.dataset.portalFloatingQuick = '';
      floatingQuick.setAttribute('aria-label', '페이지 이동');
      floatingQuick.innerHTML = `
        <div class="portal-floating-quick__panel">
          <nav class="portal-floating-quick__links" aria-label="페이지 이동">
            <button class="portal-floating-quick__link portal-floating-quick__top" type="button" data-portal-quick-top aria-label="페이지 맨 위로 이동">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>
              <span>TOP</span>
            </button>
          </nav>
        </div>`;
      document.body.append(floatingQuick);
    }

    if (floatingQuick.dataset.quickInitialized === 'true') return;
    floatingQuick.dataset.quickInitialized = 'true';

    const toggle = floatingQuick.querySelector('[data-portal-quick-toggle]');
    const topButton = floatingQuick.querySelector('[data-portal-quick-top]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncVisibility = () => floatingQuick.classList.toggle('show', window.scrollY > 160);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const collapsed = floatingQuick.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute('aria-label', collapsed ? '퀵메뉴 펼치기' : '퀵메뉴 접기');
      });
    }

    if (topButton) {
      topButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    }

    window.addEventListener('scroll', syncVisibility, { passive: true });
    syncVisibility();
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
    const breadcrumb = `<nav class="breadcrumb subnav-breadcrumb" aria-label="현재 위치">
      <a class="breadcrumb-home" href="${withRootPrefix('index.html', rootPrefix)}" aria-label="${t('nav.home')}"><svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.7h-6v-6h-5v6h-6z"/></svg></a>
      <span class="breadcrumb-separator" aria-hidden="true"></span>
      <div class="breadcrumb-dropdown">
        <button class="breadcrumb-trigger" type="button" aria-expanded="false" aria-controls="portal-depth-one-menu"><span>${parentLabel}</span><i aria-hidden="true"></i></button>
        <ul class="breadcrumb-menu" id="portal-depth-one-menu" hidden>${depthOneItems}</ul>
      </div>
      ${indexPage ? '' : `<span class="breadcrumb-separator" aria-hidden="true"></span>
      <div class="breadcrumb-dropdown">
        <button class="breadcrumb-trigger" type="button" aria-expanded="false" aria-controls="portal-depth-two-menu"><span>${pageLabel}</span><i aria-hidden="true"></i></button>
        <ul class="breadcrumb-menu" id="portal-depth-two-menu" hidden>${depthTwoItems}</ul>
      </div>`}
    </nav>`;
    const childCards = indexPage ? `<div class="portal-terminal-directory">${visibleChildren.map((item) => `<a class="portal-terminal-link-card" href="${resolvePortalLink(item)}"${portalExternalAttributes(item)}><span class="portal-card-region">${parentLabel}</span><h3>${t(item.labelKey)}</h3><strong>${t(item.labelKey)} <i aria-hidden="true">→</i></strong></a>`).join('')}</div>` : '';

    const content = (typeof data.content === 'function' ? data.content({ t, escapeHtml, rootPrefix }) : data.content) || renderPortalPreparingBlock(data.emptyState, rootPrefix);
    const renderSection = (section = {}) => {
      const sectionTitle = resolveText(section.title);
      const sectionClass = `template-section${section.soft ? ' template-section--soft' : ''}`;
      return `<section class="${sectionClass}"><div class="container">
        ${sectionTitle ? `<div class="template-section-heading${section.accent ? ' has-accent' : ''}"><h2>${escapeHtml(sectionTitle)}</h2></div>` : ''}
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
        <div class="subnav-bar"><div class="container">${breadcrumb}</div></div>
        <section class="subhero" aria-labelledby="page-title"><div class="container">
          <div class="subhero-title">
            <h1 id="page-title">${escapeHtml(pageTitle)}</h1>
          </div>
        </div></section>
        ${pageContent}
      </main>
      <div id="site-footer-root"></div>`;

    return rootPrefix;
  }

  function initializeBreadcrumb() {
    const breadcrumb = document.querySelector('.subnav-breadcrumb');
    if (!breadcrumb) return;
    const dropdowns = [...breadcrumb.querySelectorAll('.breadcrumb-dropdown')];

    function setDropdown(dropdown, open, returnFocus = false) {
      const trigger = dropdown.querySelector('.breadcrumb-trigger');
      const menu = dropdown.querySelector('.breadcrumb-menu');
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
      const trigger = dropdown.querySelector('.breadcrumb-trigger');
      const menu = dropdown.querySelector('.breadcrumb-menu');
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
    const languageSwitcher = header.querySelector('.language-switcher');
    const languageSwitcherButton = header.querySelector('#language-switcher-button');
    const languageSwitcherMenu = header.querySelector('#language-switcher-menu');
    const mobileMenuPanel = document.querySelector('#mobile-menu-panel');
    const mobileMenuClose = mobileMenuPanel.querySelector('.mobile-menu-close');
    const mobileMenuToggles = [...mobileMenuPanel.querySelectorAll('.mobile-menu-toggle')];
    const mobileTerminalSelector = mobileMenuPanel.querySelector('.mobile-terminal-selector');
    const mobileTerminalButton = mobileMenuPanel.querySelector('.mobile-menu-terminal-button');
    const mobileTerminalMenu = mobileMenuPanel.querySelector('#mobile-terminal-menu');
    let mobileMenuScrollY = 0;
    let mobileMenuTrigger = menuButton;

    const isMobileMenuViewport = () => window.innerWidth < 1024;
    const mobileMenuFocusableElements = () => [...mobileMenuPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true' && !element.closest('[hidden]'));

    function setPageScrollLocked(locked) {
      if (locked) {
        mobileMenuScrollY = window.scrollY;
        document.body.style.setProperty('--mobile-menu-scroll-offset', `-${mobileMenuScrollY}px`);
        document.documentElement.classList.add('mobile-menu-open');
        document.body.classList.add('menu-open');
        return;
      }
      document.documentElement.classList.remove('mobile-menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--mobile-menu-scroll-offset');
      window.scrollTo({ top: mobileMenuScrollY, left: 0, behavior: 'instant' });
    }

    function setMobileMenu(open, { restoreFocus = true, trigger = menuButton } = {}) {
      const shouldOpen = Boolean(open && isMobileMenuViewport());
      const wasOpen = mobileMenuPanel.classList.contains('is-open');

      if (shouldOpen && !wasOpen) {
        mobileMenuTrigger = trigger;
        setMegaMenu(false);
        setTerminalSwitcher(false);
        setLanguageSwitcher(false);
        setPageScrollLocked(true);
      }

      mobileMenuPanel.classList.toggle('is-open', shouldOpen);
      mobileMenuPanel.setAttribute('aria-hidden', String(!shouldOpen));
      menuButton.classList.toggle('is-open', shouldOpen);
      menuButton.setAttribute('aria-expanded', String(shouldOpen));
      menuButton.setAttribute('aria-label', shouldOpen ? t('header.menuClose') : t('header.menuOpen'));

      if (shouldOpen) {
        mobileMenuPanel.removeAttribute('inert');
        window.requestAnimationFrame(() => {
          const firstMenuLink = mobileMenuPanel.querySelector('.mobile-menu-nav a[href]');
          (firstMenuLink || mobileMenuClose).focus();
        });
        return;
      }

      setMobileTerminalMenu(false);
      mobileMenuPanel.setAttribute('inert', '');
      if (!wasOpen) return;
      if (restoreFocus && mobileMenuTrigger && typeof mobileMenuTrigger.focus === 'function') {
        mobileMenuTrigger.focus({ preventScroll: true });
      }
      setPageScrollLocked(false);
    }

    function setMobileMenuGroup(toggle, open) {
      const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
      const group = toggle.closest('.mobile-menu-group');
      toggle.setAttribute('aria-expanded', String(open));
      group.classList.toggle('is-open', open);
      submenu.hidden = !open;
    }

    function setMobileTerminalMenu(open, { restoreFocus = false } = {}) {
      mobileTerminalButton.setAttribute('aria-expanded', String(open));
      mobileTerminalSelector.classList.toggle('is-open', open);
      mobileTerminalMenu.hidden = !open;
      if (restoreFocus) mobileTerminalButton.focus();
    }

    function setTerminalSwitcher(open) {
      terminalSwitcher.classList.toggle('open', open);
      terminalSwitcherButton.setAttribute('aria-expanded', String(open));
      terminalSwitcherMenu.setAttribute('aria-hidden', String(!open));
    }

    function setLanguageSwitcher(open, { restoreFocus = false } = {}) {
      languageSwitcher.classList.toggle('open', open);
      languageSwitcherButton.setAttribute('aria-expanded', String(open));
      languageSwitcherMenu.hidden = !open;
      if (restoreFocus) languageSwitcherButton.focus();
    }

    function setMegaMenu(open) {
      if (window.innerWidth < 1024) return;
      if (open) {
        setTerminalSwitcher(false);
        setLanguageSwitcher(false);
      }
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
        setLanguageSwitcher(false);
      }
    }, 0));

    terminalSwitcherButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = !terminalSwitcher.classList.contains('open');
      setMegaMenu(false);
      setLanguageSwitcher(false);
      setTerminalSwitcher(open);
    });
    terminalSwitcherMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setTerminalSwitcher(false);
    });
    document.addEventListener('click', (event) => {
      if (!terminalSwitcher.contains(event.target)) setTerminalSwitcher(false);
      if (!languageSwitcher.contains(event.target)) setLanguageSwitcher(false);
    });
    languageSwitcherButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = !languageSwitcher.classList.contains('open');
      setMegaMenu(false);
      setTerminalSwitcher(false);
      setLanguageSwitcher(open);
    });
    languageSwitcherMenu.addEventListener('click', (event) => {
      if (event.target.closest('.language-switcher-option.is-current')) setLanguageSwitcher(false, { restoreFocus: true });
    });

    menuButton.addEventListener('click', () => {
      setMobileMenu(!mobileMenuPanel.classList.contains('is-open'), { trigger: menuButton });
    });
    mobileMenuClose.addEventListener('click', () => setMobileMenu(false));
    mobileTerminalButton.addEventListener('click', () => {
      setMobileTerminalMenu(mobileTerminalButton.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenuToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        mobileMenuToggles.forEach((otherToggle) => {
          if (otherToggle !== toggle) setMobileMenuGroup(otherToggle, false);
        });
        setMobileMenuGroup(toggle, open);
      });
    });
    mobileMenuPanel.addEventListener('click', (event) => {
      if (!mobileTerminalSelector.contains(event.target)) setMobileTerminalMenu(false);
      const anchor = event.target.closest('a');
      if (!anchor) return;

      const target = anchor.getAttribute('target');
      const opensNewContext = Boolean(target && target !== '_self');
      const destination = new URL(anchor.href, window.location.href);
      const staysOnCurrentPage = Boolean(
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash
      );

      if (opensNewContext || staysOnCurrentPage) setMobileMenu(false);
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
    });

    document.addEventListener('keydown', (event) => {
      const mobileMenuOpen = mobileMenuPanel.classList.contains('is-open');
      if (event.key === 'Escape') {
        setMegaMenu(false);
        setTerminalSwitcher(false);
        if (languageSwitcher.classList.contains('open')) {
          event.preventDefault();
          setLanguageSwitcher(false, { restoreFocus: true });
          return;
        }
        if (mobileTerminalButton.getAttribute('aria-expanded') === 'true') {
          event.preventDefault();
          setMobileTerminalMenu(false, { restoreFocus: true });
          return;
        }
        if (mobileMenuOpen) {
          event.preventDefault();
          setMobileMenu(false);
        }
        return;
      }
      if (event.key !== 'Tab' || !mobileMenuOpen) return;

      const focusableElements = mobileMenuFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        mobileMenuClose.focus();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === firstElement || !mobileMenuPanel.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });

    nav.setAttribute('aria-hidden', String(isMobileMenuViewport()));
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8), { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        setMobileMenu(false, { restoreFocus: false });
        nav.setAttribute('aria-hidden', 'false');
      } else {
        nav.setAttribute('aria-hidden', 'true');
        setMegaMenu(false);
        setTerminalSwitcher(false);
      }
    });
  }

  function renderRegionTemplate(data, app) {
    if (!window.RegionHome) throw new Error('지역 메인에는 RegionHome 컴포넌트가 필요합니다.');
    const terminalName = localize(data.name);
    const scheduleConfig = window.scheduleData || {};
    app.innerHTML = `
      <a class="skip-link" href="#main">${t('common.skip')}</a>
      ${sharedHeader({ brandName: terminalName, brandLogoSrc: resolveTerminalLogoSrc(data.regionId), portal: true, portalSection: 'terminal', rootPrefix: '../../', regionId: data.regionId, menuMode: data.regionId === 'mokpo' ? 'region-v2' : 'terminal' })}
      <main id="main">
        ${window.RegionHome.renderHero(data, scheduleConfig)}
        ${window.RegionHome.renderTerminalSection(data, scheduleConfig)}
        ${window.RegionHome.renderGuideSection(data)}
        ${window.RegionHome.renderBottomInfo(data)}
      </main>
      ${window.RegionHome.renderFloatingQuick()}
      ${sharedSiteFooter('../../', data.regionId)}`;

    initializeHeader();
    initializeSiteFooter();
    initializeFloatingQuick();
  }

  function renderRegionGuidePlaceholder(data, app) {
    if (!window.RegionHome) throw new Error('지역 메인에는 RegionHome 컴포넌트가 필요합니다.');
    const terminalName = localize(data.name);
    const scheduleConfig = window.scheduleData || {};
    app.innerHTML = `
      <a class="skip-link" href="#main">${t('common.skip')}</a>
      ${sharedHeader({ brandName: terminalName, brandLogoSrc: resolveTerminalLogoSrc(data.regionId), portal: true, portalSection: 'terminal', rootPrefix: '../../', regionId: data.regionId, menuMode: data.regionId === 'mokpo' ? 'region-v2' : 'terminal' })}
      <main id="main">
        ${window.RegionHome.renderHero(data, scheduleConfig)}
        ${window.RegionHome.renderTerminalSection(data, scheduleConfig)}
        ${window.RegionHome.renderGuideSection(data)}
        ${window.RegionHome.renderBottomInfo(data)}
      </main>
      ${window.RegionHome.renderFloatingQuick()}
      ${sharedSiteFooter('../../', data.regionId)}`;
    initializeHeader();
    initializeSiteFooter();
    initializeFloatingQuick();
  }

  if (document.body.classList.contains('portal-page') && !document.body.classList.contains('region-template-page')) {
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
    if (subpageData) initializeBreadcrumb();
    initializeFloatingQuick();
    return;
  }

  const data = window.terminalData;
  const app = document.getElementById('app');
  if (!data || !app) throw new Error('terminalData와 #app 요소가 필요합니다.');

  const regionPageKey = document.body.dataset.regionPage;
  if (regionPageKey) {
    if (!window.RegionPage) throw new Error('지역 서브페이지에는 RegionPage 렌더러가 필요합니다.');
    const terminalName = localize(data.name);
    app.innerHTML = `
      <a class="skip-link" href="#main">${t('common.skip')}</a>
      ${sharedHeader({ brandName: terminalName, brandLogoSrc: resolveTerminalLogoSrc(data.regionId), portal: true, portalSection: 'terminal', rootPrefix: '../../', regionId: data.regionId, menuMode: 'region-v2' })}
      ${window.RegionPage.renderMain({ pageKey: regionPageKey, terminalData: data, scheduleData: window.scheduleData || {} })}
      ${sharedSiteFooter('../../', data.regionId)}`;
    window.RegionPage.initialize?.();
    initializeBreadcrumb();
    initializeHeader();
    initializeSiteFooter();
    initializeFloatingQuick();
    return;
  }

  if (data.template === 'portal-region') {
    const regionStatus = window.getPortalRegionStatus
      ? window.getPortalRegionStatus(data.regionId, data.status)
      : data.status;
    if (regionStatus) data.status = regionStatus;
    if (regionStatus === 'preparing' || document.body.classList.contains('guide-page')) {
      renderRegionGuidePlaceholder(data, app);
    } else {
      renderRegionTemplate(data, app);
    }
    return;
  }
}

if (window.i18n) renderSharedLayout();
else document.addEventListener('i18n:ready', renderSharedLayout, { once: true });
