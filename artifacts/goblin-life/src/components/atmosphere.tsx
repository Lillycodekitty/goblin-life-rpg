import { useMemo } from "react";
import { useGetDailyState } from "@workspace/api-client-react";
import { WEATHER_META } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Seeded pseudo-random so particles are stable across renders
───────────────────────────────────────────────────────────────*/
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ─────────────────────────────────────────────────────────────
   RAIN  (thunderstorm + persistent_drizzle)
───────────────────────────────────────────────────────────────*/
function RainParticles({ count, speed, opacity, angle }: {
  count: number; speed: [number, number]; opacity: number; angle: number;
}) {
  const rand = useMemo(() => seededRand(42), []);
  const drops = useMemo(() => Array.from({ length: count }, (_, i) => {
    const r = rand;
    return {
      id: i,
      left: r() * 120 - 10,
      delay: r() * 3,
      duration: speed[0] + r() * (speed[1] - speed[0]),
      length: 14 + r() * 22,
      width: 0.8 + r() * 0.8,
    };
  }), [count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transform: `skewX(${angle}deg)` }}>
      {drops.map(d => (
        <div
          key={d.id}
          className="absolute top-0 rounded-full"
          style={{
            left: `${d.left}%`,
            width: `${d.width}px`,
            height: `${d.length}px`,
            background: `rgba(180,210,240,${opacity})`,
            animationName: "rainFall",
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOG WISPS  (foggy_morning)
───────────────────────────────────────────────────────────────*/
function FogWisps() {
  const wisps = useMemo(() => {
    const r = seededRand(7);
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: 10 + r() * 80,
      width: 300 + r() * 500,
      height: 80 + r() * 120,
      opacity: 0.04 + r() * 0.08,
      duration: 60 + r() * 60,
      delay: r() * -60,
      direction: r() > 0.5 ? 1 : -1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {wisps.map(w => (
        <div
          key={w.id}
          className="absolute rounded-full"
          style={{
            top: `${w.top}%`,
            left: "-20%",
            width: `${w.width}px`,
            height: `${w.height}px`,
            background: "radial-gradient(ellipse, rgba(200,215,210,1) 0%, transparent 70%)",
            opacity: w.opacity,
            filter: "blur(40px)",
            animationName: w.direction > 0 ? "fogDriftRight" : "fogDriftLeft",
            animationDuration: `${w.duration}s`,
            animationDelay: `${w.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SNOWFLAKES  (cold_snap)
───────────────────────────────────────────────────────────────*/
function Snowflakes() {
  const flakes = useMemo(() => {
    const r = seededRand(13);
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: r() * 100,
      size: 3 + r() * 9,
      opacity: 0.3 + r() * 0.5,
      duration: 10 + r() * 18,
      delay: r() * -20,
      sway: 20 + r() * 40,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute top-[-12px] select-none"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            animationName: "snowFall",
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            "--sway": `${f.sway}px`,
          } as React.CSSProperties}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FALLING LEAVES  (autumn_drift)
───────────────────────────────────────────────────────────────*/
const LEAF_CHARS = ["🍂", "🍁", "🍃"];
function FallingLeaves() {
  const leaves = useMemo(() => {
    const r = seededRand(99);
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: r() * 110 - 5,
      size: 12 + r() * 16,
      opacity: 0.55 + r() * 0.35,
      duration: 8 + r() * 14,
      delay: r() * -18,
      sway: 30 + r() * 60,
      rotStart: r() * 360,
      rotEnd: r() * 360 * (r() > 0.5 ? 1 : -1),
      char: LEAF_CHARS[Math.floor(r() * LEAF_CHARS.length)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map(l => (
        <div
          key={l.id}
          className="absolute top-[-30px] select-none"
          style={{
            left: `${l.left}%`,
            fontSize: `${l.size}px`,
            opacity: l.opacity,
            animationName: "leafFall",
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            "--sway": `${l.sway}px`,
            "--rot-start": `${l.rotStart}deg`,
            "--rot-end": `${l.rotEnd}deg`,
          } as React.CSSProperties}
        >
          {l.char}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOLDEN DUST  (clear_skies)
───────────────────────────────────────────────────────────────*/
function GoldenDust() {
  const motes = useMemo(() => {
    const r = seededRand(55);
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: r() * 100,
      bottom: r() * 30,
      size: 1.5 + r() * 3.5,
      opacity: 0.3 + r() * 0.5,
      duration: 10 + r() * 20,
      delay: r() * -25,
      drift: (r() - 0.5) * 60,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {motes.map(m => (
        <div
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            background: `radial-gradient(circle, rgba(255,215,80,1) 0%, rgba(255,180,20,0.4) 60%, transparent 100%)`,
            opacity: m.opacity,
            animationName: "dustFloat",
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            "--drift": `${m.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SPARKLES  (golden_hour)
───────────────────────────────────────────────────────────────*/
const SPARKLE_CHARS = ["✦", "✧", "·", "⋆", "˚"];
function Sparkles() {
  const sparks = useMemo(() => {
    const r = seededRand(77);
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: r() * 100,
      top: 20 + r() * 70,
      size: 8 + r() * 16,
      opacity: 0.4 + r() * 0.5,
      duration: 4 + r() * 10,
      delay: r() * -12,
      char: SPARKLE_CHARS[Math.floor(r() * SPARKLE_CHARS.length)],
      drift: (r() - 0.5) * 40,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparks.map(s => (
        <div
          key={s.id}
          className="absolute select-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `${s.size}px`,
            color: `rgba(255,200,60,${s.opacity})`,
            animationName: "sparkleFloat",
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            "--drift": `${s.drift}px`,
          } as React.CSSProperties}
        >
          {s.char}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DRIZZLE MIST  (persistent_drizzle)
───────────────────────────────────────────────────────────────*/
function DrizzleMist() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background: "linear-gradient(to top, rgba(100,140,160,0.12) 0%, transparent 100%)",
          filter: "blur(8px)",
          animationName: "mistPulse",
          animationDuration: "8s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIGHTNING  (thunderstorm)
───────────────────────────────────────────────────────────────*/
function Lightning() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animationName: "lightningFlash",
        animationDuration: "7s",
        animationTimingFunction: "ease-out",
        animationIterationCount: "infinite",
        animationDelay: "2s",
        background: "rgba(160,160,255,0.06)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   CSS KEYFRAMES — injected once into the DOM
───────────────────────────────────────────────────────────────*/
const KEYFRAMES = `
@keyframes rainFall {
  0%   { transform: translateY(-40px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(110vh); opacity: 0; }
}
@keyframes fogDriftRight {
  0%   { transform: translateX(-30%) scaleY(1); }
  50%  { transform: translateX(80%) scaleY(1.15); }
  100% { transform: translateX(-30%) scaleY(1); }
}
@keyframes fogDriftLeft {
  0%   { transform: translateX(80%) scaleY(1); }
  50%  { transform: translateX(-30%) scaleY(0.9); }
  100% { transform: translateX(80%) scaleY(1); }
}
@keyframes snowFall {
  0%   { transform: translateY(-12px) translateX(0); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 0.8; }
  100% { transform: translateY(105vh) translateX(var(--sway,30px)); opacity: 0; }
}
@keyframes leafFall {
  0%   { transform: translateY(-30px) translateX(0) rotate(var(--rot-start,0deg)); opacity: 0; }
  8%   { opacity: 1; }
  40%  { transform: translateY(40vh) translateX(var(--sway,50px)) rotate(calc(var(--rot-start,0deg) + 120deg)); }
  70%  { transform: translateY(70vh) translateX(0) rotate(calc(var(--rot-start,0deg) + 240deg)); }
  92%  { opacity: 0.6; }
  100% { transform: translateY(108vh) translateX(calc(var(--sway,50px) * 0.5)) rotate(var(--rot-end,360deg)); opacity: 0; }
}
@keyframes dustFloat {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  20%  { opacity: 1; }
  50%  { transform: translateY(-60px) translateX(var(--drift,20px)); opacity: 0.8; }
  80%  { opacity: 0.3; }
  100% { transform: translateY(-120px) translateX(calc(var(--drift,20px) * 0.5)); opacity: 0; }
}
@keyframes sparkleFloat {
  0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
  20%  { opacity: 1; transform: translateY(-10px) translateX(calc(var(--drift,0px) * 0.3)) scale(1); }
  60%  { opacity: 0.6; }
  100% { transform: translateY(-50px) translateX(var(--drift,0px)) scale(0.4); opacity: 0; }
}
@keyframes mistPulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}
@keyframes lightningFlash {
  0%, 88%, 92%, 96%, 100% { opacity: 0; }
  89%, 93%                 { opacity: 1; }
}
`;

function ParticleStyles() {
  return <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />;
}

/* ─────────────────────────────────────────────────────────────
   BACKGROUND GRADIENTS per weather
───────────────────────────────────────────────────────────────*/
const WEATHER_GRADIENTS: Record<string, string> = {
  foggy_morning:      "radial-gradient(ellipse at 60% 40%, #1a2820 0%, #0d1710 50%, #070d08 100%)",
  thunderstorm:       "radial-gradient(ellipse at 50% 20%, #0a0a1a 0%, #050510 50%, #020208 100%)",
  persistent_drizzle: "radial-gradient(ellipse at 40% 60%, #0d1a20 0%, #07121a 50%, #040c12 100%)",
  clear_skies:        "radial-gradient(ellipse at 50% 80%, #0d2010 0%, #071a0a 40%, #030d05 100%)",
  autumn_drift:       "radial-gradient(ellipse at 40% 50%, #1a1005 0%, #100a02 50%, #080500 100%)",
  cold_snap:          "radial-gradient(ellipse at 50% 30%, #060d18 0%, #03080f 50%, #020508 100%)",
  golden_hour:        "radial-gradient(ellipse at 60% 70%, #1a0f00 0%, #120800 50%, #080400 100%)",
};

/* ─────────────────────────────────────────────────────────────
   CANDLE GLOW  — always present, intensity varies by weather
───────────────────────────────────────────────────────────────*/
const CANDLE_INTENSITY: Record<string, number> = {
  foggy_morning: 0.4, thunderstorm: 0.6, persistent_drizzle: 0.5,
  clear_skies: 0.15, autumn_drift: 0.5, cold_snap: 0.7, golden_hour: 0.35,
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────*/
export function Atmosphere() {
  const { data: dailyState } = useGetDailyState();
  const weather = (dailyState?.emotionalWeather as string) || "foggy_morning";
  const candleGlow = CANDLE_INTENSITY[weather] ?? 0.4;

  return (
    <>
      <ParticleStyles />
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">

        {/* Base gradient — transitions between weather states */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${weather}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0"
            style={{ background: WEATHER_GRADIENTS[weather] ?? WEATHER_GRADIENTS.foggy_morning }}
          />
        </AnimatePresence>

        {/* Candle warmth — amber glow from bottom corners */}
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(200,130,20,${candleGlow}) 0%, transparent 70%)`,
            filter: "blur(60px)",
            transition: "opacity 3s ease",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(180,100,10,${candleGlow * 0.6}) 0%, transparent 70%)`,
            filter: "blur(50px)",
            transition: "opacity 3s ease",
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* Weather-specific particles — cross-fade in/out */}
        <AnimatePresence mode="wait">
          {weather === "foggy_morning" && (
            <motion.div key="fog-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 3 }}>
              <FogWisps />
            </motion.div>
          )}
          {weather === "thunderstorm" && (
            <motion.div key="storm-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}>
              <RainParticles count={90} speed={[0.28, 0.55]} opacity={0.45} angle={-12} />
              <Lightning />
            </motion.div>
          )}
          {weather === "persistent_drizzle" && (
            <motion.div key="drizzle-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 2 }}>
              <RainParticles count={55} speed={[0.65, 1.3]} opacity={0.28} angle={-5} />
              <DrizzleMist />
            </motion.div>
          )}
          {weather === "clear_skies" && (
            <motion.div key="clear-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 3 }}>
              <GoldenDust />
            </motion.div>
          )}
          {weather === "autumn_drift" && (
            <motion.div key="autumn-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}>
              <FallingLeaves />
            </motion.div>
          )}
          {weather === "cold_snap" && (
            <motion.div key="snow-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 2 }}>
              <Snowflakes />
            </motion.div>
          )}
          {weather === "golden_hour" && (
            <motion.div key="golden-particles" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 2.5 }}>
              <Sparkles />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark forest silhouette — sits above gradient, below particles */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.72 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <defs>
              <linearGradient id="treeGradFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1a0c" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#050d06" stopOpacity="0.85"/>
              </linearGradient>
              <linearGradient id="treeGradMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#071209" stopOpacity="0.75"/>
                <stop offset="100%" stopColor="#030806" stopOpacity="0.95"/>
              </linearGradient>
              <linearGradient id="treeGradNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#020805" stopOpacity="0.92"/>
                <stop offset="100%" stopColor="#010403" stopOpacity="1"/>
              </linearGradient>
            </defs>

            {/* Ground */}
            <rect y="820" width="1440" height="80" fill="#010403"/>

            {/* Far layer — wispy, misty */}
            <g fill="url(#treeGradFar)">
              <polygon points="-20,820 30,620 80,820"/>
              <polygon points="60,820 120,580 180,820"/>
              <polygon points="150,820 210,600 270,820"/>
              <polygon points="240,820 305,560 370,820"/>
              <polygon points="340,820 405,590 470,820"/>
              <polygon points="440,820 510,545 580,820"/>
              <polygon points="550,820 620,570 690,820"/>
              <polygon points="660,820 735,540 810,820"/>
              <polygon points="770,820 845,560 920,820"/>
              <polygon points="880,820 960,545 1040,820"/>
              <polygon points="1000,820 1080,565 1160,820"/>
              <polygon points="1120,820 1200,580 1280,820"/>
              <polygon points="1250,820 1325,600 1400,820"/>
              <polygon points="1360,820 1420,615 1480,820"/>
            </g>

            {/* Mid layer — defined silhouettes */}
            <g fill="url(#treeGradMid)">
              <polygon points="-30,820 35,640 100,820"/>
              <polygon points="55,820 130,600 205,820"/>
              <polygon points="170,820 250,565 330,820"/>
              <polygon points="290,820 375,545 460,820"/>
              <polygon points="415,820 505,555 595,820"/>
              <polygon points="545,820 640,520 735,820"/>
              <polygon points="680,820 780,530 880,820"/>
              <polygon points="820,820 920,515 1020,820"/>
              <polygon points="960,820 1065,535 1170,820"/>
              <polygon points="1110,820 1215,545 1320,820"/>
              <polygon points="1260,820 1360,560 1460,820"/>
              <polygon points="1380,820 1460,590 1540,820"/>
            </g>

            {/* Near layer — darkest, thickest trunks */}
            <g fill="url(#treeGradNear)">
              <polygon points="-50,820 30,660 110,820"/>
              <polygon points="80,820 175,615 270,820"/>
              <polygon points="225,820 330,575 435,820"/>
              <polygon points="380,820 490,545 600,820"/>
              <polygon points="540,820 660,540 780,820"/>
              <polygon points="710,820 835,525 960,820"/>
              <polygon points="880,820 1010,530 1140,820"/>
              <polygon points="1060,820 1190,545 1320,820"/>
              <polygon points="1240,820 1365,560 1490,820"/>
              <polygon points="1380,820 1480,590 1580,820"/>
              {/* Extra thick nearer foreground elements */}
              <polygon points="-10,820 100,680 210,820"/>
              <polygon points="195,820 320,645 445,820"/>
              <polygon points="620,820 755,630 890,820"/>
              <polygon points="990,820 1120,640 1250,820"/>
              <polygon points="1300,820 1410,660 1520,820"/>
            </g>

            {/* Very near silhouettes — almost pure black, partial tree sides */}
            <g fill="#010302" opacity="0.97">
              <polygon points="-20,820 60,700 140,820"/>
              <polygon points="350,820 445,685 540,820"/>
              <polygon points="820,820 920,695 1020,820"/>
              <polygon points="1240,820 1340,700 1440,820"/>
            </g>
          </svg>
        </div>

        {/* Vignette — always present */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

      </div>
    </>
  );
}
