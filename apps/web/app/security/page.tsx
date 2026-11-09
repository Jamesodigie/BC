import { DocPage } from "@/components/DocPage";
export const metadata = { title: "Security | Brand Collaborator" };
export default function Page() {
  return <DocPage title="Security" intro="How we help protect your account and data." draft={false} sections={[
    { h: "Your data", p: ["Access rules limit private information to the account it belongs to and to authorised Brand Collaborator staff. Connections to the site are encrypted."] },
    { h: "Your account", p: ["Use a strong password that you don’t use anywhere else, and never share your login details. Our staff will never ask for your password."] },
    { h: "Reporting a problem", p: ["If you think your account or the platform has a security problem, email us straight away."] },
  ]} />;
}
