const BASE_URL = "http://localhost:4000";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  login: (email, password) => post("/auth/login", { email, password }),
  register: (email, password) => post("/auth/register", { email, password }),
  ingest: (events) => post("/activity/ingest", events),

  getTasks: async () => { },
  createTask: async (task) => { },
  updateTask: async (id, data) => { },
  deleteTask: async (id) => { },

  getSessions: async () => { },
  createSession: async (session) => { },

  getUser: async () => { },
  updateUser: async (data) => { },
};
