"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, AlertCircle, RefreshCw } from "lucide-react";
import useFetch from "@/lib/use-fetch";
import type { AwardsType } from "@/lib/types";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

function AwardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="h-6 bg-muted rounded w-3/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </CardContent>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        Mukofotlarni yuklashda muammo yuz berdi. Iltimos, qayta urinib ko'ring.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="gap-2 bg-transparent"
      >
        <RefreshCw className="h-4 w-4" />
        Qayta yuklash
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Award className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Hozircha mukofotlar yo'q</h3>
      <p className="text-muted-foreground max-w-md">
        Memor Studio faoliyati davomida qo'lga kiritilgan mukofotlar bu yerda
        ko'rsatiladi.
      </p>
    </div>
  );
}

function AwardCard({ award }: { award: AwardsType }) {
  const formattedDate = useMemo(() => {
    return new Date(award.date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [award.date]);

  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/awards/${award.id}`)}
      className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
    >
      <CardHeader className="flex flex-row items-center space-x-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-balance leading-tight">
          {award.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tashkilot:</span>{" "}
            {award.organization}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Sana:</span>{" "}
            {formattedDate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const { data, isLoading, isError, mutate } = useFetch<{
    results: AwardsType[];
    count: number;
  }>(`awards/`);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Mukofotlar</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Memor Studio faoliyati davomida qo'lga kiritilgan yutuqlar va
              mukofotlar.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <AwardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <section className="py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Mukofotlar</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Memor Studio faoliyati davomida qo'lga kiritilgan yutuqlar va
              mukofotlar.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <ErrorState onRetry={() => mutate()} />
          </div>
        </section>
      </div>
    );
  }

  const awards = data?.results || [];
  const hasAwards = awards.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-balance">Mukofotlar</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Memor Studio faoliyati davomida qo'lga kiritilgan yutuqlar va
            mukofotlar.
          </p>
          {hasAwards && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <Award className="h-4 w-4" />
              <span>{data?.count} ta mukofot</span>
            </div>
          )}
        </div>
      </section>

      {/* Awards List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {hasAwards ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  );
}
