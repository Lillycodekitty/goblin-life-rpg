import { Router } from "express";
import { db } from "@workspace/db";
import { journalEntriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateJournalEntryBody } from "@workspace/api-zod";

const router = Router();

router.get("/journal", async (req, res) => {
  const limit = parseInt((req.query.limit as string) ?? "20", 10);

  const entries = await db
    .select()
    .from(journalEntriesTable)
    .orderBy(desc(journalEntriesTable.createdAt))
    .limit(isNaN(limit) ? 20 : limit);

  return res.json(
    entries.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    }))
  );
});

router.post("/journal", async (req, res) => {
  const parsed = CreateJournalEntryBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const [entry] = await db
    .insert(journalEntriesTable)
    .values({
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
      emotionalWeather: parsed.data.emotionalWeather ?? null,
      goblinState: parsed.data.goblinState ?? null,
    })
    .returning();

  return res.status(201).json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.get("/journal/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [entry] = await db
    .select()
    .from(journalEntriesTable)
    .where(eq(journalEntriesTable.id, id))
    .limit(1);

  if (!entry) return res.status(404).json({ error: "Journal entry not found" });

  return res.json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/journal/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  await db.delete(journalEntriesTable).where(eq(journalEntriesTable.id, id));
  return res.status(204).send();
});

export default router;
