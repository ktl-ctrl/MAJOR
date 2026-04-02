import { api } from "../services/api";
let currentUserId = null;
let deviceId = null;
let buffer = [];
let flushing = false;

function genId() {
  return "dev-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function init(userId) {
  currentUserId = userId || null;
  if (!deviceId) deviceId = genId();
}

export function setUser(userId) {
  currentUserId = userId || null;
}

export function track(type, payload) {
  if (!currentUserId) return;
  buffer.push({
    userId: currentUserId,
    deviceId,
    type,
    ts: new Date().toISOString(),
    payload: payload || {},
  });
  if (buffer.length >= 10) {
    flush();
  }
}

export async function flush() {
  if (flushing || buffer.length === 0) return;
  flushing = true;
  const events = buffer.slice();
  buffer = [];
  try {
    await api.ingest(events);
  } catch {
    buffer = events.concat(buffer);
  } finally {
    flushing = false;
  }
}
