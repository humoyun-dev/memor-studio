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

const ContactPage = () => {
  const { t } = useTranslation("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const router = useRouter();

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
    <div className="min-h-screen mt-[60px] md:mt-[100px] bg-background">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Map */}
          <div className="md:col-span-1 order-1 md:order-1">
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps?q=41.324807,69.285155&hl=en&z=15&output=embed"
                loading="lazy"
              ></iframe>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-base md:text-lg mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                {t("office.title")}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {t("office.description")}
              </p>
            </div>
          </div>

          {/* Middle Column - Contact Information */}
          <div className="md:col-span-1 order-2 md:order-2">
            <Card className="border-none shadow-none">
              <CardHeader className="px-0 pt-0 pb-4 md:pb-6">
                <CardTitle className="text-xl md:text-2xl font-bold">
                  {t("contact.title")}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {t("contact.description")}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-sm md:text-base flex items-center gap-2">
                        <span className="flex-shrink-0">{info.icon}</span>
                        {info.title}
                      </h4>
                      {info.content.map((line, i) => (
                        <p
                          key={i}
                          className="text-xs md:text-sm text-muted-foreground pl-7"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4 md:space-y-6">
                  {emailInfo.map((info, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-sm md:text-base flex items-center gap-2">
                        <span className="flex-shrink-0">{info.icon}</span>
                        {info.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground pl-7 break-all">
                        {info.email}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm md:text-base flex items-center gap-2">
                    <User className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                    {t("careers.title")}
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground pl-7">
                    {t("careers.description")}
                  </p>
                  <Button
                    onClick={() => router.push(`/careers`)}
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-7 text-xs md:text-sm"
                  >
                    {t("careers.view")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Team Photos */}
          <div className="md:col-span-2 lg:col-span-1 order-3 md:order-3">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 md:gap-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] overflow-hidden rounded-lg relative"
                >
                  <Image
                    src={`/images/team${index + 1}.jpg`}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 md:mt-16 max-w-2xl mx-auto">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4 md:pb-6">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
                {t("form.title")}
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                {t("form.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <User className="h-3 w-3 md:h-4 md:w-4" />
                      {t("form.name")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={t("form.placeholders.name")}
                      className="py-3 md:py-5 text-sm md:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm md:text-base"
                    >
                      <Mail className="h-3 w-3 md:h-4 md:w-4" />
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
                      className="py-3 md:py-5 text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                    {t("form.subject")}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t("form.placeholders.subject")}
                    className="py-3 md:py-5 text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                    {t("form.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                    placeholder={t("form.placeholders.message")}
                  />
                </div>

                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm">{t("form.success")}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 md:py-6 text-sm md:text-base"
                >
                  {isSubmitting ? t("form.sending") : t("form.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
