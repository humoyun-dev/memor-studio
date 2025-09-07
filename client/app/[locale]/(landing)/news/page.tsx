"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Clock } from "lucide-react";
import useFetch from "@/lib/use-fetch";
import { NewsType } from "@/lib/types";
import Image from "next/image";

export default function Page() {
  const { data, isLoading, isError } = useFetch<{
    results: NewsType[];
    count: number;
  }>(`news/`);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground animate-pulse">
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">Xatolik yuz berdi.</p>
      </div>
    );
  }

  if (!data || data.count === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Hozircha yangiliklar yo‘q.
        </p>
      </div>
    );
  }

  const [featured, ...others] = data.results;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-8 text-sm font-medium">
              📰 So'nggi yangiliklar va tadbirlar
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Yangiliklar va
              <br />
              <span className="text-muted-foreground">Tadbirlar</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Memor Studio faoliyati, qurilish sohasidagi eng so'nggi
              yangiliklar va kompaniya tadbirlari haqida
              <strong className="text-foreground"> birinchi bo'lib</strong>{" "}
              xabardor bo'ling.
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Asosiy Yangilik
              </h2>
              <p className="text-lg text-muted-foreground">
                Eng muhim va so'nggi yangilik
              </p>
            </div>

            {featured && (
              <article className="bg-muted/30 rounded-lg overflow-hidden hover:shadow-lg transition-shadow mb-16">
                <div className="h-72 w-full relative">
                  {featured.cover_url ? (
                    <Image
                      src={featured.cover_url}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Rasm mavjud emas
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(featured.date).toLocaleDateString("uz-UZ", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>5 daqiqa o‘qish</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {featured.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.tags?.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild>
                    <a href={`/news/${featured.slug}`}>
                      To‘liq o‘qish
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </article>
            )}

            {/* Other News */}
            {others.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                  Boshqa Yangiliklar
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {others.map((news) => (
                    <article
                      key={news.id}
                      className="bg-muted/30 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 w-full relative">
                        {news.cover_url ? (
                          <Image
                            src={news.cover_url}
                            alt={news.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <div className="absolute inset-0 bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">
                              Rasm mavjud emas
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(news.date).toLocaleDateString("uz-UZ", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">
                          {news.title}
                        </h3>
                        <Button asChild variant="outline" size="sm">
                          <a href={`/news/${news.slug}`}>
                            Batafsil
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
