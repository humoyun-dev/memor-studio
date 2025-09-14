"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ruler, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import useFetch from "@/lib/use-fetch";
import { ProjectsType } from "@/lib/types";
import Loader from "@/components/loading";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useFetch<ProjectsType>(
    `projects/${slug}/`,
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load project details.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero + Gallery */}
      <section className="relative w-full">
        <div className="relative h-[70vh] w-full">
          <Image
            src={data.cover_url}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-10 left-6 z-10 max-w-2xl text-white">
            <Badge variant="secondary" className="mb-4">
              {data.category}
            </Badge>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl mb-4">
              {data.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{data.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{data.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>{data.area}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="mb-8 text-2xl font-bold text-foreground">
            Project Gallery
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.gallery?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className="group relative overflow-hidden rounded-xl shadow-md focus:outline-none"
              >
                <Image
                  src={img}
                  alt={`${data.title} image ${i + 1}`}
                  width={800}
                  height={600}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative overflow-hidden object-cover max-h-[90%] max-w-[90%]">
            <Image
              src={selectedImage}
              alt="Selected project image"
              width={1200}
              height={800}
              className="object-contain rounded-lg max-h-[90vh] max-w-[90%]"
            />
          </div>
        </div>
      )}

      {/* Content (Description + Sidebar) */}
      <main className="container mx-auto px-6 pb-20 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground">About</h2>
            <div
              className="prose prose-lg max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: data.description ?? "" }}
            />
          </section>
        </div>

        <aside className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6 text-lg font-semibold">Project Info</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>{data.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd>{data.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Year</dt>
                  <dd>{data.year}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Area</dt>
                  <dd>{data.area}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {data.tags?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.partners?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Partners</h3>
                <ul className="space-y-3">
                  {data.partners.map((partner) => (
                    <li
                      key={partner.id}
                      className="flex items-center justify-between"
                    >
                      <span>{partner.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Visit ${partner.name}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </main>
    </div>
  );
}
