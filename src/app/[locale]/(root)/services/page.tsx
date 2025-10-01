"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import useFetch from "@/lib/use-fetch";
import { motion, useAnimation } from "framer-motion";

const ServicesPage = () => {
  const { t } = useTranslation();
  const { data: services, isLoading } = useFetch("service/");
  const router = useRouter();
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // Loading state
  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-700 animate-pulse">
        {t("services.loading", "Loading...")}
      </div>
    );

  // No data fallback
  if (!services?.length)
    return (
      <div className="p-10 text-center text-gray-700">
        {t("services.noData", "No data available")}
      </div>
    );

  return (
    <main className="w-full min-h-screen bg-white text-gray-900">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center h-[60vh] text-center bg-gray-50"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white" />
        <div className="relative z-10 px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-wide mb-6 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t("services.title", "Our Services")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {t(
              "services.subtitle",
              "We offer a wide range of professional design and development services tailored to your needs.",
            )}
          </motion.p>
        </div>
      </motion.section>

      {/* Services List - Full-width Hero Cards */}
      <section className="w-full bg-gray-50">
        {services.map((service: any, index: number) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative w-full h-[70vh] md:h-[80vh] overflow-hidden flex items-center ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
            onClick={() => router.push(`/services/${service.slug}`)}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {service.banner ? (
                <img
                  src={service.banner}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {t("services.noBanner", "No Image Available")}
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {service.title}
              </h2>
              <div
                className="text-sm md:text-base mb-6 max-w-2xl opacity-90 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    service.description.length > 200
                      ? service.description.substring(0, 200) + "..."
                      : service.description,
                }}
              />
              <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
                {t("services.readMore", "Find Out More →")}
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Footer Info */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full py-8 text-center text-sm text-gray-500 border-t border-gray-200"
      >
        {t("services.lastUpdated", "Last updated")} —{" "}
        {new Date().toLocaleDateString()}
      </motion.footer>
    </main>
  );
};

export default ServicesPage;
