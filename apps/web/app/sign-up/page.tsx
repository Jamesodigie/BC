"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { AuthShell } from "@/components/AuthShell";

const roles = [["brand", "Brand", "role-brand"], ["creator", "UGC Creator", "role-creator"], ["freelancer", "Freelancer", "role-freelancer"]];
const titles: Record<string, [string, string]> = {
  brand: ["About your brand", "Tell us who’s hiring."],
  creator: ["Your creator details", "This is what brands see before they book you."],
  freelancer: ["Your work details", "Help brands find you for the right role."],
};

export default function SignUp() {
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState("brand");
  const [step, setStep] = useState(1);
  const stepOne = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("role");
    if (r === "brand" || r === "creator" || r === "freelancer") setRole(r);
  }, []);

  function next() {
    setError("");
    const fields = Array.from(stepOne.current?.querySelectorAll("input") ?? []);
    for (const f of fields) if (!f.reportValidity()) return;
    const pw = fields.find((f) => f.name === "password")?.value ?? "";
    const confirm = fields.find((f) => f.name === "confirm")?.value ?? "";
    if (pw.length < 8) return setError("Use at least 8 characters for your password.");
    if (pw !== confirm) return setError("The passwords don’t match.");
    setStep(2);
    window.scrollTo({ top: 0 });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) return next();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    const g = (k: string) => { const v = f.get(k); return v == null ? undefined : String(v).trim() || undefined; };
    const { data, error } = await supabase.auth.signUp({
      email: String(f.get("email")).trim(),
      password: String(f.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/sign-in`,
        data: {
          role, full_name: `${g("first")} ${g("last")}`.trim(), phone: g("phone"), location: g("location"), company_name: g("company"), industry: g("industry"),
          price_naira: g("price"), availability: g("availability"), delivery_days: g("delivery"), category: g("category"), bio: g("bio"),
          instagram: g("instagram"), tiktok: g("tiktok"), portfolio: g("portfolio"), linkedin: g("linkedin"),
          role_title: g("role_title"), years_experience: g("years"), skills: g("skills"), employment_type: g("employment"),
        },
      },
    });
    setBusy(false);
    if (error) {
      if (error.status === 429) return setError("We’ve sent too many emails just now. Please try again in a while.");
      if (error.code === "weak_password") return setError("Please choose a stronger password.");
      return setError("We couldn’t create your account. Please check your details and try again.");
    }
    if (data.session) { window.location.href = "/dashboard"; return; }
    if (data.user && data.user.identities?.length === 0) return setError("An account with this email already exists. Please sign in.");
    setOk(true);
  }

  if (ok) return (
    <AuthShell title="Check your email" intro={role === "creator" ? "Confirm your account with the link we sent, then sign in to upload your showcase video." : "We’ve sent a link to confirm your account. Check your spam folder too, then come back and sign in."}>
      <Link className="btn btn-blue" href="/sign-in">Go to sign in</Link>
    </AuthShell>
  );

  return (
    <AuthShell title={step === 1 ? "Sign up" : titles[role][0]} intro={step === 1 ? "Sign up to enjoy the features of Brand Collaborator" : titles[role][1]}>
      <p className="step-count">Step {step} of 2</p>
      <form onSubmit={submit} noValidate={false}>
        <div ref={stepOne} className="form-part" hidden={step !== 1}>
          <fieldset className="role-picker">
            <legend>I am joining as a</legend>
            {roles.map(([v, l, c]) => (
              <label className={`role ${c}`} key={v}>
                <input type="radio" value={v} checked={role === v} onChange={() => setRole(v)} />{l}
              </label>
            ))}
          </fieldset>
          <label>First name<input name="first" required autoComplete="given-name" /></label>
          <label>Last name<input name="last" required autoComplete="family-name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Phone number<input name="phone" type="tel" required autoComplete="tel" /></label>
          <label>Password<input name="password" type="password" required autoComplete="new-password" /></label>
          <label>Confirm password<input name="confirm" type="password" required autoComplete="new-password" /></label>
        </div>

        {step === 2 && role === "brand" && (
          <div className="form-part">
            <label>Company or brand name<input name="company" required /></label>
            <label>Industry<input name="industry" /></label>
            <label>Location<input name="location" /></label>
          </div>
        )}
        {step === 2 && role === "creator" && (
          <div className="form-part">
            <label>Your price per video (₦)<input name="price" type="number" min="1" required inputMode="numeric" /></label>
            <label>How many days to produce a video?<input name="delivery" type="number" min="1" max="365" required inputMode="numeric" /></label>
            <label>When are you available?<input name="availability" required placeholder="e.g. Weekdays, 9am to 5pm" /></label>
            <label>Content niche<input name="category" required placeholder="e.g. Beauty, Food, Tech" /></label>
            <label>Location<input name="location" required /></label>
            <label>Instagram<input name="instagram" placeholder="@yourname" /></label>
            <label>TikTok<input name="tiktok" placeholder="@yourname" /></label>
            <label>About you<textarea name="bio" rows={3} maxLength={2000} /></label>
            <p className="muted">You’ll upload your showcase video right after you confirm your email and sign in.</p>
          </div>
        )}
        {step === 2 && role === "freelancer" && (
          <div className="form-part">
            <label>Your role<input name="role_title" required placeholder="e.g. Graphic Designer" /></label>
            <label>Years of experience<input name="years" type="number" min="0" max="60" required inputMode="numeric" /></label>
            <label>Skills (separate with commas)<input name="skills" required placeholder="e.g. Figma, Branding, UI" /></label>
            <label>Work type<select name="employment" defaultValue="Remote"><option>Remote</option><option>Onsite</option><option>Both</option></select></label>
            <label>Starting price (₦)<input name="price" type="number" min="1" required inputMode="numeric" /></label>
            <label>When are you available?<input name="availability" required placeholder="e.g. Full-time, Weekends" /></label>
            <label>Location<input name="location" required /></label>
            <label>Portfolio link<input name="portfolio" type="url" placeholder="https://" /></label>
            <label>LinkedIn<input name="linkedin" type="url" placeholder="https://" /></label>
            <label>About you<textarea name="bio" rows={3} maxLength={2000} /></label>
          </div>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
        {step === 1 ? <button type="button" className="btn btn-blue" onClick={next}>Continue</button> : (
          <div className="row"><button type="button" className="btn btn-line" onClick={() => setStep(1)}>Back</button><button className="btn btn-blue" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button></div>
        )}
      </form>
      <p>Already have an account with Brand Collaborator? <Link className="link" href="/sign-in">Sign in</Link></p>
    </AuthShell>
  );
}
