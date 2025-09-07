"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import useFetch from "@/lib/use-fetch";
import { NewsType } from "@/lib/types";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useFetch<NewsType>(`news/${slug}/`);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Xatolik yuz berdi yoki ma’lumot topilmadi.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cover Image */}
      <div className="relative h-[60vh] w-full">
        {data.cover_url ? (
          <Image
            src={data.cover_url}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Rasm mavjud emas</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(data.date).toLocaleDateString("uz-UZ", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.tags?.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <article className="prose prose-lg max-w-none text-muted-foreground">
          <div
            dangerouslySetInnerHTML={{
              __html: data.body,
            }}
          />
        </article>

        {/* Back Button */}
        <div className="mt-12">
          <Button asChild variant="outline">
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Barcha yangiliklarga qaytish
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
