"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "./supabase";

export const naira = (k?: number | null) => (k == null ? "—" : "₦" + (Number(k) / 100).toLocaleString("en-NG"));
export const date = (d?: string | null) => (d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—");

export function useRows(load: () => PromiseLike<{ data: any; error?: any }>, deps: unknown[] = []) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState(false);
  const reload = useCallback(async () => {
    const { data, error } = await load();
    setError(!!error);
    setRows(data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { rows, reload, error };
}

export function Loading({ rows, error, empty }: { rows: any[] | null; error?: boolean; empty: string }) {
  if (error) return <p className="form-error" role="alert">We couldn’t load this. Please refresh the page.</p>;
  if (rows === null) return <p className="muted">Loading…</p>;
  if (rows.length === 0) return <div className="blank">{empty}</div>;
  return null;
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

export function Badge({ s }: { s: string }) {
  return <span className={`badge b-${s}`}>{s.replace(/_/g, " ")}</span>;
}

export function Thread({ cid, me }: { cid: string; me: string }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("messages").select("id, sender_id, body, created_at").eq("conversation_id", cid).order("created_at");
      setMsgs(data ?? []);
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [cid]);
  useEffect(() => { end.current?.scrollTo({ top: end.current.scrollHeight }); }, [msgs.length]);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body")).trim();
    if (!body) return;
    const { data, error } = await supabase.from("messages").insert({ conversation_id: cid, sender_id: me, body }).select("id, sender_id, body, created_at").single();
    if (!error && data) { setMsgs((m) => [...m, data]); form.reset(); }
  }

  return (
    <div className="thread">
      <div className="thread-log" ref={end} aria-live="polite">
        {msgs.length === 0 && <p className="muted">No messages yet. Say hello.</p>}
        {msgs.map((m) => <div key={m.id} className={m.sender_id === me ? "bubble mine" : "bubble"}>{m.body}</div>)}
      </div>
      <form onSubmit={send} className="thread-form"><input name="body" required maxLength={5000} placeholder="Type a message" aria-label="Message" /><button className="btn btn-blue">Send</button></form>
    </div>
  );
}

export function InstallApp() {
  const [evt, setEvt] = useState<any>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const h = (e: Event) => { e.preventDefault(); setEvt(e); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  if (evt) return <button className="install" onClick={async () => { await evt.prompt(); setEvt(null); }}>Install app</button>;
  if (ios) return (
    <>
      <button className="install" onClick={() => setShow(!show)}>Install app</button>
      {show && <p className="install-tip">In Safari, tap Share, then “Add to Home Screen”.</p>}
    </>
  );
  return null;
}
