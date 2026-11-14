"""Real-pointer test. usage: realmouse.py <index|single> <fresh|demo> <en|ru> <width|m>
1) every screen: every visible clickable -> elementFromPoint at its center must be the element (or inside it) => not covered.
2) Games nav clicked with page.mouse / touchscreen.tap at coordinates from every screen (incl. mid-quiz, open sheet, inside games).
3) every game card, every level button, exit button - by coordinates.
4) leave-animation race: exit game, then Diary 60ms later."""
import sys, json
from playwright.sync_api import sync_playwright
which, state, lang, dev = sys.argv[1:5]
BASE = {"index": "file:///tmp/crawlroot/balapan-focus-calm/index.html", "single": "file:///tmp/iso/balapan-single.html"}[which]
MOB = dev == "m"; W = 390 if MOB else int(dev)
TAG = f"{which}-{state}-{lang}-{dev}"
ERRS = []
COVER = r"""() => {
  const sel = 'a[href], button, select, input, textarea, summary, [role=button], [role=tab], [data-lv], [data-game], label.switch, label.toggle-row';
  const out = []; let n = 0; document.documentElement.style.scrollBehavior = 'auto';
  const sheetOpen = !!document.querySelector('.sheet');
  for (const el of document.querySelectorAll(sel)) {
    if (el.closest('#printArea') || el.matches('.skip')) continue;
    if (sheetOpen && !el.closest('.sheet')) continue;
    if (el.disabled) continue;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    if (el.checkVisibility && !el.checkVisibility({contentVisibilityAuto: true, visibilityProperty: true, opacityProperty: true})) continue;
    let hid = false, p = el; while (p && p.nodeType === 1) { const c = getComputedStyle(p); if (c.display === 'none' || c.visibility === 'hidden' || c.pointerEvents === 'none' && p === el) { hid = true; break; } p = p.parentElement; } if (hid) continue;
    if (getComputedStyle(el).position !== 'fixed') el.scrollIntoView({block: 'center', inline: 'nearest', behavior: 'instant'});
    const rs = el.getClientRects(); const q = (getComputedStyle(el).display === 'inline' && rs.length) ? rs[0] : el.getBoundingClientRect(); const x = q.left + q.width / 2, y = q.top + q.height / 2; n++;
    const name = el.tagName + '.' + String(el.className.baseVal ?? el.className).slice(0,30) + ' "' + (el.innerText||el.getAttribute('aria-label')||el.getAttribute('title')||el.value||'').trim().replace(/\s+/g,' ').slice(0,30) + '"';
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) { out.push({el: name, by: 'OFFSCREEN'}); continue; }
    const hit = document.elementFromPoint(x, y);
    const lab = hit && hit.closest && hit.closest('label');
    if (!hit || !(el === hit || el.contains(hit) || (lab && lab.contains(el)))) out.push({el: name, by: hit ? hit.tagName + '.' + String(hit.className.baseVal ?? hit.className).slice(0,30) + (hit.id ? '#' + hit.id : '') : 'null'});
  }
  scrollTo({top: 0, behavior: 'instant'}); document.documentElement.style.scrollBehavior = '';
  return {n, out};
}"""
def tap(pg, sel, timeout=3000):
    loc = pg.locator(sel).first
    loc.wait_for(state="visible", timeout=timeout)
    loc.scroll_into_view_if_needed(timeout=timeout); pg.wait_for_timeout(60)
    bb = loc.bounding_box(); x, y = bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2
    if MOB: pg.touchscreen.tap(x, y)
    else: pg.mouse.move(x, y, steps=3); pg.mouse.down(); pg.mouse.up()
res = {"tag": TAG, "checked": {}, "covered": {}, "nav": {}, "cards": 0, "levels": 0, "exits": 0, "race": None, "errors": []}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W, "height": 844 if MOB else 760}, is_mobile=MOB, has_touch=MOB)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: ERRS.append("pageerror: " + str(e)))
    pg.on("console", lambda m: ERRS.append("console.error: " + m.text) if m.type == "error" else None)
    pg.on("dialog", lambda d: d.dismiss())
    pg.goto(BASE); pg.evaluate("localStorage.clear()"); pg.evaluate("l => localStorage.setItem('balapan.lang', l)", lang)
    pg.goto("about:blank"); pg.goto(BASE + "#/"); pg.wait_for_timeout(500)
    if state == "demo": pg.evaluate("()=>{ const d = BF.store.children().find(c=>c.isDemo); BF.store.setActive(d.id); }")
    snap = pg.evaluate("JSON.stringify(Object.assign({}, localStorage))")
    def load(route):
        pg.evaluate("s => { localStorage.clear(); const o = JSON.parse(s); for (const k in o) localStorage.setItem(k, o[k]); }", snap)
        pg.goto("about:blank"); pg.goto(BASE + "#/" + route); pg.wait_for_timeout(450)
    games = pg.evaluate("BF.GAME_ORDER")
    plans = pg.evaluate("Object.entries(BF.store.s.plans).slice(0,1).map(([id,p]) => (p.tag==='adhd'?'quest/':'brave/')+id)")
    routes = ["", "welcome", "parent", "@midquiz", "library", "games", "diary", "diary?tab=outcomes", "diary?tab=moods", "diary?tab=progress", "specialist", "family", "settings", "pricing", "safety", "about", "hero", "plan", "quiz", "quiz?new=1", "@sheet"] + plans + ["game/" + g for g in games]
    narrow = MOB or W <= 860
    for r in routes:
        if r == "@midquiz":
            load("welcome")
            for _ in range(2):
                if pg.locator(".opt").count(): tap(pg, ".opt"); pg.wait_for_timeout(350)
        elif r == "@sheet":
            load(""); tap(pg, "#kidSwitch"); pg.wait_for_timeout(400)
        else: load(r)
        c = pg.evaluate(COVER); res["checked"][r or "home"] = c["n"]; res["covered"][r or "home"] = c["out"]
        before_err = len(ERRS)
        if r == "@sheet": tap(pg, ".sheet .sheet-x"); pg.wait_for_timeout(350)
        try:
            if r.startswith("game/") and narrow: tap(pg, ".gs-top a.btn")
            else: tap(pg, ".tabbar a[data-nav=games]" if narrow else ".mainnav a[data-nav=games]")
            pg.wait_for_timeout(500)
            ok = pg.evaluate("location.hash") == "#/games" and pg.locator(".toy").count() == len(games)
        except Exception as e: ok = "EXC " + str(e).split("\n")[0][:120]
        res["nav"][r or "home"] = ok
        if len(ERRS) > before_err: res["errors"].append({"screen": r, "errs": ERRS[before_err:][:3]})
    # games played as the profile is (fresh: easy only) is covered by nav above; now unlock all to click every level
    load("games"); pg.evaluate("()=>{ BF.store.update(c => { c.gameLevels = {}; BF.GAME_ORDER.forEach(g => c.gameLevels[g] = 'hard'); }); BF.router.refresh(); }"); pg.wait_for_timeout(400)
    n0 = len(ERRS)
    for g in games:
        try:
            tap(pg, f".toy[data-game={g}]"); pg.wait_for_timeout(450)
            if pg.evaluate("location.hash") == f"#/game/{g}": res["cards"] += 1
            for i in range(3):
                tap(pg, f".lv-pick [data-lv='{i}']"); pg.wait_for_timeout(350)
                if pg.locator(f".lv-pick [data-lv='{i}'][aria-pressed=true]").count() and pg.locator(".stage").evaluate("s => s.children.length > 0"): res["levels"] += 1
            tap(pg, ".gs-top a.btn"); pg.wait_for_timeout(450)
            if pg.evaluate("location.hash") == "#/games": res["exits"] += 1
        except Exception as e:
            res["errors"].append({"game": g, "exc": str(e).split("\n")[0][:160], "hash": pg.evaluate("location.hash")})
            load("games")
    if len(ERRS) > n0: res["errors"].append({"games-loop": ERRS[n0:][:3]})
    load("game/keys")
    other = ".tabbar a[data-nav=diary]" if narrow else ".mainnav a[data-nav=parent]"
    pg.evaluate("([a,b]) => { document.querySelector(a).click(); setTimeout(() => document.querySelector(b).click(), 60); }", [".gs-top a.btn", other]); pg.wait_for_timeout(900)
    res["race"] = pg.evaluate("({hash: location.hash, sections: document.querySelectorAll('#app > section').length, route: document.body.dataset.route})")
    pg.keyboard.type("abc"); pg.wait_for_timeout(200)
    b.close()
cov_n = sum(len(v) for v in res["covered"].values()); nav_bad = [k for k, v in res["nav"].items() if v is not True]
json.dump(res, open(f"/tmp/crawl/rm-{TAG}.json", "w"), ensure_ascii=False, indent=1)
print(TAG, f"screens={len(res['nav'])} checked={sum(res['checked'].values())} covered={cov_n} nav_ok={len(res['nav'])-len(nav_bad)} nav_bad={nav_bad} cards={res['cards']} levels={res['levels']} exits={res['exits']} race={res['race']} errors={len(res['errors'])}")
for k, v in res["covered"].items():
    for c in v[:4]: print("  COVER", k, c)
for e in res["errors"][:6]: print("  ERR", e)
