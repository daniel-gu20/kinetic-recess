// Email via FormSubmit (https://formsubmit.co) — no account, key, or DNS needed.
// One POST sends a notification to the team inbox AND an auto-reply confirmation
// to the person who submitted (via _autoresponse). No-ops if TEAM_EMAIL is unset.

const env = (k: string): string | undefined =>
  (import.meta as any).env?.[k] ?? (globalThis as any).process?.env?.[k];

export const TEAM_EMAIL = () => env("TEAM_EMAIL") || "danielgu@wix.com";

type SubmissionArgs = {
  visitorEmail: string;        // who filled the form — gets the auto-reply confirmation
  subject: string;             // subject of the team-notification email
  autoresponse: string;        // confirmation message sent to the visitor
  fields: Record<string, string>; // shown in the team notification (formatted as a table)
};

export async function notifySubmission({ visitorEmail, subject, autoresponse, fields }: SubmissionArgs): Promise<boolean> {
  const team = TEAM_EMAIL();
  if (!team) return false;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(team)}`, {
      method: "POST",
      // Origin/Referer required — FormSubmit rejects requests without them.
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://kineticrecess.com",
        Referer: "https://kineticrecess.com/",
      },
      body: JSON.stringify({
        ...fields,
        email: visitorEmail,        // FormSubmit uses this as reply-to + _autoresponse target
        _subject: subject,
        _autoresponse: autoresponse,
        _template: "table",
        _captcha: "false",
      }),
    });
    if (!res.ok) {
      console.error("[email] FormSubmit error", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}
