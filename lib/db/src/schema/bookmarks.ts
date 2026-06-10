import { pgTable, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { questionsTable } from "./questions";

export const bookmarksTable = pgTable("bookmarks", {
  userId: integer("user_id").notNull().references(() => usersTable.id),
  questionId: integer("question_id").notNull().references(() => questionsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] })]);

export type Bookmark = typeof bookmarksTable.$inferSelect;
