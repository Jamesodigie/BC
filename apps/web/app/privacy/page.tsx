import { DocPage } from "@/components/DocPage";
export const metadata = { title: "Privacy Policy | Brand Collaborator" };
export default function Page() {
  return <DocPage title="Privacy Policy" intro="What we collect and how we use it." sections={[
    { h: "What we collect", p: ["Your name, email address, phone number, profile and portfolio details, project information, messages sent on the platform, and records of payments."] },
    { h: "How we use it", p: ["To run your account, match brands with talent, process payments, provide support, and keep the platform safe."] },
    { h: "Who can see it", p: ["Approved talent profiles are public so brands can find them. Your email, phone number and payment records are not shown publicly. We share data with service providers that help us run the platform, such as hosting and payment providers."] },
    { h: "Your choices", p: ["You can update your profile at any time, and contact us to ask for a copy of your data or for your account to be deleted."] },
  ]} />;
}
