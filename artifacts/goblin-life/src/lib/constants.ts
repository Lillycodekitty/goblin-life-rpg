import { EmotionalWeather, GoblinState, QuestCategory } from "@workspace/api-client-react";

export const WEATHER_META: Record<EmotionalWeather, { icon: string; name: string; description: string; colors: string }> = {
  foggy_morning: {
    icon: "☁️",
    name: "Foggy Morning",
    description: "Brain fog. Low executive function. The system is buffering.",
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
    description: "Emotionally soggy. You're not lazy. You're waterlogged.",
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
    description: "Reflective. Nostalgic. The inner world wants the mic.",
    colors: "from-orange-950 via-amber-950 to-stone-950"
  },
  cold_snap: {
    icon: "❄️",
    name: "Cold Snap",
    description: "Shutdown. Burnout. Existing is the quest today.",
    colors: "from-slate-950 via-sky-950 to-slate-950"
  },
  golden_hour: {
    icon: "🌅",
    name: "Golden Hour",
    description: "Mischievous, playful, weird-good energy.",
    colors: "from-amber-900 via-orange-900 to-yellow-950"
  }
};

export interface GoblinStateContent {
  icon: string;
  name: string;
  tagline: string;
  translation: string;
  whatYouNeed: string;
  successToday: string;
  approach: string[];
  avoid: string;
}

export const GOBLIN_STATE_META: Record<GoblinState, GoblinStateContent> = {
  emotionally_crunchy: {
    icon: "🌹",
    name: "Emotionally Crunchy",
    tagline: "Brittle around the edges, soft in the middle.",
    translation: "You're not difficult. Your nervous system is just very loud right now.",
    whatYouNeed: "Structure. Softness. Someone to not ask too much of you.",
    successToday: "One thing without self-judgment. That's the whole win.",
    approach: [
      "Don't make big decisions in this state",
      "Eat something that isn't just coffee",
      "Text the one person who gets it",
      "Let yourself be bad at one thing today",
    ],
    avoid: "Overstimulating yourself further or explaining your feelings to someone who won't understand",
  },
  unstable_moist_goblin: {
    icon: "🍄",
    name: "Unstable Moist Goblin",
    tagline: "Damp feelings, mossy thoughts, unwell vibes.",
    translation: "You are emotionally soggy and that is a medically valid condition.",
    whatYouNeed: "Warmth. Hydration. One safe person. No heavy lifting.",
    successToday: "Tiny momentum. Literally just existing counts.",
    approach: [
      "Drink water before making any decisions",
      "Text someone low-stakes",
      "Move to a different room — change the air",
      "Make soup if soup is available",
    ],
    avoid: "Forcing productivity or big emotional conversations",
  },
  roadkill_crunch: {
    icon: "🪦",
    name: "Roadkill Crunch",
    tagline: "Spiritually flattened. Physically present, barely.",
    translation: "Burnout is real and you have it. This is not a character flaw.",
    whatYouNeed: "Permission to cancel everything. Food. Horizontal time. Zero guilt.",
    successToday: "You existed. That is the entire quest. Full stop.",
    approach: [
      "Cancel what can be cancelled",
      "Eat something, anything",
      "Do not attempt productivity today",
      "Lie flat and let the ceiling heal you",
    ],
    avoid: "Making major decisions, saying yes to anything, or explaining your burnout to anyone who won't get it",
  },
  vaguely_employed: {
    icon: "📜",
    name: "Vaguely Employed",
    tagline: "Doing a job. No one's sure which one, including you.",
    translation: "Brain fog is not laziness. It's your system buffering. Let it buffer.",
    whatYouNeed: "Micro momentum. Tiny timers. Easy wins.",
    successToday: "One annoying task, dispatched. That is a full win.",
    approach: [
      "Set a 10-minute timer for one thing",
      "Move one item from the doom pile",
      "Send the email you've been avoiding",
      "Open the thing — just open it, don't do it yet",
    ],
    avoid: "Stacking tasks, context switching, or shame-spiraling about what's still undone",
  },
  suspiciously_functional: {
    icon: "🕯️",
    name: "Suspiciously Functional",
    tagline: "Eerily put-together. Something is afoot.",
    translation: "This is a rare gift. Do not investigate too closely.",
    whatYouNeed: "Gentle momentum. Protect this energy at all costs.",
    successToday: "Use the energy on future-you. Bank something good.",
    approach: [
      "Do the hard thing while you can",
      "Send the cursed email",
      "Slay one item from the doom pile",
      "Do something kind for future-you",
    ],
    avoid: "Spending all this energy on other people or overcommitting just because you can",
  },
  haunted_but_hydrated: {
    icon: "👻",
    name: "Haunted But Hydrated",
    tagline: "Possessed, but the water bottle is full.",
    translation: "Anxiety is loud. Your body is actually okay. One thing at a time.",
    whatYouNeed: "Regulation. Breathing room. One thing, then a break.",
    successToday: "One thing, kindly. With breathing between.",
    approach: [
      "Breathe before responding to anything",
      "Close at least 10 browser tabs",
      "Drink the water — it's full, use it",
      "Pick one thing and only that thing",
    ],
    avoid: "Overstimulating environments, doom-scrolling, and explaining yourself to people who aren't listening",
  },
  tiny_forest_menace: {
    icon: "🌿",
    name: "Tiny Forest Menace",
    tagline: "Small. Feral. Up to crimes of joy.",
    translation: "Channel the feral into something small and creative.",
    whatYouNeed: "An outlet. A canvas. A weird walk.",
    successToday: "Make a mess, then a thing. Move the body.",
    approach: [
      "Make a mess, then a thing",
      "Move the body, weirdly",
      "Send the lovingly chaotic text",
      "Reorganize something for no reason",
    ],
    avoid: "Sitting still and overthinking it",
  },
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

export interface Modifier {
  id: string;
  icon: string;
  label: string;
}

export const MODIFIERS: Modifier[] = [
  { id: "bad_sleep",       icon: "🌙", label: "Bad sleep" },
  { id: "anxiety",         icon: "✏️", label: "Anxiety yelling in cursive" },
  { id: "fresh_lashes",    icon: "👁️", label: "Fresh lashes" },
  { id: "haunted_playlist",icon: "🎸", label: "Haunted playlist" },
  { id: "tooth_demon",     icon: "🦷", label: "Tooth demon" },
  { id: "caffeine_feral",  icon: "☕", label: "Caffeine level: feral" },
  { id: "weather_mood",    icon: "⛈️", label: "Weather mood" },
  { id: "book_hangover",   icon: "📚", label: "Book hangover" },
  { id: "forgot_to_human", icon: "🌀", label: "Forgot to human" },
  { id: "need_snack",      icon: "🔮", label: "Need snack or prophecy" },
];

export interface SuggestedQuest {
  title: string;
  category: QuestCategory;
  xpReward: number;
}

export const SUGGESTED_QUESTS: Record<GoblinState, SuggestedQuest[]> = {
  emotionally_crunchy: [
    { title: "Eat something soft and warm", category: "goblin_survival", xpReward: 10 },
    { title: "Close the extra tabs", category: "self_care", xpReward: 10 },
    { title: "Text the one safe person", category: "self_care", xpReward: 15 },
    { title: "Do one small thing without judging it", category: "daily_rituals", xpReward: 20 },
    { title: "Take a dramatic walk around the block", category: "self_care", xpReward: 15 },
  ],
  unstable_moist_goblin: [
    { title: "Drink a full glass of water", category: "goblin_survival", xpReward: 5 },
    { title: "Move to a different room", category: "self_care", xpReward: 10 },
    { title: "Make something warm to drink", category: "goblin_survival", xpReward: 10 },
    { title: "Read 10 pages of something cozy", category: "bookish", xpReward: 15 },
    { title: "Text someone low-stakes", category: "self_care", xpReward: 10 },
  ],
  roadkill_crunch: [
    { title: "Exist today. That's enough.", category: "goblin_survival", xpReward: 5 },
    { title: "Eat something, anything", category: "goblin_survival", xpReward: 10 },
    { title: "Cancel what can be cancelled", category: "self_care", xpReward: 15 },
    { title: "Horizontal time, no guilt", category: "self_care", xpReward: 5 },
    { title: "Let the ceiling heal you for 20 min", category: "daily_rituals", xpReward: 10 },
  ],
  vaguely_employed: [
    { title: "Set a 10-minute timer for one thing", category: "work", xpReward: 15 },
    { title: "Send the one email", category: "work", xpReward: 25 },
    { title: "Move one item from the doom pile", category: "work", xpReward: 20 },
    { title: "Write one sentence toward the thing", category: "creative", xpReward: 10 },
    { title: "Open the document. Don't do anything yet.", category: "work", xpReward: 10 },
  ],
  suspiciously_functional: [
    { title: "Deep work for one (1) tiny hour", category: "work", xpReward: 40 },
    { title: "Send the cursed email", category: "work", xpReward: 30 },
    { title: "Slay one item from the doom pile", category: "work", xpReward: 25 },
    { title: "Make the nest (aka the bed)", category: "cave_restoration", xpReward: 20 },
    { title: "Scribble a thing, no judgment", category: "creative", xpReward: 20 },
  ],
  haunted_but_hydrated: [
    { title: "Drink the water (it's full)", category: "goblin_survival", xpReward: 5 },
    { title: "Close 10 browser tabs", category: "self_care", xpReward: 10 },
    { title: "Breathe for 2 minutes before responding", category: "daily_rituals", xpReward: 10 },
    { title: "One thing, then actual rest", category: "self_care", xpReward: 15 },
    { title: "Take the dramatic walk", category: "self_care", xpReward: 20 },
  ],
  tiny_forest_menace: [
    { title: "Make a mess, then a thing", category: "creative", xpReward: 20 },
    { title: "Move the body, weirdly", category: "self_care", xpReward: 15 },
    { title: "Send the lovingly chaotic text", category: "daily_rituals", xpReward: 15 },
    { title: "Reorganize something for no reason", category: "cave_restoration", xpReward: 20 },
    { title: "Doodle badly for exactly 5 minutes", category: "creative", xpReward: 15 },
  ],
};
