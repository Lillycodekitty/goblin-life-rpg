import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const charactersTable = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Little Goblin"),
  title: text("title").notNull().default("Apprentice of Surviving"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  questsCompleted: integer("quests_completed").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCharacterSchema = createInsertSchema(charactersTable).omit({ id: true, createdAt: true });
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof charactersTable.$inferSelect;
