"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Badge, Loading, Stat, Thread, date, naira, useRows } from "@/lib/dash";

const db = supabase;
const n = (r: { count: number | null }) => r.count ?? 0;

export function Overview({ go }: { go: (t: string) => void }) {
  const { rows } = useRows(async () => {
    const c = (t: string, f?: (q: any) => any) => { const q = db.from(t).select("*", { count: "exact", head: true }); return f ? f(q) : q; };
    const [u, a, d, p, h, m, pr] = await Promise.all([
      c("profiles"), c("talent_profiles", (q) => q.in("approval", ["pending_payment", "pending_review"])),
      c("disputes", (q) => q.in("status", ["open", "in_review"])), c("projects", (q) => q.in("status", ["accepted", "in_progress"])),
      c("hiring_requests", (q) => q.eq("status", "submitted")), c("contact_messages", (q) => q.is("handled_at", null)),
      db.from("projects").select("budget_kobo").not("paid_at", "is", null),
    ]);
    const paid = (pr.data ?? []).reduce((s: number, x: any) => s + Number(x.budget_kobo), 0);
    return { data: [{ users: n(u), approvals: n(a), disputes: n(d), active: n(p), teams: n(h), msgs: n(m), paid }] };
  });
  const s = rows?.[0];
  if (!s) return <p className="muted">Loading…</p>;
  const todo = [["Talent awaiting approval", s.approvals, "freelancer"], ["Team requests to price", s.teams, "teams"], ["Open disputes", s.disputes, "disputes"], ["New enquiries", s.msgs, "contact"]] as const;
  return (
    <>
      <div className="stats-row">
        <Stat label="Total users" value={s.users} /><Stat label="Active projects" value={s.active} />
        <Stat label="Paid project value" value={naira(s.paid)} /><Stat label="BC commission (20%)" value={naira(Math.floor(s.paid * 0.2))} />
      </div>
      <div className="panel"><h2>Needs attention</h2><div className="stack" style={{ marginTop: 8 }}>{todo.map(([l, v, t]) => <button key={l} className="row-btn spread todo" onClick={() => go(t)}><span>{l}</span><strong>{v}</strong></button>)}</div></div>
    </>
  );
}

export function Users({ role }: { role: string }) {
  const talent = role !== "brand";
  const [q, setQ] = useState("");
  const { rows, reload, error } = useRows(async () => {
    const [{ data: p, error }, { data: t }] = await Promise.all([
      db.from("profiles").select("*").eq("role", role).order("created_at", { ascending: false }).limit(500),
      talent ? db.from("talent_profiles").select("*").eq("kind", role) : Promise.resolve({ data: [] as any[] }),
    ]);
    const m = new Map((t ?? []).map((x: any) => [x.user_id, x]));
    return { data: (p ?? []).map((x: any) => ({ ...x, talent: m.get(x.id) })), error };
  }, [role]);
  const list = (rows ?? []).filter((u) => (u.full_name + u.email + (u.company_name ?? "")).toLowerCase().includes(q.toLowerCase()));
  const setStatus = async (id: string, status: string) => { await db.from("profiles").update({ status }).eq("id", id); reload(); };
  const setApproval = async (id: string, approval: string) => { await db.from("talent_profiles").update({ approval }).eq("user_id", id); reload(); };
  return (
    <>
      <input className="search" placeholder="Search name or email" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <Loading rows={rows && list} error={error} empty="No users here yet." />
      <div className="grid">
        {list.map((u) => (
          <article className="panel" key={u.id}>
            <div className="spread"><h3>{u.full_name || "No name"}</h3><Badge s={u.status} /></div>
            <p className="muted">{u.email}{u.phone ? ` · ${u.phone}` : ""}</p>
            <p className="muted small">Joined {date(u.created_at)}</p>
            {u.talent && <><p>Approval: <Badge s={u.talent.approval} /></p>{u.talent.kind === "creator" ? <p className="muted">{naira(u.talent.rate_kobo)} per video · {u.talent.delivery_days ?? "?"} days · {u.talent.availability ?? "No availability"} · {u.talent.video_urls?.length ?? 0} videos</p> : <p className="muted">{u.talent.role_title ?? "No role"} · {u.talent.years_experience ?? "?"} yrs · From {naira(u.talent.rate_kobo)}</p>}{u.talent.video_urls?.[0] && <video className="vid" src={u.talent.video_urls[0]} controls preload="metadata" playsInline />}{u.talent.bio && <p className="muted small">{u.talent.bio}</p>}</>}
            <div className="row">
              {u.talent && u.talent.approval !== "approved" && <button className="btn btn-blue" onClick={() => setApproval(u.id, "approved")}>Approve</button>}
              {u.talent && u.talent.approval !== "rejected" && <button className="btn btn-line" onClick={() => setApproval(u.id, "rejected")}>Reject</button>}
              <button className="btn btn-line" onClick={() => setStatus(u.id, u.status === "active" ? "suspended" : "active")}>{u.status === "active" ? "Suspend" : "Reactivate"}</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function ProjectsAdmin() {
  const [f, setF] = useState("all");
  const [err, setErr] = useState("");
  const { rows, reload, error } = useRows(() => db.from("projects").select("*").order("created_at", { ascending: false }).limit(300));
  const list = (rows ?? []).filter((p) => f === "all" || p.status === f);
  const paid = async (id: string) => { setErr(""); const { error } = await db.rpc("admin_mark_project_paid", { p_id: id }); if (error) setErr("Couldn’t mark this project as paid."); reload(); };
  return (
    <>
      <div className="row filters">{["all", "requested", "accepted", "in_progress", "completed", "disputed", "cancelled"].map((k) => <button key={k} className={f === k ? "chip on" : "chip"} onClick={() => setF(k)}>{k.replace("_", " ")}</button>)}</div>
      {err && <p className="form-error" role="alert">{err}</p>}
      <Loading rows={rows && list} error={error} empty="No projects found." />
      <div className="stack">{list.map((p) => (
        <article className="panel" key={p.id}>
          <div className="spread"><h3>{p.title}</h3><Badge s={p.status} /></div>
          <p className="muted">{p.brand_name ?? "Brand"} · {naira(p.budget_kobo)} · BC earns {naira(Math.floor(p.budget_kobo * 0.2))}</p>
          {p.brief && <p className="small">{p.brief}</p>}
          {p.status === "accepted" && !p.paid_at && <div className="row"><button className="btn btn-blue" onClick={() => paid(p.id)}>Mark as paid and start</button></div>}
        </article>
      ))}</div>
    </>
  );
}

export function TeamRequests() {
  const { rows, reload, error } = useRows(() => db.from("hiring_requests").select("*").neq("status", "draft").order("created_at", { ascending: false }).limit(300));
  const set = async (id: string, status: string) => { await db.from("hiring_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id); reload(); };
  return (
    <>
      <Loading rows={rows} error={error} empty="No team requests yet." />
      <div className="stack">{(rows ?? []).map((r) => (
        <article className="panel" key={r.id}>
          <div className="spread"><h3>{r.details?.role ?? "Team request"}</h3><Badge s={r.status} /></div>
          <p className="muted">{r.details?.business} · {r.kind} · Team of {r.details?.team_size ?? "?"}{r.details?.location ? ` · ${r.details.location}` : ""}</p>
          {r.details?.requirements && <p className="small">{r.details.requirements}</p>}
          <div className="row">
            <select aria-label="Status" value={r.status} onChange={(e) => set(r.id, e.target.value)}>{["submitted", "paid", "matching", "matched", "closed", "cancelled"].map((s) => <option key={s}>{s}</option>)}</select>
          </div>
        </article>
      ))}</div>
    </>
  );
}

export function Disputes() {
  const { rows, reload, error } = useRows(() => db.from("disputes").select("*, projects(title)").order("created_at", { ascending: false }).limit(200));
  async function close(e: FormEvent<HTMLFormElement>, d: any, status: string) {
    e.preventDefault();
    const res = String(new FormData(e.currentTarget).get("res"));
    await db.from("disputes").update({ status, resolution: res, updated_at: new Date().toISOString() }).eq("id", d.id);
    await db.from("projects").update({ status: "completed", updated_at: new Date().toISOString() }).eq("id", d.project_id);
    reload();
  }
  return (
    <>
      <Loading rows={rows} error={error} empty="No disputes. Great news." />
      <div className="stack">{(rows ?? []).map((d) => (
        <article className="panel" key={d.id}>
          <div className="spread"><h3>{d.projects?.title ?? "Project"}</h3><Badge s={d.status} /></div>
          <p>{d.reason}</p><p className="muted small">{date(d.created_at)}</p>
          {d.resolution ? <p className="muted">Resolution: {d.resolution}</p> : (
            <form className="form" onSubmit={(e) => close(e, d, "resolved")}><label>Resolution<textarea name="res" rows={2} required /></label><button className="btn btn-blue">Resolve</button></form>
          )}
        </article>
      ))}</div>
    </>
  );
}

export function Payouts() {
  const { rows, reload, error } = useRows(() => db.from("payouts").select("*, talent_profiles(display_name)").order("created_at", { ascending: false }).limit(300));
  const set = async (id: string, status: string) => { await db.from("payouts").update({ status }).eq("id", id); reload(); };
  return (
    <>
      <Loading rows={rows} error={error} empty="No payouts yet." />
      <div className="stack">{(rows ?? []).map((p) => (
        <article className="panel spread" key={p.id}>
          <div><strong>{naira(p.amount_kobo)}</strong><p className="muted">{p.talent_profiles?.display_name} · {date(p.created_at)}</p></div>
          <div className="pay-actions"><Badge s={p.status} />{p.status !== "paid" && <button className="btn btn-blue" onClick={() => set(p.id, "paid")}>Mark paid</button>}</div>
        </article>
      ))}</div>
    </>
  );
}

export function Support({ me }: { me: string }) {
  const [open, setOpen] = useState<any>(null);
  const { rows, error } = useRows(async () => {
    const { data: c, error } = await db.from("conversations").select("id, created_at, conversation_members(user_id)").eq("is_support", true).order("created_at", { ascending: false }).limit(200);
    const ids = (c ?? []).flatMap((x: any) => x.conversation_members.map((m: any) => m.user_id));
    const { data: p } = ids.length ? await db.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] as any[] };
    const map = new Map((p ?? []).map((x: any) => [x.id, x]));
    return { data: (c ?? []).map((x: any) => { const u: any = map.get(x.conversation_members[0]?.user_id); return { id: x.id, name: u?.full_name || u?.email || "User" }; }), error };
  });
  if (open) return <div className="panel"><button className="link back" onClick={() => setOpen(null)}>← All chats</button><h3>{open.name}</h3><Thread cid={open.id} me={me} /></div>;
  return (
    <>
      <Loading rows={rows} error={error} empty="No support chats yet." />
      <div className="stack">{(rows ?? []).map((c) => <button key={c.id} className="panel row-btn" onClick={() => setOpen(c)}><strong>{c.name}</strong><span className="muted">Open chat</span></button>)}</div>
    </>
  );
}

export function Contact() {
  const { rows, reload, error } = useRows(() => db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(300));
  const done = async (id: string) => { await db.from("contact_messages").update({ handled_at: new Date().toISOString() }).eq("id", id); reload(); };
  return (
    <>
      <Loading rows={rows} error={error} empty="No enquiries yet." />
      <div className="stack">{(rows ?? []).map((m) => (
        <article className={m.handled_at ? "panel" : "panel unread"} key={m.id}>
          <h3>{m.subject || "Enquiry"}</h3>
          <p className="muted">{m.name} · <a className="link" href={`mailto:${m.email}`}>{m.email}</a> · {date(m.created_at)}</p>
          <p>{m.message}</p>
          {!m.handled_at && <button className="btn btn-line" onClick={() => done(m.id)}>Mark handled</button>}
        </article>
      ))}</div>
    </>
  );
}

export function Tasks({ me }: { me: string }) {
  const { rows, reload, error } = useRows(() => db.from("tasks").select("*").order("created_at", { ascending: false }).limit(300));
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form);
    const due = String(f.get("due"));
    const { error } = await db.from("tasks").insert({ title: f.get("title"), description: f.get("desc"), due_at: due ? new Date(due).toISOString() : null, created_by: me, assigned_to: me });
    if (!error) { form.reset(); reload(); }
  }
  const set = async (id: string, status: string) => { await db.from("tasks").update({ status }).eq("id", id); reload(); };
  return (
    <>
      <form className="panel form" onSubmit={add}><h2>Add task</h2><label>Title<input name="title" required /></label><label>Details<textarea name="desc" rows={2} /></label><label>Due date<input name="due" type="date" /></label><button className="btn btn-blue">Add task</button></form>
      <h2 className="sub">All tasks</h2>
      <Loading rows={rows} error={error} empty="No tasks yet." />
      <div className="stack">{(rows ?? []).map((t) => (
        <article className="panel" key={t.id}>
          <div className="spread"><h3>{t.title}</h3><Badge s={t.status} /></div>
          {t.description && <p className="muted">{t.description}</p>}
          <div className="row"><select aria-label="Status" value={t.status} onChange={(e) => set(t.id, e.target.value)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select>{t.due_at && <span className="muted small">Due {date(t.due_at)}</span>}</div>
        </article>
      ))}</div>
    </>
  );
}
