import { Hono } from "hono";
import { serve } from "@hono/node-server";

// Reminder Type
interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

// In-memory storage
const reminders: Reminder[] = [];

const app = new Hono();

// Create Reminder
app.post("/reminders", async (c) => {
  const body: Reminder = await c.req.json();
  if (!body.id || !body.title || !body.description || !body.dueDate || body.isCompleted === undefined) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  reminders.push(body);
  return c.json(body, 201);
});

// Get a Specific Reminder
app.get("/reminders/:id", (c) => {
  const reminder = reminders.find(r => r.id === c.req.param("id"));
  return reminder ? c.json(reminder) : c.json({ error: "Not Found" }, 404);
});

// Get All Reminders
app.get("/reminders", (c) => {
  return reminders.length > 0 ? c.json(reminders) : c.json({ error: "No reminders found" }, 404);
});

// Update a Reminder
app.patch("/reminders/:id", async (c) => {
  const updates = await c.req.json();
  const index = reminders.findIndex(r => r.id === c.req.param("id"));
  if (index === -1) return c.json({ error: "Not Found" }, 404);
  reminders[index] = { ...reminders[index], ...updates };
  return c.json(reminders[index]);
});

// Delete a Reminder
app.delete("/reminders/:id", (c) => {
  const index = reminders.findIndex(r => r.id === c.req.param("id"));
  if (index === -1) return c.json({ error: "Not Found" }, 404);
  return c.json(reminders.splice(index, 1)[0]);
});

// Mark Reminder as Completed
app.post("/reminders/:id/mark-completed", (c) => {
  const reminder = reminders.find(r => r.id === c.req.param("id"));
  if (!reminder) return c.json({ error: "Not Found" }, 404);
  reminder.isCompleted = true;
  return c.json(reminder);
});

// Unmark Reminder as Completed
app.post("/reminders/:id/unmark-completed", (c) => {
  const reminder = reminders.find(r => r.id === c.req.param("id"));
  if (!reminder) return c.json({ error: "Not Found" }, 404);
  reminder.isCompleted = false;
  return c.json(reminder);
});

// Get Completed Reminders
app.get("/reminders/completed", (c) => {
  const completed = reminders.filter(r => r.isCompleted);
  return completed.length > 0 ? c.json(completed) : c.json({ error: "No completed reminders" }, 404);
});

// Get Not Completed Reminders
app.get("/reminders/not-completed", (c) => {
  const notCompleted = reminders.filter(r => !r.isCompleted);
  return notCompleted.length > 0 ? c.json(notCompleted) : c.json({ error: "No uncompleted reminders" }, 404);
});

// Get Reminders Due Today
app.get("/reminders/due-today", (c) => {
  const today = new Date().toISOString().split("T")[0];
  const dueToday = reminders.filter(r => r.dueDate === today);
  return dueToday.length > 0 ? c.json(dueToday) : c.json({ error: "No reminders due today" }, 404);
});

// Start the Server
const port = 3000;
console.log(`🚀 Server running at http://localhost:${port}`);
serve({fetch: app.fetch, port});
