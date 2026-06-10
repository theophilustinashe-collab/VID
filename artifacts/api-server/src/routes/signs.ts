import { Router } from "express";
import { db, roadSignsTable } from "@workspace/db";
import { eq, ilike, and, SQL } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { category, search } = req.query as Record<string, string>;
    const conditions: SQL[] = [];
    if (category) conditions.push(ilike(roadSignsTable.category, category));
    if (search) conditions.push(ilike(roadSignsTable.name, `%${search}%`));

    const signs = conditions.length > 0
      ? await db.select().from(roadSignsTable).where(and(...conditions))
      : await db.select().from(roadSignsTable);

    res.json(signs.map(s => ({
      ...s,
      createdAt: undefined,
    })));
  } catch (err) {
    logger.error({ err }, "List signs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, category, meaning, imageUrl, usage } = req.body;
    if (!name || !category || !meaning || !imageUrl) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const [sign] = await db.insert(roadSignsTable).values({ name, category, meaning, imageUrl, usage }).returning();
    res.status(201).json({ ...sign, createdAt: undefined });
  } catch (err) {
    logger.error({ err }, "Create sign error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [sign] = await db.select().from(roadSignsTable).where(eq(roadSignsTable.id, id)).limit(1);
    if (!sign) {
      res.status(404).json({ error: "Sign not found" });
      return;
    }
    res.json({ ...sign, createdAt: undefined });
  } catch (err) {
    logger.error({ err }, "Get sign error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
