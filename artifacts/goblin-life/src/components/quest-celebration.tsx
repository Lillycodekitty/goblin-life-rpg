import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface CelebrationConfig {
  xp: number;
  weather: string;
}

/* Weather-appropriate particles for each state */
const WEATHER_PARTICLES: Record<string, string[]> = {
  golden_hour:       ["✦", "✧", "⋆", "˚", "·"],
  thunderstorm:      ["⚡", "✦", "·", "⋆"],
  cold_snap:         ["❄", "✦", "·", "❅"],
  autumn_drift:      ["🍂", "🍁", "🍃", "·"],
  foggy_morning:     ["·", "○", "◦", "⋆"],
  clear_skies:       ["✨", "✦", "·", "⋆", "˚"],
  persistent_drizzle:["💧", "·", "◦", "○"],
};

const WEATHER_COLORS: Record<string, string[]> = {
  golden_hour:        ["#FFD060", "#FFAA20", "#FFC840", "#FFE080"],
  thunderstorm:       ["#B0B0FF", "#8080FF", "#D0D0FF", "#6060CC"],
  cold_snap:          ["#C0E8FF", "#80C8FF", "#E0F4FF", "#A0D8FF"],
  autumn_drift:       ["#E06020", "#C04010", "#F08040", "#A83010"],
  foggy_morning:      ["#90A898", "#708878", "#B0C8B8", "#607868"],
  clear_skies:        ["#80FF90", "#60E070", "#A0FFA8", "#40C050"],
  persistent_drizzle: ["#70A8C8", "#5090B0", "#90C0D8", "#608898"],
};

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

interface ParticleDef {
  id: number;
  char: string;
  color: string;
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
}

function makeParticles(weather: string, count: number): ParticleDef[] {
  const r = seededRand(Date.now() & 0xfff);
  const chars  = WEATHER_PARTICLES[weather] ?? WEATHER_PARTICLES.golden_hour;
  const colors = WEATHER_COLORS[weather]   ?? WEATHER_COLORS.golden_hour;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + r() * 0.8;
    const dist  = 80 + r() * 160;
    return {
      id:     i,
      char:   chars[Math.floor(r() * chars.length)],
      color:  colors[Math.floor(r() * colors.length)],
      x:      Math.cos(angle) * dist,
      y:      Math.sin(angle) * dist,
      rotate: r() * 720 - 360,
      size:   14 + r() * 18,
      delay:  r() * 0.12,
    };
  });
}

interface CelebrationOverlayProps {
  config: CelebrationConfig;
  onDone: () => void;
}

function CelebrationOverlay({ config, onDone }: CelebrationOverlayProps) {
  const particles = useRef(makeParticles(config.weather, 28)).current;

  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center">
      {/* Screen-edge glow flash */}
      <motion.div
        className="absolute inset-0 rounded-none pointer-events-none"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          boxShadow: `inset 0 0 120px 20px ${WEATHER_COLORS[config.weather]?.[0] ?? "#FFD060"}55`,
        }}
      />

      {/* XP popup */}
      <motion.div
        className="absolute font-serif font-bold select-none pointer-events-none"
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], y: -140, scale: [0.5, 1.4, 1.2, 0.9] }}
        transition={{ duration: 1.8, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
        style={{
          color: WEATHER_COLORS[config.weather]?.[0] ?? "#FFD060",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          textShadow: `0 0 30px ${WEATHER_COLORS[config.weather]?.[0] ?? "#FFD060"}`,
          filter: "drop-shadow(0 0 12px currentColor)",
        }}
      >
        +{config.xp} XP
      </motion.div>

      {/* "Tiny win." label */}
      <motion.div
        className="absolute font-sans text-sm tracking-widest uppercase select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, -60, -80, -120] }}
        transition={{ duration: 2.0, times: [0, 0.15, 0.7, 1] }}
        style={{ color: WEATHER_COLORS[config.weather]?.[2] ?? "#FFE080" }}
      >
        tiny win.
      </motion.div>

      {/* Burst particles */}
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity:  [0, 1, 0.9, 0],
            x:        p.x,
            y:        p.y,
            scale:    [0, 1.2, 0.8, 0],
            rotate:   p.rotate,
          }}
          transition={{
            duration: 1.5 + p.delay * 3,
            delay:    p.delay,
            ease:     "easeOut",
          }}
          style={{
            fontSize: p.size,
            color:    p.color,
            filter:   `drop-shadow(0 0 6px ${p.color})`,
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

interface QuestCelebrationProps {
  config: CelebrationConfig | null;
  onDone: () => void;
}

export function QuestCelebration({ config, onDone }: QuestCelebrationProps) {
  return createPortal(
    <AnimatePresence>
      {config && <CelebrationOverlay key={config.xp + config.weather} config={config} onDone={onDone} />}
    </AnimatePresence>,
    document.body
  );
}
