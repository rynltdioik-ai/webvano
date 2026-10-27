import { useEffect, useRef, useState } from "react";
import { getHS, setHS } from "./hs";

const N = 15;
const S = 20;
type P = { x: number; y: number };

export default function Snake() {
  const cv = useRef<HTMLCanvasElement>(null);
  const g = useRef({ dir: { x: 1, y: 0 } as P });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState(getHS("snake"));
  const [run, setRun] = useState(0);

  const turn = (x: number, y: number) => {
    const d = g.current.dir;
    if (d.x + x === 0 && d.y + y === 0) return;
    g.current.dir = { x, y };
  };

  useEffect(() => {
    const snake: P[] = [{ x: 7, y: 7 }];
    let food: P = { x: 3, y: 3 };
    let sc = 0;
    g.current.dir = { x: 1, y: 0 };
    setScore(0);
    setOver(false);
    const ctx = cv.current!.getContext("2d")!;
    const draw = () => {
      ctx.fillStyle = "#7bb662";
      ctx.fillRect(0, 0, N * S, N * S);
      ctx.fillStyle = "#a33b1e";
      ctx.fillRect(food.x * S + 2, food.y * S + 2, S - 4, S - 4);
      ctx.fillStyle = "#5b3a1e";
      snake.forEach((p) => ctx.fillRect(p.x * S + 1, p.y * S + 1, S - 2, S - 2));
    };
    const tick = () => {
      const d = g.current.dir;
      const h = { x: snake[0].x + d.x, y: snake[0].y + d.y };
      if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some((p) => p.x === h.x && p.y === h.y)) {
        setOver(true);
        if (sc > getHS("snake")) {
          setHS("snake", sc);
          setBest(sc);
        }
        clearInterval(id);
        return;
      }
      snake.unshift(h);
      if (h.x === food.x && h.y === food.y) {
        sc++;
        setScore(sc);
        do {
          food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        } while (snake.some((p) => p.x === food.x && p.y === food.y));
      } else snake.pop();
      draw();
    };
    draw();
    const id = setInterval(tick, 140);
    return () => clearInterval(id);
  }, [run]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      };
      const v = m[e.key];
      if (v) {
        e.preventDefault();
        turn(v[0], v[1]);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const btn = "border-2 border-[#5b3a1e] py-3 touch-manipulation";
  return (
    <div>
      <p className="text-xs mb-2">Skor: {score} / Terbaik: {best}</p>
      <canvas
        ref={cv}
        width={N * S}
        height={N * S}
        className="border-2 border-[#5b3a1e] max-w-full mb-3"
        style={{ imageRendering: "pixelated" }}
      />
      {over && <p className="text-xs text-[#a33b1e] mb-2">Game over!</p>}
      <div className="grid grid-cols-3 gap-2 w-44 mb-3">
        <span />
        <button className={btn} onClick={() => turn(0, -1)}>▲</button>
        <span />
        <button className={btn} onClick={() => turn(-1, 0)}>◀</button>
        <span />
        <button className={btn} onClick={() => turn(1, 0)}>▶</button>
        <span />
        <button className={btn} onClick={() => turn(0, 1)}>▼</button>
        <span />
      </div>
      <button className="cyber-btn px-3 py-2 text-xs" onClick={() => setRun((r) => r + 1)}>[ Mulai ulang ]</button>
    </div>
  );
}
