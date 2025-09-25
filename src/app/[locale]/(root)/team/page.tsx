"use client";
import useFetch from "@/lib/use-fetch";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string | null;
}

export interface TeamPageData {
  team_info: {
    title: string;
    subtitle: string;
    description: string;
  };
  team: TeamMember[];
}

const OutTeamPage = () => {
  const { t } = useTranslation();
  const {
    data: safeData,
    isLoading,
    isError,
  } = useFetch<TeamPageData>(`team/`);

  if (isLoading) {
    return (
      <div className="min-h-screen mt-16 md:mt-[100px] bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-muted-foreground">
            {t("states.loading") || "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen mt-16 md:mt-[100px] bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-destructive">
            {t("states.error") || "Error loading team"}
          </div>
        </div>
      </div>
    );
  }

  if (!safeData || !safeData.team || safeData.team.length === 0) {
    return (
      <div className="min-h-screen mt-16 md:mt-[100px] bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-muted-foreground">
            {t("states.no_team") || "No team members found"}
          </div>
        </div>
      </div>
    );
  }

  const { team_info, team } = safeData;

  return (
    <div className="min-h-screen mt-16 md:mt-[100px] bg-background">
      <section className="relative py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-foreground mb-4 md:mb-6 leading-tight">
            {team_info.title}
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {team_info.subtitle}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[300px] aspect-[2/3] mb-4 md:mb-6 overflow-hidden rounded-lg shadow-sm">
                  <Image
                    src={member.image || "/placeholder-avatar.jpg"}
                    alt={member.name}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
                  />
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                  {member.name}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OutTeamPage;
