"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Badge, Loading, Stat, Thread, date, naira, useRows } from "@/lib/dash";

type P = { me: any };
const tx = (id: string, action: string, reason?: string) => supabase.rpc("project_transition", { p_id: id, p_action: action, p_reason: reason ?? null });
const toKobo = (v: FormDataEntryValue | null) => Math.round(Number(v) * 100);

function count(rows: any[] | null, ...s: string[]) { return rows ? rows.filter((r) => s.includes(r.status)).length : "…"; }

export function BrandHome({ me, go }: P & { go: (t: string) => void }) {
  const { rows } = useRows(() => supabase.from("projects").select("status").eq("brand_id", me.id), [me.id]);
  const { rows: reqs } = useRows(() => supabase.from("hiring_requests").select("status").eq("brand_id", me.id), [me.id]);
  return (
    <>
      <div className="stats-row">
        <Stat label="Active projects" value={count(rows, "accepted", "in_progress")} />
        <Stat label="Awaiting talent" value={count(rows, "requested")} />
        <Stat label="Completed" value={count(rows, "completed")} />
        <Stat label="Team requests" value={reqs ? reqs.length : "…"} />
      </div>
      <div className="panel quick"><h2>What would you like to do?</h2><div className="row"><button className="btn btn-blue" onClick={() => go("find")}>Find talent</button><button className="btn btn-line" onClick={() => go("team")}>Hire a team</button></div></div>
    </>
  );
}

export function TalentHome({ me, go }: P & { go: (t: string) => void }) {
  const { rows: t } = useRows(() => supabase.from("talent_profiles").select("approval, rating, review_count").eq("user_id", me.id), [me.id]);
  const { rows } = useRows(() => supabase.from("projects").select("status").eq("talent_id", me.id), [me.id]);
  const { rows: pay } = useRows(() => supabase.from("payouts").select("amount_kobo, status").eq("talent_id", me.id), [me.id]);
  const a = t?.[0]?.approval;
  const msg: Record<string, string> = {
    pending_payment: "Complete your portfolio, then contact us about your ₦5,000 registration so we can review your profile.",
    pending_review: "Your profile is being reviewed. We’ll let you know soon.",
    rejected: "Your profile wasn’t approved. Please contact us for details.",
  };
  return (
    <>
      {a && msg[a] && <div className="notice"><p>{msg[a]}</p><div className="row"><button className="btn btn-blue" onClick={() => go("profile")}>Update portfolio</button><Link className="btn btn-line" href="/contact?topic=Talent%20registration">Contact us</Link></div></div>}
      <div className="stats-row">
        <Stat label="Job requests" value={count(rows, "requested")} />
        <Stat label="Ongoing" value={count(rows, "accepted", "in_progress")} />
        <Stat label="Completed" value={count(rows, "completed")} />
        <Stat label="Total earned" value={pay ? naira(pay.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount_kobo), 0)) : "…"} />
      </div>
      {!!t?.[0]?.review_count && <div className="panel"><h2>Rating</h2><p>★ {Number(t[0].rating).toFixed(1)} from {t[0].review_count} reviews</p></div>}
    </>
  );
}

export function FindTalent({ me }: P) {
  const [kind, setKind] = useState("all");
  const [hire, setHire] = useState<any>(null);
  const [done, setDone] = useState("");
  const [err, setErr] = useState("");
  const { rows, error } = useRows(() => supabase.from("talent_profiles").select("*").eq("approval", "approved").order("rating", { ascending: false }).limit(100));
  const list = (rows ?? []).filter((t) => kind === "all" || t.kind === kind);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setErr("");
    const { error } = await supabase.from("projects").insert({ brand_id: me.id, talent_id: hire.user_id, title: String(f.get("title")), brief: String(f.get("brief")), budget_kobo: toKobo(f.get("budget")) });
    if (error) return setErr("We couldn’t send this request. Please try again.");
    setDone(`Request sent to ${hire.display_name}.`); setHire(null);
  }

  return (
    <>
      <div className="row filters">{[["all", "All"], ["creator", "UGC Creators"], ["freelancer", "Freelancers"]].map(([k, l]) => <button key={k} className={kind === k ? "chip on" : "chip"} onClick={() => setKind(k)}>{l}</button>)}</div>
      {done && <p className="form-ok" role="status">{done}</p>}
      <Loading rows={rows && list} error={error} empty="No approved talent yet. Check back soon, or request a team." />
      <div className="grid">
        {list.map((t) => (
          <article className="panel" key={t.user_id}>
            <h3>{t.display_name}</h3>
            <p className="muted">{t.kind === "creator" ? "UGC Creator" : "Freelancer"}{t.location ? ` · ${t.location}` : ""}</p>
            {t.headline && <p>{t.headline}</p>}
            <p className="muted">{t.rate_kobo ? `From ${naira(t.rate_kobo)}` : ""}{t.review_count ? ` ★ ${Number(t.rating).toFixed(1)}` : ""}</p>
            {hire?.user_id === t.user_id ? (
              <form className="form" onSubmit={send}>
                <label>Project title<input name="title" required maxLength={150} /></label>
                <label>Project brief<textarea name="brief" required rows={4} maxLength={4000} /></label>
                <label>Budget (₦)<input name="budget" type="number" min="1" required inputMode="numeric" /></label>
                {err && <p className="form-error" role="alert">{err}</p>}
                <div className="row"><button className="btn btn-blue">Send request</button><button type="button" className="btn btn-line" onClick={() => setHire(null)}>Cancel</button></div>
              </form>
            ) : <button className="btn btn-blue" onClick={() => { setDone(""); setHire(t); }}>Hire</button>}
          </article>
        ))}
      </div>
    </>
  );
}

function Rate({ p, onDone }: { p: any; onDone: () => void }) {
  const [n, setN] = useState(0);
  const [sent, setSent] = useState(false);
  async function save() {
    const { error } = await supabase.from("reviews").insert({ project_id: p.id, brand_id: p.brand_id, talent_id: p.talent_id, rating: n });
    if (!error) { setSent(true); onDone(); }
  }
  if (sent) return <p className="form-ok">Thanks for your rating.</p>;
  return <div className="row">{[1, 2, 3, 4, 5].map((i) => <button key={i} aria-label={`${i} stars`} className={i <= n ? "star on" : "star"} onClick={() => setN(i)}>★</button>)}<button className="btn btn-line" disabled={!n} onClick={save}>Rate</button></div>;
}

function ProjectCard({ p, side, reload }: { p: any; side: "brand" | "talent"; reload: () => void }) {
  const [err, setErr] = useState("");
  async function act(fn: () => PromiseLike<{ error: any }>) { setErr(""); const { error } = await fn(); if (error) setErr("That action isn’t available right now."); reload(); }
  const ask = (q: string) => { const r = window.prompt(q); return r && r.trim() ? r.trim() : null; };
  return (
    <article className="panel">
      <div className="spread"><h3>{p.title}</h3><Badge s={p.status} /></div>
      {side === "talent" && <p className="muted">From {p.brand_name ?? "Brand"}</p>}
      {p.brief && <p>{p.brief}</p>}
      <p className="muted">Budget {naira(p.budget_kobo)}{side === "talent" ? ` · You receive ${naira(Math.floor(p.budget_kobo * 0.8))}` : ""} · {date(p.created_at)}</p>
      {p.status === "accepted" && !p.paid_at && <p className="muted">{side === "brand" ? "Accepted. Our team will contact you to arrange payment." : "Accepted. Work starts once payment is confirmed."}</p>}
      {p.cancel_reason && <p className="muted">Reason: {p.cancel_reason}</p>}
      {err && <p className="form-error" role="alert">{err}</p>}
      <div className="row">
        {side === "talent" && p.status === "requested" && <><button className="btn btn-blue" onClick={() => act(() => tx(p.id, "accept"))}>Accept</button><button className="btn btn-line" onClick={() => act(() => tx(p.id, "reject"))}>Decline</button></>}
        {side === "brand" && p.status === "in_progress" && <button className="btn btn-blue" onClick={() => act(() => tx(p.id, "complete"))}>Mark complete</button>}
        {["requested", "accepted"].includes(p.status) && !p.paid_at && <button className="btn btn-line" onClick={() => { const r = ask("Why are you cancelling?"); if (r) act(() => tx(p.id, "cancel", r)); }}>Cancel</button>}
        {["in_progress", "completed"].includes(p.status) && <button className="btn btn-line" onClick={() => { const r = ask("What went wrong?"); if (r) act(() => supabase.rpc("raise_dispute", { p_id: p.id, p_reason: r })); }}>Report a problem</button>}
      </div>
      {side === "brand" && p.status === "completed" && <Rate p={p} onDone={reload} />}
    </article>
  );
}

function ProjectList({ me, side }: P & { side: "brand" | "talent" }) {
  const [group, setGroup] = useState("active");
  const col = side === "brand" ? "brand_id" : "talent_id";
  const { rows, reload, error } = useRows(() => supabase.from("projects").select("*").eq(col, me.id).order("created_at", { ascending: false }), [me.id]);
  const map: Record<string, string[]> = { active: ["requested", "accepted", "in_progress", "disputed"], completed: ["completed"], cancelled: ["cancelled", "rejected"] };
  const list = (rows ?? []).filter((p) => map[group].includes(p.status));
  return (
    <>
      <div className="row filters">{Object.keys(map).map((k) => <button key={k} className={group === k ? "chip on" : "chip"} onClick={() => setGroup(k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}</div>
      <Loading rows={rows && list} error={error} empty={`No ${group} ${side === "brand" ? "projects" : "jobs"} yet.`} />
      <div className="stack">{list.map((p) => <ProjectCard key={p.id} p={p} side={side} reload={reload} />)}</div>
    </>
  );
}
export const Projects = ({ me }: P) => <ProjectList me={me} side="brand" />;
export const Jobs = ({ me }: P) => <ProjectList me={me} side="talent" />;

export function HireTeam({ me }: P) {
  const { rows, reload, error } = useRows(() => supabase.from("hiring_requests").select("*").eq("brand_id", me.id).order("created_at", { ascending: false }), [me.id]);
  const [state, setState] = useState("");
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form);
    const { error } = await supabase.from("hiring_requests").insert({
      brand_id: me.id, kind: String(f.get("kind")), status: "submitted",
      details: { business: f.get("business"), role: f.get("role"), team_size: f.get("size"), location: f.get("location"), requirements: f.get("req"), start: f.get("start") },
    });
    if (error) return setState("err");
    form.reset(); setState("ok"); reload();
  }
  return (
    <>
      <form className="panel form" onSubmit={send}>
        <h2>Request a team</h2>
        <p className="muted">Tell us what you need. We’ll contact you with a custom price.</p>
        <label>Hiring type<select name="kind" defaultValue="onsite"><option value="onsite">Onsite</option><option value="remote">Remote</option><option value="instant">Instant</option></select></label>
        <label>Business name<input name="business" required defaultValue={me.company_name ?? ""} /></label>
        <label>Role or skill needed<input name="role" required /></label>
        <label>Team size<input name="size" type="number" min="1" required inputMode="numeric" /></label>
        <label>Location<input name="location" /></label>
        <label>Preferred start date<input name="start" type="date" /></label>
        <label>Job requirements<textarea name="req" rows={4} required maxLength={4000} /></label>
        {state === "ok" && <p className="form-ok" role="status">Request sent. We’ll be in touch.</p>}
        {state === "err" && <p className="form-error" role="alert">We couldn’t send this. Please try again.</p>}
        <button className="btn btn-blue">Send request</button>
      </form>
      <h2 className="sub">Your requests</h2>
      <Loading rows={rows} error={error} empty="No team requests yet." />
      <div className="stack">{(rows ?? []).map((r) => <article className="panel" key={r.id}><div className="spread"><h3>{r.details?.role ?? "Team request"}</h3><Badge s={r.status} /></div><p className="muted">{r.kind} · {date(r.created_at)}</p></article>)}</div>
    </>
  );
}

export function Profile({ me }: P) {
  const { rows, reload } = useRows(() => supabase.from("talent_profiles").select("*").eq("user_id", me.id), [me.id]);
  const [note, setNote] = useState("");
  const t = rows?.[0];
  if (!t) return <p className="muted">Loading…</p>;
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const rate = String(f.get("rate"));
    const { error } = await supabase.from("talent_profiles").update({
      display_name: f.get("name"), headline: f.get("headline"), bio: f.get("bio"), category: f.get("category"), location: f.get("location"),
      skills: String(f.get("skills")).split(",").map((s) => s.trim()).filter(Boolean),
      links: { portfolio: f.get("portfolio"), instagram: f.get("instagram"), tiktok: f.get("tiktok"), linkedin: f.get("linkedin") },
      rate_kobo: rate ? toKobo(rate) : null, updated_at: new Date().toISOString(),
    }).eq("user_id", me.id);
    setNote(error ? "We couldn’t save your changes." : "Saved.");
    reload();
  }
  async function photo(file?: File) {
    if (!file) return;
    if (file.size > 5_000_000 || !file.type.startsWith("image/")) return setNote("Please choose an image under 5 MB.");
    const path = `${me.id}/${Date.now()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (error) return setNote("We couldn’t upload that photo.");
    const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    await supabase.from("talent_profiles").update({ avatar_url: url }).eq("user_id", me.id);
    setNote("Photo updated."); reload();
  }
  return (
    <form className="panel form" onSubmit={save} key={t.updated_at}>
      <div className="spread"><h2>Your portfolio</h2><Badge s={t.approval} /></div>
      <div className="avatar-row">{t.avatar_url ? <img src={t.avatar_url} alt="" /> : <div className="avatar-blank" />}<label className="btn btn-line">Upload photo<input type="file" accept="image/*" hidden onChange={(e) => photo(e.target.files?.[0])} /></label></div>
      <label>Display name<input name="name" required defaultValue={t.display_name} /></label>
      <label>Headline<input name="headline" maxLength={120} defaultValue={t.headline ?? ""} /></label>
      <label>About you<textarea name="bio" rows={4} maxLength={2000} defaultValue={t.bio ?? ""} /></label>
      <label>Category<input name="category" defaultValue={t.category ?? ""} /></label>
      <label>Skills (separate with commas)<input name="skills" defaultValue={(t.skills ?? []).join(", ")} /></label>
      <label>Location<input name="location" defaultValue={t.location ?? ""} /></label>
      <label>Starting rate (₦)<input name="rate" type="number" min="0" inputMode="numeric" defaultValue={t.rate_kobo ? t.rate_kobo / 100 : ""} /></label>
      <label>Portfolio link<input name="portfolio" type="url" defaultValue={t.links?.portfolio ?? ""} /></label>
      <label>Instagram<input name="instagram" defaultValue={t.links?.instagram ?? ""} /></label>
      <label>TikTok<input name="tiktok" defaultValue={t.links?.tiktok ?? ""} /></label>
      <label>LinkedIn<input name="linkedin" defaultValue={t.links?.linkedin ?? ""} /></label>
      {note && <p className="muted" role="status">{note}</p>}
      <button className="btn btn-blue">Save portfolio</button>
    </form>
  );
}

export function Services({ me }: P) {
  const { rows, reload, error } = useRows(() => supabase.from("services").select("*").eq("talent_id", me.id).order("created_at", { ascending: false }), [me.id]);
  const [err, setErr] = useState(false);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form);
    const { error } = await supabase.from("services").insert({ talent_id: me.id, title: f.get("title"), description: f.get("desc"), price_kobo: toKobo(f.get("price")), project_url: f.get("url") || null });
    setErr(!!error); if (!error) { form.reset(); reload(); }
  }
  return (
    <>
      <form className="panel form" onSubmit={add}>
        <h2>Add a service</h2>
        <label>Title<input name="title" required maxLength={120} /></label>
        <label>Description<textarea name="desc" rows={3} maxLength={1500} /></label>
        <label>Price (₦)<input name="price" type="number" min="0" required inputMode="numeric" /></label>
        <label>Sample project link<input name="url" type="url" /></label>
        {err && <p className="form-error" role="alert">We couldn’t add that service.</p>}
        <button className="btn btn-blue">Add service</button>
      </form>
      <h2 className="sub">Your services</h2>
      <Loading rows={rows} error={error} empty="You haven’t added any services yet." />
      <div className="stack">{(rows ?? []).map((s) => <article className="panel" key={s.id}><div className="spread"><h3>{s.title}</h3><strong>{naira(s.price_kobo)}</strong></div>{s.description && <p>{s.description}</p>}<button className="btn btn-line" onClick={async () => { await supabase.from("services").delete().eq("id", s.id); reload(); }}>Remove</button></article>)}</div>
    </>
  );
}

export function Earnings({ me }: P) {
  const { rows, error } = useRows(() => supabase.from("payouts").select("*").eq("talent_id", me.id).order("created_at", { ascending: false }), [me.id]);
  const sum = (s: string[]) => naira((rows ?? []).filter((p) => s.includes(p.status)).reduce((a, p) => a + Number(p.amount_kobo), 0));
  return (
    <>
      <div className="stats-row"><Stat label="Paid out" value={sum(["paid"])} /><Stat label="Pending" value={sum(["pending", "processing"])} /></div>
      <p className="muted">Brand Collaborator keeps 20% of each completed project. Amounts below are what you receive.</p>
      <Loading rows={rows} error={error} empty="No earnings yet. Completed paid projects appear here." />
      <div className="stack">{(rows ?? []).map((p) => <article className="panel spread" key={p.id}><div><strong>{naira(p.amount_kobo)}</strong><p className="muted">{date(p.created_at)}</p></div><Badge s={p.status} /></article>)}</div>
    </>
  );
}

export function Messages({ me }: P) {
  const [open, setOpen] = useState<any>(null);
  const { rows, error } = useRows(async () => {
    const col = me.role === "brand" ? "brand_id" : "talent_id";
    const [{ data: pr, error }, { data: cv }] = await Promise.all([
      supabase.from("projects").select("id, title, brand_name").eq(col, me.id).order("created_at", { ascending: false }),
      supabase.from("conversations").select("id, project_id"),
    ]);
    const map = new Map((cv ?? []).map((c: any) => [c.project_id, c.id]));
    return { data: (pr ?? []).map((p: any) => ({ cid: map.get(p.id), title: p.title })).filter((x: any) => x.cid), error };
  }, [me.id]);
  async function support() {
    const { data } = await supabase.rpc("open_support_conversation");
    if (data) setOpen({ cid: data, title: "Brand Collaborator support" });
  }
  if (open) return <div className="panel"><button className="link back" onClick={() => setOpen(null)}>← All messages</button><h3>{open.title}</h3><Thread cid={open.cid} me={me.id} /></div>;
  return (
    <div className="stack">
      <button className="panel row-btn" onClick={support}><strong>Chat with support</strong><span className="muted">Message the Brand Collaborator team</span></button>
      <Loading rows={rows} error={error} empty="Project conversations appear here." />
      {(rows ?? []).map((c) => <button key={c.cid} className="panel row-btn" onClick={() => setOpen(c)}><strong>{c.title}</strong><span className="muted">Open conversation</span></button>)}
    </div>
  );
}

export function Alerts({ me }: P) {
  const { rows, reload, error } = useRows(() => supabase.from("notifications").select("*").eq("user_id", me.id).order("created_at", { ascending: false }).limit(50), [me.id]);
  useEffect(() => {
    supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", me.id).is("read_at", null).then(() => {});
  }, [me.id]);
  void reload;
  return (
    <>
      <Loading rows={rows} error={error} empty="No alerts yet." />
      <div className="stack">{(rows ?? []).map((n) => <article className={n.read_at ? "panel" : "panel unread"} key={n.id}><strong>{n.title}</strong>{n.body && <p className="muted">{n.body}</p>}<p className="muted small">{date(n.created_at)}</p></article>)}</div>
    </>
  );
}

export function Settings({ me, onSaved, onLogout }: P & { onSaved: (p: any) => void; onLogout: () => void }) {
  const [note, setNote] = useState("");
  const [pw, setPw] = useState("");
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const patch = { full_name: String(f.get("name")), phone: String(f.get("phone")), company_name: String(f.get("company") ?? ""), location: String(f.get("location")), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("profiles").update(patch).eq("id", me.id);
    setNote(error ? "We couldn’t save your changes." : "Saved.");
    if (!error) onSaved({ ...me, ...patch });
  }
  async function changePw(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = String(new FormData(form).get("password"));
    if (password.length < 8) return setPw("Use at least 8 characters.");
    const { error } = await supabase.auth.updateUser({ password });
    setPw(error ? "We couldn’t change your password." : "Password changed.");
    if (!error) form.reset();
  }
  return (
    <div className="stack">
      <form className="panel form" onSubmit={save}>
        <h2>General</h2>
        <label>Full name<input name="name" required defaultValue={me.full_name} /></label>
        <label>Email<input value={me.email} disabled readOnly /></label>
        <label>Phone<input name="phone" type="tel" defaultValue={me.phone ?? ""} /></label>
        {me.role === "brand" && <label>Company<input name="company" defaultValue={me.company_name ?? ""} /></label>}
        <label>Location<input name="location" defaultValue={me.location ?? ""} /></label>
        {note && <p className="muted" role="status">{note}</p>}
        <button className="btn btn-blue">Save changes</button>
      </form>
      <form className="panel form" onSubmit={changePw}>
        <h2>Security</h2>
        <label>New password<input name="password" type="password" required autoComplete="new-password" /></label>
        {pw && <p className="muted" role="status">{pw}</p>}
        <button className="btn btn-blue">Change password</button>
      </form>
      <button className="btn btn-line mobile-only" onClick={onLogout}>Log out</button>
    </div>
  );
}
