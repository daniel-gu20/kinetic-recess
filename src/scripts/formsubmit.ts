// Sends a notification + visitor auto-reply via FormSubmit, FROM THE BROWSER.
// Must run client-side: FormSubmit is behind Cloudflare and blocks server IPs.
const TEAM = "danielgu@wix.com";

export async function sendFormEmail(opts: {
  email: string; // visitor — receives the auto-reply confirmation
  subject: string; // team-notification subject
  autoresponse: string; // confirmation message to the visitor
  fields: Record<string, string>; // shown in the team notification
}): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TEAM)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...opts.fields,
        email: opts.email,
        _subject: opts.subject,
        _autoresponse: opts.autoresponse,
        _template: "table",
        _captcha: "false",
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[email] FormSubmit failed:", err);
    return false;
  }
}
