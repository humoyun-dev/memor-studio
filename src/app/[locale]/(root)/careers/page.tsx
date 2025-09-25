"use client";

import type React from "react";
import { useState } from "react";
import useFetch from "@/lib/use-fetch";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  BuildingIcon,
  MapPinIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Types
interface JobType {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  posted_date: string;
  is_remote: boolean;
}

interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  cover_letter: string;
  resume: File | null;
}

const CareersPage = () => {
  const { t } = useTranslation();

  const {
    data: jobs,
    isLoading,
    isError,
  } = useFetch<JobType[]>("careers/jobs/");

  const [activeJob, setActiveJob] = useState<JobType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    cover_letter: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "resume") {
          formDataToSend.append(key, value);
        }
      });
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}careers/apply/`,
        {
          method: "POST",
          body: formDataToSend,
        },
      );

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          cover_letter: "",
          resume: null,
        });
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitError(
          t("form.errors.failed") || "Failed to submit application",
        );
      }
    } catch (error) {
      setSubmitError(t("form.errors.general") || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open application form for a specific job
  const openApplicationForm = (job: JobType) => {
    setActiveJob(job);
    setFormData((prev) => ({ ...prev, position: job.title }));
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {t("states.loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            {t("states.error") || "Error"}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t("states.try_again") || "Please try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 md:mt-[100px] bg-background">
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            {t("hero.title") || "Join Our Team"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {t("hero.subtitle") || "Discover exciting career opportunities"}
          </p>
        </div>

        <section className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">
            {t("positions.title") || "Open Positions"}
          </h2>

          {jobs && jobs.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4">
                      <div>
                        <CardTitle className="text-lg md:text-xl mb-3">
                          {job.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 text-xs"
                          >
                            <BuildingIcon className="h-3 w-3" />
                            {job.department}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 text-xs"
                          >
                            <MapPinIcon className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 text-xs"
                          >
                            <ClockIcon className="h-3 w-3" />
                            {job.type}
                          </Badge>
                          {job.is_remote && (
                            <Badge className="text-xs">
                              {t("positions.remote") || "Remote"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => openApplicationForm(job)}
                        className="w-full sm:w-auto sm:self-start"
                      >
                        {t("positions.apply") || "Apply Now"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {t("positions.posted") || "Posted"}{" "}
                        {format(new Date(job.posted_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8 md:py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t("positions.none") || "No open positions"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto"
                >
                  {t("positions.send_inquiry") || "Send Inquiry"}
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                {t("contact.title") || "Contact Us"}
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                {t("contact.description") ||
                  "Have questions? Get in touch with us."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-3 text-sm md:text-base">
                  {t("contact.message") || "Send Message"}
                </h3>
                <Button onClick={() => setIsFormOpen(true)} className="w-full">
                  {t("contact.submit_inquiry") || "Submit Inquiry"}
                </Button>
              </div>
              <div>
                <h3 className="font-medium mb-3 text-sm md:text-base">
                  {t("contact.direct") || "Direct Contact"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">careers@company.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">
                  {activeJob
                    ? t("form.apply_for", { title: activeJob.title }) ||
                      `Apply for ${activeJob.title}`
                    : t("form.general_inquiry") || "General Inquiry"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsFormOpen(false);
                    setSubmitSuccess(false);
                    setSubmitError("");
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("form.success.title") || "Application Sent!"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("form.success.message") || "We'll get back to you soon."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">
                      {t("form.name") || "Name"}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="text-base" // Prevents zoom on iOS
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      {t("form.email") || "Email"}
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">
                      {t("form.phone") || "Phone"}
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm">
                      {t("form.position") || "Position"}
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      readOnly={!!activeJob}
                      className={`text-base ${activeJob ? "bg-muted" : ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm">
                      {t("form.experience") || "Experience"}
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        handleSelectChange("experience", value)
                      }
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue
                          placeholder={
                            t("form.experience_placeholder") ||
                            "Select experience"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">
                          {t("form.experience_levels.0_1") || "0-1 years"}
                        </SelectItem>
                        <SelectItem value="2-3">
                          {t("form.experience_levels.2_3") || "2-3 years"}
                        </SelectItem>
                        <SelectItem value="4-5">
                          {t("form.experience_levels.4_5") || "4-5 years"}
                        </SelectItem>
                        <SelectItem value="5+">
                          {t("form.experience_levels.5_plus") || "5+ years"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_letter" className="text-sm">
                      {t("form.cover_letter") || "Cover Letter"}
                    </Label>
                    <Textarea
                      id="cover_letter"
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={
                        t("form.cover_letter_placeholder") ||
                        "Tell us about yourself..."
                      }
                      className="text-base resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">
                      {t("form.resume") || "Resume"}
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-2 pb-2">
                          <UploadIcon className="w-6 h-6 mb-2 text-muted-foreground" />
                          <p className="text-xs md:text-sm text-muted-foreground text-center px-2">
                            <span className="font-semibold">
                              {t("form.upload_click") || "Click to upload"}
                            </span>{" "}
                            {t("form.upload_drag") || "or drag and drop"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("form.upload_formats") || "PDF, DOC, DOCX"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                    {formData.resume && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {t("form.selected") || "Selected"}:{" "}
                        {formData.resume.name}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div className="text-destructive text-sm py-2 bg-destructive/10 px-3 rounded">
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsFormOpen(false);
                        setSubmitSuccess(false);
                        setSubmitError("");
                      }}
                      className="w-full sm:w-auto"
                    >
                      {t("form.cancel") || "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting
                        ? t("form.submitting") || "Submitting..."
                        : t("form.submit") || "Submit"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
