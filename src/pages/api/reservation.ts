import type { APIRoute } from "astro";
import { items } from "@wix/data";
import { auth } from "@wix/essentials";
import { sendEmail, shell, TEAM_EMAIL } from "../../lib/email";

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

    // Fire-and-forget emails (no-op if RESEND_API_KEY is unset).
    const free = item.type === "community";
    const when = [item.sessionDay, item.sessionTime, item.park].filter(Boolean).join(" · ");
    sendEmail({
      to: item.email,
      subject: free ? "Your free spot is saved 🟡" : "You're in — spot held 🟡",
      html: shell(
        `<h2 style="margin:0 0 8px;text-transform:uppercase">${free ? "Spot saved." : "Spot held."}</h2>
         <p>We'll see you at <strong>${item.sessionName}</strong>${when ? ` — ${when}` : ""}.</p>
         <p>Bring runners, water, and a willingness to lose gracefully.${free ? " Free community night — no fee." : " $18 at the park; sessions cap at 24."}</p>
         <p>There's a referee. It won't stop the argument. That's the point.</p>`
      ),
    });
    const team = TEAM_EMAIL();
    if (team) sendEmail({
      to: team,
      replyTo: item.email,
      subject: `New ${free ? "free " : ""}reservation: ${item.sessionName} — ${item.name}`,
      html: shell(`<p><strong>${item.name}</strong> (${item.email}) · party of ${item.partySize || "?"}</p>
        <p>${item.sessionName}${when ? ` — ${when}` : ""}</p>`),
    });

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
