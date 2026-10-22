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
  const [inventory, setInventory] = useState<Item[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [inputName, setInputName] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // Load data dari localStorage saat pertama kali buka
  useEffect(() => {
    const savedUser = localStorage.getItem("cyber_user");
    const savedCredits = localStorage.getItem("cyber_credits");
    if (savedUser) setUsername(savedUser);
    if (savedCredits) setCredits(parseInt(savedCredits));
  }, []);

  // Simpan data ke localStorage tiap ada perubahan
  useEffect(() => {
    if (username) localStorage.setItem("cyber_user", username);
    localStorage.setItem("cyber_credits", credits.toString());
  }, [username, credits]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    if (credits === 0) setCredits(10000); // Bonus awal 10.000 CR
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
    setCredits((prev) => prev + item.price); // Refund credits
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]";
      case "Epic": return "text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]";
      case "Rare": return "text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]";
      default: return "text-gray-400 border-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* HEADER DENGAN FITUR AKUN */}
      <header className="border-b-2 border-[#00ffcc] pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-[#00ffcc] drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">
            // CYBERDECK_
          </h1>
          <p className="text-xs text-[#00ffcc]/60 mt-1 uppercase">System Ready. Welcome, Netrunner.</p>
        </div>

        {/* PROFIL / LOGIN SECTION */}
        <div className="text-right flex flex-col items-end">
          {username ? (
            <>
              <p className="text-sm text-[#ff00ff] mb-1">
                ID: <span className="font-bold text-white">{username}</span>
              </p>
              <p className="text-xs text-[#00ffcc] mb-2">
                CREDITS: <span className="font-bold text-lg">{credits.toLocaleString()}</span>
              </p>
              <button onClick={handleLogout} className="text-[10px] text-red-500 hover:text-red-400 border border-red-500/50 px-2 py-1 rounded">
                [ DISCONNECT ]
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} className="cyber-btn px-4 py-2 text-xs rounded">
              [ LOGIN ]
            </button>
          )}
        </div>
      </header>

      {/* MODAL LOGIN */}
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

      {/* MAIN CONTENT */}
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
    </div>
  );
}
