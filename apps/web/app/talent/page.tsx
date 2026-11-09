import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Talent | Brand Collaborator" };

export default async function Page() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await db.from("talent_profiles").select("user_id, display_name, avatar_url, headline, kind, location, rating, review_count").eq("approval", "approved").order("rating", { ascending: false }).limit(60);
  const talent = data ?? [];
  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-short"><div><h1>Find Talent</h1><p>Approved UGC creators and freelancers, ready to work with your brand.</p></div></section>
        <section className="section">
          {talent.length === 0 ? (
            <div className="empty"><h2>Our first talent are joining now</h2><p>Be among the first creators and freelancers brands can hire.</p><Link className="btn btn-blue" href="/get-started">Join Brand Collaborator</Link></div>
          ) : (
            <div className="cards">
              {talent.map((t) => (
                <article className="card" key={t.user_id}>
                  {t.avatar_url && <img className="icon ph" src={t.avatar_url} alt="" />}
                  <h3>{t.display_name}</h3>
                  <div>{t.kind === "creator" ? "UGC Creator" : "Freelancer"}{t.location ? ` · ${t.location}` : ""}</div>
                  {t.headline && <div>{t.headline}</div>}
                  {t.review_count > 0 && <div>★ {Number(t.rating).toFixed(1)} ({t.review_count})</div>}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
