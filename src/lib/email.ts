// Transactional email via Resend (https://resend.com).
// No-ops safely if RESEND_API_KEY is unset, so forms keep working without it.

const env = (k: string): string | undefined =>
  (import.meta as any).env?.[k] ?? (globalThis as any).process?.env?.[k];

const API_KEY = () => env("RESEND_API_KEY");
// Sending address. Until your domain is verified in Resend, use onboarding@resend.dev.
const FROM = () => env("RESEND_FROM") || "Kinetic Recess <onboarding@resend.dev>";
export const TEAM_EMAIL = () => env("TEAM_EMAIL");

type SendArgs = { to: string; subject: string; html: string; replyTo?: string };

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  const key = API_KEY();
  if (!key || !to) return false; // email disabled / no recipient — skip quietly
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM(), to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

// Small shared wrapper so both emails look on-brand.
export function shell(body: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1c1c13">
    <div style="background:#11192e;padding:20px 24px">
      <span style="font-family:'Arial Black',sans-serif;color:#ffe74c;font-size:22px;letter-spacing:.5px;text-transform:uppercase">Kinetic Recess</span>
    </div>
    <div style="padding:24px;background:#fdf9ea;line-height:1.5">${body}</div>
    <div style="padding:16px 24px;background:#000;color:#9a9a9a;font-size:12px">
      Real playground games in permitted Toronto parks, after hours. · @kineticrecess
    </div>
  </div>`;
}
