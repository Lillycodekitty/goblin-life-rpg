import { Router } from "express";
import { db } from "@workspace/db";
import { questsTable, charactersTable, dailyStatesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateQuestBody, UpdateQuestBody } from "@workspace/api-zod";

const router = Router();

const WEATHER_QUEST_MAP: Record<string, string[]> = {
  foggy_morning: ["daily_rituals", "self_care", "goblin_survival"],
  thunderstorm: ["self_care", "daily_rituals", "goblin_survival"],
  persistent_drizzle: ["self_care", "daily_rituals", "bookish"],
  clear_skies: ["work", "creative", "cave_restoration"],
  autumn_drift: ["bookish", "creative", "daily_rituals"],
  cold_snap: ["goblin_survival", "self_care"],
  golden_hour: ["creative", "cave_restoration", "work"],
};

const WEATHER_GUIDANCE: Record<string, {
  description: string;
  translation: string;
  whatYouNeed: string;
  tinyThing: string;
  successToday: string;
  avoid: string;
}> = {
  foggy_morning: {
    description: "Brain fog. Low executive function. Mentally slow.",
    translation: "You are not lazy. The system is buffering.",
    whatYouNeed: "Tiny tasks only. Gentle momentum. Low-pressure quests. Comfort rituals.",
    tinyThing: "Pick ONE tiny thing: make unnecessarily fancy coffee, fold one clothing pile, read 10 pages, do a 5-minute stretch",
    successToday: "You got through it. That is the whole win.",
    avoid: "Overwhelming task lists, big work tasks, back-to-back meetings",
  },
  thunderstorm: {
    description: "Overstimulated. Anxious. Emotionally loud.",
    translation: "Your brain is yelling in cursive.",
    whatYouNeed: "Nervous system regulation first. Only ONE important task. Hydration. Softness. Reduce overwhelm.",
    tinyThing: "Pick ONE tiny thing: drink a full glass of water, step outside for 2 minutes, put on a comfort show, close 10 browser tabs",
    successToday: "One thing kindly. That is enough.",
    avoid: "Stacking too many tasks, saying yes to new things, checking all your notifications at once",
  },
  persistent_drizzle: {
    description: "Emotionally soggy. Low-grade sadness.",
    translation: "You're not lazy. You're emotionally waterlogged.",
    whatYouNeed: "Warmth over pressure. Gentle movement. Soft humans. Soft tasks.",
    tinyThing: "Pick ONE tiny thing: text one person something nice, make soup or tea, read 10 pages, go on a dramatic slow walk",
    successToday: "You showed up. Even soggy.",
    avoid: "Forcing productivity, big social obligations, heavy admin tasks",
  },
  clear_skies: {
    description: "Higher capacity day. Momentum exists.",
    translation: "Energy exists. Use wisely.",
    whatYouNeed: "Harder tasks are okay. Creative work. Admin. Momentum.",
    tinyThing: "Pick ONE tiny thing: tackle that annoying email, reorganize one tiny corner, make progress on that project you've been avoiding",
    successToday: "You used the energy well. Future-you thanks you.",
    avoid: "Turning into productivity capitalism. Overcommitting. Spending it all on other people.",
  },
  autumn_drift: {
    description: "Reflective. Nostalgic. Emotionally soft.",
    translation: "The inner world wants the mic.",
    whatYouNeed: "Journaling. Reading. Cozy rituals. Creativity.",
    tinyThing: "Pick ONE tiny thing: write 3 sentences in your journal, doodle badly for 5 minutes, reread something you love, make unnecessarily fancy coffee",
    successToday: "You listened to yourself. That counts for a lot.",
    avoid: "Heavy logistics, admin, anything requiring cheerful small talk",
  },
  cold_snap: {
    description: "Shutdown. Burnout. Low battery.",
    translation: "Existing is the quest today.",
    whatYouNeed: "Rest. Food. Horizontal time. Zero guilt.",
    tinyThing: "Pick ONE tiny thing: eat something, drink water, lie down somewhere comfortable, put on something comforting",
    successToday: "You existed. Full stop. That is the quest.",
    avoid: "Expecting miracles, guilt-tripping yourself, making big decisions",
  },
  golden_hour: {
    description: "Playful. Creative. Mischievous energy.",
    translation: "Your brain has sparkle today.",
    whatYouNeed: "Move this energy through your body. Create something chaotic. Make a mess.",
    tinyThing: "Pick ONE tiny thing: send the weird text, reorganize something with no reason, doodle badly for 5 minutes, make a chaotic playlist",
    successToday: "You made something or moved something. Goblin approved.",
    avoid: "Overthinking, sitting still, letting the sparkle go unused",
  },
};

router.get("/quests", async (req, res) => {
  const { category, completed } = req.query;

  let query = db.select().from(questsTable).$dynamic();

  const conditions = [];
  if (category && typeof category === "string") {
    conditions.push(eq(questsTable.category, category));
  }
  if (completed !== undefined) {
    conditions.push(eq(questsTable.completed, completed === "true"));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const quests = await query.orderBy(desc(questsTable.createdAt));

  return res.json(
    quests.map((q) => ({
      ...q,
      createdAt: q.createdAt.toISOString(),
      completedAt: q.completedAt ? q.completedAt.toISOString() : null,
    }))
  );
});

router.post("/quests", async (req, res) => {
  const parsed = CreateQuestBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [quest] = await db
    .insert(questsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      xpReward: parsed.data.xpReward ?? 10,
    })
    .returning();

  return res.status(201).json({
    ...quest,
    createdAt: quest.createdAt.toISOString(),
    completedAt: null,
  });
});

router.get("/quests/recommended", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const [state] = await db
    .select()
    .from(dailyStatesTable)
    .where(eq(dailyStatesTable.date, today))
    .limit(1);

  const weather = state?.emotionalWeather ?? "foggy_morning";
  const goblinState = state?.goblinState ?? "vaguely_employed";

  const recommendedCategories = WEATHER_QUEST_MAP[weather] ?? ["self_care", "goblin_survival"];
  const guidance = WEATHER_GUIDANCE[weather] ?? WEATHER_GUIDANCE.foggy_morning;

  const quests = await db
    .select()
    .from(questsTable)
    .where(eq(questsTable.completed, false))
    .orderBy(desc(questsTable.createdAt))
    .limit(20);

  const recommended = quests
    .filter((q) => recommendedCategories.includes(q.category))
    .slice(0, 6);

  return res.json({
    emotionalWeather: weather,
    goblinState,
    guidance: {
      description: guidance.description,
      translation: guidance.translation,
      whatYouNeed: guidance.whatYouNeed,
      tinyThing: guidance.tinyThing,
      successToday: guidance.successToday,
      recommendedCategories,
      avoid: guidance.avoid,
    },
    tinyThing: guidance.tinyThing,
    successDefinition: guidance.successToday,
    recommendedCategories,
    quests: recommended.map((q) => ({
      ...q,
      createdAt: q.createdAt.toISOString(),
      completedAt: q.completedAt ? q.completedAt.toISOString() : null,
    })),
  });
});

router.patch("/quests/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = UpdateQuestBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.completed !== undefined) {
    updateData.completed = parsed.data.completed;
    if (parsed.data.completed) {
      updateData.completedAt = new Date();
    }
  }

  const [quest] = await db
    .update(questsTable)
    .set(updateData)
    .where(eq(questsTable.id, id))
    .returning();

  if (!quest) return res.status(404).json({ error: "Quest not found" });

  return res.json({
    ...quest,
    createdAt: quest.createdAt.toISOString(),
    completedAt: quest.completedAt ? quest.completedAt.toISOString() : null,
  });
});

router.delete("/quests/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  await db.delete(questsTable).where(eq(questsTable.id, id));
  return res.status(204).send();
});

router.post("/quests/:id/complete", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [quest] = await db
    .select()
    .from(questsTable)
    .where(eq(questsTable.id, id))
    .limit(1);

  if (!quest) return res.status(404).json({ error: "Quest not found" });

  const [updatedQuest] = await db
    .update(questsTable)
    .set({ completed: true, completedAt: new Date() })
    .where(eq(questsTable.id, id))
    .returning();

  let [character] = await db.select().from(charactersTable).limit(1);
  if (!character) {
    [character] = await db.insert(charactersTable).values({}).returning();
  }

  const newXp = character.xp + updatedQuest.xpReward;
  const newQuestsCompleted = character.questsCompleted + 1;
  const newLevel = Math.floor(newXp / 100) + 1;
  const xpToNextLevel = newLevel * 100 - newXp;

  const [updatedCharacter] = await db
    .update(charactersTable)
    .set({ xp: newXp, questsCompleted: newQuestsCompleted, level: newLevel })
    .where(eq(charactersTable.id, character.id))
    .returning();

  return res.json({
    quest: {
      ...updatedQuest,
      createdAt: updatedQuest.createdAt.toISOString(),
      completedAt: updatedQuest.completedAt ? updatedQuest.completedAt.toISOString() : null,
    },
    xpAwarded: updatedQuest.xpReward,
    character: {
      ...updatedCharacter,
      xpToNextLevel,
      createdAt: updatedCharacter.createdAt.toISOString(),
    },
  });
});

export default router;
