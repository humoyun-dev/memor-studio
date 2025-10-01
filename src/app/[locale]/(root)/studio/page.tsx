"use client";

import React from "react";
import useFetch from "@/lib/use-fetch";
import VideoCard from "@/components/video-card";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const StudioPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useFetch("studio/detail/");
  const router = useRouter();

  if (isLoading)
    return <div className="p-10 text-center">{t("common.loading")}</div>;
  if (!data)
    return <div className="p-10 text-center">{t("common.noData")}</div>;

  const { banner, content, videos, sections } = data;

  return (
    <main className="w-full min-h-screen bg-white text-gray-900">
      {/* Hero Banner */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <img
          src={banner}
          alt={t("studio.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-10 left-10 text-white max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            {t("studio.title", "Memor Design Studio")}
          </h1>
          <p className="text-lg leading-relaxed">
            {content || t("studio.noContent")}
          </p>
        </div>
      </section>

      {/* Sections */}
      {sections?.length > 0 && (
        <section className="w-full py-28 space-y-28">
          {sections.map((section: any, index: number) => (
            <div
              key={section.id}
              className={`flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } max-w-7xl mx-auto px-6 md:px-12`}
            >
              {/* Text */}
              <div className="flex-1">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">
                  {section.title}
                </h3>
                {/*<h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-snug">*/}
                {/*  {t("studio.sectionHeading", "Passionate About Design")}*/}
                {/*</h2>*/}
                <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
                  {section.body}
                </p>
                <button
                  onClick={() => router.push("/about")}
                  className="border border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300 px-6 py-2 rounded-sm text-sm uppercase tracking-wide"
                >
                  {t("studio.findOutMore", "Find Out More")}
                </button>
              </div>

              {/* Image */}
              <div className="flex-1">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-2xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Videos Section */}
      {videos?.length > 0 && (
        <section className="w-full py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              {t("studio.videosTitle", "Our Studio Videos")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {videos.map((video: any, index: number) => (
                <VideoCard
                  key={index}
                  data={{
                    video_url: video.youtube_video,
                    title: video.title,
                    id: video.id,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default StudioPage;
