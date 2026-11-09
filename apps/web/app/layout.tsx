import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Brand Collaborator",
  description: "Connecting creators, freelancers, and businesses for seamless collaboration",
  appleWebApp: { capable: true, title: "BC", statusBarStyle: "default" },
  icons: { apple: "/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#37657f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
