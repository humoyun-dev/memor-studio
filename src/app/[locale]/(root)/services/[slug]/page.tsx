"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useFetch from "@/lib/use-fetch";

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();

  const { data: service, isLoading } = useFetch(`service/${slug}/`);

  if (isLoading)
    return <div className="p-10 text-center">{t("common.loading")}</div>;

  if (!service)
    return <div className="p-10 text-center">{t("common.noData")}</div>;

  const { title, banner, description, updated_at } = service;

  return (
    <main className="w-full min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
        {banner ? (
          <img
            src={banner}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
            {t("services.noBanner", "No Image Available")}
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Content */}
        <div className="absolute bottom-10 left-6 md:left-12 text-white max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-sm opacity-80">
            {t("services.lastUpdated", "Last updated")}:{" "}
            {new Date(updated_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto py-16 px-6 md:px-12">
        <article
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </section>
    </main>
  );
};

export default ServiceDetailPage;
