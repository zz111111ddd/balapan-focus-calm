import json, glob, collections
def benign(d):
    c = d.get("cls","")
    if "skip" in c.split(): return "skip link: content already focused"
    if d["tag"] == "g" and "done" in c.split(): return "completed game target (already used)"
    return None
tot = collections.Counter(); print("CRAWL (click every element, assert visible change)")
for f in sorted(glob.glob("/tmp/crawl/[si]*.json")):
    r = json.load(open(f)); sc = r["screens"]
    clicked = sum(v["clicked"] for v in sc.values()); ok = sum(v["ok"] for v in sc.values())
    dead = r["dead"] + [dict(i, why2=i["why"]) for i in r["intercepted"]]
    real = [d for d in dead if not benign(d)]; ben = [d for d in dead if benign(d)]
    fl = r.get("flow", {})
    print(f"{r['tag']:22} screens={len(sc):2} clicked={clicked:4} changed={ok:4} noop-selected={len(r.get('noop_selected',[]))} benign={len(ben)} DEAD={len(real)} errors={len(r['errors'])} flow={ {k:(v.get('opened'),v.get('levels'),v.get('exit'),v.get('fail','ok')[:40]) for k,v in fl.items()} if isinstance(fl,dict) else fl}")
    for d in real[:8]: print("    DEAD", d["screen"], d["tag"], d.get("cls"), d.get("txt"), d.get("why2",""))
    for e in r["errors"][:4]: print("    ERR", e["screen"], e.get("txt"), e["errs"][:2])
    tot["clicked"] += clicked; tot["dead"] += len(real); tot["errors"] += len(r["errors"])
print("TOTAL", dict(tot))
print("\nREAL POINTER (elementFromPoint at centre + mouse/touch clicks)")
for f in sorted(glob.glob("/tmp/crawl/rm-*.json")):
    r = json.load(open(f)); cov = sum(len(v) for v in r["covered"].values()); bad = [k for k,v in r["nav"].items() if v is not True]
    print(f"{r['tag']:24} screens={len(r['nav'])} checked={sum(r['checked'].values())} covered={cov} gamesNavOK={len(r['nav'])-len(bad)}/{len(r['nav'])} cards={r['cards']} levels={r['levels']} exits={r['exits']} race={r['race']['hash']},{r['race']['sections']} errors={len(r['errors'])}")
    for k,v in r["covered"].items():
        for c in v[:3]: print("    COVER", k, c)
    for e in r["errors"][:3]: print("    ERR", e)
