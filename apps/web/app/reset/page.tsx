"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { AuthShell } from "@/components/AuthShell";

export default function Reset() {
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password"));
    if (password.length < 8) return setMsg("Use at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg("This reset link has expired. Please request a new one.");
    window.location.href = "/dashboard";
  }
  return (
    <AuthShell title="New password" intro="Choose a new password for your account.">
      <form onSubmit={submit}>
        <label>New password<input name="password" type="password" required autoComplete="new-password" /></label>
        {msg && <p className="form-error" role="alert">{msg}</p>}
        <button className="btn btn-blue">Save password</button>
      </form>
      <p><Link className="link" href="/sign-in">Back to sign in</Link></p>
    </AuthShell>
  );
}
