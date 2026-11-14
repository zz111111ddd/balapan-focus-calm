"""Exhaustive click crawler. usage: crawl.py <file: index|single> <state: fresh|demo|v1> <lang> <dev: d|m> [screens-filter]"""
import sys, json, os
from playwright.sync_api import sync_playwright
which, state, lang, dev = sys.argv[1:5]
only = sys.argv[5].split(",") if len(sys.argv) > 5 else None
BASE = {"index": "file:///tmp/crawlroot/balapan-focus-calm/index.html", "single": "file:///tmp/iso/balapan-single.html"}[which]
MOB = dev == "m"
W = int(os.environ.get("W", "0")); RM = os.environ.get("RM") == "1"
TAG = f"{which}-{state}-{lang}-{dev}" + (f"-w{W}" if W else "") + ("-rm" if RM else "")
OUT = f"/tmp/crawl/{TAG}.json"; os.makedirs("/tmp/crawl", exist_ok=True)
V1 = open("/tmp/s/v1state.json").read()

INIT = """
window.__errs = [];
window.addEventListener('error', e => window.__errs.push('error: '+(e.message||e)));
window.addEventListener('unhandledrejection', e => window.__errs.push('rejection: '+(e.reason && (e.reason.stack||e.reason.message) || e.reason)));
window.print = function(){ window.__printed = (window.__printed||0)+1; };
window.__opened = 0; window.open = function(){ window.__opened++; return null; };
"""
ENUM = r"""() => {
  document.querySelectorAll('[data-crawl]').forEach(e => e.removeAttribute('data-crawl'));
  const sel = 'a[href], button, [role=button], [role=tab], summary, select, input, textarea, label, [data-open], [data-ci], [data-part], [data-lv], [data-v], [data-k], [data-i], [data-ch], [data-game], [data-edit], [data-del], [tabindex]';
  const set = new Set(document.querySelectorAll(sel));
  document.querySelectorAll('body *').forEach(el => { const cs = getComputedStyle(el); if (cs.cursor === 'pointer' && el.parentElement && getComputedStyle(el.parentElement).cursor !== 'pointer') set.add(el); });
  const out = []; let n = 0;
  const strong = 'a[href],button,select,input,textarea,summary,[role=button],[role=tab],[data-lv],[data-game]';
  for (const el of set) {
    if (el.closest('#printArea') || el.closest('.sheet')) continue;
    if (el.getAttribute('tabindex') === '-1' && !el.matches('a[href],button,[data-lv],[data-game]')) continue;
    if (el.tagName === 'LABEL' && !el.classList.contains('switch') && !el.classList.contains('toggle-row')) continue;
    if (el.tagName === 'INPUT' && el.closest('label.switch, label.toggle-row')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    let p = el, hid = false; while (p && p.nodeType === 1) { const c = getComputedStyle(p); if (c.display === 'none' || c.visibility === 'hidden') { hid = true; break; } p = p.parentElement; }
    if (hid) continue;
    if (el.checkVisibility && !el.checkVisibility({contentVisibilityAuto: true, visibilityProperty: true})) continue; // e.g. inside a closed <details>
    let anc = el.parentElement, dup = false; while (anc) { if (set.has(anc) && anc.matches('a[href],button,summary,label.switch,label.toggle-row')) { dup = true; break; } anc = anc.parentElement; }
    if (dup) continue;
    if (!el.matches(strong) && el.querySelector(strong)) continue;
    el.setAttribute('data-crawl', n);
    const zone = el.closest('#topbar') ? 'header' : el.closest('#tabbar') ? 'tabbar' : el.closest('#foot') ? 'footer' : 'app';
    const cn = el.className && (el.className.baseVal !== undefined ? el.className.baseVal : el.className);
    out.push({ id: n, zone, tag: el.tagName.toLowerCase(), txt: (el.getAttribute('aria-label') || el.innerText || el.value || el.getAttribute('title') || cn || '').trim().replace(/\s+/g,' ').slice(0, 40), cls: String(cn||'').slice(0,40), href: el.getAttribute('href'), disabled: !!(el.disabled || el.getAttribute('aria-disabled') === 'true'), type: el.type || '', selected: el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-checked') === 'true' && el.type === 'radio' });
    n++;
  }
  return out;
}"""
WATCH = r"""() => {
  window.__mut = 0; window.__noisy = new Set();
  const mo = new MutationObserver(recs => { for (const r of recs) { if (window.__phase === 'base') window.__noisy.add(r.target); else { let t = r.target, noisy = false; while (t) { if (window.__noisy.has(t)) { noisy = true; break; } t = t.parentNode; } if (!noisy) window.__mut++; } } });
  mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
  window.__phase = 'base';
}"""
SNAP = """() => ({ hash: location.hash, title: document.title, ls: JSON.stringify(Object.assign({}, localStorage)), sheet: document.querySelectorAll('.sheet').length, toast: (document.querySelector('.toast.show')||{}).textContent || '', printed: window.__printed||0, opened: window.__opened, scroll: Math.round(scrollY), active: document.activeElement && document.activeElement.getAttribute('data-crawl'), focusId: document.activeElement && document.activeElement.id, errs: window.__errs.slice() })"""

def setup_state(pg):
    pg.goto(BASE); pg.wait_for_timeout(300)
    pg.evaluate("localStorage.clear()")
    if state == "v1": pg.evaluate("v => localStorage.setItem('balapan.v1', v)", V1)
    pg.evaluate("l => localStorage.setItem('balapan.lang', l)", lang)
    pg.goto(BASE + "#/"); pg.reload(); pg.wait_for_timeout(500)
    if state == "nodemo":
        pg.evaluate("()=>{ BF.clearDemo(); }"); pg.reload(); pg.wait_for_timeout(500)
    if state == "demo":
        pg.evaluate("()=>{ const d = BF.store.children().find(c=>c.isDemo); BF.store.setActive(d.id); }")
    return pg.evaluate("JSON.stringify(Object.assign({}, localStorage))")

def load(pg, snap, route):
    pg.evaluate("s => { localStorage.clear(); const o = JSON.parse(s); for (const k in o) localStorage.setItem(k, o[k]); }", snap)
    pg.goto("about:blank"); pg.goto(BASE + "#/" + route); pg.wait_for_timeout(420)

def screens(pg):
    ids = pg.evaluate("BF.GAME_ORDER")
    sc = ["", "welcome", "parent", "library", "games", "diary", "diary?tab=diary", "diary?tab=outcomes", "diary?tab=moods", "diary?tab=progress", "specialist", "family", "settings", "pricing", "safety", "about", "hero", "plan", "quiz", "quiz?new=1"]
    plans = pg.evaluate("Object.keys(BF.store.s.plans)")
    for pid in plans[:2]:
        tag = pg.evaluate("id => BF.store.s.plans[id].tag", pid)
        sc.append(("quest/" if tag == "adhd" else "brave/") + pid)
    sc += ["game/" + g for g in ids]
    return sc

res = {"tag": TAG, "screens": {}, "dead": [], "errors": [], "intercepted": [], "dialogs": 0}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W or 390, "height": 844} if MOB else {"width": W or 1280, "height": 760}, is_mobile=MOB, has_touch=MOB, accept_downloads=True, reduced_motion="reduce" if RM else "no-preference")
    ctx.add_init_script(INIT)
    pg = ctx.new_page()
    perr = []
    pg.on("pageerror", lambda e: perr.append("pageerror: " + str(e)))
    pg.on("console", lambda m: perr.append("console.error: " + m.text) if m.type == "error" else None)
    def ondialog(d):
        res["dialogs"] += 1; d.accept()
    pg.on("dialog", ondialog)
    downloads = []
    pg.on("download", lambda d: downloads.append(d.suggested_filename))
    snap = setup_state(pg)
    allsc = screens(pg)
    if only: allsc = [s for s in allsc if any((s == "" if o == "HOME" else s.startswith(o)) for o in only)]
    shell_done = False
    for route in allsc:
        load(pg, snap, route)
        landed = pg.evaluate("location.hash")
        items = pg.evaluate(ENUM)
        stats = {"landed": landed, "total": len(items), "clicked": 0, "ok": 0, "disabled": 0, "external": 0, "dead": 0, "shell_skipped": 0}
        fresh = True
        for i, it in enumerate(items):
            if it["zone"] in ("header", "tabbar", "footer") and shell_done and it.get("href") != "#/games":
                stats["shell_skipped"] += 1; continue
            if it["disabled"]: stats["disabled"] += 1; continue
            h = it.get("href") or ""
            if h and not h.startswith("#"): stats["external"] += 1; continue
            if not fresh:
                load(pg, snap, route)
                items2 = pg.evaluate(ENUM)
                if i >= len(items2): continue
            fresh = False
            pg.evaluate(WATCH); pg.wait_for_timeout(120); pg.evaluate("window.__phase='click'")
            before = pg.evaluate(SNAP); nd = len(downloads); perr.clear()
            try:
                loc = pg.locator(f"[data-crawl='{i}']")
                if it["tag"] == "select":
                    cur = loc.evaluate("e=>e.selectedIndex"); opts = loc.evaluate("e => e.options.length")
                    loc.select_option(index=(cur + 1) % max(1, opts), timeout=2500)
                elif it["type"] == "range":
                    loc.evaluate("e => { e.value = (+e.value === +e.max) ? e.min : e.max; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); }")
                elif it["tag"] in ("input", "textarea") and it["type"] not in ("checkbox", "radio"):
                    loc.click(timeout=2500)
                    if it["type"] in ("text", "search", "textarea", "password", "") or it["tag"] == "textarea":
                        loc.fill("abc", timeout=2500)
                else:
                    if "skip" in it["cls"].split(): loc.focus()
                    try: loc.click(timeout=2500)
                    except Exception as e1:
                        if "intercepts pointer events" in str(e1): raise
                        loc.click(timeout=2500, force=True)  # animated (pulsing) SVG targets never become "stable"
            except Exception as e:
                full = str(e)
                kind = "intercepted" if "intercepts pointer events" in full else "click-failed"
                print(TAG, "FAILCLICK", route, it, full.split("\n")[0][:150], flush=True); res["intercepted"].append({"screen": route, **it, "why": kind, "msg": ([l.strip() for l in full.split("\n") if "intercepts" in l][:1] or [full.split("\n")[0][:200]])[0]})
                stats["dead"] += 1; stats["clicked"] += 1; continue
            pg.wait_for_timeout(380)
            after = pg.evaluate(SNAP)
            mut = pg.evaluate("window.__mut||0")
            changed = (after["hash"] != before["hash"] or after["title"] != before["title"] or after["ls"] != before["ls"] or after["sheet"] != before["sheet"]
                       or after["toast"] != before["toast"] or after["printed"] != before["printed"] or after["opened"] != before["opened"] or len(downloads) != nd
                       or after["scroll"] != before["scroll"] or mut > 0 or (after["focusId"] == "app" and before["focusId"] != "app") or (after["active"] == str(i) and it["tag"] in ("input","select","textarea")))
            stats["clicked"] += 1
            errs = perr[:] + after["errs"][len(before["errs"]):]
            if errs: res["errors"].append({"screen": route, **it, "errs": errs[:3]})
            if changed: stats["ok"] += 1
            elif it.get("selected") and not it.get("href"):
                stats.setdefault("noop_selected", 0); stats["noop_selected"] += 1; res.setdefault("noop_selected", []).append({"screen": route, **it})
            else:
                stats["dead"] += 1; res["dead"].append({"screen": route, **it}); print(TAG, "DEAD", route, it, flush=True)
        if any(it["zone"] in ("header","tabbar","footer") for it in items): shell_done = True
        res["screens"][route or "home"] = stats
        print(TAG, route or "home", stats, flush=True)
    nav = ".tabbar a[data-nav=games]" if (MOB or (W and W <= 860)) else ".mainnav a[data-nav=games]"
    PLAY = """() => { const st = document.querySelector('.stage'); if (!st) return 0; const c = [...st.querySelectorAll('button, [data-i], [data-k], [data-v], [data-part], [data-ch], .tile, .card, .dot, .bub, .cell, .key, .piece, circle, rect, g')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4; }); let n = 0; for (const e of c.slice(0, 12)) { for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) e.dispatchEvent(new MouseEvent(t, {bubbles:true, cancelable:true, clientX: e.getBoundingClientRect().x+3, clientY: e.getBoundingClientRect().y+3})); n++; } return n; }"""
    flows = {}
    for mode in ("as-is", "all-levels"):
        load(pg, snap, "")
        if mode == "all-levels":
            pg.evaluate("()=>{ BF.store.update(c => { c.gameLevels = {}; BF.GAME_ORDER.forEach(g => c.gameLevels[g] = 'hard'); }); }")
        perr.clear()
        flow = {"quizDone": pg.evaluate("!!BF.store.s.quizDone"), "games_hash": None, "cards": 0, "opened": 0, "levels": 0, "played": 0, "exit": 0}
        try:
            pg.click(nav, timeout=3000); pg.wait_for_timeout(600)
            flow["games_hash"] = pg.evaluate("location.hash"); flow["cards"] = pg.locator(".toy").count()
            for gid in pg.evaluate("BF.GAME_ORDER"):
                pg.click(f".toy[data-game={gid}]", timeout=3000); pg.wait_for_timeout(500)
                if pg.evaluate("location.hash").startswith("#/game/" + gid) and pg.locator(".stage").count(): flow["opened"] += 1
                for b_ in range(3):
                    btn = pg.locator(f".lv-pick [data-lv='{b_}']")
                    if not btn.is_disabled():
                        btn.click(timeout=3000); pg.wait_for_timeout(450)
                        if pg.locator(".stage").evaluate("s => s.children.length > 0"): flow["levels"] += 1
                        if pg.evaluate(PLAY) > 0: flow["played"] += 1
                        pg.wait_for_timeout(250)
                pg.locator(".gs-top a.btn").first.click(timeout=3000); pg.wait_for_timeout(450)
                if pg.evaluate("location.hash") == "#/games": flow["exit"] += 1
        except Exception as e:
            flow["fail"] = " | ".join([l.strip() for l in str(e).split("\n") if l.strip()][:8])[:900]; flow["at"] = pg.evaluate("location.hash")
        flow["errs"] = perr[:5] + pg.evaluate("window.__errs.slice(0,5)")
        flows[mode] = flow; print(TAG, "flow", mode, flow, flush=True)
    flow = flows
    res["flow"] = flow; print(TAG, "flow", flow, flush=True)
    b.close()
json.dump(res, open(OUT, "w"), ensure_ascii=False, indent=1)
print(TAG, "DONE dead", len(res["dead"]), "intercepted", len(res["intercepted"]), "errors", len(res["errors"]))
