import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SocialSidebar from "@/components/bar";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;

  return (
    <>
      <Header lang={locale} />
      <SocialSidebar />
      <div className={`min-h-screen`}>{children}</div>
      <Footer lang={locale} />
    </>
  );
}
