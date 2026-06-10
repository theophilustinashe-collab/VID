import { Router } from "express";
import { db, usersTable, questionsTable, testSessionsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [[{ totalUsers }], [{ totalQuestions }], [{ totalTests }]] = await Promise.all([
      db.select({ totalUsers: count() }).from(usersTable),
      db.select({ totalQuestions: count() }).from(questionsTable),
      db.select({ totalTests: count() }).from(testSessionsTable).where(eq(testSessionsTable.status, "completed")),
    ]);

    const passedCount = await db.select({ n: count() }).from(testSessionsTable)
      .where(eq(testSessionsTable.passed, true));
    const passRate = totalTests > 0 ? (passedCount[0].n / totalTests) * 100 : 0;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [{ activeToday }] = await db.select({ activeToday: count() }).from(usersTable)
      .where(sql`${usersTable.lastActiveAt} > ${oneDayAgo}`);

    res.json({
      totalUsers,
      totalQuestions,
      totalTests,
      passRate: Math.round(passRate * 10) / 10,
      activeToday,
    });
  } catch (err) {
    logger.error({ err }, "Get admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { limit = "50", offset = "0" } = req.query as Record<string, string>;
    const users = await db.select().from(usersTable)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json(users.map(u => {
      const { passwordHash: _ph, ...safe } = u;
      return {
        ...safe,
        createdAt: safe.createdAt?.toISOString() ?? new Date().toISOString(),
      };
    }));
  } catch (err) {
    logger.error({ err }, "List users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    if (!["learner", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    const [updated] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { passwordHash: _ph, ...safe } = updated;
    res.json({
      ...safe,
      createdAt: safe.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Update user role error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
