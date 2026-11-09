import Link from "next/link";
import { AudiencePage } from "@/components/AudiencePage";
import { photos } from "@/lib/photos";

const plans = [
  { t: "Instant Hiring", d: "Browse approved creators and freelancers and book them for a specific project." },
  { t: "Remote Hiring", d: "We assemble a remote team tailored to your project requirements." },
  { t: "Onsite Hiring", d: "We match you with vetted professionals who work from your location." },
];
const steps = [
  { t: "Sign Up", d: "Join our community and tell us about your brand." },
  { t: "Choose Talent", d: "Get access to our talented creators and freelancers and start collaborating today." },
  { t: "Hire Talent", d: "Confirm the project details, agree on terms, and begin collaboration." },
  { t: "Track Progress", d: "Track your project’s progress in real-time, and stay informed about milestones and deadlines." },
];

export default function Brands() {
  return (
    <AudiencePage
      photo={photos.brand}
      title="Elevate Your Brand with Top Talents and Creators"
      intro="Discover, hire, and seamlessly collaborate with top-tier creators and professional teams, perfectly tailored to meet your unique project and business requirements."
      cta="Hire Talent" ctaHref="/sign-up?role=brand"
      pill="Why Choose Us" heading="Why We’re the Perfect Choice for Your Brand"
      items={[
        { t: "Tailored Talent Solutions", d: "Access a curated network of creators and teams, handpicked to match your unique needs and drive your projects forward effortlessly." },
        { t: "Seamless Collaboration", d: "Simplify your workflow with powerful tools that ensure smooth communication, real-time updates, and a strong focus on delivering results." },
        { t: "Dedicated Support", d: "From onboarding to final delivery, enjoy premium assistance designed to make your hiring and collaboration experience hassle-free." },
      ]}
      closeTitle="Discover and Collaborate with Exceptional Talents."
      closeText="Access a vast pool of talents, and get started on your brand’s project today."
      extra={<>
        <section className="section">
          <span className="pill">How It Works</span>
          <h2 style={{ marginTop: 30, maxWidth: 1148 }}>Bringing Your Brand Vision to Life: Our Easy-to-Use Process.</h2>
          <div className="steps">{steps.map((s) => <article className="card" key={s.t}><h3>{s.t}</h3><div>{s.d}</div></article>)}</div>
        </section>
        <section className="section" id="pricing" style={{ background: "var(--blue-light)", textAlign: "center" }}>
          <span className="pill" style={{ background: "#fff" }}>Pricing</span>
          <h2 style={{ margin: "30px auto 0", maxWidth: 742 }}>Flexible Hiring Options to Suit Your Needs</h2>
          <div className="cards">
            {plans.map((p) => (
              <article className="card plan" key={p.t}>
                <h3>{p.t}</h3>
                <div className="price">Custom price</div>
                <div>{p.d}</div>
                <Link className="btn btn-blue" href={`/contact?topic=${encodeURIComponent(p.t + " pricing")}`}>Contact us for price</Link>
              </article>
            ))}
          </div>
        </section>
      </>}
    />
  );
}
