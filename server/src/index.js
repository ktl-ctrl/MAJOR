import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import activityRouter from "./routes/activity.js";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  const state = mongoose.connection?.readyState ?? 0;
  res.json({ ok: true, mongoConfigured: !!(MONGODB_URI || process.env.MONGO_HOST), mongoState: state });
});

app.use((req, _res, next) => {
  req.config = { jwtSecret: JWT_SECRET };
  next();
});

app.use("/auth", authRouter);
app.use("/activity", activityRouter);

async function start() {
  try {
    let uri = MONGODB_URI;
    if (!uri) {
      const host = process.env.MONGO_HOST;
      const user = process.env.MONGO_USER;
      const pass = process.env.MONGO_PASS;
      const db = process.env.MONGO_DB || "dayrift";
      if (host && user && pass) {
        const encPass = encodeURIComponent(pass);
        const opts = process.env.MONGO_OPTIONS || "retryWrites=true&w=majority&appName=Cluster0";
        uri = `mongodb+srv://${user}:${encPass}@${host}/${db}?${opts}`;
        console.log("Constructed MongoDB URI from components");
      }
    }
    if (uri) {
      try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
      } catch (connErr) {
        console.error("MongoDB connection error:", connErr.message);
        console.warn("Falling back to in-memory MongoDB");
        const mem = await MongoMemoryServer.create();
        const memUri = mem.getUri();
        await mongoose.connect(memUri);
        console.log("In-memory MongoDB connected");
      }
    } else {
      console.warn("MONGODB_URI not set. Starting in-memory MongoDB");
      const mem = await MongoMemoryServer.create();
      const memUri = mem.getUri();
      await mongoose.connect(memUri);
      console.log("In-memory MongoDB connected");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
  app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
}

start();
