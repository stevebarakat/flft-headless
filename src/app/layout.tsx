import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { getMenu, getSiteInfo, getSocialLinks } from "@/lib/wp-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fort Lauderdale Fishing Trips",
  description: "Premier fishing charters in Fort Lauderdale",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menu = await getMenu("Main");
  const siteInfo = await getSiteInfo("832");
  const socialLinks = await getSocialLinks();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header menu={menu} siteInfo={siteInfo} socialLinks={socialLinks} />
        <main>{children}</main>
      </body>
    </html>
  );
}
