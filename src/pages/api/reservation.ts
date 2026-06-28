import type { APIRoute } from "astro";
import { items } from "@wix/data";
import { auth } from "@wix/essentials";

export const prerender = false;

// Wix CMS collection that stores session reservations ("Grab a spot").
// Create it in the dashboard (CMS → Collections) with these fields:
//   name, email, sessionName, sessionDay, sessionTime, park, partySize, type, status
const COLLECTION_ID = "Reservations";
const FIELDS = [
  "name",
  "email",
  "sessionName",
  "sessionDay",
  "sessionTime",
  "park",
  "partySize",
  "type", // "public" | "community"
] as const;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const item: Record<string, string> = { status: "New" };
  for (const f of FIELDS) item[f] = String(body[f] ?? "").slice(0, 500);

  if (!item.name || !item.email || !item.sessionName) {
    return json({ ok: false, error: "Missing required fields" }, 422);
  }
  // Light email sanity check
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(item.email)) {
    return json({ ok: false, error: "Enter a valid email" }, 422);
  }

  try {
    const insert = auth.elevate(items.insert);
    await insert(COLLECTION_ID, item);
    return json({ ok: true }, 200);
  } catch (err) {
    console.error("[reservation] insert failed:", err);
    return json({ ok: false, error: "Could not save reservation" }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
