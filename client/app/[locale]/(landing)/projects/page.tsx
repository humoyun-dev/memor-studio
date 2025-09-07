"use client";

import React from "react";
import useFetch from "@/lib/use-fetch";
import { ProjectsType } from "@/lib/types";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import Loader from "@/components/loading";
import Link from "next/link";

const Page = () => {
  const { data, isLoading } = useFetch<{
    results: ProjectsType[];
    count: number;
  }>(`projects/`);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center mb-4">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Bizning Loyihalar
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Bizning sifat va batafsilliklarga e'tiborimizni ko'rsatadigan
              so'nggi qurilish loyihalarimizga nazar tashlang.
            </p>
          </div>
        </div>
      </section>
      <div className={`grid grid-cols-3 gap-4`}>
        {data?.results.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer w-full relative  flex items-center justify-center"
          >
            <Link href={`/projects/${item.slug}`} passHref>
              <DirectionAwareHover
                className={`!w-full`}
                imageUrl={item.cover_url}
              >
                <p className="font-bold text-xl">{item.title}</p>
                <p className="font-normal text-sm">
                  {item.location} - {item.year}
                </p>
              </DirectionAwareHover>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
