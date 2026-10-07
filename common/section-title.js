(function () {
  'use strict';

  const escapeHtml = window.PortalDomUtils.escapeHtml;

  function render({
    align = 'center',
    theme = 'light',
    eyebrow = '',
    title = '',
    subtitle = '',
    titleId = ''
  } = {}) {
    const resolvedAlign = align === 'left' ? 'left' : 'center';
    const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    const idAttribute = titleId ? ` id="${escapeHtml(titleId)}"` : '';

    return `
      <div class="section-title section-title--${resolvedAlign} section-title--${resolvedTheme}">
        ${eyebrow ? `<p class="section-title__eyebrow">${escapeHtml(eyebrow)}</p>` : ''}
        <h2 class="section-title__title"${idAttribute}>${escapeHtml(title)}</h2>
        ${subtitle ? `<p class="section-title__subtitle">${escapeHtml(subtitle)}</p>` : ''}
      </div>`;
  }

  window.SectionTitle = { render };
})();
