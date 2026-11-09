"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export function ContactForm({ topic }: { topic: string }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setState("busy");
    const { error } = await supabase.from("contact_messages").insert({
      name: String(f.get("name")), email: String(f.get("email")), subject: String(f.get("subject")), message: String(f.get("message")),
    });
    if (error) return setState("err");
    form.reset();
    setState("ok");
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <label>Your name<input name="name" required maxLength={200} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Subject<input name="subject" defaultValue={topic} /></label>
      <label>Message<textarea name="message" required maxLength={5000} rows={6} /></label>
      {state === "ok" && <p className="form-ok" role="status">Thanks. We’ll be in touch shortly.</p>}
      {state === "err" && <p className="form-error" role="alert">Something went wrong. Please email us instead.</p>}
      <button className="btn btn-blue" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
