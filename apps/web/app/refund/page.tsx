import { DocPage } from "@/components/DocPage";
export const metadata = { title: "Refund Policy | Brand Collaborator" };
export default function Page() {
  return <DocPage title="Refund Policy" intro="How to ask for a refund." sections={[
    { h: "Requesting a refund", p: ["Contact us with your account email, the payment details and the reason for your request. Our team reviews each request individually."] },
    { h: "Project disputes", p: ["If there is a problem with a paid project, raise a dispute from the project before it is closed. Our team will review the project and messages before reaching a decision."] },
  ]} />;
}
