"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Msg = { id: string; sender_id: string; body: string };

export default function Page() {
  const [state, setState] = useState<"loading" | "out" | "ready" | "err">("loading");
  const [me, setMe] = useState("");
  const [cid, setCid] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return setState("out");
      setMe(data.session.user.id);
      const { data: id, error } = await supabase.rpc("open_support_conversation");
      if (error || !id) return setState("err");
      setCid(id);
      const load = async () => {
        const { data: rows } = await supabase.from("messages").select("id, sender_id, body").eq("conversation_id", id).order("created_at");
        setMsgs(rows ?? []);
      };
      await load();
      setState("ready");
      timer = setInterval(load, 5000);
    })();
    return () => clearInterval(timer);
  }, []);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body")).trim();
    if (!body) return;
    const { data, error } = await supabase.from("messages").insert({ conversation_id: cid, sender_id: me, body }).select("id, sender_id, body").single();
    if (error) return setState("err");
    setMsgs((m) => [...m, data]);
    form.reset();
  }

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-short"><div><h1>Live Chat Support</h1><p>Message our team and we’ll reply here.</p></div></section>
        <section className="section">
          {state === "loading" && <p>Loading…</p>}
          {state === "out" && <div className="empty"><h2>Sign in to chat with us</h2><p>Or email <a className="link" href="mailto:contact.brandcollaborator@gmail.com">contact.brandcollaborator@gmail.com</a></p><Link className="btn btn-blue" href="/sign-in">Sign in</Link></div>}
          {state === "err" && <p className="form-error" role="alert">Chat isn’t available right now. Please email contact.brandcollaborator@gmail.com.</p>}
          {state === "ready" && (
            <div className="chat">
              <div className="chat-log" aria-live="polite">
                {msgs.length === 0 && <p>Send a message to start the conversation.</p>}
                {msgs.map((m) => <div key={m.id} className={m.sender_id === me ? "bubble mine" : "bubble"}>{m.body}</div>)}
              </div>
              <form onSubmit={send} className="chat-form"><input name="body" required maxLength={5000} placeholder="Type your message" aria-label="Message" /><button className="btn btn-blue">Send</button></form>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
