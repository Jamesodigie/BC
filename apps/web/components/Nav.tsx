"use client";
import Link from "next/link";
import { useState } from "react";
import { InstallApp } from "@/lib/dash";

const links = [["/why-bc", "Why BC?"], ["/brands", "Brands"], ["/creators", "Creators"], ["/freelancers", "Freelancers"], ["/talent", "Talent"], ["/brands#pricing", "Pricing"], ["/contact", "Contact Us"]];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link href="/" className="wordmark">brand<br />collaborator</Link>
      <nav className="nav-links" aria-label="Main">{links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
      <div className="nav-actions">
        <Link href="/sign-in" className="btn nav-login">Login</Link>
        <Link href="/get-started" className="btn btn-white">Get Started</Link>
        <button className="burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <nav className="mobile-menu" aria-label="Mobile">
          {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
          <Link href="/sign-in" onClick={() => setOpen(false)}>Login</Link>
          <InstallApp />
        </nav>
      )}
    </header>
  );
}
