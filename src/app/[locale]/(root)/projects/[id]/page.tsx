"use client";
import useFetch from "@/lib/use-fetch";
import type { ProjectType } from "@/components/cards/project";
import { useParams } from "next/navigation";
import Image from "next/image";
import VideoCard from "@/components/video-card";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { t } = useTranslation("project_detail");
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetch<ProjectType>(`projects/detail/${id}/`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        {t("states.loading")}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <div className="relative h-[60vh] sm:h-[80vh] lg:h-screen w-full">
        <Image
          src={data.hero_image || "/placeholder.svg"}
          alt={data.title || t("states.no_image")}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 sm:bottom-8 lg:bottom-24 left-4 sm:left-8 lg:left-24 right-4 text-white">
          <h1 className="text-2xl sm:text-4xl lg:text-7xl font-extrabold leading-tight text-balance">
            {data.title}
          </h1>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-muted-foreground">
        <p className="mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base leading-relaxed text-pretty">
          {data.body}
        </p>

        <div className="grid gap-3 sm:gap-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-foreground min-w-[100px]">
              {t("fields.client")}:
            </strong>
            <span>{data.client || "—"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-foreground min-w-[100px]">
              {t("fields.location")}:
            </strong>
            <span>{data.location || "—"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-foreground min-w-[100px]">
              {t("fields.type")}:
            </strong>
            <span>{data.type || "—"}</span>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <strong className="text-foreground">{t("fields.features")}:</strong>
            <div className="pl-0 sm:pl-4">
              {data.features
                ? data.features.split("\n").map((f, i) => (
                    <div key={i} className="py-0.5 text-sm">
                      {f}
                    </div>
                  ))
                : "—"}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-foreground min-w-[100px]">
              {t("fields.status")}:
            </strong>
            <span>{data.status || "—"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-foreground min-w-[100px]">
              {t("fields.year")}:
            </strong>
            <span>{data.year ?? "—"}</span>
          </div>
        </div>
      </section>

      {data.images?.length > 0 && (
        <section className="px-4 sm:px-6 lg:max-w-[80%] mx-auto py-6 sm:py-8 lg:py-10">
          <div className="grid gap-4 sm:gap-6">
            {data.images.map((item, index) => (
              <div
                key={index}
                className="relative w-full aspect-[16/9] sm:aspect-[16/10] lg:aspect-[16/9]"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={`${data.title} ${index + 1}`}
                  fill
                  className="object-cover rounded-lg shadow-sm"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.videos?.length > 0 && (
        <section className="px-4 sm:px-6 lg:max-w-[80%] mx-auto py-6 sm:py-8 lg:py-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
            {t("videos.title")}
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.videos.map((item, index) => (
              <VideoCard key={index} data={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;
