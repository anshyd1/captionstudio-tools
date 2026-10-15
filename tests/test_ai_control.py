"""Multi-page control centre browser regression test.
Run: pip install playwright && python -m playwright install chromium && python tests/test_ai_control.py
"""
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ('', 'pages', 'search', 'plan', 'impact', 'worklog', 'checker', 'agent')


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
                    assert page.locator('nav.sectionNav a').count() >= 1, (label, route)
                    assert page.locator('.nextStep a').count() == 1, (label, route)
                    first_jump = page.locator('nav.sectionNav a').first
                    section_id = first_jump.get_attribute('href')[1:]
                    first_jump.click()
                    assert page.evaluate('location.hash') == '#' + section_id
                    assert page.locator('#' + section_id).count() == 1
                    if route == '':
                        expect(page.locator('#app')).to_contain_text('ek nazar mein saari baat')
                        expect(page.locator('#app')).to_contain_text('Viral page bachana')
                        expect(page.locator('#app')).to_contain_text('Kisne kya kaam kiya')
                        expect(page.locator('#app')).to_contain_text('5,977')
                        expect(page.locator('#app')).to_contain_text('Verified historical change')
                        expect(page.locator('#app')).to_contain_text('5,541 clicks')
                        expect(page.locator('#app')).to_contain_text('GSC data')
                        expect(page.locator('#app')).to_contain_text('Numeric baseline and target pending')
                    if route == 'pages':
                        expect(page.locator('#pageCount')).to_contain_text('62 of 62')
                        expect(page.locator('#app')).to_contain_text('One baseline')
                        page.locator('#pageSearch').fill('bio')
                        assert 0 < page.locator('#pageRows tr').count() < 62
                        page.locator('#pageSearch').fill('')
                        page.locator('#pageRows [data-path]').first.click()
                        expect(page.locator('#pageDetail')).to_contain_text('Waiting for another comparable')
                    if route == 'impact':
                        expect(page.locator('#app')).to_contain_text('Weekly directional balance')
                        expect(page.locator('#app')).to_contain_text('0 up · 4 down · 0 flat')
                        expect(page.locator('#app')).to_contain_text('1,442 → 267')
                        expect(page.locator('#app')).to_contain_text('222 → 182')
                        expect(page.locator('#app')).to_contain_text('34 → 44')
                        expect(page.locator('#app')).to_contain_text('Owner review · five questions')
                        expect(page.locator('#app')).to_contain_text('28d comparison requires 56')
                        expect(page.locator('#app')).to_contain_text('No verified revenue')
                        expect(page.locator('#app')).to_contain_text('Confirmed agent-caused harm')
                        expect(page.locator('#app')).to_contain_text('Agent Raahi')
                        expect(page.locator('#app')).to_contain_text('not assessed')
                    if route == 'worklog':
                        expect(page.locator('#app')).to_contain_text('3 verified days')
                        expect(page.locator('#app')).to_contain_text('Historical notes (not attendance)')
                        expect(page.locator('#attendanceCount')).to_contain_text('2 verified IST day')
                        expect(page.locator('#app')).to_contain_text('Agent Meridian')
                        page.locator('#agentFilter').select_option('legacy')
                        assert page.locator('#attendanceRows .event').count() == 2
                        expect(page.locator('#attendanceRows')).to_contain_text('Start: Not recorded')
                        page.locator('#agentFilter').select_option('raahi-20261013-a6c1')
                        assert page.locator('#attendanceRows .event').count() == 3
                        expect(page.locator('#attendanceRows')).to_contain_text('View commit')
                        expect(page.locator('#attendanceRows')).to_contain_text('Agent Atlas')
                        expect(page.locator('#attendanceRows')).to_contain_text('Verified public protocol correction')
                        expect(page.locator('#attendanceRows')).to_contain_text('Agent Raahi')
                        expect(page.locator('#attendanceRows')).to_contain_text('Verified implementation and deployment')
                        expect(page.locator('#attendanceRows')).to_contain_text('Verified published control-centre feature')
                        expect(page.locator('#attendanceCount')).to_contain_text('1 verified IST day')
                        page.locator('#dateFilter').select_option('2026-10-13')
                        expect(page.locator('#attendanceRows')).to_contain_text('Agent Raahi')
                    if route == 'agent':
                        expect(page.locator('#app')).to_contain_text('https://captionstudio.in/ai-control/agent')
                        expect(page.locator('#app')).to_contain_text('No scheduler is configured')
                        expect(page.locator('#app')).to_contain_text('Choose a distinctive English agent name')
                        expect(page.locator('#app')).to_contain_text('Last verified handoff')
                        expect(page.locator('#app')).to_contain_text('Introduce yourself first')
                        expect(page.locator('#app')).to_contain_text('tools you actually have')
                        expect(page.locator('#app')).to_contain_text('FIRST owner-facing chat reply')
                        assert page.locator('.nextStep a').get_attribute('href') == '/ai-control'
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
                if label == 'desktop':
                    # A missing GSC day invalidates a weekly comparison; it must not become zero.
                    modified = json.loads((ROOT / 'ai-control/snapshot.json').read_text())
                    modified['data']['gsc_daily'] = [x for x in modified['data']['gsc_daily'] if x['date'] != '2026-10-06']
                    page.route('**/ai-control/snapshot.json', lambda route: route.fulfill(json=modified))
                    page.goto(base + '/ai-control/impact', wait_until='domcontentloaded')
                    expect(page.locator('#topFresh')).to_contain_text('Updated')
                    expect(page.locator('#section-impact-4')).to_contain_text('A date is missing or repeated')
                    expect(page.locator('#section-impact-4')).to_contain_text('1,442 → 267')
                    page.unroute_all()
                guide = page.request.get(base + '/ai-control/AGENT_GUIDE.txt')
                assert guide.status == 200 and 'READ BEFORE WORK' in guide.text()
                research = page.request.get(base + '/ai-control/research-june24.txt')
                assert research.status == 200 and '5,541' in research.text()
                print(f'{label}: 8 routes, data, navigation, trends, worklog, agent guide, checks OK')
                page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
