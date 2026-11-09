"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) setError("Incorrect email or password."); else setOk(true);
  }

  return (
    <main className="auth">
      <Link href="/" className="wordmark" style={{ color: "var(--blue)" }}>brand<br />collaborator</Link>
      <h1>Sign In</h1>
      <p>Sign in to enjoy the features of Brand Collaborator</p>
      <form onSubmit={submit}>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        {ok && <p className="form-ok" role="status">You’re signed in.</p>}
        <button className="btn btn-blue" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
      </form>
      <p>Don’t have an account with Brand Collaborator? <Link className="link" href="/sign-up">Sign up</Link></p>
    </main>
  );
}
