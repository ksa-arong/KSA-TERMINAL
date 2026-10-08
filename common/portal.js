(function() {
    'use strict';

    const hero = document.querySelector('.portal-hero');
    const heroSlides = [...document.querySelectorAll('.portal-hero-slide')];
    const heroPlaybackButton = document.querySelector('[data-hero-playback]');
    const heroPreviousButton = document.querySelector('[data-hero-previous]');
    const heroNextButton = document.querySelector('[data-hero-next]');
    const heroCurrent = document.querySelector('[data-hero-current]');
    const heroTotal = document.querySelector('[data-hero-total]');
    const heroProgress = document.querySelector('[data-hero-progress]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const t = window.i18n.t;
    const localize = window.i18n.localize;
    let currentHeroSlide = 0;
    let heroTimer = null;
    let heroRotationPaused = reducedMotion.matches;
    let heroMotionOverride = false;

    function updateHeroPlaybackButton() {
        if (!heroPlaybackButton) return;
        const label = t(heroRotationPaused ? 'portal.heroPlay' : 'portal.heroPause');
        heroPlaybackButton.setAttribute('aria-pressed', String(heroRotationPaused));
        heroPlaybackButton.setAttribute('aria-label', label);
        heroPlaybackButton.title = label;
    }

    function showHeroSlide(index) {
        if (!heroSlides.length) return;
        currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentHeroSlide));
        if (heroCurrent) heroCurrent.textContent = String(currentHeroSlide + 1).padStart(2, '0');
        if (heroTotal) heroTotal.textContent = String(heroSlides.length).padStart(2, '0');
        if (heroProgress) heroProgress.style.setProperty('--hero-progress', (((currentHeroSlide + 1) / heroSlides.length) * 100) + '%');
    }

    function stopHeroRotation() {
        if (heroTimer) window.clearInterval(heroTimer);
        heroTimer = null;
    }

    function startHeroRotation() {
        stopHeroRotation();
        if (heroRotationPaused || (reducedMotion.matches && !heroMotionOverride) || heroSlides.length < 2 || document.hidden) return;
        heroTimer = window.setInterval(() => showHeroSlide(currentHeroSlide + 1), 6500);
    }

    if (hero && heroSlides.length) {
        if (heroPreviousButton) heroPreviousButton.addEventListener('click', () => {
            showHeroSlide(currentHeroSlide - 1);
            startHeroRotation();
        });
        if (heroNextButton) heroNextButton.addEventListener('click', () => {
            showHeroSlide(currentHeroSlide + 1);
            startHeroRotation();
        });
        if (heroPlaybackButton) heroPlaybackButton.addEventListener('click', () => {
            heroRotationPaused = !heroRotationPaused;
            heroMotionOverride = !heroRotationPaused;
            updateHeroPlaybackButton();
            if (heroRotationPaused) stopHeroRotation();
            else {
                showHeroSlide(currentHeroSlide + 1);
                startHeroRotation();
            }
        });
        hero.addEventListener('mouseenter', stopHeroRotation);
        hero.addEventListener('mouseleave', startHeroRotation);
        hero.addEventListener('focusin', stopHeroRotation);
        hero.addEventListener('focusout', () => window.setTimeout(() => {
            if (!hero.contains(document.activeElement)) startHeroRotation();
        }, 0));
        document.addEventListener('visibilitychange', startHeroRotation);
        reducedMotion.addEventListener('change', () => {
            heroMotionOverride = false;
            heroRotationPaused = reducedMotion.matches;
            updateHeroPlaybackButton();
            startHeroRotation();
        });
        showHeroSlide(0);
        updateHeroPlaybackButton();
        startHeroRotation();
    }

    const portalData = window.PORTAL_DATA || {};
    const regions = portalData.regions || {};
    const mapRoot = document.querySelector('[data-portal-map-root]');
    const portalRootPrefix = mapRoot ? (mapRoot.dataset.rootPrefix || '') : '';

    const markers = [...document.querySelectorAll('.terminal-marker[data-region]')];
    const nearbyTerminalMarkers = [...document.querySelectorAll('.terminal-nearby-marker[data-terminal-type]')];
    if (!markers.length) return;

    const fields = {
        summary: document.getElementById('terminal-summary'),
        region: document.getElementById('terminal-region'),
        filters: document.getElementById('terminal-type-filters'),
        cards: document.getElementById('terminal-card-list'),
        homepage: document.getElementById('region-home-link'),
        map: document.getElementById('terminal-map')
    };
    const mobileMapMedia = window.matchMedia('(max-width: 700px)');
    const mobileMapMarkerReturnDelay = 480;
    let mapZoomResetTimer = null;


    function renderRegionControls() {
        markers.forEach((marker) => {
            const region = regions[marker.dataset.region];
            if (region) {
                marker.classList.add(region.cssPos);
                marker.querySelector('span').textContent = localize(region.label);
                marker.setAttribute('role', 'button');
                marker.setAttribute('aria-label', `${localize(region.label)} 터미널 선택`);
            }
        });
    }

    function syncPrimaryMapMarkerLabel() {
        if (!fields.map) return;
        const isZoomed = fields.map.classList.contains('is-region-zoomed');
        const zoomRegion = isZoomed ? fields.map.dataset.zoomRegion : '';

        markers.forEach((marker) => {
            const region = regions[marker.dataset.region];
            if (!region) return;
            const isZoomedPrimary = isZoomed && marker.dataset.region === zoomRegion;
            const label = marker.querySelector('span');
            if (label) {
                label.textContent = isZoomedPrimary && marker.dataset.zoomLabel ?
                    marker.dataset.zoomLabel :
                    localize(region.label);
            }

            if (isZoomedPrimary && marker.dataset.terminalType) {
                const terminal = region.terminals.find((item) => item.type === marker.dataset.terminalType);
                const terminalName = localize(terminal && terminal.name) || marker.dataset.zoomLabel;
                marker.setAttribute('aria-label', `${terminalName} 정보 보기`);
            } else {
                marker.setAttribute('aria-label', `${localize(region.label)} 터미널 선택`);
            }
        });
    }

    function formatDestination(value) {
        const text = String(value || '').trim();
        if (!text) return '-';
        const parts = text.split('→').map((part) => part.trim()).filter(Boolean);
        return parts.at(-1) || text;
    }


    function createRouteList(terminal) {
        const routes = terminal.routes || [];
        const list = document.createElement('ul');
        list.className = 'terminal-route-list';
        routes.forEach((route) => {
            const item = document.createElement('li');
            item.textContent = formatDestination(localize(route.name));
            list.append(item);
        });
        return list;
    }

    function createTerminalStatusNotice(status) {
        const notice = document.createElement('div');
        const badge = document.createElement('strong');
        const description = document.createElement('p');
        notice.className = `terminal-card-status terminal-card-status--${status}`;
        notice.setAttribute('role', 'status');
        badge.className = 'terminal-card-status-badge';
        if (status === 'partial') {
            badge.textContent = '운항 시간표만 제공';
            description.textContent = '검증된 운항 정보만 제공하며 터미널 기본정보는 준비 중입니다.';
        } else {
            badge.textContent = '운항 정보 준비 중';
            description.textContent = '검증된 터미널 정보와 운항 시간표를 준비하고 있습니다.';
        }
        notice.append(badge, description);
        return notice;
    }

    function createTerminalCard(terminal, region) {
        const card = document.createElement('section');
        const content = document.createElement('div');
        const status = window.getPortalRegionStatus
            ? window.getPortalRegionStatus(region.id, region.status)
            : region.status;

        card.className = 'terminal-card';
        card.setAttribute('aria-label', localize(terminal.name));
        content.className = 'terminal-card-content';

        if (status === 'preparing') {
            content.append(createTerminalStatusNotice(status));
            card.append(content);
            return card;
        }

        if (status === 'partial') {
            content.append(createTerminalStatusNotice(status));
            if ((terminal.routes || []).length) {
                const routes = document.createElement('div');
                const routesTitle = document.createElement('strong');
                routes.className = 'terminal-card-row terminal-card-routes';
                routesTitle.textContent = t('portal.routes');
                routes.append(routesTitle, createRouteList(terminal));
                content.append(routes);
            }
            card.append(content);
            return card;
        }

        const address = document.createElement('div');
        address.className = 'terminal-card-row terminal-card-address';
        address.innerHTML = `<strong>${t('portal.location')}</strong><span></span>`;
        address.querySelector('span').textContent = localize(terminal.address) || '-';

        const phoneRow = document.createElement('div');
        const phoneLink = document.createElement('a');
        phoneRow.className = 'terminal-card-row terminal-card-phone';
        phoneRow.innerHTML = `<strong>${t('portal.phone')}</strong>`;
        phoneLink.textContent = region.phone || '-';
        if (region.phone) phoneLink.href = `tel:${region.phone.replace(/[^\d+]/g, '')}`;
        phoneRow.append(phoneLink);

        const routes = document.createElement('div');
        const routesTitle = document.createElement('strong');
        routes.className = 'terminal-card-row terminal-card-routes';
        routesTitle.textContent = t('portal.routes');
        routes.append(routesTitle, createRouteList(terminal));

        const hours = document.createElement('div');
        const hoursText = document.createElement('span');
        hours.className = 'terminal-card-row terminal-card-hours';
        hours.innerHTML = `<strong>${t('portal.operatingHours')}</strong>`;
        hoursText.textContent = localize(terminal.hours) || '-';
        hours.append(hoursText);



        content.append(address, phoneRow, hours, routes);
        card.append(content);
        return card;
    }

    function renderTerminalCards(region, type = 'all') {
        const terminals = type === 'all' ?
            region.terminals :
            region.terminals.filter((terminal) => terminal.type === type);

        if (!terminals.length) {
            const empty = document.createElement('p');
            empty.className = 'terminal-card-empty';
            empty.setAttribute('role', 'status');
            empty.textContent = type === 'international' ?
                '현재 운항 중인 국제 항로가 없습니다.' :
                '현재 운항 중인 항로가 없습니다.';
            fields.cards.replaceChildren(empty);
            return;
        }

        fields.cards.replaceChildren(...terminals.map((terminal) => (
            createTerminalCard(terminal, region)
        )));
    }

    function selectTerminalType(region, type) {
        fields.filters.querySelectorAll('.terminal-type-filter').forEach((filter) => {
            filter.setAttribute('aria-pressed', String(filter.dataset.type === type));
        });
        let hasNearbySelection = false;
        nearbyTerminalMarkers.forEach((marker) => {
            const selected = marker.dataset.region === region.id && marker.dataset.terminalType === type;
            marker.classList.toggle('is-active', selected);
            marker.setAttribute('aria-pressed', String(selected));
            if (selected) hasNearbySelection = true;
        });
        if (fields.map) fields.map.classList.toggle('has-nearby-selection', hasNearbySelection);
        markers.forEach((marker) => {
            if (marker.dataset.region === region.id) {
                marker.setAttribute('aria-pressed', String(!hasNearbySelection));
            }
        });
        renderTerminalCards(region, type);
    }

    function renderTypeFilters(region, preferredType = '') {
        const availableTypes = [...new Set(region.terminals.map((terminal) => terminal.type))];
        const standardTypes = ['coastal', 'international'];
        const types = [...standardTypes, ...availableTypes.filter((type) => !standardTypes.includes(type))];
        const initialType = availableTypes.includes(preferredType) ? preferredType : (availableTypes[0] || 'all');
        fields.filters.replaceChildren();
        fields.filters.hidden = false;

        types.forEach((type) => {
            const available = availableTypes.includes(type);
            const button = document.createElement('button');
            button.className = 'terminal-type-filter';
            button.type = 'button';
            button.dataset.type = type;
            button.disabled = !available;
            button.setAttribute('aria-disabled', String(!available));
            button.setAttribute('aria-pressed', String(available && type === initialType));
            button.textContent = t(`portal.type.${type}`);
            if (!available) {
                const unavailableMessage = type === 'international' ?
                    '현재 운항 중인 국제 항로가 없습니다.' :
                    '현재 운항 중인 연안 항로가 없습니다.';
                button.title = unavailableMessage;
                button.setAttribute('aria-label', `${button.textContent}. ${unavailableMessage}`);
            } else {
                button.addEventListener('click', () => selectTerminalType(region, type));
            }
            fields.filters.append(button);
        });
        return initialType;
    }

    function renderRegion(id) {
        const region = regions[id];
        if (!region) return;

        markers.forEach((marker) => {
            const selected = marker.dataset.region === id;
            marker.classList.toggle('active', selected);
            marker.setAttribute('aria-pressed', String(selected));
        });

        // region-quick-select 버튼들도 업데이트
        const quickSelectButtons = document.querySelectorAll('.region-quick-btn[data-region]');
        quickSelectButtons.forEach((btn) => {
            const selected = btn.dataset.region === id;
            btn.classList.toggle('active', selected);
            btn.setAttribute('aria-pressed', String(selected));
        });

        const representative = region.terminals[0];
        const regionLabel = localize(region.label) ||
            localize(region.region) ||
            localize(representative.name);
        fields.region.textContent = localize(region.summaryName) || `${regionLabel}항 여객선 터미널`;
        fields.homepage.hidden = !region.folder;
        if (region.folder) fields.homepage.href = `${portalRootPrefix}${region.folder}/index.html`;
        else fields.homepage.removeAttribute('href');
        const primaryMarker = [...markers].find((marker) => marker.dataset.region === id);
        const initialType = renderTypeFilters(region, primaryMarker?.dataset.terminalType);
        selectTerminalType(region, initialType);
        fields.summary.hidden = false;
        fields.summary.setAttribute('aria-busy', 'false');
    }

    function initializeLatestNotices() {
        const list = document.getElementById('portal-latest-notice-list');
        const terminals = window.PORTAL_NOTICE_DATA?.terminals || [];
        if (!list || !terminals.length) return;

        const escapeHtml = window.PortalDomUtils.escapeHtml;
        const notices = terminals.flatMap((terminal) => terminal.notices.map((notice, index) => ({
            ...notice,
            terminalId: terminal.id,
            terminalLabel: terminal.label,
            noticeId: notice.id || `${terminal.id}-${index + 1}`
        }))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

        list.innerHTML = notices.map((notice) => `<li><a href="customer/notice-detail.html?id=${encodeURIComponent(notice.noticeId)}"><span><span class="portal-content-badge${notice.terminalId === 'common' ? ' portal-content-badge--common' : ' portal-content-badge--terminal'}">${escapeHtml(notice.terminalLabel)}</span><b>${escapeHtml(notice.title)}</b></span><time datetime="${escapeHtml(notice.date.replaceAll('.', '-'))}">${escapeHtml(notice.date)}</time></a></li>`).join('');
    }

    function syncZoomedMapMarkers() {
        if (!fields.map) return;
        const isZoomed = fields.map.classList.contains('is-region-zoomed');
        const zoomRegion = isZoomed ? fields.map.dataset.zoomRegion : '';

        markers.forEach((marker) => {
            const visible = !isZoomed || marker.dataset.region === zoomRegion;
            marker.classList.toggle('is-region-visible', isZoomed && visible);
            if (visible) marker.removeAttribute('aria-hidden');
            else marker.setAttribute('aria-hidden', 'true');
        });

        nearbyTerminalMarkers.forEach((marker) => {
            const visible = isZoomed && marker.dataset.region === zoomRegion;
            marker.classList.toggle('is-region-visible', visible);
            if (visible) marker.removeAttribute('aria-hidden');
            else marker.setAttribute('aria-hidden', 'true');
        });
    }

    function resetMapZoom() {
        if (!fields.map || !fields.map.classList.contains('is-region-zoomed')) return;

        if (mapZoomResetTimer) window.clearTimeout(mapZoomResetTimer);

        const sequenceMobileMarkers = mobileMapMedia.matches && !reducedMotion.matches;
        fields.map.classList.toggle('is-region-unzooming', sequenceMobileMarkers);
        fields.map.classList.remove('is-region-zoomed');
        fields.map.removeAttribute('data-zoom-region');
        syncPrimaryMapMarkerLabel();

        if (!sequenceMobileMarkers) {
            syncZoomedMapMarkers();
            return;
        }

        mapZoomResetTimer = window.setTimeout(() => {
            fields.map.classList.remove('is-region-unzooming');
            syncZoomedMapMarkers();
            mapZoomResetTimer = null;
        }, mobileMapMarkerReturnDelay);
    }

    function selectRegionFromControl(id) {
        if (mapZoomResetTimer) {
            window.clearTimeout(mapZoomResetTimer);
            mapZoomResetTimer = null;
            fields.map?.classList.remove('is-region-unzooming');
        }

        const isSameZoomedRegion = Boolean(
            fields.map &&
            fields.map.classList.contains('is-region-zoomed') &&
            fields.map.dataset.zoomRegion === id
        );

        renderRegion(id);

        if (!fields.map) return;

        if (isSameZoomedRegion) {
            resetMapZoom();
            return;
        }

        fields.map.dataset.zoomRegion = id;

        // Commit the selected nationwide-map state before starting the zoom transition.
        void fields.map.offsetWidth;

        fields.map.classList.add('is-region-zoomed');
        syncZoomedMapMarkers();
        syncPrimaryMapMarkerLabel();
    }

    markers.forEach((marker) => {
        marker.addEventListener('click', () => {
            const region = regions[marker.dataset.region];
            const isZoomedPrimaryMarker = Boolean(
                region &&
                fields.map &&
                fields.map.classList.contains('is-region-zoomed') &&
                fields.map.dataset.zoomRegion === marker.dataset.region
            );
            const terminalType = marker.dataset.terminalType;
            const hasTerminalType = region && region.terminals.some((terminal) => terminal.type === terminalType);
            if (isZoomedPrimaryMarker && terminalType && hasTerminalType) {
                selectTerminalType(region, terminalType);
                return;
            }
            selectRegionFromControl(marker.dataset.region);
        });
    });

    nearbyTerminalMarkers.forEach((marker) => {
        marker.addEventListener('click', () => {
            const region = regions[marker.dataset.region];
            if (!region) return;
            const terminalType = marker.dataset.terminalType;
            const hasTerminalType = region.terminals.some((terminal) => terminal.type === terminalType);
            if (!hasTerminalType) return;
            selectTerminalType(region, terminalType);
        });
    });

    if (fields.map) {
        fields.map.addEventListener('click', (event) => {
            if (event.target.closest('button')) return;
            resetMapZoom();
        });
    }
    // region-quick-select 버튼들에 이벤트 리스너 추가
    const quickSelectButtons = document.querySelectorAll('.region-quick-btn[data-region]');
    window.validatePortalRegionKeys?.(
        'portal DOM [data-region]',
        [...document.querySelectorAll('[data-region]')].map((element) => element.dataset.region)
    );
    quickSelectButtons.forEach((button) => {
        button.addEventListener('click', () => selectRegionFromControl(button.dataset.region));
    });

    renderRegionControls();
    renderRegion(portalData.initialRegionId || window.PORTAL_REGION_REGISTRY?.[0]?.key);
    syncZoomedMapMarkers();
    syncPrimaryMapMarkerLabel();
    initializeLatestNotices();
}());
