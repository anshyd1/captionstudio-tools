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
/* DiwaOk Gaming Promotion: Floating Sticky Bar + Copy Trigger */
(function() {
  'use strict';
  var DIWAOK_URL = "https://diwaokshare.club?pid=324558753&channel=2010001&pkg=com.diwaok.app";
  var BAR_ID = "diwaok-floating-bar";
  var TOAST_ID = "diwaok-copy-toast";

  function createFloatingBar() {
    if (document.getElementById(BAR_ID) || sessionStorage.getItem('diwaok_bar_closed')) return;

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.innerHTML = 
      '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#ffffff;border-top:3px solid #ff6a00;box-shadow:0 -4px 20px rgba(0,0,0,0.12);padding:10px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
        '<div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:center;gap:10px;min-width:240px;">' +
            '<span style="background:#fff3e6;color:#ff5500;padding:6px 10px;border-radius:10px;font-weight:900;font-size:16px;">🎮</span>' +
            '<div>' +
              '<div style="font-weight:800;font-size:14px;color:#111;line-height:1.2;">DiwaOk: <span style="color:#ff5500;">₹500 Free Bonus</span> + Win ₹1,000 Cash!</div>' +
              '<div style="font-size:11px;color:#666;">Instant UPI Cashout • 100% Real Money Gaming</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<a href="' + DIWAOK_URL + '" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:linear-gradient(135deg,#ff7700,#ff3b00);color:#ffffff;font-weight:800;font-size:13px;padding:9px 18px;border-radius:24px;text-decoration:none;box-shadow:0 3px 10px rgba(255,106,0,0.35);white-space:nowrap;">' +
              '🎁 Claim ₹500 & Play ➔' +
            '</a>' +
            '<button id="close-diwaok-bar" type="button" aria-label="Close" style="background:transparent;border:none;color:#999;font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;">&times;</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);

    document.getElementById('close-diwaok-bar').addEventListener('click', function(e) {
      e.stopPropagation();
      bar.remove();
      try { sessionStorage.setItem('diwaok_bar_closed', '1'); } catch(e){}
    });
  }

  function showCopyToast() {
    var existing = document.getElementById(TOAST_ID);
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = TOAST_ID;
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:999999;' +
      'background:#ffffff;border:2px solid #ff6a00;border-radius:14px;padding:12px 18px;' +
      'box-shadow:0 10px 30px rgba(255,106,0,0.25);display:flex;align-items:center;gap:12px;' +
      'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:slideDown 0.3s ease;max-width:90%;width:auto;';

    toast.innerHTML = 
      '<div style="font-size:20px;">🎉</div>' +
      '<div style="text-align:left;">' +
        '<div style="font-weight:800;font-size:13px;color:#111;">Copied! Claim ₹500 Sign-Up Bonus</div>' +
        '<div style="font-size:11px;color:#666;">Play DiwaOk & Win ₹1,000 Guaranteed Cash</div>' +
      '</div>' +
      '<a href="' + DIWAOK_URL + '" target="_blank" rel="noopener noreferrer" style="background:#ff5500;color:#fff;font-weight:800;font-size:12px;padding:7px 14px;border-radius:20px;text-decoration:none;white-space:nowrap;margin-left:4px;">' +
        'Claim ₹500 ➔' +
      '</a>';

    document.body.appendChild(toast);

    setTimeout(function() {
      if (toast && toast.parentNode) {
        toast.style.transition = 'opacity 0.4s ease';
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 400);
      }
    }, 4500);
  }

  // Hook copy buttons and copy events
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn, .copy-button, [data-copy]');
    if (btn) {
      setTimeout(showCopyToast, 300);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(createFloatingBar, 800);
    });
  } else {
    setTimeout(createFloatingBar, 800);
  }
})();
