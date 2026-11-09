"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { AuthShell } from "@/components/AuthShell";

export default function SignIn() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [unconfirmed, setUnconfirmed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) window.location.replace("/dashboard"); });
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(""); setInfo(""); setUnconfirmed(false);
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: String(f.get("password")) });
    setBusy(false);
    if (!error) { window.location.href = "/dashboard"; return; }
    if (error.code === "email_not_confirmed") { setUnconfirmed(true); setError("Please confirm your email first. Check your inbox and spam folder."); }
    else if (error.status === 429) setError("Too many attempts. Please wait a few minutes.");
    else setError("Incorrect email or password.");
  }
  async function resend() {
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: `${location.origin}/sign-in` } });
    setInfo(error ? "We couldn’t send it right now. Please try again in a while." : "Confirmation email sent.");
  }
  async function forgot() {
    if (!email.trim()) return setError("Enter your email above first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/reset` });
    setError(""); setInfo(error ? "We couldn’t send it right now. Please try again in a while." : "If that email has an account, a reset link is on its way.");
  }

  return (
    <AuthShell title="Sign In" intro="Sign in to enjoy the features of Brand Collaborator">
      <form onSubmit={submit}>
        <label>Email<input name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        {info && <p className="form-ok" role="status">{info}</p>}
        <button className="btn btn-blue" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
      </form>
      <p>
        <button className="textlink" type="button" onClick={forgot}>Forgot password?</button>
        {unconfirmed && <> · <button className="textlink" type="button" onClick={resend}>Resend confirmation</button></>}
      </p>
      <p>Don’t have an account with Brand Collaborator? <Link className="link" href="/sign-up">Sign up</Link></p>
    </AuthShell>
  );
}
