/* CaptionStudio community and bio navigation measurement. No popups or automatic redirects. */
(function () {
  'use strict';
  if (window.__CS_COMMUNITY_HELPER_LOADED) return;
  window.__CS_COMMUNITY_HELPER_LOADED = true;

  function track(name, params) {
    // Honour an explicit decline; Google Consent Mode handles regional defaults.
    try {
      if (localStorage.getItem('cs_cookie_consent_v1') === 'rejected') return;
    } catch (err) { /* Storage may be unavailable; Google Consent Mode still applies. */ }
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var tgLink = target.closest('a[href*="t.me/skill2incomehub"]');
    if (tgLink) {
      track('community_link_click', {
        placement: tgLink.getAttribute('data-tg-slot') || 'inline_community_card',
        page_path: location.pathname
      });
    }
    var bioLink = target.closest('.cs-bio-silo-bridge a');
    if (bioLink) {
      track('bio_navigation_click', {
        page_path: location.pathname,
        destination_path: bioLink.pathname
      });
    }
  });

  // Count a CTA as visible once per page load after >=50% is visible for 1s.
  // This measures CTA visibility, not total ad impressions or Telegram joins.
  function initVisibility() {
    if (!('IntersectionObserver' in window)) return;
    var timers = new WeakMap();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        clearTimeout(timers.get(el));
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || document.hidden) return;
        timers.set(el, setTimeout(function () {
          if (document.hidden) return;
          track('community_cta_visible', {
            placement: el.getAttribute('data-tg-slot'),
            page_path: location.pathname
          });
          observer.unobserve(el);
        }, 1000));
      });
    }, { threshold: [0, 0.5, 1] });
    document.querySelectorAll('a[data-tg-slot][href*="t.me/skill2incomehub"]').forEach(function (el) {
      observer.observe(el);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) document.querySelectorAll('a[data-tg-slot][href*="t.me/skill2incomehub"]').forEach(function (el) { clearTimeout(timers.get(el)); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVisibility);
  else initVisibility();
})();
