"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ProjectType {
  id: number;
  title: string;
  hero_image: string;
  body: string;
  client: string;
  location: string;
  type: string;
  features: string;
  status: string;
  year: number;
  categories: CategoryType[];
  images: {
    id: number;
    image: string;
  }[];
  videos: {
    title: string;
    id: number;
    video_url: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CategoryType {
  id: number;
  name: string;
}

interface ProjectCardProps {
  data: ProjectType;
  className?: string;
}

const ProjectCard = ({ data, className }: ProjectCardProps) => {
  // Calculate optimized dimensions based on screen size
  const getOptimizedDimensions = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return { width: 600, height: 500 };
      if (window.innerWidth >= 768) return { width: 500, height: 400 };
      return { width: 400, height: 300 };
    }
    // Default server-side dimensions
    return { width: 500, height: 400 };
  };

  const { width, height } = getOptimizedDimensions();

  return (
    <Link
      href={`/projects/${data.id}`}
      className={cn(
        className,
        "relative w-full overflow-hidden group rounded-lg",
        "h-[300px] sm:h-[400px] lg:h-[500px]",
      )}
    >
      <Image
        src={data.hero_image || "/placeholder.svg"}
        alt={data.title || "Project image"}
        width={width}
        height={height}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
        sizes="(max-width: 640px) 400px, (max-width: 768px) 500px, (max-width: 1024px) 600px, 700px"
        quality={85}
      />

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white">
        <h3 className="text-base sm:text-lg font-medium pr-2 line-clamp-2">
          {data.title}
        </h3>
        <MoveRight className="size-5 sm:size-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0" />
      </div>
    </Link>
  );
};

export default ProjectCard;
