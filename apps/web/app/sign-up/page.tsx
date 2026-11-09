"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== f.get("confirm")) return setError("The passwords don’t match.");
    setBusy(true); setError("");
    const { error } = await supabase.auth.signUp({
      email: String(f.get("email")),
      password,
      options: { data: { role: f.get("role"), full_name: `${f.get("first")} ${f.get("last")}`.trim(), phone: f.get("phone") } },
    });
    setBusy(false);
    if (error) setError(error.message); else setOk(true);
  }

  if (ok) return <main className="auth"><h1>Check your email</h1><p>We’ve sent a link to confirm your account.</p></main>;

  return (
    <main className="auth">
      <Link href="/" className="wordmark" style={{ color: "var(--blue)" }}>brand<br />collaborator</Link>
      <h1>Sign up</h1>
      <p>Sign up to enjoy the features of Brand Collaborator</p>
      <form onSubmit={submit}>
        <label>I am joining as a
          <select name="role" defaultValue="brand">
            <option value="brand">Brand</option><option value="creator">UGC Creator</option><option value="freelancer">Freelancer</option>
          </select>
        </label>
        <label>First name<input name="first" required autoComplete="given-name" /></label>
        <label>Last name<input name="last" required autoComplete="family-name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
        <label>Password<input name="password" type="password" required autoComplete="new-password" /></label>
        <label>Confirm password<input name="confirm" type="password" required autoComplete="new-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-blue" disabled={busy}>{busy ? "Creating account…" : "Sign up"}</button>
      </form>
      <p>Already have an account with Brand Collaborator? <Link className="link" href="/sign-in">Sign in</Link></p>
    </main>
  );
}
