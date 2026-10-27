import Scenery from "./Scenery";
import Farm from "./games/Farm";

export default function App() {
  return (
    <>
      <Scenery />
      <div className="relative z-10 min-h-screen p-4 pb-36 max-w-3xl mx-auto animate-fade-in">
        <header className="sd-wood p-4 mb-5 text-center">
          <p className="text-xl mb-1">🌻 🐔 🐄 🌾</p>
          <h1 className="text-2xl">Lembah Pixel</h1>
          <p className="text-xs opacity-80 mt-1">Tanam, mancing, jual, dan hias kebunmu</p>
        </header>
        <div className="cyber-panel p-4">
          <Farm />
        </div>
        <footer className="sd-wood mt-10 p-2 text-center text-xs">
          Progres tersimpan di browser lo
        </footer>
      </div>
    </>
  );
}
