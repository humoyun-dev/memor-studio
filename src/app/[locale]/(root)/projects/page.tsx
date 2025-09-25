"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/lib/use-fetch";
import ProjectCard, {
  type ProjectType,
  type CategoryType,
} from "@/components/cards/project";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Page = () => {
  const { t } = useTranslation("projects");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: projects, isLoading } =
    useFetch<ProjectType[]>(`projects/list/`);
  const { safeData: categories } =
    useFetch<CategoryType[]>(`projects/category/`);

  const initialFilter = searchParams.get("filter") || "all";
  const [filter, setFilter] = useState<string>(initialFilter);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.replace(`?${params.toString()}`);
  }, [filter, router, searchParams]);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects?.filter((project) =>
          project.categories.some((cat) => cat.name === filter),
        );

  return (
    <div className="min-h-screen">
      <div className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              size="sm"
              className="uppercase whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105"
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
            >
              {t("filter.all")}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                className="uppercase whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105"
                variant={filter === cat.name ? "default" : "ghost"}
                onClick={() => setFilter(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8 sm:pb-12">
          {isLoading && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t("states.loading")}</p>
              </div>
            </div>
          )}
          {!isLoading && filteredProjects?.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-center text-muted-foreground">
                {t("states.no_projects")}
              </p>
            </div>
          )}
          {filteredProjects?.map((item) => (
            <div
              key={item.id}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            >
              <ProjectCard data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
