"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { siteData } from "@/lib/data/navigations";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { t } from "@/lib/utils";

// Service menu item interface
interface ServiceMenuItem {
  label: any; // LocalizedString
  href: string;
  children?: ServiceMenuItem[];
}

const mockCategories = [
  { id: 1, name: "architecture" },
  { id: 2, name: "interior design" },
  { id: 3, name: "landscape" },
  { id: 4, name: "urban planning" },
];

const Footer: FC<{ lang?: string }> = ({ lang = "uz" }) => {
  const categories = mockCategories;

  return (
    <footer className="w-full text-muted-foreground bg-background px-4 md:px-8 py-8 md:py-12 text-sm">
      <div className="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {/* Company Info */}
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <Image
            src={siteData.footer.logo || "/placeholder.svg"}
            alt="Company Logo"
            width={120}
            height={120}
            className="object-contain w-24 md:w-32 lg:w-36"
          />
          <div className="text-xs md:text-sm">
            {siteData.footer.address.map((line, idx) => (
              <p key={`${idx}-${t(line, lang)}`}>{t(line, lang)}</p>
            ))}
          </div>
          <div className="text-xs md:text-sm">
            <div className="grid gap-1 md:gap-2">
              <a
                href={`tel:${siteData.footer.phone}`}
                className="hover:text-primary transition-colors"
              >
                {siteData.footer.phone}
              </a>
              <a
                href={`tel:${siteData.footer.phone2}`}
                className="hover:text-primary transition-colors"
              >
                {siteData.footer.phone2}
              </a>
            </div>
            <a
              href={`mailto:${siteData.footer.email}`}
              className="hover:underline hover:text-primary transition-colors mt-2 block"
            >
              {siteData.footer.email}
            </a>
          </div>
          <p className="text-xs">{t(siteData.footer.copyright, lang)}</p>
        </div>

        {/* Empty column for spacing on larger screens */}
        <div className="hidden lg:block"></div>

        {/* Static Sections */}
        {siteData.footer.sections.map((section, idx) => (
          <div key={`${idx}-${t(section.title, lang)}`} className="space-y-3">
            <h3 className="font-bold text-sm md:text-base">
              {t(section.title, lang)}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:underline hover:text-primary transition-colors text-xs md:text-sm"
                  >
                    {t(link.label, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Projects Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm md:text-base">PROJECTS</h3>
          <ul className="space-y-2">
            {categories?.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/projects?filter=${link.name}`}
                  className="hover:underline capitalize hover:text-primary transition-colors text-xs md:text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="mx-auto mt-6 md:mt-8 flex text-lg md:text-xl justify-center md:justify-end space-x-4 md:space-x-6">
        {siteData.footer.social.map((s) => {
          const label = t(s.label, lang).toLowerCase();

          if (label === "facebook")
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaFacebookF />
              </a>
            );
          if (label === "linkedin")
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedinIn />
              </a>
            );
          if (label === "instagram")
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaInstagram />
              </a>
            );
          return null;
        })}
      </div>
    </footer>
  );
};

export default Footer;
