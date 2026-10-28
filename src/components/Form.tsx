"use client";
import { useState } from "react";
import { site } from "@/lib/site";

type Field = { name: string; label: string; type?: "text" | "email" | "tel" | "textarea" | "select"; required?: boolean; options?: string[]; placeholder?: string; defaultValue?: string };

export function Form({ fields, subject, submitLabel }: { fields: Field[]; subject: string; submitLabel: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("_subject", subject);
    if (!site.formEndpoint) {
      // No endpoint configured yet: hand off to the visitor's mail client.
      const body = Array.from(data.entries()).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("sent");
      return;
    }
    setState("sending");
    try {
      const r = await fetch(site.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      setState(r.ok ? "sent" : "error");
      if (r.ok) form.reset();
    } catch { setState("error"); }
  }

  if (state === "sent") {
    return (
      <div className="rounded-sm border border-palm/40 bg-palm/5 p-6">
        <p className="display text-2xl">Received.</p>
        <p className="mt-2 text-ink/80">We read everything ourselves and will reply within a few days. If it is urgent, call {site.phone}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
      {fields.map((f) => (
        <label key={f.name} className="grid gap-1.5 text-sm">
          <span>{f.label}{f.required && <span aria-hidden="true"> *</span>}</span>
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} rows={5} className="field" placeholder={f.placeholder} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} className="field" defaultValue={f.defaultValue ?? ""}>
              <option value="" disabled>Choose one</option>
              {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} className="field" placeholder={f.placeholder} defaultValue={f.defaultValue} />
          )}
        </label>
      ))}
      <div className="flex items-center gap-4">
        <button type="submit" className="btn btn-solid" disabled={state === "sending"}>{state === "sending" ? "Sending…" : submitLabel}</button>
        {state === "error" && <span className="text-sm text-red-800">That did not send. Email us directly at {site.email}.</span>}
      </div>
    </form>
  );
}
