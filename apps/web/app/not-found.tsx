import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <h1>Page not found</h1>
      <p>This page may have moved. Let’s get you back on track.</p>
      <Link className="btn btn-blue" href="/">Back to home</Link>
    </main>
  );
}
