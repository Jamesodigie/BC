import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import "./dashboard.css";

export const metadata: Metadata = { title: "BC Admin", robots: { index: false, follow: false }, appleWebApp: { capable: true, title: "BC Admin" }, icons: { apple: "/icon-192.png" } };
export const viewport: Viewport = { themeColor: "#37657f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
