/**
 * theme-toggle.js
 * Toggle Light / Dark mode para os arquivos HTML de docs/
 *
 * - Padrão: modo escuro (identidade visual)
 * - Se o usuário não tem preferência salva, respeita prefers-color-scheme
 * - Persiste a escolha em localStorage
 * - Anti-FOUC: script inline no <head> de cada HTML aplica o tema antes do CSS
 */
(function () {
  'use strict';

  var HTML = document.documentElement;
  var STORAGE_KEY = 'twr-docs-theme';

  function getTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  function currentTheme() {
    return HTML.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      HTML.setAttribute('data-theme', 'light');
    } else {
      HTML.removeAttribute('data-theme');
    }
    saveTheme(theme);
    syncButtons(theme);
  }

  function syncButtons(theme) {
    var isLight = theme === 'light';
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
      btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      btn.title = isLight
        ? 'Modo claro ativo — clique para escuro'
        : 'Modo escuro ativo — clique para claro';
    });
  }

  function init() {
    syncButtons(currentTheme());

    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
      });
    });

    // Reage a mudança de preferência do OS (só se o usuário não salvou nada)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        if (!getTheme()) applyTheme(e.matches ? 'light' : 'dark');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
