import { useState } from "react";
import { getHS, setHS } from "./hs";

const roll = () => 1 + Math.floor(Math.random() * 100);

export default function Guess() {
  const [target, setTarget] = useState(roll);
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState("Tebak angka 1 sampai 100");
  const [tries, setTries] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(getHS("guess"));

  const submit = () => {
    const n = parseInt(val, 10);
    if (isNaN(n) || won) return;
    const t = tries + 1;
    setTries(t);
    setVal("");
    if (n === target) {
      setWon(true);
      setMsg(`Benar! ${t} kali tebak`);
      if (best === 0 || t < best) {
        setBest(t);
        setHS("guess", t);
      }
    } else setMsg(n < target ? "Terlalu kecil" : "Terlalu besar");
  };
  const reset = () => {
    setTarget(roll());
    setTries(0);
    setWon(false);
    setVal("");
    setMsg("Tebak angka 1 sampai 100");
  };

  return (
    <div>
      <p className="text-xs mb-3">Tebakan: {tries} / Terbaik: {best || "-"}</p>
      <p className="text-sm text-[#e0f8d0] mb-3">{msg}</p>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full bg-transparent border-2 border-[#9bbc0f] p-3 mb-3 outline-none"
      />
      <div className="flex gap-2">
        <button className="cyber-btn flex-1 py-2 text-xs" onClick={submit}>[ Tebak ]</button>
        <button className="border-2 border-[#9bbc0f] px-3 text-xs" onClick={reset}>ULANG</button>
      </div>
    </div>
  );
}
