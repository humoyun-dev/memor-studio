import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Biz Bilan Bog'laning</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loyiha, xizmatlar yoki hamkorlik bo‘yicha murojaat qiling. Biz har
            doim ochiqmiz.
          </p>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 flex space-x-4">
              <Phone className="h-6 w-6 text-foreground shrink-0" />
              <div>
                <h3 className="font-semibold">Telefon</h3>
                <p className="text-muted-foreground">+998 90 135 01 02</p>
                <p className="text-muted-foreground">+998 99 222 22 33</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex space-x-4">
              <Mail className="h-6 w-6 text-foreground shrink-0" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">info@memorstudio.uz</p>
                <p className="text-muted-foreground">projects@memorstudio.uz</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex space-x-4">
              <MapPin className="h-6 w-6 text-foreground shrink-0" />
              <div>
                <h3 className="font-semibold">Manzil</h3>
                <p className="text-muted-foreground">
                  Toshkent shahar, Yunusobod
                </p>
                <p className="text-muted-foreground">
                  Amir Temur ko‘chasi, 108-uy
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex space-x-4">
              <Clock className="h-6 w-6 text-foreground shrink-0" />
              <div>
                <h3 className="font-semibold">Ish Vaqti</h3>
                <p className="text-muted-foreground">
                  Dushanba - Juma: 9:00 - 18:00
                </p>
                <p className="text-muted-foreground">Shanba: 9:00 - 15:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Map */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Joylashuv</h2>
          <div className="rounded-lg overflow-hidden shadow-lg h-[700px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2996.2670057717764!2d69.28258007605642!3d41.32480697130795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE5JzI5LjMiTiA2OcKwMTcnMDYuNiJF!5e0!3m2!1sen!2s!4v1757875892097!5m2!1sen!2s"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
