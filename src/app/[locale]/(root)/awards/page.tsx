"use client";
import useFetch from "@/lib/use-fetch";
import { useTranslation } from "react-i18next";

export interface Award {
  id: number;
  year: number;
  project: string;
  award: string;
  organization: string;
  image: string | null;
}

export interface AwardsPageData {
  title: string;
  subtitle: string;
  hero_image: string | null;
  awards: Award[];
}

const AwardsPage = () => {
  const { t } = useTranslation("");
  const { safeData, isLoading, isError } = useFetch<AwardsPageData>(`awards/`);

  console.log(
    "[v0] Awards page - isLoading:",
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
    console.log("[v0] Awards page error:", isError);
    return (
      <div className="min-h-screen mt-[100px] bg-white flex items-center justify-center">
        <div className="text-red-600">
          {t("states.error") || "Error loading page"}
        </div>
      </div>
    );
  }

  if (!safeData || !safeData.awards || safeData.awards.length === 0) {
    console.log("[v0] Awards page - no data:", safeData);
    return (
      <div className="min-h-screen mt-[100px] bg-white flex items-center justify-center">
        <div className="text-gray-600">
          {t("states.not_found") || "No data found"}
        </div>
      </div>
    );
  }

  const { title, subtitle, hero_image, awards } = safeData;

  return (
    <div className="min-h-screen mt-[100px] bg-white">
      {/* Hero Banner Section */}
      <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        <img
          src={hero_image || "/placeholder-office.jpg"}
          alt="Awards"
          className="w-full h-full object-cover grayscale"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-default.jpg";
          }}
        />
      </section>

      {/* Awards Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mb-3 sm:mb-4">
              {t("section.achievements") || "Our Achievements"}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 sm:mb-8">
              {title || "Awards & Recognition"}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
              {subtitle || ""}
            </p>
          </div>

          {/* Awards - Mobile Cards, Desktop Table */}
          <div className="block md:hidden space-y-6">
            {/* Mobile Cards */}
            {awards &&
              awards.map((award) => (
                <div
                  key={award.id}
                  className="bg-white border border-gray-100 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {award?.image && (
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-md">
                          <img
                            src={award.image || "/placeholder.svg"}
                            alt={award?.project || "Project"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-project.jpg";
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {award?.year || ""}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {award?.project || ""}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-2">
                        {award?.award || ""}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {award?.organization || ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-600 text-sm uppercase tracking-wider">
                    {t("table.image") || "Image"}
                  </th>
                  <th className="text-left py-4 px-2 text-gray-600 text-sm uppercase tracking-wider">
                    {t("table.year") || "Year"}
                  </th>
                  <th className="text-left py-4 px-2 text-gray-600 text-sm uppercase tracking-wider">
                    {t("table.project") || "Project"}
                  </th>
                  <th className="text-left py-4 px-2 text-gray-600 text-sm uppercase tracking-wider">
                    {t("table.award") || "Award"}
                  </th>
                  <th className="text-left py-4 px-2 text-gray-600 text-sm uppercase tracking-wider">
                    {t("table.organization") || "Organization"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {awards &&
                  awards.map((award) => (
                    <tr
                      key={award.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-2">
                        {award?.image && (
                          <div className="w-20 h-20 overflow-hidden rounded-md">
                            <img
                              src={award.image || "/placeholder.svg"}
                              alt={award?.project || "Project"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-project.jpg";
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-2 text-gray-700">
                        {award?.year || ""}
                      </td>
                      <td className="py-4 px-2 text-gray-700">
                        {award?.project || ""}
                      </td>
                      <td className="py-4 px-2 text-gray-700">
                        {award?.award || ""}
                      </td>
                      <td className="py-4 px-2 text-gray-700">
                        {award?.organization || ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AwardsPage;
