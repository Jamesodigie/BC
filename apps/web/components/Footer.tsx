"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export function Footer() {
  const [note, setNote] = useState("");

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email")).trim().toLowerCase();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && error.code !== "23505") return setNote("Something went wrong. Please try again.");
    form.reset();
    setNote("You're subscribed.");
  }

  return (
    <footer className="footer">
      <div className="news">
        <div style={{ maxWidth: 312 }}>
          <h3>Join our newsletter</h3>
          <p style={{ margin: "8px 0 0" }}>Get all the latest Brand Collaborator news delivered to your inbox.</p>
        </div>
        <div>
          <form onSubmit={subscribe}>
            <input name="email" type="email" required placeholder="Email address" aria-label="Email address" />
            <button className="btn btn-blue">Subscribe</button>
          </form>
          {note && <p role="status">{note}</p>}
        </div>
      </div>
      <div className="foot-grid">
        <div>
          <div className="wordmark" style={{ color: "var(--blue)" }}>brand<br />collaborator</div>
          <p>© 2026 BC. All rights reserved.</p>
          <p>Connecting creators, freelancers, and businesses for seamless collaboration</p>
        </div>
        <div><h4>Company</h4><Link href="/why-bc">Why BC?</Link><Link href="/talent">Talent</Link><Link href="/contact">Contact us</Link></div>
        <div><h4>Solutions</h4><Link href="/brands">For Brands</Link><Link href="/freelancers">For Freelancers</Link><Link href="/creators">For Creators</Link></div>
        <div><h4>Resources</h4><Link href="/#faq">FAQ</Link><Link href="/live-chat">Live Chat</Link><Link href="/brands#pricing">Pricing</Link></div>
      </div>
      <div className="legal"><Link href="/terms">Terms of Service</Link><Link href="/privacy">Privacy Policy</Link><Link href="/user-agreement">User Agreement</Link><Link href="/refund">Refund Policy</Link><Link href="/security">Security</Link></div>
      <p className="photo-credit">Photos from <a href="https://unsplash.com" rel="noreferrer">Unsplash</a></p>
    </footer>
  );
}
