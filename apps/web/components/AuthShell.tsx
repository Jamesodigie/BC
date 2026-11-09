import Link from "next/link";
import { authPhotos } from "@/lib/photos";

const tints = ["#f2c94c", "#27ae60", "#eb5757", "#37657f", "#f2994a", "#9b51e0", "#2d9cdb", "#eb5757", "#27ae60"];

export function AuthShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="auth-split">
      <main className="auth">
        <Link href="/" className="wordmark" style={{ color: "var(--blue)" }}>brand<br />collaborator</Link>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </main>
      <aside className="collage" aria-hidden="true">
        <span className="shape dot yellow" /><span className="shape tri coral" /><span className="shape dot green" /><span className="shape tri purple" />
        <div className="collage-grid">
          {authPhotos.map((src, i) => (
            <div className="tile" key={src} style={{ background: tints[i] }}><img src={src} alt="" /></div>
          ))}
        </div>
      </aside>
    </div>
  );
}
