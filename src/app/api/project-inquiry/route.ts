import { NextResponse } from "next/server";
import { ProjectInquiryEmail } from "@/emails/project-inquiry-email";
import { projectInquirySchema } from "@/lib/project-inquiry";
import { getResend } from "@/lib/resend";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function clientAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(address: string) {
  const now = Date.now();

  if (rateLimitStore.size > 500) {
    for (const [key, value] of rateLimitStore) {
      if (value.resetAt <= now) rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(address);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(address, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(address, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The enquiry could not be read." },
      { status: 400 },
    );
  }

  const result = projectInquirySchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const inquiry = result.data;

  if (inquiry.website) {
    return NextResponse.json({ ok: true });
  }

  if (Date.now() - inquiry.startedAt < 800) {
    return NextResponse.json(
      { ok: false, message: "Please wait a moment and try again." },
      { status: 400 },
    );
  }

  if (isRateLimited(clientAddress(request))) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many enquiries were submitted. Please try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const resend = getResend();
    const safeName = inquiry.name.replace(/[\r\n]+/g, " ");
    const safeCompany = inquiry.company.replace(/[\r\n]+/g, " ");
    const companySuffix = safeCompany ? ` at ${safeCompany}` : "";
    const { error } = await resend.emails.send({
      from: "VASTOS Website <website@vastos.in>",
      to: ["team@vastos.in"],
      replyTo: inquiry.email,
      subject: `New project enquiry from ${safeName}${companySuffix}`,
      react: ProjectInquiryEmail(inquiry),
      text: [
        "New project enquiry",
        "",
        `Name: ${inquiry.name}`,
        `Work email: ${inquiry.email}`,
        `Company: ${inquiry.company || "Not provided"}`,
        "",
        "Project brief:",
        inquiry.brief,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend project enquiry error", error);
      return NextResponse.json(
        {
          ok: false,
          message:
            "We could not send your enquiry right now. Please email team@vastos.in.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project enquiry delivery error", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not send your enquiry right now. Please email team@vastos.in.",
      },
      { status: 500 },
    );
  }
}
