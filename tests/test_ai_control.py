"""Multi-page control centre browser regression test.
Run: pip install playwright && python -m playwright install chromium && python tests/test_ai_control.py
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ('', 'pages', 'search', 'plan', 'worklog', 'checker', 'agent')


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == '/ai-control':
            self.path = '/ai-control.html'
        elif path.startswith('/ai-control/') and path.rsplit('/', 1)[-1] in ROUTES:
            self.path += '.html'
        elif path == '/redirect':
            self.send_response(302)
            self.send_header('Location', '/ai-control.html')
            self.end_headers()
            return
        elif path == '/server-error':
            self.send_error(500)
            return
        super().do_GET()

    def log_message(self, *args):
        pass


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(args=['--no-sandbox'])
            for label, w, h in [('desktop', 1440, 900), ('mobile', 390, 844)]:
                page = browser.new_page(viewport={'width': w, 'height': h})
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                for route in ROUTES:
                    url = base + '/ai-control' + ('/' + route if route else '')
                    response = page.goto(url, wait_until='domcontentloaded')
                    assert response.status == 200, (route, response.status)
                    expect(page.locator('#topFresh')).to_contain_text('Updated', timeout=10000)
                    assert page.locator('[data-nav].active').count() == 1, route
                    assert page.locator('#app h1').count() == 1, route
                    assert page.evaluate('document.documentElement.scrollWidth') <= w, (label, route)
                    if route == '':
                        assert page.locator('.hero').bounding_box()['y'] < 390
                        expect(page.locator('#app')).to_contain_text('5,977')
                        expect(page.locator('#app')).to_contain_text('GSC data')
                    if route == 'pages':
                        expect(page.locator('#pageCount')).to_contain_text('62 of 62')
                        expect(page.locator('#app')).to_contain_text('One baseline')
                        page.locator('#pageSearch').fill('bio')
                        assert 0 < page.locator('#pageRows tr').count() < 62
                        page.locator('#pageSearch').fill('')
                        page.locator('#pageRows [data-path]').first.click()
                        expect(page.locator('#pageDetail')).to_contain_text('Waiting for another comparable')
                    if route == 'worklog':
                        expect(page.locator('#app')).to_contain_text('1 verified day')
                        expect(page.locator('#app')).to_contain_text('Unverified historic notes')
                    if route == 'agent':
                        expect(page.locator('#app')).to_contain_text('https://captionstudio.in/ai-control/agent')
                        expect(page.locator('#app')).to_contain_text('No scheduler is configured')
                    if route == 'checker':
                        page.locator('#checkUrl').fill(base + '/missing-page')
                        page.locator('#urlForm button').click()
                        expect(page.locator('#urlResult')).to_contain_text('HTTP 404')
                        assert '/100' not in page.locator('#urlResult').inner_text()
                        page.locator('#checkUrl').fill('https://example.com')
                        page.locator('#urlForm button').click()
                        expect(page.locator('#urlResult')).to_contain_text('Only same-origin')
                        page.locator('#checkUrl').fill(base + '/redirect')
                        page.locator('#urlForm button').click()
                        expect(page.locator('#urlResult')).to_contain_text('HTTP 200')
                        page.locator('#topicInput').fill('Diwali captions Instagram')
                        page.locator('#topicForm button').click()
                        expect(page.locator('#topicResult')).to_contain_text('Possible duplicates')
                    assert not errors, (label, route, errors)
                if label == 'mobile':
                    page.goto(base + '/ai-control')
                    page.locator('.menuBtn').click()
                    assert page.locator('.menuBtn').get_attribute('aria-expanded') == 'true'
                    assert page.locator('.side').is_visible()
                guide = page.request.get(base + '/ai-control/AGENT_GUIDE.txt')
                assert guide.status == 200 and 'READ BEFORE WORK' in guide.text()
                print(f'{label}: 7 routes, data, navigation, trends, worklog, agent guide, checks OK')
                page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
