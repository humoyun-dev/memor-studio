import React from "react";
import initTranslations from "@/app/i18n";
import TranslationProvider from "@/components/providers/translate.provider";

const i18nNamespaces = ["home"];

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationProvider
      locale={locale}
      resources={resources}
      namespaces={i18nNamespaces}
    >
      {children}
    </TranslationProvider>
  );
};
export default Layout;
