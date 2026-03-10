import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: linear-gradient(180deg, #87ceeb 0%, #b8e4ff 52%, #7ec850 52%, #5aab30 100%);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif; overflow: hidden;
  }

  .cloud { position: fixed; background: white; border-radius: 50px; opacity: 0.9; animation: float-cloud linear infinite; }
  .cloud::before { content: ''; position: absolute; background: white; border-radius: 50%; width: 60%; height: 180%; top: -50%; left: 15%; }
  .cloud::after  { content: ''; position: absolute; background: white; border-radius: 50%; width: 40%; height: 150%; top: -35%; left: 48%; }
  @keyframes float-cloud { from { transform: translateX(110vw); } to { transform: translateX(-35vw); } }

  .flower { position: fixed; bottom: calc(48% - 10px); font-size: 1.3rem; z-index: 1; pointer-events: none; }

  .scene { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 28px; }

  h1 { font-family: 'Fredoka One', cursive; font-size: 2.8rem; color: #fff; text-shadow: 3px 4px 0 #c026d3, 0 0 30px rgba(200,50,220,0.4); letter-spacing: 2px; }

  .track { position: relative; width: 680px; max-width: 92vw; height: 210px; overflow: visible; }

  .unicorn { position: absolute; bottom: 8px; left: 40px; width: 220px; filter: drop-shadow(4px 8px 10px rgba(0,0,0,0.2)); }

  .unicorn.running {
    animation: gallop-run 5s cubic-bezier(0.3,0,1,0.9) forwards, bob 0.28s ease-in-out infinite;
  }

  @keyframes gallop-run {
    0%   { left: 40px; opacity: 1; }
    80%  { opacity: 1; }
    96%  { left: calc(100vw + 280px); opacity: 0; }
    100% { left: calc(100vw + 280px); opacity: 0; }
  }

  @keyframes bob {
    0%   { transform: translateY(0px); }
    50%  { transform: translateY(-10px) rotate(1deg); }
    100% { transform: translateY(0px); }
  }

  .unicorn.running .leg-fl { animation: swing-a 0.28s ease-in-out infinite; }
  .unicorn.running .leg-fr { animation: swing-b 0.28s ease-in-out infinite; }
  .unicorn.running .leg-rl { animation: swing-b 0.28s ease-in-out infinite; }
  .unicorn.running .leg-rr { animation: swing-a 0.28s ease-in-out infinite; }

  @keyframes swing-a { 0% { transform: rotate(-28deg); } 50% { transform: rotate(28deg); } 100% { transform: rotate(-28deg); } }
  @keyframes swing-b { 0% { transform: rotate(28deg); } 50% { transform: rotate(-28deg); } 100% { transform: rotate(28deg); } }

  .unicorn.running .tail { animation: tail-flap 0.24s ease-in-out infinite alternate; }
  @keyframes tail-flap { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }

  .unicorn.running .mane { animation: mane-wave 0.28s ease-in-out infinite alternate; }
  @keyframes mane-wave { from { transform: skewX(-5deg); } to { transform: skewX(5deg); } }

  .dust { position: absolute; bottom: 8px; left: 10px; pointer-events: none; opacity: 0; }
  .unicorn.running ~ .dust { animation: dust-life 5s forwards; }
  @keyframes dust-life { 0%,5% { opacity: 0; } 10% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
  .puff { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.75); animation: puff-go var(--pd) ease-out infinite var(--del); }
  @keyframes puff-go { 0% { transform: scale(0.2) translate(0,0); opacity: 0.9; } 100% { transform: scale(1.8) translate(-28px,-28px); opacity: 0; } }

  .sparkle { position: fixed; pointer-events: none; font-size: 1.3rem; z-index: 99; animation: sp-fade 0.9s ease-out forwards; }
  @keyframes sp-fade { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-50px) scale(0.2); } }

  .btn { font-family: 'Fredoka One', cursive; font-size: 1.6rem; color: white; background: linear-gradient(135deg,#e040a0,#7c3aed); border: none; border-radius: 60px; padding: 16px 56px; cursor: pointer; box-shadow: 0 8px 0 #5b21b6, 0 14px 30px rgba(124,58,237,0.4); transition: transform 0.1s, box-shadow 0.1s; letter-spacing: 1px; }
  .btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 11px 0 #5b21b6, 0 22px 36px rgba(124,58,237,0.45); }
  .btn:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 3px 0 #5b21b6; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .status { font-size: 1.15rem; font-weight: 800; color: #fff; text-shadow: 1px 2px 0 rgba(0,0,0,0.18); min-height: 28px; }
`;

const SPARKLES = ["✨", "⭐", "💫", "🌟", "🌸"];
const FLOWERS = ["🌸", "🌼", "🌻", "🌺", "🌷"];

function UnicornSVG() {
  return (
    <svg
      viewBox="0 0 240 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", overflow: "visible" }}
    >
      <g className="tail" style={{ transformOrigin: "28px 90px" }}>
        <path
          d="M30 90 Q8 76 6 52 Q14 65 20 82 Q10 60 16 38 Q25 54 22 76 Q22 55 30 46"
          fill="#d946ef"
          stroke="#a21caf"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M32 97 Q4 86 8 63" stroke="#f0abfc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      <ellipse cx="112" cy="112" rx="78" ry="46" fill="#fdf2fb" stroke="#f0abfc" strokeWidth="2.5" />
      <ellipse cx="96" cy="102" rx="36" ry="22" fill="rgba(255,255,255,0.45)" />
      <g className="leg-rr" style={{ transformOrigin: "74px 142px" }}>
        <rect x="65" y="142" width="19" height="34" rx="9.5" fill="#fce7f3" stroke="#f0abfc" strokeWidth="2" />
        <rect x="63" y="168" width="23" height="9" rx="4.5" fill="#d946ef" />
      </g>
      <g className="leg-rl" style={{ transformOrigin: "56px 142px" }}>
        <rect x="47" y="142" width="19" height="34" rx="9.5" fill="#fce7f3" stroke="#f0abfc" strokeWidth="2" />
        <rect x="45" y="168" width="23" height="9" rx="4.5" fill="#c026d3" />
      </g>
      <g className="leg-fr" style={{ transformOrigin: "162px 142px" }}>
        <rect x="153" y="142" width="19" height="34" rx="9.5" fill="#fce7f3" stroke="#f0abfc" strokeWidth="2" />
        <rect x="151" y="168" width="23" height="9" rx="4.5" fill="#d946ef" />
      </g>
      <g className="leg-fl" style={{ transformOrigin: "144px 142px" }}>
        <rect x="135" y="142" width="19" height="34" rx="9.5" fill="#fce7f3" stroke="#f0abfc" strokeWidth="2" />
        <rect x="133" y="168" width="23" height="9" rx="4.5" fill="#c026d3" />
      </g>
      <path
        d="M155 90 Q168 62 172 46 Q180 54 178 72 Q176 90 163 108"
        fill="#fdf2fb"
        stroke="#f0abfc"
        strokeWidth="2.5"
      />
      <ellipse
        cx="188"
        cy="66"
        rx="30"
        ry="24"
        fill="#fdf2fb"
        stroke="#f0abfc"
        strokeWidth="2.5"
        transform="rotate(-8 188 66)"
      />
      <ellipse cx="212" cy="76" rx="16" ry="12" fill="#fdf2fb" stroke="#f0abfc" strokeWidth="2.5" />
      <path d="M176 45 L172 24 L186 36 Z" fill="#fce7f3" stroke="#f0abfc" strokeWidth="1.5" />
      <path d="M177 44 L173 28 L184 37 Z" fill="#f0abfc" />
      <polygon points="200,8 176,42 190,38" fill="url(#hg)" stroke="#d97706" strokeWidth="1.3" />
      <line x1="181" y1="35" x2="192" y2="28" stroke="#b45309" strokeWidth="1" />
      <line x1="186" y1="24" x2="196" y2="17" stroke="#b45309" strokeWidth="1" />
      <line x1="193" y1="14" x2="199" y2="10" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="200" cy="9" r="3" fill="white" opacity="0.9" />
      <g className="mane" style={{ transformOrigin: "172px 55px" }}>
        <path
          d="M182 46 Q170 32 174 14 Q165 28 162 46 Q167 22 158 16 Q154 30 158 48 Q158 26 149 22 Q147 36 154 50"
          fill="#e879f9"
          stroke="#c026d3"
          strokeWidth="1.3"
        />
      </g>
      <ellipse cx="196" cy="63" rx="7.5" ry="8.5" fill="white" stroke="#c026d3" strokeWidth="2" />
      <ellipse cx="196" cy="64" rx="5" ry="6" fill="#150025" />
      <circle cx="198" cy="61" r="2" fill="white" />
      <path d="M189 57 Q196 53 203 57" stroke="#c026d3" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="208" cy="74" rx="8" ry="5" fill="#f9a8e0" opacity="0.65" />
      <ellipse cx="223" cy="74" rx="5" ry="4" fill="#fce7f3" stroke="#f0abfc" strokeWidth="1.2" />
      <circle cx="221" cy="74" r="1.3" fill="#c026d3" opacity="0.5" />
      <circle cx="224" cy="75" r="1.3" fill="#c026d3" opacity="0.5" />
      <path d="M221 82 Q214 87 207 82" stroke="#c026d3" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <text x="110" y="120" fontSize="16" textAnchor="middle" fill="#e879f9" opacity="0.55">
        ★
      </text>
      <defs>
        <linearGradient id="hg" x1="183" y1="8" x2="183" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function App() {
  const [running, setRunning] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const sparkId = useRef(0);
  const sparkInt = useRef(null);
  const unicornEl = useRef(null);

  const flowers = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i / 13) * 94 + 3}%`,
    emoji: FLOWERS[i % FLOWERS.length],
  }));
  const clouds = [
    { w: 130, h: 44, top: "8%", dur: "24s", delay: "0s" },
    { w: 90, h: 32, top: "18%", dur: "32s", delay: "9s" },
    { w: 160, h: 52, top: "5%", dur: "28s", delay: "16s" },
  ];

  const spawnSparkle = () => {
    const el = unicornEl.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSparkles((s) => [
      ...s,
      {
        id: sparkId.current++,
        x: r.left + r.width * 0.88 + (Math.random() - 0.5) * 50,
        y: r.top + r.height * 0.28 + (Math.random() - 0.5) * 40,
        emoji: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
      },
    ]);
  };
  const removeSpark = (id) => setSparkles((s) => s.filter((p) => p.id !== id));

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    sparkInt.current = setInterval(spawnSparkle, 160);
    setTimeout(() => {
      clearInterval(sparkInt.current);
      setRunning(false);
    }, 5000);
  };

  useEffect(() => () => clearInterval(sparkInt.current), []);

  return (
    <>
      <style>{css}</style>
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            width: c.w,
            height: c.h,
            top: c.top,
            zIndex: 0,
            animation: `float-cloud ${c.dur} linear ${c.delay} infinite`,
          }}
        />
      ))}
      {flowers.map((f) => (
        <div key={f.id} className="flower" style={{ left: f.left }}>
          {f.emoji}
        </div>
      ))}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="sparkle"
          style={{ left: sp.x, top: sp.y }}
          onAnimationEnd={() => removeSpark(sp.id)}
        >
          {sp.emoji}
        </div>
      ))}
      <div className="scene">
        <h1>🦄 Unicornio Veloz</h1>
        <div className="track">
          <div className="dust">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="puff"
                style={{
                  width: 16 + i * 9,
                  height: 16 + i * 9,
                  left: -i * 12,
                  bottom: i * 5,
                  "--pd": `${0.45 + i * 0.14}s`,
                  "--del": `${i * 0.06}s`,
                }}
              />
            ))}
          </div>
          <div ref={unicornEl} className={`unicorn ${running ? "running" : ""}`}>
            <UnicornSVG />
          </div>
        </div>
        <p className="status">{running ? "🌟 ¡A todo galope! 🌟" : "Presiona el botón para correr 🐴"}</p>
        <button className="btn" onClick={handleRun} disabled={running}>
          {running ? "⚡ Corriendo..." : "🏇 ¡Correr!"}
        </button>
      </div>
    </>
  );
}
