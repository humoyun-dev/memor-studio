"use client";

import useFetch from "@/lib/use-fetch";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

type NewsType = {
  id: number;
  slug: string;
  title: string;
  date: string;
  cover_url: string | null;
};

export default function NewsSection() {
  const { data, isLoading, isError } = useFetch<{
    results: NewsType[];
    count: number;
  }>("news/");

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30 text-center">
        <span className="text-muted-foreground">Yuklanmoqda...</span>
      </section>
    );
  }

  if (isError || !data?.results?.length) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
            So‘nggi Yangiliklar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Kompaniya faoliyati va qurilish sohasidagi eng so‘nggi yangiliklar
            bilan tanishing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {data.results.slice(0, 3).map((news, idx) => (
            <article
              key={news.id}
              className={`bg-background rounded-lg border p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:-translate-y-2 animate-in fade-in ${
                idx === 0
                  ? "slide-in-from-left-6 delay-200"
                  : idx === 1
                    ? "slide-in-from-bottom-6 delay-400"
                    : "slide-in-from-right-6 delay-600"
              } duration-700`}
            >
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(news.date).toLocaleDateString("uz-UZ", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 text-balance">
                {news.title}
              </h3>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-200 bg-transparent"
              >
                <Link href={`/news/${news.slug}`}>
                  Batafsil
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
          <Button
            asChild
            size="lg"
            className="px-10 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg group"
          >
            <Link href="/news">
              Barcha Yangiliklar
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
