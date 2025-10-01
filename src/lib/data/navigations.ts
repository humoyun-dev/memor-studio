export type LocalizedString = {
  uz: string;
  ru: string;
  en: string;
};

export interface MenuItem {
  label: LocalizedString;
  href?: string;
  children?: MenuItem[];
}

export interface FooterLink {
  label: LocalizedString;
  href: string;
}

export interface FooterSection {
  title: LocalizedString;
  links: FooterLink[];
}

export interface SocialLink {
  label: LocalizedString;
  href: string;
}

export interface FooterData {
  logo: string;
  address: LocalizedString[];
  phone: string;
  phone2: string;
  email: string;
  copyright: LocalizedString;
  sections: FooterSection[];
  social: SocialLink[];
}

export interface SiteData {
  menu: MenuItem[];
  footer: FooterData;
}

export const siteData: SiteData = {
  menu: [
    {
      label: { uz: "STUDIYA", ru: "СТУДИЯ", en: "STUDIO" },
      href: "/studio",
      children: [
        {
          label: { uz: "BIZ HAQIMIZDA", ru: "О НАС", en: "ABOUT" },
          href: "/about",
        },
        {
          label: { uz: "JAMOA", ru: "КОМАНДА", en: "OUR TEAM" },
          href: "/team",
        },
        {
          label: { uz: "XIZMATLAR", ru: "УСЛУГИ", en: "SERVICES" },
          href: "/services",
          children: [],
        },
        {
          label: { uz: "MUKOFOTLAR", ru: "НАГРАДЫ", en: "AWARDS" },
          href: "/awards",
        },
      ],
    },
    {
      label: { uz: "LOYIHALAR", ru: "ПРОЕКТЫ", en: "PROJECTS" },
      href: "/projects",
    },
    { label: { uz: "YANGILIKLAR", ru: "НОВОСТИ", en: "NEWS" }, href: "/news" },
    {
      label: { uz: "KARYERA", ru: "КАРЬЕРА", en: "CAREERS" },
      href: "/careers",
    },
    { label: { uz: "ALOQA", ru: "КОНТАКТЫ", en: "CONTACT" }, href: "/contact" },
  ],
  footer: {
    logo: "/logo.png",
    address: [
      {
        uz: "Niyozbek Yoʻli koʻchasi, 2-A,",
        ru: "улица Ниёзбек Йули, 2-A,",
        en: "Niyozbek Yoʻli street, 2-A,",
      },
      {
        uz: "Toshkent, Oʻzbekiston",
        ru: "Ташкент, Узбекистан",
        en: "Tashkent, Uzbekistan",
      },
    ],
    phone: "+998 99 222 22 33",
    phone2: "+998 90 135 01 02",
    email: "memor.studio.works@gmail.com",
    copyright: {
      uz: "© 2025 Memor Studio",
      ru: "© 2025 Memor Studio",
      en: "© 2025 Memor Studio",
    },
    sections: [],
    social: [],
  },
};
