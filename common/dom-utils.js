(function initializePortalDomUtils() {
  window.PortalDomUtils = window.PortalDomUtils || {};
  window.PortalDomUtils.escapeHtml = function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  };
}());
