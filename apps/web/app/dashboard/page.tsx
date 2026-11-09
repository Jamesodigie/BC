"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { InstallApp } from "@/lib/dash";
import { Alerts, BrandHome, CreatorHome, Earnings, FindCreators, FindFreelancers, FreelancerHome, HireTeam, Jobs, Messages, Payments, Pricing, Profile, Projects, Services, Settings, Videos } from "./views";

const tabSets: Record<string, string[][]> = {
  brand: [["home", "Overview"], ["creators", "UGC Creators"], ["freelancers", "Freelancers"], ["projects", "My Bookings"], ["payments", "Payments"], ["team", "Hire a Team"], ["messages", "Messages"], ["alerts", "Alerts"], ["settings", "Settings"]],
  creator: [["home", "Overview"], ["jobs", "Bookings"], ["videos", "My Videos"], ["pricing", "Price & Availability"], ["earnings", "Earnings"], ["messages", "Messages"], ["alerts", "Alerts"], ["settings", "Settings"]],
  freelancer: [["home", "Overview"], ["jobs", "Bookings"], ["profile", "Role & Experience"], ["services", "Services"], ["earnings", "Earnings"], ["messages", "Messages"], ["alerts", "Alerts"], ["settings", "Settings"]],
};

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [tab, setTab] = useState("home");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { window.location.replace("/sign-in"); return; }
      const { data: p, error } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single();
      if (error || !p) { setFailed(true); return; }
      setMe(p);
    })();
  }, []);

  if (failed) return <main className="nf"><h1>We couldn’t load your account</h1><p>Please refresh, or contact us if this continues.</p></main>;
  if (!me) return <main className="nf"><p>Loading your dashboard…</p></main>;
  if (me.status === "suspended") return <main className="nf"><h1>Account suspended</h1><p>Please contact contact.brandcollaborator@gmail.com.</p></main>;

  const isBrand = me.role === "brand";
  const tabs = tabSets[me.role];
  const roleLabel = isBrand ? "Brand" : me.role === "creator" ? "UGC Creator" : "Freelancer";
  const out = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  return (
    <div className="dash">
      <aside className="dash-side">
        <Link href="/" className="wordmark">brand<br />collaborator</Link>
        <nav aria-label="Dashboard">
          {tabs.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>{l}</button>)}
        </nav>
        <div className="side-foot"><InstallApp /><button className="logout" onClick={out}>Log out</button></div>
      </aside>
      <div className="dash-main">
        <header className="dash-top">
          <div><h1>{tabs.find(([k]) => k === tab)?.[1]}</h1><p className="muted">{me.full_name || me.email} · {roleLabel}</p></div>
        </header>
        <main>
          {tab === "home" && (isBrand ? <BrandHome me={me} go={setTab} /> : me.role === "creator" ? <CreatorHome me={me} go={setTab} /> : <FreelancerHome me={me} go={setTab} />)}
          {tab === "creators" && <FindCreators me={me} />}
          {tab === "freelancers" && <FindFreelancers me={me} />}
          {tab === "payments" && <Payments me={me} />}
          {tab === "videos" && <Videos me={me} />}
          {tab === "pricing" && <Pricing me={me} />}
          {tab === "projects" && <Projects me={me} />}
          {tab === "team" && <HireTeam me={me} />}
          {tab === "jobs" && <Jobs me={me} />}
          {tab === "profile" && <Profile me={me} />}
          {tab === "services" && <Services me={me} />}
          {tab === "earnings" && <Earnings me={me} />}
          {tab === "messages" && <Messages me={me} />}
          {tab === "alerts" && <Alerts me={me} />}
          {tab === "settings" && <Settings me={me} onSaved={setMe} onLogout={out} />}
        </main>
      </div>
    </div>
  );
}
