import { Nav } from "./Nav";
import { Footer } from "./Footer";

export type Section = { h: string; p: string[] };

export function DocPage({ title, intro, draft = true, sections }: { title: string; intro: string; draft?: boolean; sections: Section[] }) {
  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-short"><div><h1>{title}</h1><p>{intro}</p></div></section>
        <section className="section doc">
          {draft && <p className="draft-note">Draft: this page is being finalised. Contact us if you have any questions.</p>}
          {sections.map((s) => <div key={s.h}><h3>{s.h}</h3>{s.p.map((t) => <p key={t}>{t}</p>)}</div>)}
          <p>Questions? Email <a className="link" href="mailto:contact.brandcollaborator@gmail.com">contact.brandcollaborator@gmail.com</a></p>
        </section>
      </main>
      <Footer />
    </>
  );
}
