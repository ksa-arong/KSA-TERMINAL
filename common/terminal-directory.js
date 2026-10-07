(function initializeTerminalDirectory() {
    'use strict';

    const form = document.querySelector('.portal-terminal-directory-search');
    const regionSelect = document.getElementById('terminal-region-select');
    const queryInput = document.getElementById('terminal-query-search');
    const count = document.getElementById('terminal-directory-count');
    const tableWrap = document.querySelector('.portal-terminal-directory-table-wrap');
    const results = document.getElementById('terminal-directory-results');
    const pagination = document.querySelector('.portal-pagination');
    const emptyMessage = document.querySelector('.portal-terminal-directory-empty');
    const pageSize = 10;
    let currentPage = 1;
    if (!form || !regionSelect || !queryInput || !count || !tableWrap || !results || !pagination || !emptyMessage) return;

    const terminals = [
        { region: '보령', name: '오천항 여객터미널', address: '충남 보령시 오천면 오천해안로 782-13' },
        { region: '보령', name: '대천연안여객터미널', address: '충남 보령시 대천항중앙길 30' },
        { region: '군산', name: '군산항 연안여객터미널', address: '전북특별자치도 군산시 소룡동 1668' },
        { region: '군산', name: '군산항 국제여객터미널', address: '전북특별자치도 군산시 임해로 378-14' },
        { region: '목포', name: '목포항 연안여객터미널', address: '전남광주통합특별시 목포시 해안로 182' },
        { region: '목포', name: '목포항 국제여객터미널', address: '전남광주통합특별시 목포시 해안로148번길 14' },
        { region: '목포', name: '흑산도항 여객터미널', address: '전남광주통합특별시 신안군 흑산면 예리1길 41-19' },
        { region: '목포', name: '홍도항 여객선터미널', address: '전남광주통합특별시 신안군 흑산면 홍도리 94-8' },
        { region: '완도', name: '완도항 여객선터미널', address: '전남광주통합특별시 완도군 완도읍 장보고대로 339' },
        { region: '완도', name: '진도항 여객선터미널', address: '전남광주통합특별시 진도군 임회면 진도항길 90' },
        { region: '완도', name: '땅끝항 여객선터미널', address: '전남광주통합특별시 해남군 송지면 땅끝마을길 111 1층' },
        { region: '여수', name: '녹동신항 여객선터미널', address: '전남광주통합특별시 고흥군 도양읍 비봉로 266-16' },
        { region: '여수', name: '나로도 여객선터미널', address: '전남광주통합특별시 고흥군 봉래면 나로도항길 120-7' },
        { region: '여수', name: '거문도 여객선터미널', address: '전남광주통합특별시 여수시 삼산면 거문길 103' },
        { region: '제주', name: '제주항 연안여객터미널', address: '제주특별자치도 제주시 임항로 111' },
        { region: '제주', name: '제주항 국제여객터미널', address: '제주특별자치도 제주시 임항로 191' },
        { region: '제주', name: '서귀포 강정크루즈터미널', address: '제주특별자치도 서귀포시 말질로 261' },
        { region: '통영', name: '통영항 연안여객선터미널', address: '경남 통영시 통영해안로 234' },
        { region: '통영', name: '삼천포신항 연안여객선터미널', address: '경남 사천시 신항만1길 76' },
        { region: '포항', name: '포항 연안여객터미널', address: '경북 포항시 북구 해안로 44' },
        { region: '포항', name: '포항 국제여객터미널', address: '경북 포항시 북구 흥해읍 용한리 853' },
        { region: '포항', name: '울릉(사동)항 여객선터미널', address: '경북 울릉군 울릉읍 울릉순환로 785-25' },
        { region: '동해', name: '속초항 여객선터미널', address: '강원특별자치도 속초시 설악금강대교로 230' },
        { region: '동해', name: '동해항 국제여객터미널', address: '강원특별자치도 속초시 설악금강대교로 136-58' }
    ].sort((a, b) => a.region.localeCompare(b.region, 'ko-KR'));
    const homepageByRegion = {
        '보령': 'https://www.shinhanhewoon.com/',
        '군산': 'http://www.shidaoferry.com/',
        '목포': 'https://seaferry.co.kr/',
        '완도': 'https://www.hanilexpress.co.kr/',
        '여수': 'https://www.hanilexpress.co.kr/',
        '제주': 'https://seaferry.co.kr/',
        '통영': 'https://island.theksa.co.kr/',
        '포항': 'https://www.daezer.com/',
        '동해': 'https://www.dwship.co.kr/'
    };
    const regionFolderByName = {
        '군산': 'gunsan',
        '목포': 'mokpo',
        '완도': 'wando',
        '여수': 'yeosu',
        '제주': 'jeju',
        '통영': 'tongyeong',
        '포항': 'pohang'
    };
    const regionStatusByName = Object.fromEntries(
        Object.entries(regionFolderByName).map(([region, folder]) => [
            region,
            window.getPortalRegionStatus?.(folder)
        ])
    );
    terminals.forEach((terminal) => {
        if (regionStatusByName[terminal.region] === 'preparing') terminal.verified = false;
    });
    const normalize = (value) => String(value || '').trim().toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ');

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = '전체 터미널';
    regionSelect.append(allOption);
    const terminalRegions = Array.isArray(window.PORTAL_TERMINAL_REGIONS)
        ? window.PORTAL_TERMINAL_REGIONS
        : [...new Set(terminals.map((terminal) => terminal.region))];
    [...terminalRegions]
      .sort((a, b) => a.localeCompare(b, 'ko-KR'))
      .forEach((region) => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.append(option);
      });

    function createCell(text, className = '') {
        const cell = document.createElement('td');
        cell.textContent = text || '';
        if (className) cell.className = className;
        return cell;
    }

    function createActionLink(terminal, label, href) {
        const link = document.createElement('a');
        link.className = 'btn btn--md btn--outline';
        link.href = href;
        if (/^https?:\/\//.test(href)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        const labelText = document.createElement('span');
        labelText.textContent = label;
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'line-icon portal-terminal-directory-action-icon');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '1.5');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = label === '위치안내'
            ? '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>'
            : '<path d="M15 3h6v6"></path><path d="m10 14 11-11"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>';
        link.append(icon, labelText);
        link.setAttribute('aria-label', `${terminal.name} ${label}${link.target ? ' (새 창)' : ''}`);
        return link;
    }

    function createLinkCell(terminal, label, href) {
        const cell = createCell('', 'portal-terminal-directory-action');
        cell.append(createActionLink(terminal, label, href));
        return cell;
    }

    function terminalHomepage(terminal) {
        if (regionStatusByName[terminal.region] === 'preparing') {
            return `../${regionFolderByName[terminal.region]}/index.html`;
        }
        if (terminal.region === '포항' && terminal.name.includes('울릉')) return 'https://www.ulcruise.co.kr/';
        return homepageByRegion[terminal.region];
    }

    function createMobileEntry(terminal) {
        const entry = document.createElement('div');
        entry.className = 'portal-terminal-directory-mobile-entry';

        const info = document.createElement('div');
        info.className = 'portal-terminal-directory-mobile-info';
        const heading = document.createElement('div');
        heading.className = 'portal-terminal-directory-mobile-heading';
        const region = document.createElement('span');
        region.textContent = terminal.region;
        const name = document.createElement('strong');
        name.textContent = terminal.name;
        const address = document.createElement('p');
        const preparing = regionStatusByName[terminal.region] === 'preparing';
        address.textContent = preparing ? '검증된 정보 준비 중' : terminal.address;
        heading.append(region, name);
        info.append(heading, address);

        const actions = document.createElement('div');
        actions.className = 'portal-terminal-directory-mobile-actions';
        if (preparing) {
            actions.append(createActionLink(terminal, '지역 안내', terminalHomepage(terminal)));
        } else {
            actions.append(
                createActionLink(terminal, '홈페이지', terminalHomepage(terminal)),
                createActionLink(terminal, '위치안내', `https://map.kakao.com/link/search/${encodeURIComponent(terminal.address)}`)
            );
        }
        entry.append(info, actions);
        return entry;
    }

    function createRow(terminal) {
        const row = document.createElement('tr');
        const nameCell = createCell('', 'portal-terminal-directory-name');
        const name = document.createElement('strong');
        const preparing = regionStatusByName[terminal.region] === 'preparing';

        name.textContent = terminal.name;
        nameCell.append(name, createMobileEntry(terminal));
        row.append(
            createCell(terminal.region, 'portal-terminal-directory-region'),
            nameCell,
            createCell(preparing ? '검증된 정보 준비 중' : terminal.address, 'portal-terminal-directory-address'),
            preparing ? createCell('준비 중', 'portal-terminal-directory-action') : createLinkCell(terminal, '위치안내', `https://map.kakao.com/link/search/${encodeURIComponent(terminal.address)}`),
            createLinkCell(terminal, preparing ? '지역 안내' : '홈페이지', terminalHomepage(terminal))
        );
        return row;
    }

    function filterTerminals(resetPage = false) {
        if (resetPage) currentPage = 1;
        const selectedRegion = regionSelect.value;
        const query = normalize(queryInput.value);
        const matches = terminals.filter((terminal) => {
            const searchableAddress = regionStatusByName[terminal.region] === 'preparing' ? '' : terminal.address;
            const searchableText = normalize(`${terminal.name} ${searchableAddress} ${terminal.region}`);
            return (selectedRegion === 'all' || terminal.region === selectedRegion) &&
                (!query || searchableText.includes(query));
        });
        const totalPages = Math.ceil(matches.length / pageSize);
        currentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
        const pageStart = (currentPage - 1) * pageSize;
        const visibleTerminals = matches.slice(pageStart, pageStart + pageSize);

        results.replaceChildren(...visibleTerminals.map(createRow));
        count.textContent = String(matches.length);
        tableWrap.hidden = matches.length === 0;
        emptyMessage.hidden = matches.length !== 0;
        window.PortalPagination.renderPagination(pagination, currentPage, totalPages, (page) => {
            currentPage = page;
            filterTerminals();
            tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        filterTerminals(true);
    });
    regionSelect.addEventListener('change', () => filterTerminals(true));
    queryInput.addEventListener('input', () => filterTerminals(true));
    filterTerminals(true);
}());
