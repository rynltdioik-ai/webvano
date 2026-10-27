import { t } from "./types";

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T>(a: T[]): T => a[rnd(a.length)];
const lines = (s: string) => s.split("\n");
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const num = (a: string, d: number) => {
  const n = parseInt(a, 10);
  return isNaN(n) ? d : n;
};
const parts = (s: string) =>
  s.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((x) => x.toLowerCase());
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const utf = (s: string) =>
  Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join("");
const unutf = (b: string) =>
  new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
const sha = async (algo: string, s: string) =>
  Array.from(
    new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(s))),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
const shuffle = (a: string[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
const MORSE =
  "A .-,B -...,C -.-.,D -..,E .,F ..-.,G --.,H ....,I ..,J .---,K -.-,L .-..,M --,N -.,O ---,P .--.,Q --.-,R .-.,S ...,T -,U ..-,V ...-,W .--,X -..-,Y -.--,Z --..,0 -----,1 .----,2 ..---,3 ...--,4 ....-,5 .....,6 -....,7 --...,8 ---..,9 ----.";
const MAP = Object.fromEntries(
  MORSE.split(",").map((p) => p.split(" ") as [string, string]),
);
const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
const BOLA = ["Ya, pasti", "Kayaknya iya", "Coba tanya lagi nanti", "Jangan terlalu berharap", "Tidak", "Sangat mungkin", "Belum jelas, fokus dulu", "Peluangnya kecil"];
const QUOTE = ["Pelan-pelan asal jalan terus.", "Gagal itu latihan yang belum selesai.", "Yang penting mulai dulu.", "Konsisten ngalahin bakat.", "Istirahat juga bagian dari kerja."];
const ADJ = ["Perkasa", "Lincah", "Misterius", "Ceria", "Bijak", "Nakal"];
const ANI = ["Rubah", "Kucing", "Katak", "Burung Hantu", "Kelinci", "Rusa", "Beruang", "Panda"];
const caesar = (s: string, n: number) =>
  s.replace(/[a-z]/gi, (c) => {
    const b = c <= "Z" ? 65 : 97;
    return String.fromCharCode((((c.charCodeAt(0) - b + n) % 26) + 26) % 26 + b);
  });

export const batch1 = [
  t("Teks", "Hitung kata & karakter", (s) => `Kata: ${words(s).length}\nKarakter: ${s.length}\nBaris: ${lines(s).length}`),
  t("Teks", "HURUF BESAR", (s) => s.toUpperCase()),
  t("Teks", "huruf kecil", (s) => s.toLowerCase()),
  t("Teks", "Kapital Tiap Kata", (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase())),
  t("Teks", "Balik teks", (s) => [...s].reverse().join("")),
  t("Teks", "Balik urutan kata", (s) => s.split(/\s+/).reverse().join(" ")),
  t("Teks", "camelCase", (s) => parts(s).map((x, i) => (i ? cap(x) : x)).join("")),
  t("Teks", "PascalCase", (s) => parts(s).map(cap).join("")),
  t("Teks", "snake_case", (s) => parts(s).join("_")),
  t("Teks", "kebab-case", (s) => parts(s).join("-")),
  t("Teks", "Slug URL", (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")),
  t("Teks", "Rapikan spasi", (s) => s.replace(/[ \t]+/g, " ").trim()),
  t("Teks", "Hapus baris kosong", (s) => lines(s).filter((l) => l.trim()).join("\n")),
  t("Teks", "Urutkan baris A-Z", (s) => lines(s).sort((a, b) => a.localeCompare(b)).join("\n")),
  t("Teks", "Urutkan baris Z-A", (s) => lines(s).sort((a, b) => b.localeCompare(a)).join("\n")),
  t("Teks", "Acak urutan baris", (s) => shuffle(lines(s)).join("\n")),
  t("Teks", "Hapus baris duplikat", (s) => [...new Set(lines(s))].join("\n")),
  t("Teks", "Nomori baris", (s) => lines(s).map((l, i) => `${i + 1}. ${l}`).join("\n")),
  t("Teks", "Ulangi teks", (s, a) => Array(num(a, 3)).fill(s).join("\n"), { arg: { label: "Jumlah", def: "3" } }),
  t("Teks", "Cari dan ganti", (s, a) => { const [f, ...r] = a.split("="); return f ? s.split(f).join(r.join("=")) : s; }, { arg: { label: "cari=ganti", def: "a=b" } }),
  t("Teks", "Teks ke biner", (s) => [...s].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")),
  t("Teks", "Kode Morse", (s) => s.toUpperCase().split("").map((c) => (c === " " ? "/" : MAP[c] ?? "")).filter(Boolean).join(" ")),
  t("Teks", "ROT13", (s) => caesar(s, 13)),
  t("Teks", "Sandi Caesar", (s, a) => caesar(s, num(a, 3)), { arg: { label: "Geser", def: "3" } }),
  t("Teks", "Gaya 4l4y", (s) => s.replace(/[aeiostAEIOST]/g, (c) => ({ a: "4", e: "3", i: "1", o: "0", s: "5", t: "7" } as Record<string, string>)[c.toLowerCase()])),
  t("Teks", "BeRgAnTiAn BeSaR KeCiL", (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("")),
  t("Teks", "Frekuensi kata", (s) => { const m: Record<string, number> = {}; words(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "")).forEach((w) => { m[w] = (m[w] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${w}: ${n}`).join("\n"); }),
  t("Teks", "Cek palindrom", (s) => { const c = s.toLowerCase().replace(/[^a-z0-9]/g, ""); return c && c === [...c].reverse().join("") ? "Ya, palindrom" : "Bukan palindrom"; }),
  t("Teks", "Estimasi waktu baca", (s) => `${Math.max(1, Math.ceil(words(s).length / 200))} menit baca`),
  t("Teks", "Ekstrak email", (s) => (s.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []).join("\n")),
  t("Teks", "Ekstrak URL", (s) => (s.match(/https?:\/\/[^\s"'<>]+/g) || []).join("\n")),
  t("Teks", "Ekstrak angka", (s) => (s.match(/-?\d+(\.\d+)?/g) || []).join("\n")),
  t("Teks", "Hapus tag HTML", (s) => s.replace(/<[^>]*>/g, "")),

  t("Developer", "JSON rapikan", (s) => JSON.stringify(JSON.parse(s), null, 2)),
  t("Developer", "JSON minify", (s) => JSON.stringify(JSON.parse(s))),
  t("Developer", "Base64 encode", (s) => btoa(utf(s))),
  t("Developer", "Base64 decode", (s) => unutf(atob(s.trim()))),
  t("Developer", "URL encode", (s) => encodeURIComponent(s)),
  t("Developer", "URL decode", (s) => decodeURIComponent(s)),
  t("Developer", "HTML escape", (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")),
  t("Developer", "HTML unescape", (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&")),
  t("Developer", "HEX ke RGB", (s) => { const h = s.replace("#", "").trim(); const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; }),
  t("Developer", "RGB ke HEX", (s) => "#" + (s.match(/\d+/g) || []).slice(0, 3).map((v) => Number(v).toString(16).padStart(2, "0")).join("")),
  t("Developer", "Timestamp ke tanggal", (s) => { const n = Number(s.trim()); const d = new Date(n > 1e11 ? n : n * 1000); return d.toISOString() + "\n" + d.toLocaleString("id-ID"); }),
  t("Developer", "Tanggal ke timestamp", (s) => { const n = new Date(s).getTime(); return isNaN(n) ? "Tanggal tidak valid" : String(Math.floor(n / 1000)); }),
  t("Developer", "Timestamp sekarang", () => `${Math.floor(Date.now() / 1000)}\n${Date.now()}`, { noInput: true }),
  t("Developer", "Hash SHA-1", (s) => sha("SHA-1", s)),
  t("Developer", "Hash SHA-256", (s) => sha("SHA-256", s)),
  t("Developer", "Hash SHA-512", (s) => sha("SHA-512", s)),
  t("Developer", "Tes regex", (s, a) => { const m = s.match(new RegExp(a, "g")); return m ? `${m.length} cocok:\n` + m.join("\n") : "Tidak ada yang cocok"; }, { arg: { label: "Pola regex", def: "\\w+" } }),
  t("Developer", "Hitung ukuran byte", (s) => `${new TextEncoder().encode(s).length} byte`),
  t("Developer", "Parse URL", (s) => { const u = new URL(s.trim()); return ["Host: " + u.host, "Path: " + u.pathname, ...Array.from(u.searchParams, ([k, v]) => `${k} = ${v}`)].join("\n"); }),
  t("Developer", "CSV ke JSON", (s) => { const [h, ...r] = lines(s).filter(Boolean).map((l) => l.split(",")); return JSON.stringify(r.map((c) => Object.fromEntries(h.map((k, i) => [k.trim(), (c[i] || "").trim()] as [string, string]))), null, 2); }),
  t("Developer", "Desimal ke biner/hex", (s) => { const n = parseInt(s, 10); return `Biner: ${n.toString(2)}\nOktal: ${n.toString(8)}\nHex: ${n.toString(16).toUpperCase()}`; }),
  t("Developer", "Decode JWT", (s) => { const d = (x: string) => JSON.stringify(JSON.parse(unutf(atob(x.replace(/-/g, "+").replace(/_/g, "/")))), null, 2); const p = s.trim().split("."); return "HEADER\n" + d(p[0]) + "\n\nPAYLOAD\n" + d(p[1]); }),

  t("Generator", "UUID v4", () => crypto.randomUUID(), { noInput: true }),
  t("Generator", "Password acak", (_s, a) => { const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"; return Array.from(crypto.getRandomValues(new Uint32Array(num(a, 16))), (v) => c[v % c.length]).join(""); }, { noInput: true, arg: { label: "Panjang", def: "16" } }),
  t("Generator", "PIN acak", (_s, a) => Array.from({ length: num(a, 6) }, () => rnd(10)).join(""), { noInput: true, arg: { label: "Jumlah digit", def: "6" } }),
  t("Generator", "Angka acak", (_s, a) => { const [lo = 1, hi = 100] = a.split("-").map(Number); return String(lo + rnd(hi - lo + 1)); }, { noInput: true, arg: { label: "Rentang (min-maks)", def: "1-100" } }),
  t("Generator", "Lempar koin", () => pick(["Kepala", "Ekor"]), { noInput: true }),
  t("Generator", "Lempar dadu", (_s, a) => String(1 + rnd(num(a, 6))), { noInput: true, arg: { label: "Jumlah sisi", def: "6" } }),
  t("Generator", "Pilih acak dari daftar", (s) => pick(lines(s).filter((l) => l.trim()))),
  t("Generator", "Warna HEX acak", () => "#" + rnd(0x1000000).toString(16).padStart(6, "0"), { noInput: true }),
  t("Generator", "Lorem ipsum", (_s, a) => Array.from({ length: num(a, 2) }, () => Array.from({ length: 30 }, () => pick(LOREM)).join(" ") + ".").join("\n\n"), { noInput: true, arg: { label: "Jumlah paragraf", def: "2" } }),
  t("Generator", "Bola 8 ajaib", () => pick(BOLA), { noInput: true }),
  t("Generator", "Kata semangat acak", () => pick(QUOTE), { noInput: true }),
  t("Generator", "Nama RPG acak", () => `${pick(ANI)} ${pick(ADJ)}`, { noInput: true }),
  t("Generator", "Gunting batu kertas", () => "Komputer pilih: " + pick(["Batu", "Gunting", "Kertas"]), { noInput: true }),
  t("Generator", "Hari dari tanggal", (s) => { const d = new Date(s); return isNaN(d.getTime()) ? "Format: 2000-12-31" : d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }),
  t("Generator", "Hitung umur", (s) => { const d = new Date(s); if (isNaN(d.getTime())) return "Format: 2000-12-31"; const ms = Date.now() - d.getTime(); return `${Math.floor(ms / 31557600000)} tahun (${Math.floor(ms / 86400000)} hari)`; }),
];
