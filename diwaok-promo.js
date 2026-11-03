/* CaptionStudio Community Analytics Helper — Zero Popups, Zero Sticky Overlays, 100% AdSense & Core Web Vitals Safe */
(function() {
  'use strict';
  if (window.__CS_COMMUNITY_HELPER_LOADED) return;
  window.__CS_COMMUNITY_HELPER_LOADED = true;

  document.addEventListener('click', function(e) {
    var tgLink = e.target && e.target.closest ? e.target.closest('a[href*="t.me/skill2incomehub"]') : null;
    if (tgLink && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'community_link_click', {
          placement: tgLink.getAttribute('data-tg-slot') || 'inline_community_card',
          page_path: location.pathname
        });
      } catch (err) {}
    }
  });
})();
