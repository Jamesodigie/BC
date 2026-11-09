import Link from "next/link";
import { AudiencePage } from "@/components/AudiencePage";
import { photos } from "@/lib/photos";

export default function Page() {
  return (
    <AudiencePage
      images={[photos.roleBrand, photos.roleCreator, photos.roleFreelancer]}
      photo={photos.freelancer}
      title="Turn Your Skills into Opportunities"
      intro="Join a dynamic platform that bridges the gap between skilled freelancers and top brands, helping you connect, collaborate, and grow your career effortlessly."
      cta="Get Started" ctaHref="/sign-up?role=freelancer"
      pill="Benefits" heading="Empowering Freelancers to Succeed"
      items={[
        { t: "Access to global brands", d: "Expand your reach and collaborate with top brands, unlocking exciting opportunities to showcase your expertise." },
        { t: "Flexible work opportunities", d: "Discover diverse and flexible work opportunities that empower you to choose projects that align with your skills and schedule." },
        { t: "Tools to grow your career", d: "Leverage powerful tools to enhance your skills, streamline projects, and build a thriving career." },
      ]}
      closeTitle="Ready to Elevate Your Freelance Career?"
      closeText="Connect with top brands, secure payments, and grow your business. Start today!"
      extra={
        <section className="section" id="pricing" style={{ background: "var(--blue-light)" }}>
          <span className="pill" style={{ background: "#fff" }}>Pricing</span>
          <h2 style={{ marginTop: 30 }}>Get Started for Just ₦5,000</h2>
          <div className="cards two-cards">
            <article className="card plan"><h3>One-time registration</h3><div className="price">₦5,000</div><div>Pay once to get reviewed and listed where brands can find and hire you.</div></article>
            <article className="card plan"><h3>Platform fee</h3><div className="price">20%</div><div>Brand Collaborator keeps 20% of each completed project. You receive the other 80%.</div></article>
          </div>
          <p style={{ marginTop: 24 }}>Questions? <Link className="link" href="/contact?topic=Talent%20pricing">Contact us</Link></p>
        </section>
      }
    />
  );
}
