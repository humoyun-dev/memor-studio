"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/lib/use-fetch";
import { useTranslation } from "react-i18next";

export interface Statistic {
  value: string;
  description: string;
}

export interface CompanyInfo {
  title: string;
  subtitle: string;
  description: string;
  statistics: Statistic[];
}

export interface Leader {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string | null;
}

export interface AboutPageData {
  company_info: CompanyInfo;
  leaders: Leader[];
}

const Page = () => {
  const { t } = useTranslation("about");
  const { safeData, isLoading, isError } =
    useFetch<AboutPageData>(`info/page/`);

  console.log(
    "[v0] About page - isLoading:",
    isLoading,
    "error:",
    isError,
    "safeData:",
    safeData,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen mt-[100px] bg-white flex items-center justify-center">
        <div className="text-gray-600">
          {t("states.loading") || "Loading..."}
        </div>
      </div>
    );
  }

  if (isError) {
    console.log("[v0] About page error:", isError);
    return (
      <div className="min-h-screen mt-[100px] bg-white flex items-center justify-center">
        <div className="text-red-600">
          {t("states.error") || "Error loading page"}
        </div>
      </div>
    );
  }

  if (!safeData || !safeData.company_info) {
    console.log("[v0] About page - no data:", safeData);
    return (
      <div className="min-h-screen mt-[100px] bg-white flex items-center justify-center">
        <div className="text-gray-600">
          {t("states.not_found") || "No data found"}
        </div>
      </div>
    );
  }

  const { company_info, leaders } = safeData;

  return (
    <div className="min-h-screen mt-[100px] bg-white">
      {/* Banner Section */}
      <section className="relative bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-4xl">
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 bg-white/10 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm"
            >
              {t("banner.badge") || "About Us"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 sm:mb-8 leading-tight">
              {company_info?.title || "Our Company"}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl">
              {company_info?.subtitle || ""}
            </p>
          </div>
        </div>
      </section>

      {/* Company About Section */}
      <section className="py-16 sm:py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-5xl">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pb-6 sm:pb-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900">
                  {t("company.title") || "Our Story"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6 sm:space-y-8 text-gray-700">
                  <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                    {company_info?.description || ""}
                  </p>
                  {company_info?.statistics &&
                    company_info.statistics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
                        {company_info.statistics.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-2">
                              {stat?.value || ""}
                            </div>
                            <div className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider">
                              {stat?.description || ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leaders Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900">
              {t("leaders.title") || "Leadership Team"}
            </h2>
          </div>

          <div className="space-y-16 sm:space-y-20">
            {leaders &&
              leaders.length > 0 &&
              leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 sm:gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      <img
                        src={leader?.image || "/placeholder-avatar.jpg"}
                        alt={leader?.name || "Team member"}
                        className="w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-avatar.jpg";
                        }}
                      />
                      <div className="absolute inset-0 border border-gray-200 opacity-50 pointer-events-none rounded-sm"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="max-w-2xl mx-auto md:mx-0">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                        {leader?.name || ""}
                      </h3>
                      <h4 className="text-base sm:text-lg text-primary mb-4 sm:mb-6 font-medium">
                        {leader?.title || ""}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {leader?.bio || ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
