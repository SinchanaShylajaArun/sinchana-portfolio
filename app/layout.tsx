import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/data/resume";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from your own site.
// Each one is exposed as a CSS variable that globals.css uses.
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.intro,
};

// The layout wraps every page. {children} is replaced by the current page.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
