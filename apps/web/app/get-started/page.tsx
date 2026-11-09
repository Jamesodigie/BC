import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Get Started | Brand Collaborator" };
const options = [
  ["brand", "I’m a Brand", "Hire creators, freelancers and teams.", "role-brand"],
  ["creator", "I’m a UGC Creator", "Get paid to create content for brands.", "role-creator"],
  ["freelancer", "I’m a Freelancer", "Offer your skills and work with top brands.", "role-freelancer"],
];

export default function Page() {
  return (
    <AuthShell title="Get Started" intro="How would you like to use Brand Collaborator?">
      <div className="start-list">
        {options.map(([v, t, d, c]) => <Link key={v} className={`start ${c}`} href={`/sign-up?role=${v}`}><h3>{t}</h3><span>{d}</span></Link>)}
      </div>
      <p>Already have an account? <Link className="link" href="/sign-in">Sign in</Link></p>
    </AuthShell>
  );
}
