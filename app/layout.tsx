import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "يوم النظافة العام 2026 | هلة بغداد",
  description:
    "أكبر حدث مجتمعي سنوي على مستوى العراق - ماراثون، فعاليات بيئية، وأنشطة رياضية وثقافية في ساحة الاحتفالات الكبرى ببغداد",
  keywords: [
    "يوم النظافة",
    "هلة بغداد",
    "ماراثون بغداد",
    "العراق",
    "فعاليات بغداد",
    "البيئة",
    "النظافة",
    "أمانة بغداد",
  ],
  authors: [{ name: "هلة بغداد" }],
  openGraph: {
    title: "يوم النظافة العام 2026 | هلة بغداد",
    description:
      "أكبر حدث مجتمعي سنوي على مستوى العراق - ماراثون، فعاليات بيئية، وأنشطة رياضية وثقافية",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "يوم النظافة العام 2026 | هلة بغداد",
    description: "أكبر حدث مجتمعي سنوي على مستوى العراق",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d7a4e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body
        className={`${ibmPlexSansArabic.variable} ${ibmPlexSansArabic.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
