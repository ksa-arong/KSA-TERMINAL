(function initializeKsaPathResolver() {
  'use strict';

  const locations = Object.freeze({
    portalRoot: 'portal-root',
    portalSubpage: 'portal-subpage',
    region: 'region'
  });

  const defaultConfig = Object.freeze({
    regionsDirectory: 'regions',
    commonDirectory: 'common',
    portalIndex: 'index.html',
    regionIndex: 'index.html'
  });

  function isIndependentUrl(value) {
    return value.startsWith('#') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value);
  }

  function cleanPath(value) {
    return String(value || '').replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\/+/, '');
  }

  function join(prefix, value) {
    const path = String(value || '');
    if (isIndependentUrl(path)) return path;
    return `${prefix}${cleanPath(path)}`;
  }

  function validRegionId(regionId) {
    const value = String(regionId || '').trim();
    if (!value || value === '.' || value === '..' || /[\\/]/.test(value)) {
      throw new TypeError('regionId must be a single region identifier');
    }
    return value;
  }

  function create(options = {}) {
    const location = options.location;
    if (!Object.values(locations).includes(location)) {
      throw new TypeError('location must be portal-root, portal-subpage, or region');
    }

    const config = Object.freeze({ ...defaultConfig, ...(options.config || {}) });
    const currentRegionId = location === locations.region ? validRegionId(options.regionId) : '';
    const portalPrefix = location === locations.portalRoot ? '' : location === locations.portalSubpage ? '../' : '../../';

    function portal(relativePath = config.portalIndex) {
      return join(portalPrefix, relativePath);
    }

    function common(relativePath = '') {
      const path = String(relativePath || '');
      if (isIndependentUrl(path)) return path;
      return join(portalPrefix, `${config.commonDirectory}/${cleanPath(path)}`);
    }

    function asset(relativePath = '') {
      return common(relativePath);
    }

    function region(regionId, relativePath = config.regionIndex) {
      const targetRegionId = validRegionId(regionId);
      const encodedRegionId = encodeURIComponent(targetRegionId);
      if (location === locations.region) {
        if (targetRegionId === currentRegionId) return join('', relativePath);
        return join(`../${encodedRegionId}/`, relativePath);
      }
      return join(`${portalPrefix}${config.regionsDirectory}/${encodedRegionId}/`, relativePath);
    }

    function regionPage(relativePath, regionId = currentRegionId) {
      if (isIndependentUrl(String(relativePath || ''))) return String(relativePath || '');
      if (location !== locations.region) return region(regionId, relativePath);
      return region(regionId, relativePath);
    }

    return Object.freeze({ portal, common, asset, region, regionPage });
  }

  window.KsaPathResolver = Object.freeze({
    locations,
    defaultConfig,
    create
  });
}());
