/* Skill2Income Hub Telegram Promotion: Thin Red Border Sticky Bar + Copy & Timed Pop-Up Redirect Modal */
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
      '@keyframes csPulseRed { 0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.55); } 70% { box-shadow: 0 0 0 7px rgba(220,38,38,0); } 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } }' +
      '@keyframes csPopIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }' +
      '@keyframes csShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }' +
      '.cs-tg-pulse-dot { display:inline-block;width:8px;height:8px;background:#dc2626;border-radius:50%;animation:csPulseRed 1.6s infinite; }' +
      '.cs-tg-shimmer-btn { background: linear-gradient(110deg, #dc2626 35%, #f87171 50%, #dc2626 65%); background-size: 200% 100%; animation: csShimmer 2.8s infinite linear; }';
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
      '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99990;background:rgba(255,255,255,0.98);backdrop-filter:blur(10px);border-top:1.5px solid #dc2626;box-shadow:0 -6px 24px rgba(15,23,42,0.1);padding:9px 14px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
        '<div style="max-width:1060px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:center;gap:10px;min-width:200px;flex:1;">' +
            '<span style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;padding:5px 9px;border-radius:8px;font-weight:800;font-size:11px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;">' +
              '<span class="cs-tg-pulse-dot"></span>LIVE' +
            '</span>' +
            '<div style="min-width:0;">' +
              '<div style="font-weight:800;font-size:13px;color:#0f172a;line-height:1.25;">' +
                'Hum Roz <span style="color:#dc2626;">₹500–₹2,000 Earn</span> Karwate Hain! 💸' +
              '</div>' +
              '<div style="font-size:11px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
                'Verified Telegram Tasks • Instant UPI Cashout Proofs' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<a id="cs-tg-bar-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" class="cs-tg-shimmer-btn" style="display:inline-flex;align-items:center;gap:6px;color:#ffffff;font-weight:800;font-size:12px;padding:8px 16px;border-radius:50px;text-decoration:none;box-shadow:0 4px 12px rgba(220,38,38,0.28);white-space:nowrap;">' +
              '✈️ Join Telegram ➔' +
            '</a>' +
            '<button id="close-cs-tg-bar" type="button" aria-label="Close" style="background:transparent;border:none;color:#94a3b8;font-size:19px;cursor:pointer;padding:2px 6px;line-height:1;">&times;</button>' +
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

  function showRedirectModal(mode) {
    injectStyles();
    var existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();

    var isCopy = (mode === 'copy');
    var badgeText = isCopy ? '✅ COPIED TO CLIPBOARD • BONUS UNLOCKED' : '🔴 LIVE EARNING INVITE • @SKILL2INCOMEHUB';
    var titleText = isCopy
      ? 'Copied! Ab Roz <span style="color:#dc2626;">₹500–₹2,000</span> UPI Me Earn Karein 💸'
      : 'Mobile Se Roz <span style="color:#dc2626;">₹500–₹2,000</span> Earn Karna Hai? 💰';

    var overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,0.62);backdrop-filter:blur(5px);' +
      'display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;';

    var secLeft = isCopy ? 4 : 6;
    overlay.innerHTML =
      '<div style="background:#ffffff;border:1.5px solid #dc2626;border-radius:20px;max-width:430px;width:100%;padding:22px 20px;box-shadow:0 24px 60px rgba(15,23,42,0.3);text-align:center;position:relative;animation:csPopIn 0.28s cubic-bezier(0.16,1,0.3,1);overflow:hidden;">' +
        '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#dc2626,#f87171,#dc2626);"></div>' +
        '<button id="cs-tg-modal-close" type="button" aria-label="Close" style="position:absolute;top:10px;right:12px;background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;width:28px;height:28px;border-radius:50%;font-size:16px;cursor:pointer;line-height:1;">&times;</button>' +
        '<div style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:50px;letter-spacing:0.4px;margin-bottom:12px;">' +
          '<span class="cs-tg-pulse-dot"></span>' + badgeText +
        '</div>' +
        '<img src="/img/tg-upi-payout-proof-1.jpg" alt="Daily UPI Earning Proof" width="400" height="225" style="width:100%;height:145px;object-fit:cover;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:12px;" />' +
        '<h3 style="margin:0 0 6px;font-size:18px;font-weight:900;color:#0f172a;line-height:1.3;">' + titleText + '</h3>' +
        '<p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.5;">' +
          '<strong>Hum khud earn karwate hain!</strong> Free Telegram channel join karein — daily zero-investment tasks, AI side-hustles &amp; instant UPI payment proofs.' +
        '</p>' +
        '<div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px;font-size:11px;font-weight:700;color:#1e293b;">' +
          '<span style="background:#f8fafc;border:1px solid #e2e8f0;padding:4px 9px;border-radius:6px;">✓ ₹0 Free</span>' +
          '<span style="background:#f8fafc;border:1px solid #e2e8f0;padding:4px 9px;border-radius:6px;">✓ Instant UPI</span>' +
          '<span style="background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;padding:4px 9px;border-radius:6px;">✓ Verified Hub</span>' +
        '</div>' +
        '<a id="cs-tg-modal-cta" href="' + TG_URL + '" target="_blank" rel="noopener noreferrer" class="cs-tg-shimmer-btn" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;color:#ffffff;font-weight:800;font-size:14.5px;padding:13px 20px;border-radius:50px;text-decoration:none;box-shadow:0 8px 20px rgba(220,38,38,0.32);">' +
          '<span>✈️ Open Telegram &amp; Start Earning</span><span>➔</span>' +
        '</a>' +
        '<div id="cs-tg-countdown-txt" style="margin-top:10px;font-size:11.5px;color:#64748b;font-weight:600;">' +
          '⚡ Auto-opening Telegram invite in <strong style="color:#dc2626;" id="cs-tg-sec">' + secLeft + '</strong>s... <button id="cs-tg-cancel-timer" type="button" style="background:none;border:none;color:#0f172a;text-decoration:underline;font-size:11.5px;font-weight:700;cursor:pointer;margin-left:4px;">Cancel</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var timerCancelled = false;
    var interval = setInterval(function() {
      if (timerCancelled || !document.getElementById(MODAL_ID)) {
        clearInterval(interval);
        return;
      }
      secLeft -= 1;
      var secEl = document.getElementById('cs-tg-sec');
      if (secEl) secEl.textContent = String(secLeft);
      if (secLeft <= 0) {
        clearInterval(interval);
        trackTgClick(isCopy ? 'copy_modal_auto_redirect' : 'timed_modal_auto_redirect');
        var win = null;
        try { win = window.open(TG_URL, '_blank', 'noopener'); } catch(e) {}
        if (!win) { window.location.href = TG_URL; }
        if (overlay && overlay.parentNode) overlay.remove();
      }
    }, 1000);

    function closeModal() {
      timerCancelled = true;
      clearInterval(interval);
      if (overlay && overlay.parentNode) overlay.remove();
    }

    var closeB = document.getElementById('cs-tg-modal-close');
    if (closeB) closeB.addEventListener('click', closeModal);
    var cancelB = document.getElementById('cs-tg-cancel-timer');
    if (cancelB) {
      cancelB.addEventListener('click', function() {
        timerCancelled = true;
        clearInterval(interval);
        var cTxt = document.getElementById('cs-tg-countdown-txt');
        if (cTxt) cTxt.innerHTML = '✓ Auto-redirect paused. Click the red button above whenever ready!';
      });
    }
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    var modalCta = document.getElementById('cs-tg-modal-cta');
    if (modalCta) {
      modalCta.addEventListener('click', function() {
        timerCancelled = true;
        clearInterval(interval);
        trackTgClick(isCopy ? 'copy_modal_cta' : 'timed_modal_cta');
        setTimeout(closeModal, 300);
      });
    }
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn, .copy-button, [data-copy]');
    if (btn) {
      setTimeout(function() { showRedirectModal('copy'); }, 250);
    }
    var tgLink = e.target.closest('a[href*="t.me/skill2incomehub"]');
    if (tgLink && tgLink.id !== 'cs-tg-bar-cta' && tgLink.id !== 'cs-tg-modal-cta') {
      trackTgClick(tgLink.getAttribute('data-tg-slot') || 'inline_banner');
    }
  });

  var lastCopyAt = 0;
  document.addEventListener('copy', function() {
    var now = Date.now();
    if (now - lastCopyAt < 3000) return;
    lastCopyAt = now;
    setTimeout(function() { showRedirectModal('copy'); }, 250);
  });

  function initPromo() {
    setTimeout(createFloatingBar, 400);
    // Show timed popup once per session after 9 seconds if user hasn't seen it yet
    if (!sessionStorage.getItem('cs_tg_timed_popup_shown')) {
      setTimeout(function() {
        if (!document.getElementById(MODAL_ID)) {
          try { sessionStorage.setItem('cs_tg_timed_popup_shown', '1'); } catch(e){}
          showRedirectModal('timed');
        }
      }, 9000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPromo);
  } else {
    initPromo();
  }

  window.csOpenTelegramModal = function() { showRedirectModal('manual'); };
})();
