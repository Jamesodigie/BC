import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { photos } from "@/lib/photos";

export const metadata = { title: "Why Brand Collaborator" };
const reasons = [
  ["One place to hire", "Find creators, freelancers and full teams without juggling agencies and DMs.", photos.roleBrand],
  ["Clear project tracking", "Follow every project from brief to delivery, with milestones and messages together.", photos.roleCreator],
  ["Support when you need it", "Our team steps in to help with onboarding, questions and disputes.", photos.roleFreelancer],
];

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-sub" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), rgba(0,0,0,.55)), url("${photos.how}")` }}>
          <div><h1>Why Brand Collaborator?</h1><p>We bridge the gap between businesses and creative talent by simplifying the hiring process, so great work gets done with less stress on both sides.</p><Link className="btn btn-white" href="/get-started">Get Started</Link></div>
        </section>
        <section className="section">
          <span className="pill">Why Us</span>
          <h2 style={{ marginTop: 30 }}>Built for brands and talent</h2>
          <div className="cards">{reasons.map(([t, d, i]) => <article className="card" key={t}><img className="icon ph" src={i} alt="" /><h3>{t}</h3><div>{d}</div></article>)}</div>
        </section>
        <section className="section two">
          <div><span className="pill">Growth</span><h2 style={{ marginTop: 30 }}>Helping talent keep growing</h2><p>Through partnerships with online schools, we help creators and freelancers build skills and stay competitive in the evolving digital landscape.</p><Link className="link" href="/freelancers">Join as talent ↗</Link></div>
          <img className="ph" style={{ height: 500 }} src={photos.about} alt="A woman with braids working on a laptop" />
        </section>
      </main>
      <Footer />
    </>
  );
}
