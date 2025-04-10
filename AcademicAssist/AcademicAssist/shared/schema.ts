import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Question and answer schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer"),
  error: text("error"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  question: true,
  userId: true,
});

export const updateQuestionSchema = createInsertSchema(questions).pick({
  answer: true,
  error: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// For frontend usage without user authentication
export const sessionQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.string()
});

export type SessionQuestion = z.infer<typeof sessionQuestionSchema>;
