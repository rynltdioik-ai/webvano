import { useEffect, useState } from "react";
import { getHS, setHS } from "./hs";

export default function Whack() {
  const [hole, setHole] = useState(-1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(getHS("whack"));
  const playing = time > 0;

  useEffect(() => {
    if (!playing) return;
    const t1 = setInterval(() => setTime((t) => t - 1), 1000);
    const t2 = setInterval(() => setHole(Math.floor(Math.random() * 9)), 650);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [playing]);

  useEffect(() => {
    if (time === 0 && score > best) {
      setBest(score);
      setHS("whack", score);
    }
  }, [time, score, best]);

  const start = () => {
    setScore(0);
    setTime(30);
  };
  const hit = (i: number) => {
    if (playing && i === hole) {
      setScore((s) => s + 1);
      setHole(-1);
    }
  };

  return (
    <div>
      <p className="text-xs mb-3">Skor: {score} / Waktu: {time}s / Terbaik: {best}</p>
      <div className="grid grid-cols-3 gap-2 mb-3 max-w-xs">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onClick={() => hit(i)}
            className="aspect-square text-4xl border-2 border-[#9bbc0f] bg-[#306230] touch-manipulation"
          >
            {playing && hole === i ? "🐭" : "🕳️"}
          </button>
        ))}
      </div>
      {!playing && time === 0 && score > 0 && <p className="text-xs text-[#e0f8d0] mb-3">Waktu habis! Skor {score}</p>}
      <button className="cyber-btn px-3 py-2 text-xs" onClick={start} disabled={playing}>
        [ {playing ? "Pukul tikusnya!" : "Mulai 30 detik"} ]
      </button>
    </div>
  );
}
