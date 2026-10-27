import { useState } from "react";
import type { ComponentType } from "react";
import Memory from "./games/Memory";
import Snake from "./games/Snake";
import Whack from "./games/Whack";
import Guess from "./games/Guess";

const GAMES: { id: string; name: string; icon: string; desc: string; C: ComponentType }[] = [
  { id: "memory", name: "Memory Hewan", icon: "🐱", desc: "Cocokkan pasangan hewan", C: Memory },
  { id: "snake", name: "Snake", icon: "🐍", desc: "Makan sebanyak mungkin", C: Snake },
  { id: "whack", name: "Tangkap Tikus", icon: "🐭", desc: "Tap tikus dalam 30 detik", C: Whack },
  { id: "guess", name: "Tebak Angka", icon: "🦉", desc: "Tebak angka rahasia", C: Guess },
];

export default function App() {
  const [cur, setCur] = useState<string | null>(null);
  const game = GAMES.find((x) => x.id === cur);

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto animate-fade-in">
      <header className="border-b-2 border-[#9bbc0f] pb-4 mb-5">
        <h1 className="text-2xl uppercase text-[#9bbc0f]">// ZOO ARCADE_</h1>
        <p className="text-[10px] text-[#9bbc0f]/60 uppercase mt-2">
          {game ? game.name : "Pilih game"}
        </p>
      </header>

      {game ? (
        <div>
          <button onClick={() => setCur(null)} className="border-2 border-[#e0f8d0] text-[#e0f8d0] px-3 py-1 text-xs mb-4">
            &lt; MENU
          </button>
          <div className="cyber-panel p-4">
            <game.C />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAMES.map((x) => (
            <button key={x.id} onClick={() => setCur(x.id)} className="cyber-item p-4 text-left">
              <span className="text-4xl block mb-2">{x.icon}</span>
              <span className="text-sm text-[#e0f8d0] block mb-1">{x.name}</span>
              <span className="text-[10px] text-[#9bbc0f]/70">{x.desc}</span>
            </button>
          ))}
        </div>
      )}

      <footer className="mt-12 pt-4 border-t border-[#9bbc0f]/30 text-center text-[10px] text-gray-500 uppercase">
        Skor tertinggi tersimpan di browser lo
      </footer>
    </div>
  );
}
