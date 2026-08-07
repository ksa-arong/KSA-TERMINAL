(function () {
  'use strict';

  const dictionaries = window.I18N || (window.I18N = {});
  const warned = new Set();
  let warnMissing = Boolean(window.I18N_CONFIG && window.I18N_CONFIG.warnMissing);

  function languageFromUrl() {
    const path = decodeURIComponent(window.location.pathname || '').replaceAll('\\', '/');
    return /(^|\/)en(\/|$)/i.test(path) ? 'en' : 'ko';
  }

  const language = languageFromUrl();

  function get(object, key) {
    return key.split('.').reduce((value, part) => value && value[part], object);
  }

  function usable(value) {
    return value !== undefined && value !== null && value !== '';
  }

  function interpolate(value, params) {
    return String(value).replace(/\{([^}]+)\}/g, (_, name) => (
      Object.prototype.hasOwnProperty.call(params, name) ? params[name] : `{${name}}`
    ));
  }

  function t(key, params = {}) {
    const current = get(dictionaries[language], key);
    const korean = get(dictionaries.ko, key);
    const value = usable(current) ? current : usable(korean) ? korean : key;
    if (warnMissing && !usable(current) && !warned.has(`${language}:${key}`)) {
      warned.add(`${language}:${key}`);
      console.warn(`[i18n] Missing ${language} translation: ${key}`);
    }
    return interpolate(value, params);
  }

  function localize(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    if (!Object.prototype.hasOwnProperty.call(value, 'ko') && !Object.prototype.hasOwnProperty.call(value, 'en')) return value;
    const selected = value[language];
    return usable(selected) ? selected : usable(value.ko) ? value.ko : usable(value.en) ? value.en : '';
  }

  function translateDocument(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      element.dataset.i18nAttr.split(';').forEach((binding) => {
        const [attribute, key] = binding.split(':').map((part) => part.trim());
        if (attribute && key) element.setAttribute(attribute, t(key));
      });
    });
  }

  document.documentElement.lang = language;
  window.i18n = {
    language,
    t,
    localize,
    translateDocument,
    setMissingWarnings(enabled) { warnMissing = Boolean(enabled); }
  };
  document.dispatchEvent(new CustomEvent('i18n:ready'));
}());
