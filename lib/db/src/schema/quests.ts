import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questsTable = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  xpReward: integer("xp_reward").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestSchema = createInsertSchema(questsTable).omit({ id: true, createdAt: true, completed: true, completedAt: true });
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof questsTable.$inferSelect;
