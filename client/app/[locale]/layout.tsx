import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import TranslationProvider from "@/providers/traslations.provider";
import initTranslations from "@/i18n";
import { ThemeProvider } from "@/providers/theme.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ✅ font performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ SEO optimization
export const metadata: Metadata = {
  title: {
    default: "Memor Studio | Qurilish va Arxitektura",
    template: "%s | Memor Studio",
  },
  description:
    "Memor Studio qurilish, arxitektura va loyihalash sohasida zamonaviy yechimlarni taqdim etadi. Innovatsion loyihalar, sifatli xizmatlar va mukammal dizayn.",
  keywords: [
    "qurilish",
    "arxitektura",
    "loyiha",
    "dizayn",
    "Memor Studio",
    "toshkent",
    "uzbekistan",
  ],
  authors: [{ name: "Memor Studio", url: "https://memorstudio.uz" }],
  creator: "Memor Studio",
  publisher: "Memor Studio",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://memorstudio.uz",
    siteName: "Memor Studio",
    title: "Memor Studio | Qurilish va Arxitektura",
    description:
      "Memor Studio qurilish va arxitektura sohasidagi innovatsion loyihalari bilan mashhur.",
    images: [
      {
        url: "https://memorstudio.uz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memor Studio Office",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@memorstudio",
    creator: "@memorstudio",
    title: "Memor Studio | Qurilish va Arxitektura",
    description:
      "Qurilish, arxitektura va loyihalash bo‘yicha innovatsion yechimlar.",
    images: ["https://memorstudio.uz/og-image.jpg"],
  },
  alternates: {
    canonical: "https://memorstudio.uz",
    languages: {
      uz: "https://memorstudio.uz/uz",
      ru: "https://memorstudio.uz/ru",
      en: "https://memorstudio.uz/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Construction",
  metadataBase: new URL("https://memorstudio.uz"),
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const i18nNamespaces = ["layout"];

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider
          locale={locale}
          namespaces={i18nNamespaces}
          resources={resources}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
