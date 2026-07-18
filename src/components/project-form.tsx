"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type FieldErrors = Partial<
  Record<"name" | "email" | "company" | "brief", string[]>
>;

interface FormStatus {
  state: "idle" | "submitting" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  mailto?: string;
}

const CONTACT_EMAIL = "team@vastos.in";

// Used when the API is unreachable or errors out, so a visitor never loses what
// they typed. Opens their mail client with the brief already filled in.
function buildMailto(formData: FormData) {
  const value = (field: string) => String(formData.get(field) ?? "").trim();
  const company = value("company");

  const subject = `Project enquiry from ${value("name") || "the website"}`;
  const body = [
    `Name: ${value("name")}`,
    `Email: ${value("email")}`,
    `Company: ${company || "Not provided"}`,
    "",
    "Project:",
    value("brief"),
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef(0);
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  const [step, setStep] = useState<0 | 1>(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          brief: formData.get("brief"),
          website: formData.get("website"),
          startedAt: startedAtRef.current,
          submissionId: crypto.randomUUID(),
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setStep(result.fieldErrors?.brief ? 1 : 0);
        setStatus({
          state: "error",
          message: result.message || "Something went wrong. Please try again.",
          fieldErrors: result.fieldErrors,
          // Validation errors are the visitor's to fix, so only offer the email
          // fallback when the failure came from our side.
          mailto: result.fieldErrors ? undefined : buildMailto(formData),
        });
        return;
      }

      form.reset();
      startedAtRef.current = Date.now();
      setStep(0);
      setStatus({
        state: "success",
        message:
          "Thank you. Your project enquiry is with the VASTOS team.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "We could not send your enquiry from here.",
        mailto: buildMailto(formData),
      });
    }
  }

  const fieldError = (field: keyof FieldErrors) =>
    status.fieldErrors?.[field]?.[0];

  function continueToBrief() {
    const form = formRef.current;
    if (!form) return;

    const requiredFields = ["name", "email"]
      .map((name) => form.elements.namedItem(name))
      .filter((field): field is HTMLInputElement => field instanceof HTMLInputElement);

    const invalidField = requiredFields.find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return;
    }

    setStatus({ state: "idle" });
    setStep(1);
    window.requestAnimationFrame(() =>
      (form.elements.namedItem("brief") as HTMLTextAreaElement | null)?.focus(),
    );
  }

  return (
    <form ref={formRef} className="project-form onboarding-form" onSubmit={submitInquiry} noValidate>
      <div className="onboarding-head">
        <div>
          <span className="onboarding-kicker">Project signal</span>
          <span className="onboarding-count">0{step + 1} / 02</span>
        </div>
        <div className="onboarding-progress" data-step={step} aria-hidden="true">
          <span />
        </div>
      </div>

      <fieldset className="onboarding-scene" hidden={step !== 0}>
        <legend>First, introduce your side.</legend>
        <p className="onboarding-scene-copy">A few coordinates help us understand who we are building beside.</p>
        <div className="form-grid">
          <div className="field-group">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldError("name"))}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
          />
          {fieldError("name") && (
            <p className="field-error" id="name-error">
              {fieldError("name")}
            </p>
          )}
          </div>

          <div className="field-group">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
          />
          {fieldError("email") && (
            <p className="field-error" id="email-error">
              {fieldError("email")}
            </p>
          )}
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="company">
            Company <span>Optional</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            aria-invalid={Boolean(fieldError("company"))}
            aria-describedby={fieldError("company") ? "company-error" : undefined}
          />
          {fieldError("company") && (
            <p className="field-error" id="company-error">
              {fieldError("company")}
            </p>
          )}
        </div>

        <div className="onboarding-actions">
          <p>Next: define the opportunity</p>
          <button type="button" className="button button-primary onboarding-next" onClick={continueToBrief}>
            Continue
            <ArrowRight size={18} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </fieldset>

      <fieldset className="onboarding-scene" hidden={step !== 1}>
        <legend>Now, frame the opportunity.</legend>
        <p className="onboarding-scene-copy">No polished brief needed. Start with the friction, ambition, or outcome that matters.</p>
        <div className="field-group brief-field">
          <label htmlFor="brief">What are you building?</label>
          <textarea
            id="brief"
            name="brief"
            rows={5}
            required
            aria-invalid={Boolean(fieldError("brief"))}
            aria-describedby={fieldError("brief") ? "brief-error" : "brief-hint"}
          />
          <p className="field-hint" id="brief-hint">
            Share the challenge, context, and what a useful outcome looks like.
          </p>
          {fieldError("brief") && (
            <p className="field-error" id="brief-error">
              {fieldError("brief")}
            </p>
          )}
        </div>

        <div className="onboarding-actions onboarding-actions-final">
          <button type="button" className="onboarding-back" onClick={() => setStep(0)}>
            <ArrowLeft size={17} weight="regular" aria-hidden="true" />
            Back
          </button>
          <button
            type="submit"
            className="button button-primary form-submit"
            disabled={status.state === "submitting"}
          >
            <span>{status.state === "submitting" ? "Sending enquiry" : "Send project signal"}</span>
            <ArrowRight size={18} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </fieldset>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-footer onboarding-status">
        <p
          className={`form-status form-status-${status.state}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
          {status.mailto && (
            <>
              {" "}
              <a className="form-status-fallback" href={status.mailto}>
                Send it by email instead
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
