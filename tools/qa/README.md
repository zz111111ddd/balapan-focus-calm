# QA scripts (Playwright, Python)

Developer-only click tests used to verify every control works. Not needed to run the app.

- `crawl.py <index|single> <fresh|nodemo|demo|v1> <en|ru> <d|m> [screens]` — opens every screen, enumerates every clickable element, clicks each one (after resetting state) and asserts something visibly changes (route, title, storage, sheet, toast, scroll, DOM, focus); collects console errors / uncaught rejections; then plays the Games flow (tab → every card → every level → back).
- `realmouse.py <index|single> <fresh|demo> <en|ru> <width|m>` — real pointer: `elementFromPoint` at the centre of every control (nothing may cover it), Games tab clicked with `page.mouse` / `touchscreen.tap` from every screen (incl. mid-quiz, with a sheet open, inside every game), every game card / level / exit by coordinates, and a leave-animation race.
- `widths3.py <url>` — header controls at 900–1536 px with a wide fallback font (Windows 125–150 % scaling).
- `summarize.py` — prints the totals from `/tmp/crawl/*.json`.

Paths assume the zip is extracted to `/tmp/crawlroot` and `balapan-single.html` copied alone to `/tmp/iso`.
