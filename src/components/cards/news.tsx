"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { CategoryType } from "@/components/cards/project";

export interface NewsType {
  id: number;
  title: string;
  content: string;
  image: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  categories: CategoryType[];
}

interface NewsCardProps {
  data: NewsType;
  className?: string;
}

const NewsCard = ({ data, className }: NewsCardProps) => {
  const formattedDate = format(new Date(data.created_at), "MMM dd, yyyy");

  return (
    <Link
      href={`/news/${data.id}`}
      className={cn(
        "flex flex-col border overflow-hidden rounded-lg transition-all duration-300 group hover:shadow-lg",
        className,
      )}
      aria-label={`Read more about ${data.title}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={data.image || "/placeholder.svg"}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-xs sm:text-sm mb-2 text-muted-foreground">
            {formattedDate}
          </p>
          <h3 className="text-lg sm:text-xl font-bold transition-colors line-clamp-2">
            {data.title}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4">
          <span className="text-xs sm:text-sm font-medium text-primary">
            Read more
          </span>
          <MoveRight
            size={18}
            className="sm:w-5 sm:h-5 text-primary transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
