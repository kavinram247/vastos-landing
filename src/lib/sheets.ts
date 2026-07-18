import "server-only";
import type { ProjectInquiry } from "@/lib/project-inquiry";

const TIMEOUT_MS = 10_000;

interface WebhookResponse {
  ok?: boolean;
  error?: string;
  duplicate?: boolean;
}

/**
 * Appends an enquiry to the Google Sheet via its bound Apps Script web app.
 *
 * Callers run this from `after()`, so a failure here is logged and never
 * surfaces to the visitor. The email remains the delivery guarantee; the sheet
 * is a searchable record of it.
 */
export async function appendInquiry(inquiry: ProjectInquiry) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;

  if (!url || !secret) {
    console.warn(
      "SHEETS_WEBHOOK_URL or SHEETS_WEBHOOK_SECRET is not set; skipping sheet append.",
    );
    return;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Apps Script answers /exec with a 302 to googleusercontent, so redirects
    // have to be followed for the response body to arrive.
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      secret,
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company,
      brief: inquiry.brief,
      submissionId: inquiry.submissionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sheet webhook returned HTTP ${response.status}`);
  }

  // Apps Script replies 200 even when it rejects the request, so the outcome
  // has to be read out of the payload.
  const result = (await response.json()) as WebhookResponse;

  if (!result.ok) {
    throw new Error(`Sheet webhook rejected the enquiry: ${result.error}`);
  }
}
