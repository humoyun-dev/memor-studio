"use client";

import {
  Calendar,
  Award,
  Building2,
  Star,
  Medal,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import useFetch from "@/lib/use-fetch";
import { useMemo } from "react";
import { useParams } from "next/navigation";

interface AwardDetail {
  id: number;
  title: string;
  organization: string;
  nomination: string;
  place: string;
  score: string;
  date: string;
  description: string;
  projects: { id: number; slug: string; title: string }[];
}

function AwardDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Skeleton */}
      <section className="py-20 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Skeleton className="h-6 w-20 mx-auto" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-20 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              <Award className="h-4 w-4 mr-1" /> Mukofot
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Xatolik yuz berdi
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-4">
                <p>
                  Mukofot ma'lumotlarini yuklashda xatolik yuz berdi. Iltimos,
                  qayta urinib ko'ring.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={onRetry}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Qayta yuklash
                  </Button>
                  <Link href="/awards">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Orqaga
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-20 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              <Award className="h-4 w-4 mr-1" /> Mukofot
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Mukofot topilmadi
            </h1>
            <p className="text-muted-foreground text-lg">
              Siz qidirayotgan mukofot mavjud emas yoki o'chirilgan
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/awards">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Barcha mukofotlarga qaytish
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function AwardDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, mutate } = useFetch<AwardDetail>(
    `awards/${id}/`,
  );

  const formattedDate = useMemo(() => {
    if (!data?.date) return "";
    return new Date(data.date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [data?.date]);

  if (isLoading) {
    return <AwardDetailSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={() => mutate()} />;
  }

  if (!data) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <Link href="/awards">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Barcha mukofotlar
                </Button>
              </Link>
            </div>
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              <Award className="h-4 w-4 mr-1" /> Mukofot
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              {data.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {data.organization} tomonidan taqdim etilgan
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6">
                  <div dangerouslySetInnerHTML={{ __html: data.description }} />
                </CardContent>
              </Card>

              {data.projects && data.projects.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Bog'liq Loyihalar</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {data.projects.map((project) => (
                      <Card
                        key={project.id}
                        className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                      >
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2 text-balance">
                            {project.title}
                          </h3>
                          <Link href={`/projects/${project.slug}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                            >
                              Loyihani Ko'rish
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-8">
                    <div className="text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Bu mukofot bilan bog'liq loyihalar mavjud emas</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Medal className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">
                        Nominatsiya
                      </p>
                      <p className="font-medium text-pretty">
                        {data.nomination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Joy</p>
                      <p className="font-medium">{data.place}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Ball</p>
                      <p className="font-medium">{data.score}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">Sana</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
