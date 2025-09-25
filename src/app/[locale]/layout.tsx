import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import TranslationProvider from "@/components/providers/translate.provider";
import initTranslations from "../i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://memorstudio.uz"),
  title: {
    default: "Memor Studio – Architecture & Design",
    template: "%s | Memor Studio",
  },
  description:
    "Memor Studio – Toshkentdagi innovatsion arxitektura va dizayn studiyasi. Loyihalar, yangiliklar va jamoamiz bilan tanishing.",
  keywords: [
    "Memor Studio",
    "architecture Uzbekistan",
    "design studio Tashkent",
    "arxitektura studiyasi",
    "dizayn",
  ],
  authors: [{ name: "Memor Studio", url: "https://memorstudio.uz" }],
  creator: "Memor Studio",
  publisher: "Memor Studio",
  alternates: {
    canonical: "https://memorstudio.uz",
    languages: {
      uz: "https://memorstudio.uz/uz",
      ru: "https://memorstudio.uz/ru",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://memorstudio.uz",
    siteName: "Memor Studio",
    title: "Memor Studio – Architecture & Design",
    description:
      "Innovatsion arxitektura va dizayn loyihalari Toshkentdan. Memor Studio bilan ijodiy kelajakni quramiz.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memor Studio – Architecture & Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memor Studio – Architecture & Design",
    description:
      "Innovatsion arxitektura va dizayn loyihalari Toshkentdan. Memor Studio bilan ijodiy kelajakni quramiz.",
    images: ["/og-image.jpg"],
    creator: "@memorstudio",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  category: "architecture",
};

const i18nNamespaces = ["layout"];

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, i18nNamespaces);
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`antialiased`}>
        <TranslationProvider
          locale={locale}
          resources={resources}
          namespaces={i18nNamespaces}
        >
          <>{children}</>
        </TranslationProvider>
      </body>
    </html>
  );
}
