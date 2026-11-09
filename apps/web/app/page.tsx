import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { photos } from "@/lib/photos";

const roles = [
  { t: "Sign Up as a Brand", d: "Connect with top talent to bring your projects to life. Discover skilled professionals who can turn your vision into reality and elevate your brand.", h: "/brands", img: photos.roleBrand },
  { t: "Join as a Creator", d: "Showcase your unique skills to attract exciting opportunities. Connect with brands looking for your expertise and elevate your career.", h: "/creators", img: photos.roleCreator },
  { t: "Join as a Freelancer", d: "Offer your expertise and collaborate with brands seeking your services. Join our platform to engage in projects that showcase your skills and expand your network.", h: "/freelancers", img: photos.roleFreelancer },
];
const stats = [["50+", "Global Reach"], ["2k+", "Skilled Tech Freelancers"], ["3k+", "UGC Creators"], ["80%", "Saved Capital"]];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="hero" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.5), rgba(0,0,0,.5)), url("${photos.hero}")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div>
            <h1>Create, Connect<br />and Collaborate.</h1>
            <p>Unlock opportunities for brand collaborations on our platform. Whether you’re a brand seeking talent or a creative looking for better prospects, Brand Collaborator connects you to success. Experience seamless partnerships and enhanced campaigns.</p>
            <div className="hero-actions">
              <Link className="btn btn-white" href="/get-started">Get Started</Link>
              <Link className="btn" href="/why-bc">Learn More ↗</Link>
            </div>
          </div>
          <div className="stats">{stats.map(([n, l], i) => <div key={l}>{(i === 1 || i === 2) && <div className="avatars">{photos.creators.map((src) => <img key={src} src={src} alt="" />)}</div>}<strong>{n}</strong>{l}</div>)}</div>
        </section>

        <section className="section two">
          <div>
            <span className="pill">About Us</span>
            <h2 style={{ marginTop: 30 }}>Where Brands and Talent Connect</h2>
            <p>Brand Collaborator bridges the gap between businesses and creative talent—content creators, influencers, and freelancers—by simplifying the hiring process. Our platform provides a centralized hub for seamless collaboration, managing transactions and payments to ensure smooth project completion. Additionally, we empower talent through partnerships with online schools, offering courses to help them upskill and stay competitive in the evolving digital landscape. With a focus on fostering meaningful collaborations, we drive impactful campaigns and shared success for both brands and talent.</p>
            <Link className="link" href="/why-bc">Learn More ↗</Link>
          </div>
          <img className="ph" style={{ height: 510 }} src={photos.about} alt="A woman with braids working on a laptop" />
        </section>

        <section className="section" id="solutions">
          <span className="pill">Solutions</span>
          <h2 style={{ marginTop: 30, maxWidth: 838 }}>Maximize Your Potential: Join Us as a Brand, Creator, or Freelancer</h2>
          <p style={{ maxWidth: 757 }}>Engage with our platform by signing up as a brand to connect with top talent, joining as a creator to showcase your skills, or becoming a freelancer to offer your expertise. Whatever your goals, we’re here to help you succeed.</p>
          <div className="cards">
            {roles.map((r) => (
              <article className="card" key={r.t}>
                <img className="icon ph" src={r.img} alt="" />
                <h3>{r.t}</h3>
                <div>{r.d}</div>
                <Link className="link" href={r.h}>Learn More ↗</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 style={{ textAlign: "center" }}>Top Content Creators</h2>
          <div className="creators">{photos.creators.map((src) => <img className="ph" key={src} src={src} alt="A content creator at work" />)}</div>
        </section>

        <section className="section">
          <span className="pill">How It Works</span>
          <h2 style={{ marginTop: 30, maxWidth: 662 }}>Discover How Our Platform Enhances Collaboration</h2>
          <div className="two" style={{ marginTop: 50 }}>
            <img className="ph" style={{ height: 628 }} src={photos.how} alt="A team collaborating around a table" />
            <div>
              <div className="step on"><h3>Register Your Brand</h3><p>Sign up today to connect with top creators and streamline your marketing efforts. Unlock new collaboration opportunities for your brand.</p></div>
              <div className="step"><h3>Browse and Hire Talent</h3><p>Explore a diverse pool of skilled creators and freelancers. Easily find the perfect match for your project needs to ensure a successful collaboration</p></div>
              <div className="step"><h3>Collaborate and Achieve Results</h3><p>Work closely with your chosen talent to bring your vision to life and drive meaningful outcomes. Experience seamless collaboration every step of the way.</p></div>
            </div>
          </div>
        </section>

        <section className="section two" id="faq">
          <div>
            <span className="pill">Simple. Fast. Secure.</span>
            <h2 style={{ margin: "20px 0 30px" }}>A whole world of talent at your fingertips</h2>
            <div className="faq on"><h3>The best for every budget</h3><p>Find quality services that fit any budget. With project-base pricing and no hourly rates, you get transparent, upfront costs every time.</p></div>
            <div className="faq"><h3>Quality work done quickly</h3></div>
            <div className="faq"><h3>Protected payments, every time</h3></div>
          </div>
          <img className="ph" style={{ height: 655 }} src={photos.talent} alt="A man working on a laptop at a table" />
        </section>

        <section className="cta cta-photo">
          <div><h2 style={{ maxWidth: 563 }}>Are You Ready to Transform Your Brand?</h2>
          <p>Start your journey with top creators and unlock new possibilities.</p>
          <Link className="btn btn-white" href="/get-started">Get Started</Link></div>
          <img className="ph" src={photos.brand} alt="" />
        </section>
      </main>
      <Footer />
    </>
  );
}
