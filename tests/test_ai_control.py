"""Browser regression checks for ai-control.html.

Run from repo root after installing Playwright + Chromium:
  python -m pip install playwright
  python -m playwright install chromium
  python tests/test_ai_control.py
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from functools import partial

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/redirect':
            self.send_response(302)
            self.send_header('Location', '/ai-control.html')
            self.end_headers()
        elif self.path == '/server-error':
            self.send_error(500)
        else:
            super().do_GET()

    def log_message(self, *args):
        pass


def run():
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(args=['--no-sandbox'])
            for label, width, height in [('desktop', 1440, 900), ('mobile', 390, 844)]:
                page = browser.new_page(viewport={'width': width, 'height': height})
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto(base + '/ai-control.html', wait_until='domcontentloaded')
                page.wait_for_timeout(250)
                geometry = page.evaluate('''() => {
                  const D = JSON.parse(document.querySelector('#dash-data').textContent).data;
                  return {
                  heroY: document.querySelector('.hero').getBoundingClientRect().top,
                  sectionInMain: document.querySelector('main').contains(document.querySelector('#pages')),
                  footerInMain: document.querySelector('main').contains(document.querySelector('footer')),
                  overviewY: document.querySelector('#overview').getBoundingClientRect().top,
                  findingsY: document.querySelector('#findings').getBoundingClientRect().top,
                  bodyWidth: document.documentElement.scrollWidth,
                  range: document.querySelector('#range').innerText,
                  chartNote: document.querySelector('#chartNote').innerText,
                  searchPath: document.querySelector('#chart path[stroke="#191919"]').getAttribute('d'),
                  gscEnd: D.gsc_daily?.at(-1)?.date || null,
                  matchedSearchCount: D.ga_daily.filter(x => D.gsc_daily.some(y => y.date === x.date)).length,
                  missingDays: D.ga_daily.filter(x => !D.gsc_daily.some(y => y.date === x.date)).length
                }
                }''')
                assert geometry['heroY'] < 200, (label, geometry['heroY'])
                assert geometry['sectionInMain'] and geometry['footerInMain'], label
                assert geometry['overviewY'] < geometry['findingsY'], (label, geometry)
                assert geometry['bodyWidth'] == width, (label, geometry['bodyWidth'])
                if geometry['gscEnd']:
                    assert 'Google Search:' in geometry['range'] and geometry['gscEnd'] in geometry['range'], label
                if geometry['missingDays']:
                    assert f"{geometry['missingDays']} din ka Search data abhi available nahi hai" in geometry['chartNote'], label
                # Only dates with actual Search data have points; missing dates do not become zero clicks.
                assert geometry['searchPath'].count('L') + geometry['searchPath'].count('M') == geometry['matchedSearchCount'], label
                page.locator('#pages').scroll_into_view_if_needed()
                page.wait_for_timeout(700)
                assert page.locator('#pages').evaluate('(el) => getComputedStyle(el).opacity') == '1', label
                all_rows = page.locator('#prows tr').count()
                assert all_rows > 0, label
                page.locator('#psearch').fill('bio')
                assert 0 < page.locator('#prows tr').count() < all_rows, label
                page.locator('#psearch').fill('')
                page.locator('#prows tr').first.click()
                assert page.locator('#pdetail').inner_text(), label
                page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
                page.wait_for_timeout(500)
                assert page.locator('#navToggle').is_visible(), label
                page.locator('#navToggle').click()
                assert page.locator('#navToggle').get_attribute('aria-expanded') == 'true', label
                assert page.locator('#navLinks').is_visible(), label
                page.locator('#navToggle').click()
                page.locator('#curl').fill(base + '/missing-page')
                page.locator('#checker button').first.click()
                page.wait_for_function("document.querySelector('#cout').textContent.includes('HTTP 404')")
                assert '/100' not in page.locator('#cout').inner_text(), label
                page.locator('#curl').fill(base + '/server-error')
                page.locator('#checker button').first.click()
                page.wait_for_function("document.querySelector('#cout').textContent.includes('HTTP 500')")
                page.locator('#curl').fill('https://example.com/')
                page.locator('#checker button').first.click()
                assert 'Sirf isi website' in page.locator('#cout').inner_text(), label
                page.locator('#curl').fill(base + '/redirect')
                page.locator('#checker button').first.click()
                page.wait_for_function("document.querySelector('#cout').textContent.includes('Redirect ke baad khula')")
                assert 'HTTP 200' in page.locator('#cout').inner_text(), label
                assert not errors, (label, errors)
                print(f'{label}: layout, chart lag, navigation, page filter, 404/500/external/redirect checker OK')
                page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    run()
