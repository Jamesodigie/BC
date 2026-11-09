"use client";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { InstallApp } from "@/lib/dash";
import { Contact, Disputes, Overview, Payouts, ProjectsAdmin, Support, Tasks, TeamRequests, Users } from "./views";

const tabs = [["home", "Dashboard"], ["freelancer", "Freelancers"], ["creator", "UGC Creators"], ["brand", "Brands"], ["projects", "Projects"], ["teams", "Remote & Onsite"], ["disputes", "Disputes"], ["payouts", "Payouts"], ["support", "Support"], ["contact", "Enquiries"], ["tasks", "Tasks"]];

export default function Admin() {
  const [state, setState] = useState<"load" | "out" | "denied" | "in">("load");
  const [uid, setUid] = useState("");
  const [tab, setTab] = useState("home");
  const [err, setErr] = useState("");

  async function check() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return setState("out");
    const { data: ok } = await supabase.rpc("is_admin");
    setUid(data.session.user.id);
    setState(ok ? "in" : "denied");
  }
  useEffect(() => { check(); }, []);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")).trim(), password: String(f.get("password")) });
    if (error) return setErr("Incorrect email or password.");
    check();
  }
  const out = async () => { await supabase.auth.signOut(); setState("out"); };

  if (state === "load") return <main className="nf"><p>Loading…</p></main>;
  if (state === "out") return (
    <main className="nf">
      <form className="panel form admin-login" onSubmit={login}>
        <h1>BC Admin</h1>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {err && <p className="form-error" role="alert">{err}</p>}
        <button className="btn btn-blue">Sign in</button>
      </form>
    </main>
  );
  if (state === "denied") return <main className="nf"><h1>No admin access</h1><p>This account isn’t an admin.</p><button className="btn btn-blue" onClick={out}>Sign out</button></main>;

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="wordmark">brand<br />collaborator</div>
        <nav aria-label="Admin">{tabs.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>{l}</button>)}</nav>
        <div className="side-foot"><InstallApp /><button className="logout" onClick={out}>Log out</button></div>
      </aside>
      <div className="dash-main">
        <header className="dash-top"><h1>{tabs.find(([k]) => k === tab)?.[1]}</h1><p className="muted">Admin</p></header>
        <main>
          {tab === "home" && <Overview go={setTab} />}
          {(tab === "freelancer" || tab === "creator" || tab === "brand") && <Users key={tab} role={tab} />}
          {tab === "projects" && <ProjectsAdmin />}
          {tab === "teams" && <TeamRequests />}
          {tab === "disputes" && <Disputes />}
          {tab === "payouts" && <Payouts />}
          {tab === "support" && <Support me={uid} />}
          {tab === "contact" && <Contact />}
          {tab === "tasks" && <Tasks me={uid} />}
          <button className="btn btn-line mobile-only" style={{ marginTop: 20 }} onClick={out}>Log out</button>
        </main>
      </div>
    </div>
  );
}
