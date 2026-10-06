/* CaptionStudio — Cookie consent + Google Consent Mode v2
 * Consent defaults are set inline in each page's <head> (denied globally,
 * granted for South Asia). This file asks the visitor, then updates them.
 */
(function () {
  'use strict';
  var KEY = 'cs_cookie_consent_v1';
  var BANNER_ID = 'cs-consent-banner';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function apply(state) {
    if (typeof window.gtag !== 'function') return;
    var granted = state === 'accepted';
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied'
    });
  }

  function remove() {
    var el = document.getElementById(BANNER_ID);
    if (el) el.remove();
  }

  function decide(state) {
    set(state);
    apply(state);
    remove();
  }

  function show() {
    if (get() || document.getElementById(BANNER_ID)) return;
    var el = document.createElement('div');
    el.id = BANNER_ID;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie consent');
    el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;max-width:520px;margin:0 auto;' +
      'background:#171310;color:#fff;border-radius:14px;padding:14px 16px;' +
      'font:500 13px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.3)';
    el.innerHTML =
      '<div style="margin-bottom:10px">We use cookies for analytics and to show relevant ads. ' +
      'You can accept or decline — the tools work either way. ' +
      '<a href="/privacy" style="color:#ffb59e;text-decoration:underline">Privacy Policy</a></div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
      '<button type="button" data-v="rejected" style="border:1px solid #5b5049;background:transparent;color:#e6ddd6;' +
      'font:600 13px inherit;padding:9px 16px;border-radius:9px;cursor:pointer">Decline</button>' +
      '<button type="button" data-v="accepted" style="border:0;background:#e8440a;color:#fff;' +
      'font:700 13px inherit;padding:9px 18px;border-radius:9px;cursor:pointer">Accept</button>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]');
      if (b) decide(b.getAttribute('data-v'));
    });
  }

  function init() {
    var saved = get();
    if (saved) { apply(saved); return; }
    setTimeout(show, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.csCookieConsent = { reset: function () { set(''); location.reload(); } };
})();
