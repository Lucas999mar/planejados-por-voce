import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import ChatWidget from "@/components/chat/ChatWidget";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Planejados Por Você | Móveis Planejados Sob Medida e Assistência Técnica",
  description:
    "Transforme seus ambientes com móveis planejados sob medida. Assistência técnica especializada em ferragens, dobradiças e reparos. Orçamento grátis pelo WhatsApp!",
  keywords: [
    "móveis planejados",
    "móveis sob medida",
    "assistência técnica móveis",
    "cozinha planejada",
    "closet planejado",
    "reparo móveis",
    "dobradiça",
    "ferragens",
  ],
  openGraph: {
    title: "Planejados Por Você | Móveis Sob Medida",
    description: "Móveis planejados sob medida + assistência técnica. Orçamento grátis!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ChatWidget />
      </body>
    </html>
  );
}
