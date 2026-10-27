import type { CSSProperties } from "react";

type B = [number, number, number];
const BLOBS: B[] = [
  [16, 7, 6], [8, 11, 5], [24, 11, 5], [12, 15, 6], [21, 15, 6],
  [16, 12, 6], [5, 16, 4], [27, 16, 4], [16, 3, 3],
];
const FRUIT: [number, number][] = [[10, 9], [20, 13], [14, 17], [24, 9], [7, 15], [18, 6]];

function blob(cx: number, cy: number, r: number, fill: string, key: string) {
  if (r < 1) return null;
  return Array.from({ length: 2 * r + 1 }, (_, i) => {
    const dy = i - r;
    const w = Math.floor(Math.sqrt(r * r - dy * dy));
    return <rect key={key + i} x={cx - w} y={cy + dy} width={2 * w + 1} height="1" fill={fill} />;
  });
}

function Leaves({ bl, k = 0 }: { bl: B[]; k?: number }) {
  return (
    <>
      {bl.map(([x, y, r], i) => blob(x + 1, y + 1, r, "#245a26", "a" + i))}
      {bl.map(([x, y, r], i) => blob(x, y, r - 1, "#3f8f36", "b" + i))}
      {bl.map(([x, y, r], i) => blob(x - 1, y - 1, r - 2, "#6fc24f", "c" + i))}
      {k === 0 && bl.map(([x, y, r], i) => blob(x - 2, y - 2, r - 4, "#a5e66f", "d" + i))}
    </>
  );
}

function Tree({ style, flip = false, delay = 0 }: { style: CSSProperties; flip?: boolean; delay?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      className="absolute sway"
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      <g transform={flip ? "translate(32,0) scale(-1,1)" : undefined}>
        <g fill="#6b3a1a">
          <rect x="14" y="18" width="4" height="12" />
          <rect x="12" y="29" width="8" height="2" />
          <rect x="10" y="30" width="2" height="1" />
          <rect x="20" y="30" width="2" height="1" />
        </g>
        <g fill="#4a2810">
          <rect x="16" y="18" width="2" height="12" />
          <rect x="18" y="29" width="2" height="2" />
        </g>
        <Leaves bl={BLOBS} />
        {FRUIT.map(([x, y]) => (
          <rect key={x + "-" + y} x={x} y={y} width="1" height="1" fill="#e0483a" />
        ))}
      </g>
    </svg>
  );
}

const BUSH: B[] = [[6, 6, 4], [12, 6, 5], [18, 7, 4]];

function Bush({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 13" shapeRendering="crispEdges" className="absolute" style={style}>
      <Leaves bl={BUSH} k={1} />
      <rect x="8" y="5" width="1" height="1" fill="#ff8fb8" />
      <rect x="14" y="4" width="1" height="1" fill="#ffd23f" />
      <rect x="19" y="6" width="1" height="1" fill="#fff" />
    </svg>
  );
}

function Cloud({ top, size, dur, delay }: { top: number; size: number; dur: number; delay: number }) {
  return (
    <svg
      viewBox="0 0 19 7"
      shapeRendering="crispEdges"
      className="cloud"
      style={{ top, width: size, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
    >
      <rect x="5" y="0" width="6" height="1" fill="#fff" />
      <rect x="3" y="1" width="10" height="1" fill="#fff" />
      <rect x="1" y="2" width="16" height="2" fill="#fff" />
      <rect x="0" y="4" width="19" height="2" fill="#fff" />
      <rect x="1" y="6" width="17" height="1" fill="#cfe8f5" />
    </svg>
  );
}

function Ground() {
  const bumps = Array.from({ length: 50 }, (_, k) => {
    const x = k * 4;
    return { x, top: 5 + Math.round(2 * Math.sin(x / 11) + Math.sin(x / 4.3)) };
  });
  const flowers = ["#ffd23f", "#ff8fb8", "#ffffff"];
  return (
    <svg
      viewBox="0 0 200 20"
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className="absolute left-0 bottom-0 w-full"
      style={{ height: 80 }}
    >
      {bumps.map(({ x, top }) => (
        <g key={x}>
          <rect x={x} y={top} width="4" height={20 - top} fill="#5fa842" />
          <rect x={x} y={top} width="4" height="1" fill="#86d65e" />
        </g>
      ))}
      <rect y="13" width="200" height="7" fill="#4a8f35" />
      {Array.from({ length: 26 }, (_, k) => {
        const x = (k * 37) % 194;
        const y = 9 + ((k * 13) % 9);
        return (
          <g key={k} fill="#3f7d2c">
            <rect x={x} y={y} width="1" height="2" />
            <rect x={x + 1} y={y + 1} width="1" height="1" />
            <rect x={x + 2} y={y} width="1" height="2" />
          </g>
        );
      })}
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={(k * 53 + 11) % 190} y={8 + ((k * 7) % 9)} width="1" height="1" fill={flowers[k % 3]} />
      ))}
    </svg>
  );
}

type BirdProps = { top: number; dur: number; delay: number; color: string; wing: string; rtl?: boolean; size?: number };

function Bird({ top, dur, delay, color, wing, rtl = false, size = 34 }: BirdProps) {
  return (
    <div
      className={rtl ? "bird rtl" : "bird"}
      style={{ top, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 10 7" shapeRendering="crispEdges" className="bob" style={{ width: size }}>
        <g transform={rtl ? "translate(10,0) scale(-1,1)" : undefined}>
          <rect x="2" y="3" width="6" height="2" fill={color} />
          <rect x="0" y="3" width="2" height="1" fill={color} />
          <rect x="1" y="4" width="1" height="1" fill={color} />
          <rect x="7" y="2" width="2" height="2" fill={color} />
          <rect x="8" y="2" width="1" height="1" fill="#2a1a10" />
          <rect x="9" y="3" width="1" height="1" fill="#f2a33a" />
          <g className="wa" fill={wing}>
            <rect x="3" y="1" width="3" height="2" />
            <rect x="4" y="0" width="1" height="1" />
          </g>
          <g className="wb" fill={wing}>
            <rect x="3" y="5" width="3" height="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Scenery() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Cloud top={30} size={110} dur={55} delay={-10} />
        <Cloud top={90} size={80} dur={75} delay={-40} />
        <Cloud top={150} size={130} dur={95} delay={-70} />
        <Ground />
        <Bush style={{ left: 96, bottom: 14, width: 68 }} />
        <Bush style={{ right: 100, bottom: 12, width: 58 }} />
        <Tree style={{ left: -10, bottom: 16, width: 140 }} />
        <Tree style={{ right: -10, bottom: 10, width: 150 }} flip delay={-2} />
      </div>
      <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
        <Bird top={70} dur={26} delay={-4} color="#3a78c9" wing="#2a5a9a" />
        <Bird top={104} dur={26} delay={-6} color="#3a78c9" wing="#2a5a9a" size={26} />
        <Bird top={200} dur={34} delay={-18} color="#d6453a" wing="#a32f27" rtl />
        <Bird top={46} dur={42} delay={-30} color="#f2c230" wing="#c99a1a" size={28} />
      </div>
    </>
  );
}
