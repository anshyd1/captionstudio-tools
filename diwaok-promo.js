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

  // Also cover hold-to-copy / Ctrl+C / execCommand copies (fires the "copy" event).
  var lastToastAt = 0;
  document.addEventListener('copy', function() {
    var now = Date.now();
    if (now - lastToastAt < 2500) return;
    lastToastAt = now;
    setTimeout(showCopyToast, 300);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(createFloatingBar, 800);
    });
  } else {
    setTimeout(createFloatingBar, 800);
  }
})();
