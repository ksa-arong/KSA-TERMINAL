(function definePortalTerminalMap() {
    'use strict';

    const escapeHtml = window.PortalDomUtils?.escapeHtml || ((value) => String(value || ''));
    const defaultRegionKey = (window.PORTAL_REGION_REGISTRY || []).find((region) => region.isDefault)?.key;
    const regionQuickButtons = (window.PORTAL_REGION_REGISTRY || []).map((region) => `
                            <button type="button" class="btn btn--region btn--pill btn--outline region-quick-btn${region.key === defaultRegionKey ? ' active' : ''}" data-region="${escapeHtml(region.key)}" aria-pressed="${String(region.key === defaultRegionKey)}">
                        ${escapeHtml(region.portalLabelKo || region.nameKo)}
                        <span class="arr">
                            <svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                        </span>
                    </button>`).join('');

    const markup = String.raw `<div class="terminal-explorer">
                    <div class="portal-section-heading section-title section-title--light section-title--left">
                        <span class="section-title__eyebrow">TERMINAL NETWORK</span>
                        <h2 class="portal-terminal-section-title terminal-main-title" id="terminal-list-title" data-i18n="portal.networkTitle">전국 주요 터미널</h2>
                    </div>
                    <div class="terminal-explorer-content">
                        <div class="region-quick-select">${regionQuickButtons}
                        </div>
                        <article class="terminal-summary" id="terminal-summary" aria-live="polite" aria-busy="true" hidden>
                            <div class="terminal-summary-head">
                                <div class="terminal-summary-title">
                                    <strong id="terminal-region"></strong>
                                </div>
                                <a class="btn btn--md btn--outline-inverse" id="region-home-link" href="#terminal-summary">
                                    <span data-i18n="portal.homepage">홈페이지 바로가기</span>
                                    <svg class="line-icon terminal-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
                                </a>
                            </div>
                            <div class="terminal-summary-body">
                                <div class="terminal-type-filters" id="terminal-type-filters" role="group" aria-label="터미널 유형 선택" data-i18n-attr="aria-label:portal.typeFilterAria" hidden></div>
                                <div class="terminal-card-list" id="terminal-card-list"></div>
                            </div>
                        </article>
                    </div>
                    <div class="terminal-map-card" aria-label="전국 여객선터미널 위치 선택 지도">
                        <div class="korea-map" id="terminal-map">
                            <div class="terminal-marker-layer">
                            <button class="terminal-marker marker-incheon active" type="button" data-region="incheon" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="true"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--incheon-intl" type="button" data-region="incheon" data-terminal-type="international" aria-pressed="false" aria-label="인천항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>

                            <button class="terminal-marker marker-boryeong" type="button" data-region="boryeong" data-terminal-type="coastal" data-zoom-label="대천" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--boryeong-international" type="button" data-region="boryeong" data-terminal-type="international" aria-pressed="false" aria-label="대천항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--boryeong-ocheon" type="button" data-region="boryeong" data-terminal-type="ocheon" aria-pressed="false" aria-label="오천항여객선터미널 정보 보기"><i aria-hidden="true"></i><span>오천항</span></button>

                            <button class="terminal-marker marker-gunsan" type="button" data-region="gunsan" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--gunsan-intl" type="button" data-region="gunsan" data-terminal-type="international" aria-pressed="false" aria-label="군산항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>

                            <button class="terminal-marker marker-mokpo" type="button" data-region="mokpo" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--mokpo-intl" type="button" data-region="mokpo" data-terminal-type="international" aria-pressed="false" aria-label="목포항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--mokpo-heuksando" type="button" data-region="mokpo" data-terminal-type="heuksando" aria-pressed="false" aria-label="흑산도항여객터미널 정보 보기"><i aria-hidden="true"></i><span>흑산도항</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--mokpo-hongdo" type="button" data-region="mokpo" data-terminal-type="hongdo" aria-pressed="false" aria-label="홍도항여객터미널 정보 보기"><i aria-hidden="true"></i><span>홍도항</span></button>

                            <button class="terminal-marker marker-wando" type="button" data-region="wando" data-terminal-type="coastal" data-zoom-label="완도항" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--wando-international" type="button" data-region="wando" data-terminal-type="international" aria-pressed="false" aria-label="완도항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--wando-jindo" type="button" data-region="wando" data-terminal-type="jindo" aria-pressed="false" aria-label="진도항여객선터미널 정보 보기"><i aria-hidden="true"></i><span>진도항</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--wando-ttangkkeut" type="button" data-region="wando" data-terminal-type="ttangkkeut" aria-pressed="false" aria-label="땅끝항여객선터미널 정보 보기"><i aria-hidden="true"></i><span>땅끝항</span></button>

                            <button class="terminal-marker marker-yeosu" type="button" data-region="yeosu" data-terminal-type="nokdong" data-zoom-label="녹동신항" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--yeosu-international" type="button" data-region="yeosu" data-terminal-type="international" aria-pressed="false" aria-label="여수항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--yeosu-expo" type="button" data-region="yeosu" data-terminal-type="expo" aria-pressed="false" aria-label="여수 엑스포여객터미널 정보 보기"><i aria-hidden="true"></i><span>엑스포</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--yeosu-narodo" type="button" data-region="yeosu" data-terminal-type="narodo" aria-pressed="false" aria-label="나로도항여객선터미널 정보 보기"><i aria-hidden="true"></i><span>나로도</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--yeosu-geomundo" type="button" data-region="yeosu" data-terminal-type="geomundo" aria-pressed="false" aria-label="거문도항여객선터미널 정보 보기"><i aria-hidden="true"></i><span>거문도</span></button>

                            <button class="terminal-marker marker-tongyeong" type="button" data-region="tongyeong" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--tongyeong-international" type="button" data-region="tongyeong" data-terminal-type="international" aria-pressed="false" aria-label="통영항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--tongyeong-samcheonpo" type="button" data-region="tongyeong" data-terminal-type="samcheonpo" aria-pressed="false" aria-label="삼천포신항여객터미널 정보 보기"><i aria-hidden="true"></i><span>삼천포신항</span></button>

                            <button class="terminal-marker marker-busan" type="button" data-region="busan" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--busan-international" type="button" data-region="busan" data-terminal-type="international" aria-pressed="false" aria-label="부산항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--busan-yeongdo-cruise" type="button" data-region="busan" data-terminal-type="yeongdoCruise" aria-pressed="false" aria-label="영도 크루즈터미널 정보 보기"><i aria-hidden="true"></i><span>영도 크루즈</span></button>

                            <button class="terminal-marker marker-donghae" type="button" data-region="donghae" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--donghae-sokcho" type="button" data-region="donghae" data-terminal-type="sokcho" aria-pressed="false" aria-label="속초항여객터미널 정보 보기"><i aria-hidden="true"></i><span>속초항</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--donghae-international" type="button" data-region="donghae" data-terminal-type="international" aria-pressed="false" aria-label="동해항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>

                            <button class="terminal-marker marker-pohang" type="button" data-region="pohang" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--pohang-intl" type="button" data-region="pohang" data-terminal-type="international" aria-pressed="false" aria-label="포항항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--pohang-dodong" type="button" data-region="pohang" data-terminal-type="ulleungDodong" aria-pressed="false" aria-label="울릉 도동 여객터미널 정보 보기"><i aria-hidden="true"></i><span>도동</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--pohang-sadong" type="button" data-region="pohang" data-terminal-type="ulleungSadong" aria-pressed="false" aria-label="울릉 사동 여객터미널 정보 보기"><i aria-hidden="true"></i><span>사동</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--pohang-jeodong" type="button" data-region="pohang" data-terminal-type="ulleungJeodong" aria-pressed="false" aria-label="울릉 저동 여객터미널 정보 보기"><i aria-hidden="true"></i><span>저동</span></button>

                            <button class="terminal-marker marker-jeju" type="button" data-region="jeju" data-terminal-type="coastal" data-zoom-label="연안" aria-pressed="false"><i aria-hidden="true"></i><span></span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--jeju-intl" type="button" data-region="jeju" data-terminal-type="international" aria-pressed="false" aria-label="제주항 국제여객터미널 정보 보기"><i aria-hidden="true"></i><span>국제</span></button>
                            <button class="terminal-nearby-marker terminal-nearby-marker--jeju-seogwipo" type="button" data-region="jeju" data-terminal-type="seogwipo" aria-pressed="false" aria-label="서귀포항여객터미널 정보 보기"><i aria-hidden="true"></i><span>서귀포</span></button>
                            </div>
                        </div>
                    </div>
                </div>`;

    function applyCanonicalRegionOrder(root) {
        const container = root.querySelector('.region-quick-select');
        if (!container) return;
        const orderByKey = new Map((window.PORTAL_REGION_REGISTRY || []).map((region) => [region.key, region.order]));
        [...container.querySelectorAll('.region-quick-btn')]
            .sort((a, b) => (orderByKey.get(a.dataset.region) || Number.MAX_SAFE_INTEGER)
                - (orderByKey.get(b.dataset.region) || Number.MAX_SAFE_INTEGER))
            .forEach((button) => container.append(button));
    }

    function render(root) {
        if (!root) return;
        root.innerHTML = markup;
        applyCanonicalRegionOrder(root);
        if (window.i18n) window.i18n.translateDocument(root);
    }

    function renderAll() {
        document.querySelectorAll('[data-portal-map-root]').forEach(render);
    }

    window.validatePortalRegionKeys?.(
        'common/portal-map.js [data-region]',
        [...markup.matchAll(/data-region="([^"]+)"/g)].map((match) => match[1])
    );
    window.PortalTerminalMap = { render, renderAll };
    renderAll();
}());
