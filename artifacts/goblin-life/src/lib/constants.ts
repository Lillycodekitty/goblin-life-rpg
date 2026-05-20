import { EmotionalWeather, GoblinState, QuestCategory } from "@workspace/api-client-react";

export const WEATHER_META: Record<EmotionalWeather, { icon: string; name: string; description: string; colors: string }> = {
  foggy_morning: {
    icon: "☁️",
    name: "Foggy Morning",
    description: "Brain fog. Low executive function. You are not lazy. The system is buffering.",
    colors: "from-slate-900 via-slate-800 to-slate-900"
  },
  thunderstorm: {
    icon: "⛈️",
    name: "Thunderstorm",
    description: "Overstimulated. Your brain is yelling in cursive.",
    colors: "from-slate-950 via-indigo-950 to-slate-900"
  },
  persistent_drizzle: {
    icon: "🌧️",
    name: "Persistent Drizzle",
    description: "Emotionally soggy. You're not lazy. You're emotionally waterlogged.",
    colors: "from-cyan-950 via-slate-900 to-slate-950"
  },
  clear_skies: {
    icon: "☀️",
    name: "Clear Skies",
    description: "Higher capacity day. Energy exists. Use wisely.",
    colors: "from-emerald-950 via-teal-900 to-emerald-950"
  },
  autumn_drift: {
    icon: "🍂",
    name: "Autumn Drift",
    description: "Reflective. The inner world wants the mic.",
    colors: "from-orange-950 via-amber-950 to-stone-950"
  },
  cold_snap: {
    icon: "❄️",
    name: "Cold Snap",
    description: "Shutdown. Existing is the quest today.",
    colors: "from-slate-950 via-sky-950 to-slate-950"
  },
  golden_hour: {
    icon: "🌅",
    name: "Golden Hour",
    description: "Playful. Your brain has sparkle today.",
    colors: "from-amber-900 via-orange-900 to-yellow-950"
  }
};

export const GOBLIN_STATE_META: Record<GoblinState, { icon: string; name: string }> = {
  emotionally_crunchy: { icon: "🌹", name: "Emotionally Crunchy" },
  unstable_moist_goblin: { icon: "🍄", name: "Unstable Moist Goblin" },
  roadkill_crunch: { icon: "🪦", name: "Roadkill Crunch" },
  vaguely_employed: { icon: "📜", name: "Vaguely Employed" },
  suspiciously_functional: { icon: "🕯️", name: "Suspiciously Functional" },
  haunted_but_hydrated: { icon: "👻", name: "Haunted but Hydrated" },
  tiny_forest_menace: { icon: "🌿", name: "Tiny Forest Menace" }
};

export const QUEST_CATEGORY_META: Record<QuestCategory, { icon: string; name: string }> = {
  daily_rituals: { icon: "🕯️", name: "Daily Rituals" },
  self_care: { icon: "🌿", name: "Self Care" },
  goblin_survival: { icon: "🍄", name: "Goblin Survival" },
  work: { icon: "📜", name: "Work" },
  creative: { icon: "✨", name: "Creative" },
  cave_restoration: { icon: "🏠", name: "Cave Restoration" },
  bookish: { icon: "📚", name: "Bookish" }
};
