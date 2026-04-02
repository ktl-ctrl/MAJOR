import { Router } from "express";
import ActivityEvent from "../models/ActivityEvent.js";

const router = Router();

router.post("/ingest", async (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [];
    if (!events.length) return res.status(400).json({ error: "No events" });
    if (!ActivityEvent.db || ActivityEvent.db.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const docs = events.map(e => ({
      userId: String(e.userId || ""),
      deviceId: String(e.deviceId || ""),
      type: String(e.type || ""),
      ts: e.ts ? new Date(e.ts) : new Date(),
      payload: e.payload || {},
    }));
    await ActivityEvent.insertMany(docs, { ordered: false });
    res.json({ ingested: docs.length });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
