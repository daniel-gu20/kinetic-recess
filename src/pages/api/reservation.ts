import type { APIRoute } from "astro";
import { items } from "@wix/data";
import { auth } from "@wix/essentials";
import { notifySubmission } from "../../lib/email";

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

    // Notify the team + auto-reply to the visitor. Awaited so the serverless
    // runtime doesn't terminate before the email request completes.
    const free = item.type === "community";
    const when = [item.sessionDay, item.sessionTime, item.park].filter(Boolean).join(" · ");
    await notifySubmission({
      visitorEmail: item.email,
      subject: `New ${free ? "free " : ""}reservation: ${item.sessionName} — ${item.name}`,
      autoresponse:
        `${free ? "Spot saved." : "Spot held."} We'll see you at ${item.sessionName}${when ? ` — ${when}` : ""}.\n\n` +
        `Bring runners, water, and a willingness to lose gracefully.` +
        `${free ? " Free community night — no fee." : " $18 at the park; sessions cap at 24."}\n\n` +
        `There's a referee. It won't stop the argument. That's the point.\n\n— Kinetic Recess`,
      fields: {
        Name: item.name,
        Game: item.sessionName,
        When: when,
        "Party size": item.partySize || "1",
        Type: free ? "Community night (free)" : "Public drop-in",
      },
    }).catch((e) => console.error("[reservation] email failed:", e));

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
