import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact Us | Brand Collaborator" };

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic = "" } = await searchParams;
  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-short"><div><h1>Contact Us</h1><p>Tell us what you need and we’ll send you a custom price.</p></div></section>
        <section className="section two" style={{ alignItems: "start" }}>
          <div>
            <h2>Let’s talk</h2>
            <p>Email us directly at <a className="link" href="mailto:contact.brandcollaborator@gmail.com">contact.brandcollaborator@gmail.com</a></p>
          </div>
          <ContactForm topic={topic.slice(0, 120)} />
        </section>
      </main>
      <Footer />
    </>
  );
}
