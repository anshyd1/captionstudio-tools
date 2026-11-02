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
/* Skill2Income Hub Telegram Promotion: Soft Premium Bar + Copy Bonus Modal (100% Google Page Experience Safe) */
(function() {
  'use strict';
  if (window.__CS_TG_PROMO_LOADED) return;
  window.__CS_TG_PROMO_LOADED = true;

  var TG_URL = "https://t.me/skill2incomehub";
  var BAR_ID = "cs-tg-floating-bar";
  var MODAL_ID = "cs-tg-popup-modal";

  function trackTgClick(placement) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'telegram_join_click', {
          placement: placement,
          page_path: location.pathname
        });
      }
    } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById('cs-tg-promo-styles')) return;
    var st = document.createElement('style');
    st.id = 'cs-tg-promo-styles';
    st.textContent =
      '@keyframes csPulseSoft { 0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.45); } 70% { box-shadow: 0 0 0 6px rgba(220,38,38,0); } 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } }' +
      '@keyframes csPopInSoft { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }' +
      '.cs-tg-pulse-dot { display:inline-block;width:7px;height:7px;background:#dc2626;border-radius:50%;animation:csPulseSoft 1.8s infinite; }';
    document.head.appendChild(st);
  }

  function createFloatingBar() {
    var oldPill = document.getElementById('bb-sticky-pill');
    if (oldPill) oldPill.remove();
    var oldDiwa = document.getElementById('diwaok-floating-bar');
    if (oldDiwa) oldDiwa.remove();

    if (document.getElementById(BAR_ID) || sessionStorage.getItem('cs_tg_bar_closed')) return;
    injectStyles();

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.innerHTML =
      '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99990;background:rgba(255,253,249,0.98);backdrop-filter:blur(10px);border-top:1px solid #fde68a;box-shadow:0 -4px 18px rgba(15,23,42,0.07);padding:8px 14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
        '<div style="max-width:1040px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:center;gap:9px;min-width:200px;flex:1;">' +
            '<span style="background:#fffbeb;color:#b45309;border:1px solid #fde68a;padding:4px 8px;border-radius:6px;font-weight:800;font-size:10.5px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;">' +
              '<span class="cs-tg-pulse-dot"></span>SKILL2INCOME' +
            '</span>' +
            '<div style="min-width:0;">' +
              '<div style="font-weight:800;font-size:12.5px;color:#0f172a;line-height:1.25;">' +
                'Daily Student Earning &amp; UPI Cashback Tasks <span style="color:#dc2626;">(₹0 Free Join)</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<a id="cs-tg-bar-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:800;font-size:11.5px;padding:7px 15px;border-radius:50px;text-decoration:none;box-shadow:0 3px 10px rgba(220,38,38,0.22);white-space:nowrap;">' +
              '✈️ Join Telegram ➔' +
            '</a>' +
            '<button id="close-cs-tg-bar" type="button" aria-label="Close" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;padding:2px 6px;line-height:1;">&times;</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);

    var cta = document.getElementById('cs-tg-bar-cta');
    if (cta) cta.addEventListener('click', function() { trackTgClick('sticky_bottom_bar'); });
    var closeBtn = document.getElementById('close-cs-tg-bar');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        bar.remove();
        try { sessionStorage.setItem('cs_tg_bar_closed', '1'); } catch(err){}
      });
    }
  }

  function showCopyBonusModal() {
    if (sessionStorage.getItem('cs_tg_copy_modal_shown')) return;
    try { sessionStorage.setItem('cs_tg_copy_modal_shown', '1'); } catch(e){}
    injectStyles();
    var existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.48);backdrop-filter:blur(4px);' +
      'display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;';

    overlay.innerHTML =
      '<div style="background:#fffdf9;border:1px solid #fde68a;border-radius:18px;max-width:410px;width:100%;padding:22px 20px;box-shadow:0 20px 48px rgba(15,23,42,0.18);text-align:center;position:relative;animation:csPopInSoft 0.24s ease-out;overflow:hidden;">' +
        '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#f59e0b,#dc2626,#f59e0b);"></div>' +
        '<button id="cs-tg-modal-close" type="button" aria-label="Close" style="position:absolute;top:10px;right:12px;background:#ffffff;border:1px solid #e2e8f0;color:#64748b;width:28px;height:28px;border-radius:50%;font-size:16px;cursor:pointer;line-height:1;">&times;</button>' +
        '<div style="display:inline-flex;align-items:center;gap:6px;background:#fffbeb;color:#b45309;border:1px solid #fde68a;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:50px;letter-spacing:0.3px;margin-bottom:10px;">' +
          '✅ COPIED TO CLIPBOARD • CREATOR BONUS' +
        '</div>' +
        '<div style="margin:0 0 6px;font-size:17.5px;font-weight:900;color:#0f172a;line-height:1.3;">' +
          'Copied! Want Daily <span style="color:#dc2626;">₹500–₹2,000</span> Student Earning Updates? ✨' +
        '</div>' +
        '<p style="margin:0 0 14px;font-size:12.8px;color:#475569;line-height:1.55;">' +
          'Join our free <strong>Skill2Income Hub</strong> Telegram community for verified zero-investment student apps, cashback deals &amp; daily UPI earning tasks.' +
        '</p>' +
        '<div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px;font-size:11px;font-weight:700;color:#1e293b;">' +
          '<span style="background:#ffffff;border:1px solid #fde68a;padding:4px 9px;border-radius:6px;">✓ 100% Free</span>' +
          '<span style="background:#ffffff;border:1px solid #fde68a;padding:4px 9px;border-radius:6px;">✓ Direct UPI Apps</span>' +
          '<span style="background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:4px 9px;border-radius:6px;">✓ Student Safe</span>' +
        '</div>' +
        '<a id="cs-tg-modal-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:800;font-size:14px;padding:12px 18px;border-radius:50px;text-decoration:none;box-shadow:0 6px 16px rgba(220,38,38,0.24);">' +
          '<span>✈️ Join @skill2incomehub on Telegram</span><span>➔</span>' +
        '</a>' +
        '<button id="cs-tg-modal-skip" type="button" style="margin-top:10px;background:none;border:none;color:#64748b;font-size:11.5px;font-weight:600;cursor:pointer;text-decoration:underline;">' +
          'Continue browsing on CaptionStudio' +
        '</button>' +
      '</div>';

    document.body.appendChild(overlay);

    function closeModal() {
      if (overlay && overlay.parentNode) overlay.remove();
    }
    var closeB = document.getElementById('cs-tg-modal-close');
    if (closeB) closeB.addEventListener('click', closeModal);
    var skipB = document.getElementById('cs-tg-modal-skip');
    if (skipB) skipB.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    var modalCta = document.getElementById('cs-tg-modal-cta');
    if (modalCta) {
      modalCta.addEventListener('click', function() {
        trackTgClick('copy_modal_cta');
        setTimeout(closeModal, 250);
      });
    }
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn, .copy-button, [data-copy]');
    if (btn) {
      setTimeout(showCopyBonusModal, 350);
    }
    var tgLink = e.target.closest('a[href*="t.me/skill2incomehub"]');
    if (tgLink && tgLink.id !== 'cs-tg-bar-cta' && tgLink.id !== 'cs-tg-modal-cta') {
      trackTgClick(tgLink.getAttribute('data-tg-slot') || 'inline_banner');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(createFloatingBar, 500); });
  } else {
    setTimeout(createFloatingBar, 500);
  }

  window.csOpenTelegramModal = showCopyBonusModal;
})();
