import { Router } from "express";
import { db } from "@workspace/db";
import { questsTable, journalEntriesTable, charactersTable, dailyStatesTable } from "@workspace/db";
import { eq, desc, isNotNull, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/activity", async (_req, res) => {
  const completedQuests = await db
    .select()
    .from(questsTable)
    .where(eq(questsTable.completed, true))
    .orderBy(desc(questsTable.completedAt))
    .limit(10);

  const journalEntries = await db
    .select()
    .from(journalEntriesTable)
    .orderBy(desc(journalEntriesTable.createdAt))
    .limit(10);

  const items = [
    ...completedQuests.map((q) => ({
      id: `quest-${q.id}`,
      type: "quest_completed" as const,
      description: `Completed: ${q.title}`,
      xpAwarded: q.xpReward,
      timestamp: (q.completedAt ?? q.createdAt).toISOString(),
    })),
    ...journalEntries.map((e) => ({
      id: `journal-${e.id}`,
      type: "journal_entry" as const,
      description: e.content.slice(0, 80) + (e.content.length > 80 ? "..." : ""),
      xpAwarded: null,
      timestamp: e.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

  return res.json({ items });
});

router.get("/stats", async (_req, res) => {
  let [character] = await db.select().from(charactersTable).limit(1);
  if (!character) {
    [character] = await db.insert(charactersTable).values({}).returning();
  }

  const today = new Date().toISOString().split("T")[0];
  const todayStart = new Date(today + "T00:00:00.000Z");

  const completedTodayRows = await db
    .select()
    .from(questsTable)
    .where(
      sql`${questsTable.completed} = true AND ${questsTable.completedAt} >= ${todayStart}`
    );

  const questsCompletedToday = completedTodayRows.length;

  const journalRows = await db.select().from(journalEntriesTable);
  const journalEntriesTotal = journalRows.length;

  const allCompletedRows = await db
    .select()
    .from(questsTable)
    .where(eq(questsTable.completed, true))
    .orderBy(desc(questsTable.completedAt));

  const questsCompletedTotal = allCompletedRows.length;

  return res.json({
    totalXp: character.xp,
    level: character.level,
    questsCompletedToday,
    questsCompletedTotal,
    journalEntriesTotal,
    currentStreak: questsCompletedToday > 0 ? 1 : 0,
    longestStreak: Math.max(1, Math.floor(questsCompletedTotal / 3)),
  });
});

export default router;
