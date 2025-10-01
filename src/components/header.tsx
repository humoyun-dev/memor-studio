"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { type MenuItem, siteData } from "@/lib/data/navigations";
import { t } from "@/lib/utils";
import LanguageToggle from "@/components/language-toggle";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import useFetch from "@/lib/use-fetch";

interface DropdownProps {
  items: MenuItem;
  lang: string;
}

const Dropdown: FC<DropdownProps> = ({ items, lang }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive =
    items.href &&
    pathname &&
    typeof pathname === "string" &&
    pathname.startsWith(items.href);
  const hasChildren = !!items.children?.length;
  const labelText = items?.label ? t(items.label, lang) : "";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {items.href ? (
        <Link
          href={items.href}
          className={`px-2 md:px-4 py-2 inline-block text-sm md:text-base ${
            isActive
              ? "text-primary border-b border-primary"
              : "hover:bg-primary hover:text-white"
          }`}
        >
          {labelText}
        </Link>
      ) : (
        <span className="px-2 md:px-4 py-2 inline-block text-sm md:text-base hover:bg-primary hover:text-white">
          {labelText}
        </span>
      )}

      {hasChildren && open && (
        <div className="absolute top-full left-0 bg-background shadow-lg py-2 min-w-[200px] z-50 hidden md:block">
          {items.children!.map((child) => {
            const childActive =
              child.href &&
              pathname &&
              typeof pathname === "string" &&
              pathname.startsWith(child.href);
            const childLabelText = child?.label ? t(child.label, lang) : "";

            return (
              <div
                key={child.href || childLabelText}
                className="relative group"
              >
                <Link
                  href={child.href || "#"}
                  className={`block px-4 py-2 whitespace-nowrap ${
                    childActive
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                  }`}
                >
                  {childLabelText}
                </Link>

                {child.children && (
                  <div className="absolute top-0 left-full bg-background shadow-lg py-2 min-w-[200px] hidden group-hover:block">
                    {child.children.map((sub) => {
                      const subLabelText = sub?.label ? t(sub.label, lang) : "";
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href || "#"}
                          className="block px-4 py-2 whitespace-nowrap hover:bg-primary hover:text-white"
                        >
                          {subLabelText}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface MobileNavProps {
  lang: string;
  menuItems: MenuItem[];
}

const MobileNavigation: FC<MobileNavProps> = ({ lang, menuItems }) => {
  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isActive =
      item.href &&
      pathname &&
      typeof pathname === "string" &&
      pathname.startsWith(item.href);
    const hasChildren = !!item.children?.length;
    const itemLabelText = item?.label ? t(item.label, lang) : "";

    return (
      <div
        key={item.href || itemLabelText}
        className={`${level > 0 ? "ml-4" : ""}`}
      >
        {item.href ? (
          <SheetClose asChild>
            <Link
              href={item.href}
              className={`block px-4 py-3 text-lg font-medium uppercase tracking-wide ${
                isActive
                  ? "text-primary border-l-2 border-primary bg-primary/10"
                  : "hover:bg-primary/10"
              }`}
            >
              {itemLabelText}
            </Link>
          </SheetClose>
        ) : (
          <div className="px-4 py-3 text-lg font-medium uppercase tracking-wide">
            {itemLabelText}
          </div>
        )}

        {hasChildren && (
          <div className="ml-4 border-l border-border">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      {menuItems.map((item) => renderMenuItem(item))}
    </div>
  );
};

interface Service {
  id: number;
  title: string;
  slug: string;
}

const injectServicesIntoMenu = (
  menu: MenuItem[],
  services: Service[],
): MenuItem[] => {
  return menu.map((item) => {
    if (item.href === "/services") {
      return {
        ...item,
        children:
          services.length > 0
            ? services.map((service) => ({
                label: {
                  uz: service.title,
                  ru: service.title,
                  en: service.title,
                },
                href: `/services/${service.slug}`,
              }))
            : [],
      };
    }

    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: injectServicesIntoMenu(item.children, services),
      };
    }

    return item;
  });
};

const Header: FC<{ lang?: string }> = ({ lang = "uz" }) => {
  const [services, setServices] = useState<Service[]>([]);
  const { data, isLoading } = useFetch("service/");

  useEffect(() => {
    if (data && !isLoading) {
      setServices(data);
    }
  }, [data, isLoading]);

  const [dynamicMenu, setDynamicMenu] = useState(siteData.menu || []);

  useEffect(() => {
    const updated = injectServicesIntoMenu(siteData.menu, services);
    setDynamicMenu(updated);
  }, [services]);

  return (
    <header className="w-full fixed top-0 z-10 px-4 py-2 bg-background/20 backdrop-blur-sm flex items-center justify-between">
      <Link href="/" aria-label="Home">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={96}
          height={96}
          className="aspect-square size-12 md:size-20 object-contain"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-2 xl:space-x-6 text-lg font-medium uppercase tracking-wide">
        {dynamicMenu.map((item) => {
          const key =
            item?.href ||
            (item?.label ? t(item.label, lang) : Math.random().toString());
          return <Dropdown key={key} items={item} lang={lang} />;
        })}
        <LanguageToggle className="w-auto min-w-[120px]" />
      </nav>

      {/* Mobile Navigation */}
      <div className="flex items-center space-x-2 lg:hidden">
        <LanguageToggle className="w-auto min-w-[100px]" />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold uppercase tracking-wide">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <MobileNavigation lang={lang} menuItems={dynamicMenu} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
