"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, Star, Award, Users, Clock } from "lucide-react";
import TeamHero from "@/components/team";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Biz Haqimizda
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              25 yildan ortiq vaqt davomida biz Toshkentda eng ishonchli va
              professional qurilish kompaniyasi sifatida xizmat ko'rsatib
              kelmoqdamiz.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Bizning Hikoyamiz
              </h2>
              <p className="text-muted-foreground mb-6">
                1999 yilda tashkil etilgan Memor Studio kichik oilaviy biznes
                sifatida boshlangan va bugungi kunda O'zbekistondagi yetakchi
                qurilish kompaniyalaridan biriga aylangan. Bizning
                muvaffaqiyatimiz asosida mijozlarimizga sifatli xizmat
                ko'rsatish va har bir loyihani mukammallik bilan bajarish
                yotadi.
              </p>
              <p className="text-muted-foreground mb-6">
                Bizning tajribali jamoamiz zamonaviy texnologiyalar va an'anaviy
                hunarmandchilikni birlashtirgan holda, har bir loyihani noyob va
                mustahkam qilib quradi. Biz faqat qurilish emas, balki
                mijozlarimizning orzularini amalga oshiramiz.
              </p>
              <Button>
                <a href="/projects">Bizning Ishlarimiz</a>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <HardHat className="h-16 w-16 text-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Kompaniya Rasmi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bizning Yutuqlarimiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Raqamlar bizning professional faoliyatimiz va mijozlar ishonchini
              ko'rsatadi.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-background flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-foreground" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">
                200+
              </div>
              <div className="text-muted-foreground">Tugallangan Loyihalar</div>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-background flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-foreground" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">
                150+
              </div>
              <div className="text-muted-foreground">Mamnun Mijozlar</div>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-background flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">25+</div>
              <div className="text-muted-foreground">Yillik Tajriba</div>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-background flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-foreground" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">
                100%
              </div>
              <div className="text-muted-foreground">Sifat Kafolati</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bizning Jamoa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tajribali mutaxassislar jamoasi har bir loyihani professional
              darajada amalga oshiradi.
            </p>
          </div>

          <TeamHero />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bizning Qadriyatlarimiz
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Har bir loyihada biz ushbu asosiy tamoyillarga amal qilamiz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Sifat
              </h3>
              <p className="text-muted-foreground">
                Biz har doim eng yuqori sifat standartlariga amal qilamiz va
                faqat eng yaxshi materiallardan foydalanamiz.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Ishonch
              </h3>
              <p className="text-muted-foreground">
                Mijozlarimiz bilan ochiq va halol munosabatlar o'rnatish bizning
                asosiy tamoyilimizdir.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Innovatsiya
              </h3>
              <p className="text-muted-foreground">
                Zamonaviy texnologiyalar va yangi yechimlarni qo'llash orqali
                eng yaxshi natijalarni ta'minlaymiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Biz Bilan Ishlashga Tayyormisiz?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sizning loyihangizni professional jamoa bilan amalga oshiring.
            </p>
            <Button size="lg">
              <a href="/contact">Biz Bilan Bog'laning</a>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
