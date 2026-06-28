import type { APIRoute } from "astro";
import { items } from "@wix/data";
import { auth } from "@wix/essentials";
import { notifySubmission } from "../../lib/email";

export const prerender = false;

// Wix CMS collection that stores corporate booking inquiries.
// Create it in the dashboard (CMS → Collections) with these text fields:
//   contactName, companyName, email, teamSize, preferredDates, gamePreference, notes, status
const COLLECTION_ID = "CorporateInquiries";
const FIELDS = [
  "contactName",
  "companyName",
  "email",
  "teamSize",
  "preferredDates",
  "gamePreference",
  "notes",
] as const;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Whitelist + basic validation
  const item: Record<string, string> = { status: "New" };
  for (const f of FIELDS) item[f] = String(body[f] ?? "").slice(0, 2000);

  if (!item.contactName || !item.companyName || !item.email) {
    return json({ ok: false, error: "Missing required fields" }, 422);
  }

  try {
    // Elevate so anonymous site visitors can write to the collection.
    const insert = auth.elevate(items.insert);
    await insert(COLLECTION_ID, item);

    // Notify the team + auto-reply to the submitter. Awaited so the serverless
    // runtime doesn't terminate before the email request completes.
    await notifySubmission({
      visitorEmail: item.email,
      subject: `New corporate inquiry: ${item.companyName} (${item.teamSize || "?"})`,
      autoresponse:
        "Booked the request. We'll email you within a day with a park, a date, and a referee who " +
        "pretends to be impartial. Your night also funds a free community session, so, you know, hero stuff.\n\n" +
        "No deposit to inquire — we'll confirm the park permit and headcount before you owe a cent.\n\n— Kinetic Recess",
      fields: {
        Contact: item.contactName,
        Company: item.companyName,
        "Team size": item.teamSize || "—",
        "Preferred dates": item.preferredDates || "—",
        "Game preference": item.gamePreference || "—",
        Notes: item.notes || "—",
      },
    }).catch((e) => console.error("[corporate-inquiry] email failed:", e));

    return json({ ok: true }, 200);
  } catch (err) {
    // Surface the failure so it can be wired up, but don't leak internals.
    console.error("[corporate-inquiry] insert failed:", err);
    return json({ ok: false, error: "Could not save inquiry" }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
