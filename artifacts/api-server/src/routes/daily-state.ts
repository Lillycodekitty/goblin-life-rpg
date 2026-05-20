import { Router } from "express";
import { db } from "@workspace/db";
import { dailyStatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SetDailyStateBody } from "@workspace/api-zod";

const router = Router();

router.get("/daily-state", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const [state] = await db
    .select()
    .from(dailyStatesTable)
    .where(eq(dailyStatesTable.date, today))
    .limit(1);

  if (!state) {
    return res.json({
      id: 0,
      date: today,
      emotionalWeather: null,
      goblinState: null,
      note: null,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({
    ...state,
    createdAt: state.createdAt.toISOString(),
  });
});

router.post("/daily-state", async (req, res) => {
  const parsed = SetDailyStateBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const today = new Date().toISOString().split("T")[0];
  const { emotionalWeather, goblinState, note } = parsed.data;

  const [existing] = await db
    .select()
    .from(dailyStatesTable)
    .where(eq(dailyStatesTable.date, today))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(dailyStatesTable)
      .set({ emotionalWeather, goblinState, note: note ?? null })
      .where(eq(dailyStatesTable.id, existing.id))
      .returning();
    return res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  }

  const [created] = await db
    .insert(dailyStatesTable)
    .values({ date: today, emotionalWeather, goblinState, note: note ?? null })
    .returning();

  return res.json({ ...created, createdAt: created.createdAt.toISOString() });
});

export default router;
