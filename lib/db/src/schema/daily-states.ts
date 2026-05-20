import { pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dailyStatesTable = pgTable("daily_states", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  emotionalWeather: text("emotional_weather").notNull(),
  goblinState: text("goblin_state").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyStateSchema = createInsertSchema(dailyStatesTable).omit({ id: true, createdAt: true });
export type InsertDailyState = z.infer<typeof insertDailyStateSchema>;
export type DailyState = typeof dailyStatesTable.$inferSelect;
