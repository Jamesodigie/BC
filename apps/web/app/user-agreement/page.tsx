import { DocPage } from "@/components/DocPage";
export const metadata = { title: "User Agreement | Brand Collaborator" };
export default function Page() {
  return <DocPage title="User Agreement" intro="What we expect from everyone on Brand Collaborator." sections={[
    { h: "Brands", p: ["Give clear project briefs, communicate respectfully, and pay for work through the platform."] },
    { h: "Creators and freelancers", p: ["Represent your skills honestly, deliver the agreed work on time, and keep brand information confidential."] },
    { h: "Staying on the platform", p: ["Keep project payments and communication on Brand Collaborator so that both sides are protected if something goes wrong."] },
    { h: "Conduct", p: ["Harassment, fraud, fake reviews and copyright infringement are not allowed and may lead to account suspension."] },
  ]} />;
}
