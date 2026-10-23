import { useState, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  type: string;
  price: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

const CATALOG: Item[] = [
  { id: "1", name: "Neural Link V2", type: "Cyberware", price: 1500, rarity: "Epic" },
  { id: "2", name: "EMP Grenade", type: "Weapon", price: 300, rarity: "Rare" },
  { id: "3", name: "Synth-Blood Pack", type: "Consumable", price: 50, rarity: "Common" },
  { id: "4", name: "Quantum Deck", type: "Hardware", price: 5000, rarity: "Legendary" },
  { id: "5", name: "Optic Camo", type: "Armor", price: 1200, rarity: "Epic" },
  { id: "6", name: "Data Spike", type: "Software", price: 150, rarity: "Common" },
];

export default function App() {
  // State untuk Splash Screen
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const [inventory, setInventory] = useState<Item[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [inputName, setInputName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Efek buat animasi loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            clearInterval(interval);
            setTimeout(() => setLoading(false), 500); // Delay dikit sebelum masuk
            return 100;
          }
          return old + Math.floor(Math.random() * 10) + 5; // Nambah acak biar natural
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const savedUser = localStorage.getItem("cyber_user");
    const savedCredits = localStorage.getItem("cyber_credits");
    if (savedUser) setUsername(savedUser);
    if (savedCredits) setCredits(parseInt(savedCredits));
  }, []);

  useEffect(() => {
    if (username) localStorage.setItem("cyber_user", username);
    localStorage.setItem("cyber_credits", credits.toString());
  }, [username, credits]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    if (credits === 0) setCredits(10000);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUsername(null);
    setCredits(0);
    setInventory([]);
    localStorage.removeItem("cyber_user");
    localStorage.removeItem("cyber_credits");
  };

  const addItem = (item: Item) => {
    if (!username) {
      alert("SYSTEM ERROR: Login dulu buat akses terminal!");
      return;
    }
    if (credits < item.price) {
      alert("SYSTEM ERROR: Credits lu kurang, Netrunner!");
      return;
    }
    setInventory((prev) => [...prev, item]);
    setCredits((prev) => prev - item.price);
  };

  const removeItem = (index: number) => {
    const item = inventory[index];
    setInventory((prev) => prev.filter((_, i) => i !== index));
    setCredits((prev) => prev + item.price);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]";
      case "Epic": return "text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]";
      case "Rare": return "text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]";
      default: return "text-gray-400 border-gray-500";
    }
  };

  // --- SPLASH SCREEN TAMPILAN ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#05050a]">
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* Efek cincin neon */}
          <div className="absolute inset-0 rounded-full border-2 border-[#00ffcc] animate-ping opacity-20"></div>
          <div className="absolute inset-2 rounded-full border border-[#ff00ff] shadow-[0_0_20px_#ff00ff] animate-pulse"></div>
          <h1 className="text-4xl font-bold text-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,1)] z-10">
            CD_
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-[0.3em] mb-4 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          CYBERDECK
        </h2>

        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-[#00ffcc] mb-2 font-mono">
            <span>Booting system...</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00ffcc] to-[#ff00ff] transition-all duration-150 ease-out shadow-[0_0_10px_#00ffcc]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // --- WEB UTAMA ---
  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto animate-fade-in">
{/* HEADER BARU */}
<header className="border-b-2 border-[#00ffcc] pb-4 mb-6 relative">
  <div className="flex justify-between items-start">
    {/* KIRI: Tombol Menu & Judul */}
    <div>
      <div className="flex items-center gap-3 mb-1">
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          className="text-[#00ffcc] hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest uppercase text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">
          // CYBERDECK_
        </h1>
      </div>
      <p className="text-[10px] text-[#00ffcc]/60 uppercase tracking-widest">System Ready. Welcome, Netrunner.</p>
    </div>

    {/* KANAN: Profil / Login */}
    <div className="text-right flex flex-col items-end">
      {username ? (
        <>
          <p className="text-xs text-[#ff00ff] mb-1">
            ID: <span className="font-bold text-white">{username}</span>
          </p>
          <p className="text-[10px] text-[#00ffcc] mb-2">
            CR: <span className="font-bold text-sm">{credits.toLocaleString()}</span>
          </p>
          <button onClick={handleLogout} className="text-[9px] text-red-500 hover:text-red-400 border border-red-500/50 px-2 py-1 rounded">
            [ DISCONNECT ]
          </button>
        </>
      ) : (
        <button onClick={() => setShowLogin(true)} className="cyber-btn px-3 py-1.5 text-xs rounded">
          [ LOGIN ]
        </button>
      )}
    </div>
  </div>

  {/* DROPDOWN MENU KONTAK (Muncul pas tombol garis tiga diklik) */}
  {showMenu && (
    <div className="absolute top-full left-0 mt-2 w-48 bg-[#05050a] border border-[#00ffcc] p-3 rounded shadow-[0_0_15px_rgba(0,255,204,0.3)] z-50">
      <p className="text-[10px] text-[#00ffcc]/50 uppercase mb-2 border-b border-[#00ffcc]/30 pb-1">Comms Channel</p>
      <div className="flex flex-col gap-2 text-xs uppercase tracking-widest text-[#ff00ff]">
        <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          &gt; [ WA_Owner ]
        </a>
        <a href="https://t.me/username_kamu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          &gt; [ Telegram ]
        </a>
        <a href="https://instagram.com/username_kamu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          &gt; [ IG_Feed ]
        </a>
      </div>
    </div>
  )}
</header>
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="cyber-panel p-6 rounded w-full max-w-sm">
            <h2 className="text-[#ff00ff] text-lg mb-4 text-center uppercase tracking-widest">Netrunner Auth</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter Codename..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-transparent border border-[#00ffcc] text-[#00ffcc] p-3 mb-4 rounded outline-none focus:shadow-[0_0_15px_rgba(0,255,204,0.3)]"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-2 text-xs border border-gray-500 text-gray-400 rounded hover:bg-gray-800">
                  CANCEL
                </button>
                <button type="submit" className="flex-1 cyber-btn py-2 text-xs rounded">
                  CONNECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg text-[#00ffcc] uppercase border-l-4 border-[#00ffcc] pl-2 mb-4">Black Market Terminal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATALOG.map((item) => (
              <div key={item.id} className="cyber-item p-4 rounded flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 border rounded uppercase ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    <span className="text-xs text-gray-500">{item.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-[#ff00ff] text-sm mb-4">{item.price.toLocaleString()} CR</p>
                </div>
                <button 
                  onClick={() => addItem(item)}
                  className={`w-full py-2 text-xs rounded mt-auto border ${credits >= item.price && username ? "border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/10" : "border-gray-600 text-gray-600 cursor-not-allowed"}`}
                >
                  [ Acquire ]
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="cyber-panel p-4 rounded h-full sticky top-6">
            <h2 className="text-lg text-[#ff00ff] uppercase border-l-4 border-[#ff00ff] pl-2 mb-4">Your Loadout</h2>
            
            {inventory.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-10">No items equipped.</p>
            ) : (
              <ul className="space-y-2 mb-6">
                {inventory.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm border-b border-[#00ffcc]/20 pb-2">
                    <span className="text-[#00ffcc] truncate pr-2">{item.name}</span>
                    <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-400 font-bold px-2">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 pt-4 border-t border-[#00ffcc]/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400 uppercase">Total Cost</span>
                <span className="text-xl font-bold text-[#00ffcc]">
                  {inventory.reduce((sum, item) => sum + item.price, 0).toLocaleString()} CR
                </span>
              </div>
              <button 
                className={`w-full py-3 rounded text-sm font-bold border ${inventory.length > 0 ? "border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff]/10" : "border-gray-600 text-gray-600 cursor-not-allowed"}`}
                onClick={() => alert("Mengarahkan ke Checkout...")}
              >
                [ Jack In & Pay ]
              </button>
            </div>
          </div>
        </div>
      </div>
{/* FOOTER */}
<footer className="mt-16 pt-6 border-t border-[#00ffcc]/30 text-center flex flex-col gap-2">
  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
    © 2026 Cyberdeck Terminal. All systems operational.
  </p>
  <p className="text-[10px] text-[#00ffcc]/50">
    Powered by React & Netrunner Tech.
  </p>
</footer>
    </div>
  );
}
