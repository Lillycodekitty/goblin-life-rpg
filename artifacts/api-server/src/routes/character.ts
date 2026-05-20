import { Router } from "express";
import { db } from "@workspace/db";
import { charactersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateCharacterBody } from "@workspace/api-zod";

const router = Router();

async function getOrCreateCharacter() {
  let [character] = await db.select().from(charactersTable).limit(1);
  if (!character) {
    [character] = await db.insert(charactersTable).values({}).returning();
  }
  return character;
}

router.get("/character", async (_req, res) => {
  const character = await getOrCreateCharacter();
  const xpToNextLevel = character.level * 100 - character.xp;
  return res.json({
    ...character,
    xpToNextLevel: Math.max(0, xpToNextLevel),
    createdAt: character.createdAt.toISOString(),
  });
});

router.patch("/character", async (req, res) => {
  const parsed = UpdateCharacterBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const character = await getOrCreateCharacter();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;

  const [updated] = await db
    .update(charactersTable)
    .set(updateData)
    .where(eq(charactersTable.id, character.id))
    .returning();

  const xpToNextLevel = updated.level * 100 - updated.xp;
  return res.json({
    ...updated,
    xpToNextLevel: Math.max(0, xpToNextLevel),
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
