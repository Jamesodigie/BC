import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export type Audience = {
  photo: string; title: string; intro: string; cta: string; ctaHref: string;
  pill: string; heading: string; items: { t: string; d: string }[]; images?: string[];
  extra: React.ReactNode; closeTitle: string; closeText: string;
};

export function AudiencePage(a: Audience) {
  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-sub" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,.55)), url("${a.photo}")` }}>
          <div>
            <h1>{a.title}</h1>
            <p>{a.intro}</p>
            <Link className="btn btn-white" href={a.ctaHref}>{a.cta}</Link>
          </div>
        </section>
        <section className="section">
          <span className="pill">{a.pill}</span>
          <h2 style={{ marginTop: 30, maxWidth: 742 }}>{a.heading}</h2>
          <div className="cards">{a.items.map((i, n) => <article className="card" key={i.t}>{a.images?.[n] && <img className="icon ph" src={a.images[n]} alt="" />}<h3>{i.t}</h3><div>{i.d}</div></article>)}</div>
        </section>
        {a.extra}
        <section className="cta cta-photo">
          <div><h2 style={{ maxWidth: 615 }}>{a.closeTitle}</h2>
          <p>{a.closeText}</p>
          <Link className="btn btn-white" href={a.ctaHref}>{a.cta}</Link></div>
          <img className="ph" src={a.photo} alt="" />
        </section>
      </main>
      <Footer />
    </>
  );
}
