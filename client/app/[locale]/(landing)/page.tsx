import React from "react";
import { ArrowRight, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroCarousel from "@/components/hero-carousel";
import PartnersSection from "@/components/partnors";
import NewsSection from "@/components/newssection";

const Page = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Badge
                variant="secondary"
                className="mb-8 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700 delay-300"
              >
                🏆 200+ mulk egalarining ishonchi
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 text-balance leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
                Orzuingizdagi Loyihani
                <br />
                <span className="text-muted-foreground">
                  Professional Mahorat
                </span>
                <br />
                bilan Quring
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                Uy-joy ta'miridan tortib tijorat qurilishigacha, biz sifatli
                loyihalarni vaqtida va byudjet doirasida amalga oshiramiz.{" "}
                <strong className="text-foreground">25+ yillik</strong>{" "}
                mustahkam inshootlar qurish tajribasi.
              </p>

              <div className="mb-12 animate-in fade-in zoom-in-50 duration-1000 delay-1000">
                <HeroCarousel />
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1200">
                <Button
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Bepul Baholash Olish
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold bg-transparent border-2 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <a href="/projects">Ishlarimizni Ko'rish</a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-b border-muted">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-1400">
                <CheckCircle className="h-6 w-6 text-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-center sm:text-left">
                  Litsenziyali va Sug'urtalangan
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1500">
                <CheckCircle className="h-6 w-6 text-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-center sm:text-left">
                  5 yillik kafolat
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-1600">
                <CheckCircle className="h-6 w-6 text-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-center sm:text-left">
                  Bepul baholash
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />
      <NewsSection />
    </>
  );
};

export default Page;
