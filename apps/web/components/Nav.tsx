import Link from "next/link";

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-links">
        <Link href="/" className="wordmark" style={{ padding: 0, marginRight: 27 }}>brand<br />collaborator</Link>
        <Link href="/why-bc">Why BC?</Link>
        <Link href="/brands">Solutions</Link>
        <Link href="/talent">Talent</Link>
        <Link href="/brands#pricing">Pricing</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
      <div className="nav-actions">
        <Link href="/sign-in" className="btn">Login</Link>
        <Link href="/sign-up" className="btn btn-white">Get Started</Link>
      </div>
    </header>
  );
}
