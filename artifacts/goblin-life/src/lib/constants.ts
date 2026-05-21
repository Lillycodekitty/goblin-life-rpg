import { EmotionalWeather, GoblinState, QuestCategory } from "@workspace/api-client-react";

/* ─────────────────────────────────────────────────────────────
   WEATHER
───────────────────────────────────────────────────────────── */
export const WEATHER_META: Record<EmotionalWeather, { icon: string; name: string; description: string; colors: string }> = {
  foggy_morning: {
    icon: "☁️",
    name: "Foggy Morning",
    description: "Brain fog. Low executive function. The system is buffering, not broken.",
    colors: "from-slate-900 via-slate-800 to-slate-900"
  },
  thunderstorm: {
    icon: "⛈️",
    name: "Thunderstorm",
    description: "Overstimulated. Your nervous system is yelling in all caps.",
    colors: "from-slate-950 via-indigo-950 to-slate-900"
  },
  persistent_drizzle: {
    icon: "🌧️",
    name: "Persistent Drizzle",
    description: "Emotionally soggy. Not broken. Just waterlogged.",
    colors: "from-cyan-950 via-slate-900 to-slate-950"
  },
  clear_skies: {
    icon: "☀️",
    name: "Clear Skies",
    description: "Higher capacity than usual. Use it wisely — don't give it all away.",
    colors: "from-emerald-950 via-teal-900 to-emerald-950"
  },
  autumn_drift: {
    icon: "🍂",
    name: "Autumn Drift",
    description: "Reflective. Nostalgic. The inner world wants the floor.",
    colors: "from-orange-950 via-amber-950 to-stone-950"
  },
  cold_snap: {
    icon: "❄️",
    name: "Cold Snap",
    description: "Shutdown mode. Existing is the whole quest today. That still counts.",
    colors: "from-slate-950 via-sky-950 to-slate-950"
  },
  golden_hour: {
    icon: "🌅",
    name: "Golden Hour",
    description: "Mischievous, playful, weird-good energy. Aim it at something small.",
    colors: "from-amber-900 via-orange-900 to-yellow-950"
  }
};

/* ─────────────────────────────────────────────────────────────
   GOBLIN STATES
───────────────────────────────────────────────────────────── */
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
    translation: "Your nervous system is staging a protest. That's not a character flaw — it's a weather report.",
    whatYouNeed: "Structure. Softness. One person who doesn't ask too much of you today.",
    successToday: "You didn't lose it at anyone who didn't deserve it. That's a genuine win.",
    approach: [
      "Eat something that isn't just coffee or spite",
      "Close the browser tabs you're not actually using",
      "Text the person who replies with no drama",
      "Put on the comfort show — you've earned the quiet",
    ],
    avoid: "Explaining yourself to anyone who isn't actually listening",
  },
  unstable_moist_goblin: {
    icon: "🍄",
    name: "Unstable Moist Goblin",
    tagline: "Damp feelings, mossy thoughts, unwell vibes.",
    translation: "You're emotionally soggy. That's a real condition. Rest is the treatment, not a reward you have to earn.",
    whatYouNeed: "Actual warmth. Water. One low-key person. Nothing heavy.",
    successToday: "You stayed soft when it would've been easier not to. That counts.",
    approach: [
      "Drink water before making any decisions — any",
      "Text someone with nothing at stake — 'hey' is enough",
      "Move to a different room and change the air",
      "Make something warm and hold it for a second",
    ],
    avoid: "Forcing conversations that require full emotional capacity you don't currently have",
  },
  roadkill_crunch: {
    icon: "🪦",
    name: "Roadkill Crunch",
    tagline: "Spiritually flattened. Physically present, barely.",
    translation: "Burnout isn't laziness. It's the bill arriving for everything you've been pushing through.",
    whatYouNeed: "Permission to cancel things. Food. Lying flat. Zero expectation.",
    successToday: "You exist. That is the whole quest. Full marks, no asterisk.",
    approach: [
      "Eat something — literally anything qualifies",
      "Cancel what can be cancelled without guilt as the entry fee",
      "Lie flat for 20 minutes with zero agenda",
      "No major decisions until you've slept — none",
    ],
    avoid: "Anyone who needs you to perform being okay right now",
  },
  vaguely_employed: {
    icon: "📜",
    name: "Vaguely Employed",
    tagline: "Doing a job. No one's sure which one, including you.",
    translation: "Brain fog is not laziness. The system is buffering. That's different.",
    whatYouNeed: "Tiny momentum. One thing that has a clear finish line. A small win you can actually claim.",
    successToday: "One thing dispatched. One thing is enough — don't let anyone tell you otherwise.",
    approach: [
      "10-minute timer on one task — stop when it rings, no exceptions",
      "Send the email that's been living in your drafts",
      "Open the document. Just open it. You don't have to do anything yet.",
      "Move one item off the doom pile — physical or digital, both count",
    ],
    avoid: "Context switching — pick one lane and stay in it until the timer is done",
  },
  suspiciously_functional: {
    icon: "🕯️",
    name: "Suspiciously Functional",
    tagline: "Eerily put-together. Something is definitely afoot.",
    translation: "This is a rare window. Do not hand it to other people's urgency.",
    whatYouNeed: "The thing you've been putting off. Snacks. A clear direction.",
    successToday: "You used the window well. Future-you is genuinely grateful.",
    approach: [
      "Do the hard thing while the energy is actually here",
      "Draft the email you've been composing in your head for two weeks",
      "Batch the annoying small tasks before this window closes",
      "Do something specific for Tuesday-you — they will remember",
    ],
    avoid: "Spending it all on other people, or saying yes to things just because you feel capable today",
  },
  haunted_but_hydrated: {
    icon: "👻",
    name: "Haunted But Hydrated",
    tagline: "Possessed, but the water bottle is full.",
    translation: "Anxiety is loud. Your body is actually fine. That gap between those two facts is real and deeply annoying.",
    whatYouNeed: "Regulation. Breathing space. One task with a clear finish line.",
    successToday: "You didn't let the anxiety make the decisions. That's solid.",
    approach: [
      "Drink the water — it's full, it's right there",
      "Close the phone for 15 minutes, not as punishment, just as maintenance",
      "Breathe before you respond to the thing that annoyed you",
      "One task, one finish line, then actual rest with no guilt attached",
    ],
    avoid: "Doom-scrolling, over-explaining yourself, and saying yes to things because anxiety made you feel guilty about saying no",
  },
  tiny_forest_menace: {
    icon: "🌿",
    name: "Tiny Forest Menace",
    tagline: "Small. Feral. Up to crimes of joy.",
    translation: "You need a direction, not a leash. Point the chaos somewhere and let it run.",
    whatYouNeed: "Space to be productively chaotic. A walk. Something tactile.",
    successToday: "You moved the energy instead of sitting inside it.",
    approach: [
      "Doodle, rearrange, or write something badly on purpose",
      "Walk around the block while the brain finishes loading",
      "Send the nice weird text you've been drafting in your head",
      "Reorganize one small thing — one drawer, one playlist, one shelf",
    ],
    avoid: "Sitting still while overthinking — that's not where this energy lives",
  },
};

/* ─────────────────────────────────────────────────────────────
   CREATURE SYSTEM
───────────────────────────────────────────────────────────── */
export type CreatureId = "storm" | "mist" | "vapor";

export interface Creature {
  id: CreatureId;
  icon: string;
  name: string;
  species: string;
  meaning: string;
  description: string;
  coretruth: string;
  needs: string[];
  careIcons: string[];
}

export const CREATURES: Record<CreatureId, Creature> = {
  storm: {
    id: "storm",
    icon: "🐶",
    name: "Storm",
    species: "Scruffy pitbull of anxiety",
    meaning: "Anxiety. Hypervigilance. The scared kind of alert.",
    description: "Scared. Protective. Deeply loyal to keeping you safe, even when there's nothing to fight.",
    coretruth: "I'm trying to keep us safe.",
    needs: ["patience", "food", "gentleness", "reassurance"],
    careIcons: ["☕", "🌬️", "🤍"],
  },
  mist: {
    id: "mist",
    icon: "🐆",
    name: "Mist",
    species: "Black panther of panic",
    meaning: "Panic. Overwhelm. System shutdown.",
    description: "Watchful. Wounded. Quiet. Not dangerous — just needs distance and low stimulation.",
    coretruth: "Low and slow is the only speed right now.",
    needs: ["quiet", "low stimulation", "rest", "no pressure"],
    careIcons: ["🌑", "🫧", "🕯️"],
  },
  vapor: {
    id: "vapor",
    icon: "🐺",
    name: "Vapor",
    species: "Massive black winter wolf of longing",
    meaning: "Longing. Connection ache. Yearning — not sadness, not weakness.",
    description: "Quiet. Watchful. Persistent. Doesn't growl. Just paces, nudges, and waits.",
    coretruth: "Longing is not weakness. Something just feels far away.",
    needs: ["connection", "comfort media", "being witnessed", "reaching out — even small"],
    careIcons: ["🤝", "📖", "💌"],
  },
};

export const CREATURE_LIST = Object.values(CREATURES);

type ComboKey = "none" | "storm" | "mist" | "vapor" | "mist+storm" | "storm+vapor" | "mist+vapor" | "mist+storm+vapor";

export interface CreatureReading {
  heading: string;
  reading: string;
  tinyThing: string;
}

const CREATURE_READINGS: Record<ComboKey, CreatureReading> = {
  none: {
    heading: "Clear woods today.",
    reading: "No creatures reported. Either it's genuinely calm, or they're napping. Either way — run with it.",
    tinyThing: "No extra care protocol needed. Just be a regular goblin today.",
  },
  storm: {
    heading: "Storm is here.",
    reading: "Anxiety has taken point today. Your nervous system is on high alert and doing its best to protect you, even if there's nothing specific to protect you from. That's exhausting and it's not your fault.",
    tinyThing: "Food first, decisions second. Eat something before you respond to anything.",
  },
  mist: {
    heading: "Mist is moving through.",
    reading: "Panic or overwhelm has arrived. The system is shutting down non-essential operations. This is not a failure — it's a fuse box doing exactly what fuse boxes do.",
    tinyThing: "Low stimulation protocol: dim the lights, close the phone, find the quietest room you have access to.",
  },
  vapor: {
    heading: "Vapor is pacing the edge of the woods.",
    reading: "You're not sad. You're longing. Something feels far away — connection, understanding, being witnessed, or just someone who gets it. That ache is real and it isn't weakness.",
    tinyThing: "Reach out in the smallest way that feels possible — even just 'thinking of you' to one person.",
  },
  "mist+storm": {
    heading: "Storm and Mist, both at the table.",
    reading: "Full system alert. Anxiety AND overwhelm are present simultaneously, which means the nervous system is completely overloaded. This is survival mode — not performance mode, not productivity mode. Just survival.",
    tinyThing: "Cancel one thing. Just one. Pick the easiest thing to cancel and cancel it right now.",
  },
  "storm+vapor": {
    heading: "Storm and Vapor, circling each other.",
    reading: "You want closeness, but anxiety is making vulnerability feel unsafe. That tension is real: the part of you that wants connection is in direct conflict with the part that's scared of it. Both are trying to help.",
    tinyThing: "Low-stakes connection only — a meme, a 'thinking of you', a voice note. Nothing that requires emotional exposure.",
  },
  "mist+vapor": {
    heading: "Mist and Vapor, both quiet.",
    reading: "You want to be witnessed, but overwhelm is pulling you inward at the same time. That's a specific kind of lonely — wanting closeness but having nothing left to offer it. Rest first. Reach out when there's a little more in the tank.",
    tinyThing: "Comfort media, no guilt. Put on the thing that feels like a hug and let it run.",
  },
  "mist+storm+vapor": {
    heading: "Full woods today.",
    reading: "Anxiety, overwhelm, and longing are all present. That's a lot. This isn't a day to perform anything for anyone. You need softness, low stakes, and zero demands — from yourself most of all.",
    tinyThing: "One glass of water, one comfortable surface, one thing you actually want to watch or read. That's the whole plan.",
  },
};

export function getCreatureReading(selectedIds: string[]): CreatureReading {
  if (!selectedIds.length) return CREATURE_READINGS.none;
  const key = (selectedIds.slice().sort().join("+")) as ComboKey;
  return CREATURE_READINGS[key] ?? CREATURE_READINGS.none;
}

/* ─────────────────────────────────────────────────────────────
   MODIFIERS
───────────────────────────────────────────────────────────── */
export interface Modifier {
  id: string;
  icon: string;
  label: string;
}

export const MODIFIERS: Modifier[] = [
  { id: "bad_sleep",        icon: "🌙", label: "Bad sleep" },
  { id: "anxiety",          icon: "✏️", label: "Anxiety yelling in cursive" },
  { id: "fresh_lashes",     icon: "👁️", label: "Fresh lashes" },
  { id: "haunted_playlist", icon: "🎸", label: "Haunted playlist" },
  { id: "tooth_demon",      icon: "🦷", label: "Tooth demon" },
  { id: "caffeine_feral",   icon: "☕", label: "Caffeine level: feral" },
  { id: "weather_mood",     icon: "⛈️", label: "Weather mood" },
  { id: "book_hangover",    icon: "📚", label: "Book hangover" },
  { id: "forgot_to_human",  icon: "🌀", label: "Forgot to human" },
  { id: "need_snack",       icon: "🔮", label: "Need snack or prophecy" },
];

/* ─────────────────────────────────────────────────────────────
   QUEST CATEGORIES + SUGGESTED QUESTS
───────────────────────────────────────────────────────────── */
export const QUEST_CATEGORY_META: Record<QuestCategory, { icon: string; name: string }> = {
  daily_rituals: { icon: "🕯️", name: "Daily Rituals" },
  self_care:     { icon: "🌿", name: "Self Care" },
  goblin_survival: { icon: "🍄", name: "Goblin Survival" },
  work:          { icon: "📜", name: "Work" },
  creative:      { icon: "✨", name: "Creative" },
  cave_restoration: { icon: "🏠", name: "Cave Restoration" },
  bookish:       { icon: "📚", name: "Bookish" }
};

export interface SuggestedQuest {
  title: string;
  category: QuestCategory;
  xpReward: number;
}

export const SUGGESTED_QUESTS: Record<GoblinState, SuggestedQuest[]> = {
  emotionally_crunchy: [
    { title: "Eat something that isn't just coffee", category: "goblin_survival", xpReward: 15 },
    { title: "Close the tabs you're not actually using", category: "self_care", xpReward: 10 },
    { title: "Text the low-drama person", category: "self_care", xpReward: 15 },
    { title: "One small thing, no self-judgment attached", category: "daily_rituals", xpReward: 20 },
    { title: "15 minutes of the comfort show", category: "self_care", xpReward: 10 },
  ],
  unstable_moist_goblin: [
    { title: "Drink a full glass of water before anything else", category: "goblin_survival", xpReward: 5 },
    { title: "Move to a different room", category: "self_care", xpReward: 10 },
    { title: "Make something warm and hold it", category: "goblin_survival", xpReward: 10 },
    { title: "Read 10 pages of anything cozy", category: "bookish", xpReward: 15 },
    { title: "Text someone with nothing at stake", category: "self_care", xpReward: 10 },
  ],
  roadkill_crunch: [
    { title: "Exist. That's the whole quest.", category: "goblin_survival", xpReward: 5 },
    { title: "Eat something — anything qualifies", category: "goblin_survival", xpReward: 10 },
    { title: "Cancel what can be cancelled", category: "self_care", xpReward: 15 },
    { title: "Lie flat, zero agenda, 20 minutes", category: "self_care", xpReward: 5 },
    { title: "Take the medication (if applicable)", category: "daily_rituals", xpReward: 10 },
  ],
  vaguely_employed: [
    { title: "10-minute timer on one task — stop when it rings", category: "work", xpReward: 15 },
    { title: "Send the email that's been living in drafts", category: "work", xpReward: 25 },
    { title: "Move one thing off the doom pile", category: "work", xpReward: 20 },
    { title: "Open the document. That's the whole task.", category: "work", xpReward: 10 },
    { title: "Write one sentence toward the thing", category: "creative", xpReward: 10 },
  ],
  suspiciously_functional: [
    { title: "Deep work for one (1) tiny hour", category: "work", xpReward: 40 },
    { title: "Draft the email you've been composing in your head", category: "work", xpReward: 30 },
    { title: "Slay one item from the doom pile", category: "work", xpReward: 25 },
    { title: "Do something specific for Tuesday-you", category: "cave_restoration", xpReward: 20 },
    { title: "Batch the small annoying tasks", category: "work", xpReward: 20 },
  ],
  haunted_but_hydrated: [
    { title: "Drink the water (it's literally full)", category: "goblin_survival", xpReward: 5 },
    { title: "Close the phone for 15 minutes, no punishment vibe", category: "self_care", xpReward: 10 },
    { title: "Breathe before responding to the thing", category: "daily_rituals", xpReward: 10 },
    { title: "One task, one finish line, then rest", category: "self_care", xpReward: 15 },
    { title: "Walk around the block once", category: "self_care", xpReward: 20 },
  ],
  tiny_forest_menace: [
    { title: "Doodle or write something badly on purpose", category: "creative", xpReward: 15 },
    { title: "Walk around the block while the brain loads", category: "self_care", xpReward: 15 },
    { title: "Send the nice weird text", category: "daily_rituals", xpReward: 15 },
    { title: "Reorganize one small thing — one drawer, one playlist", category: "cave_restoration", xpReward: 20 },
    { title: "Make a mess, then clean up exactly half of it", category: "creative", xpReward: 20 },
  ],
};

/* ─────────────────────────────────────────────────────────────
   LEVEL TITLES
───────────────────────────────────────────────────────────── */
export function getLevelTitle(level: number): string {
  if (level <= 1)  return "Freshly Spawned Goblin";
  if (level <= 2)  return "Baby Cryptid";
  if (level <= 4)  return "Moss-Crowned Menace";
  if (level <= 6)  return "Blanket Warlord";
  if (level <= 8)  return "Doom Pile Slayer";
  if (level <= 10) return "Villain Cave Architect";
  if (level <= 14) return "Certified Forest Cryptid";
  if (level <= 19) return "Emotionally Competent Nightmare";
  return "Legendary Cozy Chaos Witch";
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "No streak yet. Today counts though.";
  if (streak === 1) return "Day 1. The goblin stirs.";
  if (streak <= 3)  return "On a streak. Chaos-consistent.";
  if (streak <= 6)  return "Consistent energy. Respect.";
  if (streak <= 13) return "Full feral routine. The goblin is thriving.";
  return "Legendary streak. You are not a normal creature.";
}

/* ─────────────────────────────────────────────────────────────
   AUTO-JOURNAL GENERATOR
───────────────────────────────────────────────────────────── */
export function generateJournalEntry(
  goblinState: GoblinState,
  weather: EmotionalWeather,
  activeModifierIds: string[],
  selectedCreatureIds: string[] = []
): string {
  const s = GOBLIN_STATE_META[goblinState];
  const w = WEATHER_META[weather];
  const activeLabels = MODIFIERS
    .filter(m => activeModifierIds.includes(m.id))
    .map(m => `${m.icon} ${m.label}`);
  const creatureLabels = selectedCreatureIds
    .map(id => CREATURES[id as CreatureId])
    .filter(Boolean)
    .map(c => `${c.icon} ${c.name} (${c.species})`);

  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const curseBlock = activeLabels.length > 0
    ? `Active curses: ${activeLabels.join(", ")}.`
    : "No active curses logged. Noted with mild suspicion.";

  const creatureBlock = creatureLabels.length > 0
    ? `Creatures present: ${creatureLabels.join(", ")}.`
    : "";

  const creatureReading = selectedCreatureIds.length > 0
    ? getCreatureReading(selectedCreatureIds)
    : null;

  return [
    `${date}. Today's card: ${s.name}.`,
    ``,
    `${w.icon} Weather: ${w.name}. ${w.description}`,
    ``,
    creatureBlock,
    creatureReading ? `Reading: ${creatureReading.reading}` : "",
    ``,
    `${curseBlock}`,
    ``,
    `Translation: "${s.translation}"`,
    ``,
    `What's needed: ${s.whatYouNeed}`,
    ``,
    `Success today: ${s.successToday}`,
    ``,
    `Approach: ${s.approach.join(". ")}.`,
    `Avoid: ${s.avoid}.`,
    ``,
    `~ may your moss be soft ~`,
  ].filter(line => line !== undefined).join("\n");
}
