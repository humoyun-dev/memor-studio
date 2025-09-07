"use client";

import useFetch from "@/lib/use-fetch";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type PartnerType = {
  id: number;
  slug: string;
  name: string;
  type: string;
  url: string;
  logo_url: string | null;
};

export default function PartnersSection() {
  const { data, isLoading, isError } = useFetch<{
    results: PartnerType[];
    count: number;
  }>("partners/");

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-muted-foreground">Yuklanmoqda...</span>
        </div>
      </section>
    );
  }

  if (isError || !data?.results?.length) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
            Bizning Hamkorlarimiz
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Eng yaxshi materiallar va texnologiyalar uchun ishonchli hamkorlar
            bilan ishlashdan faxrlanamiz
          </p>
        </div>

        <div className="relative overflow-hidden animate-in fade-in duration-1000 delay-300">
          <div className="flex animate-scroll">
            {/* 1st Loop */}
            <div className="flex space-x-8 min-w-full">
              {data.results.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="bg-muted/50 rounded-lg p-6 w-48 h-20 flex items-center justify-center hover:bg-muted/70 hover:scale-105 transition-all duration-300 hover:shadow-lg flex-shrink-0">
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="object-contain max-h-12"
                      />
                    ) : (
                      <span className="font-bold text-lg text-foreground">
                        {partner.name}
                      </span>
                    )}
                  </Card>
                </a>
              ))}
            </div>

            {/* Duplicate Loop for seamless animation */}
            <div className="flex space-x-8 min-w-full">
              {data.results.map((partner) => (
                <a
                  key={`duplicate-${partner.id}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="bg-muted/50 rounded-lg p-6 w-48 h-20 flex items-center justify-center hover:bg-muted/70 hover:scale-105 transition-all duration-300 hover:shadow-lg flex-shrink-0">
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="object-contain max-h-12"
                      />
                    ) : (
                      <span className="font-bold text-lg text-foreground">
                        {partner.name}
                      </span>
                    )}
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
