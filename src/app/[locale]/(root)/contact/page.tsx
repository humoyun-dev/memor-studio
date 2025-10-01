"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import useFetch from "@/lib/use-fetch";

const ContactPage = () => {
  const { t } = useTranslation("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const router = useRouter();

  const { data, isLoading } = useFetch(`partners/`);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}contact/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: "Memor Studio",
      content: ["Niyozbek Yoʻli koʻchasi, 2-A", "Tashkent, Uzbekistan"],
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: t("address.title"),
      content: ["41.324807, 69.285155"],
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      title: t("phone.title"),
      content: ["+998 99 222 22 33", "+998 90 135 01 02"],
      icon: <Phone className="h-5 w-5" />,
    },
  ];

  const emailInfo = [
    {
      title: t("email.general"),
      email: "memor.studio.works@gmail.com",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen mt-[60px] md:mt-[100px] bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column - Map & Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative w-full h-64 md:h-80">
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps?q=41.324807,69.285155&hl=en&z=15&output=embed"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm">
                  <h4 className="font-medium text-base flex items-center gap-2 mb-3">
                    <span className="text-primary">{info.icon}</span>
                    {info.title}
                  </h4>
                  {info.content.map((line, i) => (
                    <p key={i} className="text-gray-600 text-sm mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              ))}

              {emailInfo.map((info, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm">
                  <h4 className="font-medium text-base flex items-center gap-2 mb-3">
                    <span className="text-primary">{info.icon}</span>
                    {info.title}
                  </h4>
                  <a
                    href={`mailto:${info.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {info.email}
                  </a>
                </div>
              ))}

              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h4 className="font-medium text-base flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  {t("careers.title")}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {t("careers.description")}
                </p>
                <Button
                  onClick={() => router.push(`/careers`)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {t("careers.view")}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="bg-white shadow-lg rounded-xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {t("form.title")}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t("form.description")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        {t("form.name")}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder={t("form.placeholders.name")}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm">
                        {t("form.email")}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder={t("form.placeholders.email")}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm">
                        {t("form.subject")}
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={t("form.placeholders.subject")}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm">
                        {t("form.message")}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="mt-1"
                        placeholder={t("form.placeholders.message")}
                      />
                    </div>
                  </div>

                  {submitSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm">
                      <p>{t("form.success")}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-4"
                  >
                    {isSubmitting ? t("form.sending") : t("form.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Team Images */}
            {/*<div className="mt-8">*/}
            {/*  <h3 className="text-lg font-semibold mb-4">Bizning Jamoa</h3>*/}
            {/*  <div className="grid grid-cols-3 gap-2">*/}
            {/*    {[...Array(6)].map((_, index) => (*/}
            {/*      <div*/}
            {/*        key={index}*/}
            {/*        className="aspect-[3/4] rounded-lg overflow-hidden relative"*/}
            {/*      >*/}
            {/*        <Image*/}
            {/*          src={`/images/team${index + 1}.jpg`}*/}
            {/*          alt={`Team member ${index + 1}`}*/}
            {/*          fill*/}
            {/*          className="object-cover"*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t("partners.title", { defaultValue: "Bizning Hamkorlar" })}
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-600 py-4">
              {t("partners.loading", { defaultValue: "Yuklanmoqda..." })}
            </p>
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data.map((partner: any) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center"
                >
                  {partner.logo ? (
                    <div className="relative w-24 h-24 mb-3">
                      <Image
                        src={partner.logo}
                        alt={partner.nom}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
                      No Logo
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-center">
                    {partner.nom}
                  </h3>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      {partner.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              {t("partners.empty", {
                defaultValue: "Hozircha hamkorlar mavjud emas.",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
