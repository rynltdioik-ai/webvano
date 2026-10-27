import { useEffect, useRef, useState } from "react";

type Plot = { c: string; t: number } | null;
type S = { coins: number; inv: Record<string, number>; plots: Plot[]; yard: (string | null)[] };

const CROPS: Record<string, { e: string; t: number; seed: number }> = {
  wortel: { e: "🥕", t: 20, seed: 5 },
  tomat: { e: "🍅", t: 45, seed: 12 },
  bunga: { e: "🌻", t: 75, seed: 22 },
  labu: { e: "🎃", t: 150, seed: 50 },
};
const FISH = [
  { k: "ikan", e: "🐟", p: 10, w: 60 },
  { k: "koi", e: "🐠", p: 30, w: 25 },
  { k: "buntal", e: "🐡", p: 60, w: 10 },
  { k: "gurita", e: "🐙", p: 120, w: 4 },
  { k: "hiu", e: "🦈", p: 300, w: 1 },
];
const PRICE: Record<string, { e: string; p: number }> = {
  wortel: { e: "🥕", p: 12 }, tomat: { e: "🍅", p: 30 }, bunga: { e: "🌻", p: 55 },
  labu: { e: "🎃", p: 130 }, telur: { e: "🥚", p: 15 }, susu: { e: "🥛", p: 20 },
};
FISH.forEach((f) => { PRICE[f.k] = { e: f.e, p: f.p }; });
const DECOR = [
  { e: "🌷", c: 30 }, { e: "🪵", c: 20 }, { e: "🏮", c: 60 }, { e: "🌳", c: 80 },
  { e: "🐔", c: 120 }, { e: "🐄", c: 250 }, { e: "⛲", c: 300 }, { e: "🏡", c: 500 },
];
const TABS = [["kebun", "🌱 Kebun"], ["danau", "🎣 Danau"], ["pasangan", "🧩 Pasangan"], ["toko", "💰 Toko"], ["halaman", "🏡 Halaman"]];

const blank = (): S => ({ coins: 30, inv: {}, plots: Array(6).fill(null), yard: Array(24).fill(null) });
const load = (): S => {
  try {
    const r = localStorage.getItem("zf");
    if (r) return { ...blank(), ...JSON.parse(r) };
  } catch {
    /* abaikan */
  }
  return blank();
};
const pickFish = () => {
  let x = Math.random() * 100;
  for (const f of FISH) {
    x -= f.w;
    if (x < 0) return f.k;
  }
  return FISH[0].k;
};

function Fishing({ onCatch }: { onCatch: (k: string) => void }) {
  const [on, setOn] = useState(false);
  const [r, setR] = useState({ b: 35, f: 50, p: 30 });
  const [msg, setMsg] = useState("Lempar kail, lalu tahan tombol buat naikin bar hijau. Jaga ikan tetap di dalam bar!");
  const hold = useRef(false);
  const cb = useRef(onCatch);
  cb.current = onCatch;

  useEffect(() => {
    if (!on) return;
    let b = 35, v = 0, f = 50, tg = 50, p = 30, n = 0;
    const id = setInterval(() => {
      v += hold.current ? 0.6 : -0.6;
      v = Math.max(-4, Math.min(4, v));
      b += v;
      if (b < 0) { b = 0; v = 0; }
      if (b > 70) { b = 70; v = 0; }
      if (n++ % 30 === 0) tg = Math.random() * 80 + 5;
      f += Math.sign(tg - f) * Math.min(1.4, Math.abs(tg - f));
      p += f >= b && f <= b + 30 ? 1 : -0.7;
      setR({ b, f, p });
      if (p >= 100 || p <= 0) {
        clearInterval(id);
        setOn(false);
        if (p >= 100) {
          const k = pickFish();
          cb.current(k);
          setMsg(`Dapat ${PRICE[k].e}!`);
        } else setMsg("Ikannya kabur...");
      }
    }, 40);
    return () => clearInterval(id);
  }, [on]);

  return (
    <div>
      <p className="text-sm mb-3">{msg}</p>
      <div className="flex gap-4 items-end mb-3">
        <div className="relative w-12 h-56 border-4 border-[#6b3a1a] bg-[#8fd3f4]">
          <div className="absolute left-0 right-0 bg-[#4a9a3a]/80" style={{ bottom: `${r.b}%`, height: "30%" }} />
          <span className="absolute left-1 text-2xl leading-none" style={{ bottom: `${r.f}%` }}>🐟</span>
        </div>
        <div className="flex-1">
          <p className="text-xs mb-1">Tangkapan</p>
          <div className="h-4 border-2 border-[#6b3a1a] bg-[#e0c48a]">
            <div className="h-full bg-[#a33b1e]" style={{ width: `${Math.max(0, Math.min(100, r.p))}%` }} />
          </div>
        </div>
      </div>
      {on ? (
        <button
          className="cyber-btn w-full py-4 touch-none select-none"
          onPointerDown={() => { hold.current = true; }}
          onPointerUp={() => { hold.current = false; }}
          onPointerLeave={() => { hold.current = false; }}
          onPointerCancel={() => { hold.current = false; }}
        >
          [ TAHAN ]
        </button>
      ) : (
        <button
          className="cyber-btn w-full py-3"
          onClick={() => { setR({ b: 35, f: 50, p: 30 }); setMsg("Ikannya menggigit!"); setOn(true); }}
        >
          [ Lempar kail ]
        </button>
      )}
    </div>
  );
}

const T = ["wortel", "tomat", "bunga", "telur", "susu"];
const W = 6;
const rn = () => Math.floor(Math.random() * 5);
function find(g: number[]) {
  const s = new Set<number>();
  for (let r = 0; r < W; r++)
    for (let c = 0; c < W - 2; c++) {
      const i = r * W + c;
      if (g[i] === g[i + 1] && g[i] === g[i + 2]) { s.add(i); s.add(i + 1); s.add(i + 2); }
    }
  for (let r = 0; r < W - 2; r++)
    for (let c = 0; c < W; c++) {
      const i = r * W + c;
      if (g[i] === g[i + W] && g[i] === g[i + 2 * W]) { s.add(i); s.add(i + W); s.add(i + 2 * W); }
    }
  return s;
}
function settle(g: number[], cnt: number[]) {
  for (;;) {
    const m = find(g);
    if (!m.size) return;
    m.forEach((i) => { cnt[g[i]]++; g[i] = -1; });
    for (let c = 0; c < W; c++) {
      const col: number[] = [];
      for (let r = W - 1; r >= 0; r--) if (g[r * W + c] >= 0) col.push(g[r * W + c]);
      for (let r = W - 1, k = 0; r >= 0; r--, k++) g[r * W + c] = k < col.length ? col[k] : rn();
    }
  }
}
const fresh = () => {
  const g = Array.from({ length: W * W }, rn);
  settle(g, [0, 0, 0, 0, 0]);
  return g;
};

function Match({ onGet }: { onGet: (k: string, n: number) => void }) {
  const [g, setG] = useState(fresh);
  const [sel, setSel] = useState(-1);
  const [mv, setMv] = useState(0);
  const [got, setGot] = useState([0, 0, 0, 0, 0]);

  const start = () => { setG(fresh()); setMv(15); setGot([0, 0, 0, 0, 0]); setSel(-1); };
  const tap = (i: number) => {
    if (mv <= 0) return;
    if (sel < 0) { setSel(i); return; }
    const d = Math.abs(sel - i);
    const adj = (d === 1 && Math.floor(sel / W) === Math.floor(i / W)) || d === W;
    if (!adj) { setSel(i); return; }
    const n = [...g];
    [n[sel], n[i]] = [n[i], n[sel]];
    setSel(-1);
    if (!find(n).size) return;
    const cnt = [0, 0, 0, 0, 0];
    settle(n, cnt);
    cnt.forEach((c, t) => { if (c >= 3) onGet(T[t], Math.floor(c / 3)); });
    setGot((o) => o.map((x, t) => x + (cnt[t] >= 3 ? Math.floor(cnt[t] / 3) : 0)));
    setG(n);
    setMv(mv - 1);
  };

  return (
    <div>
      <p className="text-sm mb-2">Tukar dua petak yang bersebelahan biar 3 sejenis sejajar. Sisa langkah: {mv}</p>
      <p className="text-xs mb-3">Dapat: {got.map((n, t) => `${PRICE[T[t]].e}${n}`).join("  ")}</p>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {g.map((t, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`aspect-square text-2xl border-2 touch-manipulation ${sel === i ? "border-[#a33b1e] bg-[#fff3d4]" : "border-[#6b3a1a] bg-[#e0c48a]"}`}
          >
            {PRICE[T[t]].e}
          </button>
        ))}
      </div>
      <button className="cyber-btn w-full py-2 text-sm" onClick={start}>
        [ {mv > 0 ? "Acak ulang (reset ronde)" : "Mulai ronde (15 langkah)"} ]
      </button>
    </div>
  );
}

export default function Farm() {
  const [s, setS] = useState<S>(load);
  const [tab, setTab] = useState("kebun");
  const [, tick] = useState(0);
  const [seed, setSeed] = useState("wortel");
  const [dec, setDec] = useState(DECOR[0].e);

  useEffect(() => { localStorage.setItem("zf", JSON.stringify(s)); }, [s]);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const add = (k: string, n: number) => setS((q) => ({ ...q, inv: { ...q.inv, [k]: (q.inv[k] || 0) + n } }));
  const beauty = s.yard.filter(Boolean).length;
  const mult = 1 + 0.03 * beauty;

  const tapPlot = (i: number) => {
    const p = s.plots[i];
    if (!p) {
      const c = CROPS[seed];
      if (s.coins < c.seed) return;
      setS((q) => ({ ...q, coins: q.coins - c.seed, plots: q.plots.map((x, j) => (j === i ? { c: seed, t: Date.now() } : x)) }));
    } else if (Date.now() - p.t >= CROPS[p.c].t * 1000) {
      setS((q) => ({
        ...q,
        inv: { ...q.inv, [p.c]: (q.inv[p.c] || 0) + 1 },
        plots: q.plots.map((x, j) => (j === i ? null : x)),
      }));
    }
  };
  const sell = (k: string) =>
    setS((q) => ({ ...q, coins: q.coins + Math.round((q.inv[k] || 0) * PRICE[k].p * mult), inv: { ...q.inv, [k]: 0 } }));
  const sellAll = () =>
    setS((q) => {
      let t = 0;
      Object.entries(q.inv).forEach(([k, n]) => { t += n * (PRICE[k] ? PRICE[k].p : 0); });
      return { ...q, coins: q.coins + Math.round(t * mult), inv: {} };
    });
  const tapYard = (i: number) => {
    const cur = s.yard[i];
    const put = (v: string | null, coins: number) =>
      setS((q) => ({ ...q, coins: q.coins + coins, yard: q.yard.map((x, j) => (j === i ? v : x)) }));
    if (cur) put(null, Math.floor(DECOR.find((x) => x.e === cur)!.c / 2));
    else {
      const d = DECOR.find((x) => x.e === dec)!;
      if (s.coins >= d.c) put(dec, -d.c);
    }
  };

  const items = Object.entries(s.inv).filter(([, n]) => n > 0);

  return (
    <div>
      <div className="flex justify-between text-sm mb-3">
        <span>🪙 {s.coins}</span>
        <span>✨ Bonus jual +{beauty * 3}%</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`cyber-btn px-2 py-1 text-xs ${tab === id ? "brightness-125" : "opacity-70"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "kebun" && (
        <div>
          <p className="text-xs mb-2">Pilih bibit, lalu tap petak kosong buat nanam. Tap lagi saat matang buat panen.</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(CROPS).map(([k, c]) => (
              <button
                key={k}
                onClick={() => setSeed(k)}
                className={`border-2 px-2 py-1 text-xs ${seed === k ? "border-[#a33b1e] bg-[#fff3d4]" : "border-[#6b3a1a]"}`}
              >
                {c.e} {c.seed}🪙 / {c.t}s
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {s.plots.map((p, i) => {
              const left = p ? Math.max(0, Math.ceil((CROPS[p.c].t * 1000 - (Date.now() - p.t)) / 1000)) : 0;
              const ready = !!p && left === 0;
              return (
                <button
                  key={i}
                  onClick={() => tapPlot(i)}
                  className="h-24 border-4 border-[#6b3a1a] bg-[#a0622d] text-3xl touch-manipulation"
                >
                  {!p ? (
                    <span className="text-xs text-[#fbe9c4]">Tanam</span>
                  ) : ready ? (
                    <>
                      <span>{CROPS[p.c].e}</span>
                      <span className="block text-xs text-[#fbe9c4]">Panen!</span>
                    </>
                  ) : (
                    <>
                      <span>🌱</span>
                      <span className="block text-xs text-[#fbe9c4]">{left}s</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "danau" && <Fishing onCatch={(k) => add(k, 1)} />}
      {tab === "pasangan" && <Match onGet={add} />}

      {tab === "toko" && (
        <div>
          {items.length === 0 ? (
            <p className="text-sm">Tas kosong. Tanam, mancing, atau main pasangan dulu.</p>
          ) : (
            <>
              {items.map(([k, n]) => (
                <div key={k} className="flex justify-between items-center border-b-2 border-[#e0c48a] py-2">
                  <span>{PRICE[k].e} x{n}</span>
                  <button className="cyber-btn px-2 py-1 text-xs" onClick={() => sell(k)}>
                    Jual +{Math.round(n * PRICE[k].p * mult)}
                  </button>
                </div>
              ))}
              <button className="cyber-btn w-full py-2 text-sm mt-3" onClick={sellAll}>[ Jual semua ]</button>
            </>
          )}
        </div>
      )}

      {tab === "halaman" && (
        <div>
          <p className="text-xs mb-2">Pilih dekorasi, tap petak kosong buat naruh. Tap dekorasi buat dibongkar (balik setengah harga).</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {DECOR.map((d) => (
              <button
                key={d.e}
                onClick={() => setDec(d.e)}
                className={`border-2 px-2 py-1 text-xs ${dec === d.e ? "border-[#a33b1e] bg-[#fff3d4]" : "border-[#6b3a1a]"}`}
              >
                {d.e} {d.c}🪙
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {s.yard.map((v, i) => (
              <button
                key={i}
                onClick={() => tapYard(i)}
                className="aspect-square text-2xl border-2 border-[#3f7d2c] bg-[#7bb662] touch-manipulation"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className="text-[10px] underline opacity-60 mt-6"
        onClick={() => { if (confirm("Hapus semua progres?")) setS(blank()); }}
      >
        Reset progres
      </button>
    </div>
  );
}
