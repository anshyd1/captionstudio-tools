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
/* Skill2Income Hub Telegram Promotion: White Minimal + Red Alert Sticky Bar + Copy Trigger */
(function() {
  'use strict';
  if (window.__CS_TG_PROMO_LOADED) return;
  window.__CS_TG_PROMO_LOADED = true;

  var TG_URL = "https://t.me/skill2incomehub";
  var BAR_ID = "cs-tg-floating-bar";
  var TOAST_ID = "cs-tg-copy-toast";

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
      '@keyframes csPulseRed { 0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); } 70% { box-shadow: 0 0 0 8px rgba(220,38,38,0); } 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } }' +
      '@keyframes csSlideDown { from { opacity: 0; transform: translate(-50%, -16px); } to { opacity: 1; transform: translate(-50%, 0); } }' +
      '.cs-tg-pulse-dot { display:inline-block;width:9px;height:9px;background:#dc2626;border-radius:50%;animation:csPulseRed 1.6s infinite; }';
    document.head.appendChild(st);
  }

  function createFloatingBar() {
    // Remove any legacy sticky pills so there is no overlap
    var oldPill = document.getElementById('bb-sticky-pill');
    if (oldPill) oldPill.remove();
    var oldDiwa = document.getElementById('diwaok-floating-bar');
    if (oldDiwa) oldDiwa.remove();

    if (document.getElementById(BAR_ID) || sessionStorage.getItem('cs_tg_bar_closed')) return;
    injectStyles();

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.innerHTML =
      '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#ffffff;border-top:3px solid #dc2626;box-shadow:0 -8px 28px rgba(15,23,42,0.14);padding:10px 14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
        '<div style="max-width:1080px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:center;gap:10px;min-width:210px;flex:1;">' +
            '<span style="background:#fef2f2;color:#dc2626;border:1.5px solid #fecaca;padding:6px 9px;border-radius:10px;font-weight:900;font-size:12px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;">' +
              '<span class="cs-tg-pulse-dot"></span>LIVE' +
            '</span>' +
            '<div style="min-width:0;">' +
              '<div style="font-weight:900;font-size:13.5px;color:#0f172a;line-height:1.25;">' +
                'Hum Roz <span style="color:#dc2626;">₹500–₹2,000 Earn</span> Karwate Hain! 💸' +
              '</div>' +
              '<div style="font-size:11px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
                'Free Telegram Hub • Daily Earning Tasks &amp; Live UPI Proofs' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<a id="cs-tg-bar-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;font-weight:800;font-size:12.5px;padding:9px 16px;border-radius:50px;text-decoration:none;box-shadow:0 4px 12px rgba(220,38,38,0.35);white-space:nowrap;">' +
              '✈️ Join Telegram ➔' +
            '</a>' +
            '<button id="close-cs-tg-bar" type="button" aria-label="Close" style="background:transparent;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:2px 6px;line-height:1;">&times;</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);

    var cta = document.getElementById('cs-tg-bar-cta');
    if (cta) {
      cta.addEventListener('click', function() { trackTgClick('sticky_bottom_bar'); });
    }
    var closeBtn = document.getElementById('close-cs-tg-bar');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        bar.remove();
        try { sessionStorage.setItem('cs_tg_bar_closed', '1'); } catch(err){}
      });
    }
  }

  function showCopyToast() {
    injectStyles();
    var existing = document.getElementById(TOAST_ID);
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = TOAST_ID;
    toast.style.cssText =
      'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:999999;' +
      'background:#ffffff;border:2px solid #dc2626;border-radius:16px;padding:13px 16px;' +
      'box-shadow:0 14px 36px rgba(220,38,38,0.22);display:flex;align-items:center;justify-content:space-between;gap:12px;' +
      'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:csSlideDown 0.28s ease;width:92%;max-width:460px;';

    toast.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;text-align:left;min-width:0;">' +
        '<div style="background:#fef2f2;border:1px solid #fecaca;color:#dc2626;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🚨</div>' +
        '<div style="min-width:0;">' +
          '<div style="font-weight:900;font-size:13px;color:#0f172a;line-height:1.25;">' +
            '✅ Copied! <span style="color:#dc2626;">Roz ₹500–₹1,500 Earn Karein</span>' +
          '</div>' +
          '<div style="font-size:11.5px;color:#475569;margin-top:2px;">' +
            'Hum Khud Earn Karwate Hain • Join Free Telegram' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<a id="cs-tg-toast-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" style="background:#dc2626;color:#fff;font-weight:800;font-size:12px;padding:8px 14px;border-radius:50px;text-decoration:none;white-space:nowrap;box-shadow:0 3px 10px rgba(220,38,38,0.3);flex-shrink:0;">' +
        '✈️ Join Free ➔' +
      '</a>';

    document.body.appendChild(toast);

    var toastCta = document.getElementById('cs-tg-toast-cta');
    if (toastCta) {
      toastCta.addEventListener('click', function() { trackTgClick('copy_toast_modal'); });
    }

    setTimeout(function() {
      if (toast && toast.parentNode) {
        toast.style.transition = 'opacity 0.35s ease';
        toast.style.opacity = '0';
        setTimeout(function() { if (toast && toast.parentNode) toast.remove(); }, 380);
      }
    }, 6500);
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn, .copy-button, [data-copy]');
    if (btn) {
      setTimeout(showCopyToast, 250);
    }
    var tgLink = e.target.closest('a[href*="t.me/skill2incomehub"]');
    if (tgLink && tgLink.id !== 'cs-tg-bar-cta' && tgLink.id !== 'cs-tg-toast-cta') {
      trackTgClick(tgLink.getAttribute('data-tg-slot') || 'inline_banner');
    }
  });

  var lastToastAt = 0;
  document.addEventListener('copy', function() {
    var now = Date.now();
    if (now - lastToastAt < 2500) return;
    lastToastAt = now;
    setTimeout(showCopyToast, 250);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(createFloatingBar, 500);
    });
  } else {
    setTimeout(createFloatingBar, 500);
  }
})();
