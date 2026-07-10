import { base44 } from "@/api/base44Client";

const NOTIFY_EMAIL = "rammarketinghead@gmail.com";

/**
 * Sends a notification email for form submissions.
 * Fire-and-forget — never blocks the form success flow.
 */
export async function sendFormNotificationEmail(subject, body) {
  try {
    await base44.integrations.Core.SendEmail({
      to: NOTIFY_EMAIL,
      subject,
      body,
    });
  } catch (e) {
    console.error("Notification email failed:", e);
  }
}