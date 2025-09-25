"use client";
import useFetch from "@/lib/use-fetch";
import type { NewsType } from "@/components/cards/news";
import { useParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const NewsDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetch<NewsType>(`news/detail/${id}/`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          {t("states.loading") || "Loading..."}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formattedDate = format(new Date(data.created_at), "MMMM dd, yyyy");
  const readingTime = Math.ceil(data.content.split(" ").length / 200);

  const processedContent = data.content.replace(
    /src="\/media\//g,
    'src="http://localhost:8000/media/',
  );

  return (
    <div className="min-h-screen mt-16 md:mt-[100px] bg-background">
      <main>
        <div className="relative h-[50vh] md:h-[70vh] w-full">
          <Image
            src={data.image || "/placeholder.svg"}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-12">
            <div className="container mx-auto">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs md:text-sm font-medium rounded-full mb-3 md:mb-4">
                {t("detail.label") || "News"}
              </span>
              <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">
                {data.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 md:mt-4 text-white/90 text-sm md:text-base">
                <time dateTime={data.created_at}>{formattedDate}</time>
                <span>
                  {readingTime} {t("detail.reading_time") || "min read"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <div
            className="prose prose-sm md:prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-sm
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:border"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </section>
      </main>
    </div>
  );
};

export default NewsDetailPage;
