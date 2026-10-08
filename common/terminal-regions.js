(function defineTerminalRegions() {
  'use strict';

  const registry = window.PORTAL_REGION_REGISTRY || [];
  window.PORTAL_TERMINAL_REGIONS = Object.freeze(
    registry.map((region) => region.nameKo)
  );
  window.PORTAL_ACTIVE_TERMINAL_FOLDERS = Object.freeze(
    registry.filter((region) => region.hasPage && region.folder).map((region) => region.folder)
  );
}());
