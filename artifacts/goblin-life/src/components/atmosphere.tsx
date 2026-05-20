import { useGetDailyState } from "@workspace/api-client-react";
import { WEATHER_META } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function Atmosphere() {
  const { data: dailyState } = useGetDailyState();
  const weather = dailyState?.emotionalWeather || "foggy_morning";
  const meta = WEATHER_META[weather];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={weather}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className={`absolute inset-0 bg-gradient-to-br ${meta.colors} opacity-80`}
        />
      </AnimatePresence>
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Weather specific particles / overlays */}
      <AnimatePresence mode="wait">
        {weather === "foggy_morning" && (
          <motion.div 
            key="fog"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-200/10 blur-3xl"
          />
        )}
        {weather === "thunderstorm" && (
          <motion.div 
            key="storm"
            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute inset-0 bg-indigo-900/20 mix-blend-color-burn"
          />
        )}
        {weather === "golden_hour" && (
          <motion.div 
            key="golden"
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
            className="absolute inset-0 bg-amber-500/20 mix-blend-screen"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
