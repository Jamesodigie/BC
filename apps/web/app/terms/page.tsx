import { DocPage } from "@/components/DocPage";
export const metadata = { title: "Terms and Conditions | Brand Collaborator" };
export default function Page() {
  return <DocPage title="Terms and Conditions" intro="The rules for using Brand Collaborator." sections={[
    { h: "Using the platform", p: ["Brand Collaborator connects brands with UGC creators and freelancers. By creating an account you agree to give accurate information and to keep your login details safe."] },
    { h: "Accounts", p: ["We may suspend accounts that break these terms, misuse the platform or harm other users."] },
    { h: "Fees", p: ["Creators and freelancers pay a one-time ₦5,000 registration fee. Brand Collaborator keeps 20% of each completed project. Brand hiring plans are priced individually after you contact us."] },
    { h: "Projects", p: ["Brands and talent agree the scope, timeline and price of each project on the platform. If a disagreement cannot be settled, either side can raise a dispute for our team to review."] },
    { h: "Content", p: ["You keep ownership of the content you upload, unless you agree otherwise with the other party on a project. You must have the right to share anything you upload."] },
  ]} />;
}
