import { useEffect, useState } from "react";
import { getHS, setHS } from "./hs";

const ANI = ["🐱", "🦊", "🐸", "🦉", "🐰", "🦌", "🐻", "🐼"];
const make = () => [...ANI, ...ANI].sort(() => Math.random() - 0.5);

export default function Memory() {
  const [cards, setCards] = useState(make);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(getHS("memory"));
  const won = done.length === cards.length;

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const tm = setTimeout(() => {
      if (cards[a] === cards[b]) setDone((d) => [...d, a, b]);
      setOpen([]);
    }, 600);
    return () => clearTimeout(tm);
  }, [open, cards]);

  useEffect(() => {
    if (won && (best === 0 || moves < best)) {
      setBest(moves);
      setHS("memory", moves);
    }
  }, [won, moves, best]);

  const tap = (i: number) => {
    if (open.length === 2 || open.includes(i) || done.includes(i)) return;
    setOpen([...open, i]);
    if (open.length === 1) setMoves((m) => m + 1);
  };
  const reset = () => {
    setCards(make());
    setOpen([]);
    setDone([]);
    setMoves(0);
  };

  return (
    <div>
      <p className="text-xs mb-3">Langkah: {moves} / Terbaik: {best || "-"}</p>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {cards.map((e, i) => {
          const show = open.includes(i) || done.includes(i);
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              className={`aspect-square text-3xl border-2 border-[#9bbc0f] touch-manipulation ${show ? "bg-[#306230]" : "bg-[#0f380f]"}`}
            >
              {show ? e : "?"}
            </button>
          );
        })}
      </div>
      {won && <p className="text-xs text-[#e0f8d0] mb-3">Menang dalam {moves} langkah!</p>}
      <button className="cyber-btn px-3 py-2 text-xs" onClick={reset}>[ Main lagi ]</button>
    </div>
  );
}
