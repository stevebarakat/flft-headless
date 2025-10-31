import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Header } from "@/components/Header";
import { getMenu, getSiteInfo, getSocialLinks } from "@/lib/wp-data";
import "./globals.css";

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
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
    <html lang="en" className={lato.variable}>
      <body>
        <Header menu={menu} siteInfo={siteInfo} socialLinks={socialLinks} />
        <main>{children}</main>
      </body>
    </html>
  );
}
