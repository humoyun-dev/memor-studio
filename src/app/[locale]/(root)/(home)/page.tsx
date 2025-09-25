"use client";

import type React from "react";

import Carousel, { type CarouselItem } from "@/components/carousel";
import useFetch from "@/lib/use-fetch";
import VideoBanner, { type VideoBannerType } from "@/components/video-banner";
import ProjectCard, { type ProjectType } from "@/components/cards/project";
import NewsCard, { type NewsType } from "@/components/cards/news";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("");

  const { safeData: carousel, isLoading: carouselLoading } =
    useFetch<CarouselItem[]>(`banners/carousel/`);

  const { safeData: banners, isLoading: bannersLoading } = useFetch<
    VideoBannerType[]
  >(`banners/video-banners/`);

  return (
    <div className="space-y-12 md:space-y-20 lg:space-y-28">
      {carouselLoading ? <SectionLoader /> : <Carousel items={carousel} />}

      <AboutSection t={t} />

      {banners?.slice(0, 3).map((banner, index) => (
        <div key={banner.id} className="space-y-12 md:space-y-20 lg:space-y-28">
          <VideoBanner data={banner} />
          {index === 0 && (
            <FetchSection<ProjectType>
              title={t("projects.title")}
              viewAll={t("projects.view_all")}
              href="/projects"
              endpoint="projects/list/"
              Card={ProjectCard}
            />
          )}
          {index === 1 && (
            <FetchSection<NewsType>
              title={t("news.title")}
              viewAll={t("news.view_all")}
              href="/news"
              endpoint="news/list/"
              Card={NewsCard}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function AboutSection({ t }: { t: any }) {
  const paragraphs: string[] = t("about.description", { returnObjects: true });

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">
          {t("about.title")}
        </h2>
        <div className="space-y-3 md:space-y-4 text-muted-foreground text-base sm:text-lg">
          {paragraphs.map((text, i) => (
            <p key={i} className="leading-relaxed">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// Generic reusable section for Projects / News
function FetchSection<T>({
  title,
  viewAll,
  href,
  endpoint,
  Card,
}: {
  title: string;
  viewAll: string;
  href: string;
  endpoint: string;
  Card: React.ComponentType<{ data: T }>;
}) {
  const { safeData, isLoading } = useFetch<T[]>(endpoint);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 md:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
          {title}
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-primary mx-auto"></div>
      </div>

      {isLoading ? (
        <SectionLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 md:mb-12">
          {safeData?.slice(0, 6).map((item, index) => (
            <Card key={index} data={item} />
          ))}
        </div>
      )}

      <div className="text-center">
        <Link href={href}>
          <Button
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
          >
            {viewAll}
            <MoveRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-8 md:py-12">
      <div className="animate-spin h-8 w-8 md:h-10 md:w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}
