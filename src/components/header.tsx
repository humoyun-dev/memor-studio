"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type MenuItem, siteData } from "@/lib/data/navigations";
import { t } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, XIcon, Menu } from "lucide-react";

interface DropdownProps {
  items: MenuItem;
  lang: string;
}

const Dropdown: FC<DropdownProps> = ({ items, lang }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = items.href && pathname.startsWith(items.href);
  const hasChildren = !!items.children?.length;

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
          {t(items.label, lang)}
        </Link>
      ) : (
        <span className="px-2 md:px-4 py-2 inline-block text-sm md:text-base hover:bg-primary hover:text-white">
          {t(items.label, lang)}
        </span>
      )}

      {hasChildren && open && (
        <div className="absolute top-full left-0 bg-background shadow-lg py-2 min-w-[200px] z-50 hidden md:block">
          {items.children!.map((child) => {
            const childActive = child.href && pathname.startsWith(child.href);

            return (
              <div
                key={child.href || t(child.label, lang)}
                className="relative group"
              >
                {child.href ? (
                  <Link
                    href={child.href}
                    className={`block px-4 py-2 whitespace-nowrap ${
                      childActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    }`}
                  >
                    {t(child.label, lang)}
                  </Link>
                ) : (
                  <span className="block px-4 py-2 whitespace-nowrap hover:bg-primary hover:text-white">
                    {t(child.label, lang)}
                  </span>
                )}

                {child.children && (
                  <div className="absolute top-0 left-full bg-background shadow-lg py-2 min-w-[200px] hidden group-hover:block">
                    {child.children.map((sub) => {
                      const subActive =
                        sub.href && pathname.startsWith(sub.href);

                      return sub.href ? (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-4 py-2 whitespace-nowrap ${
                            subActive
                              ? "bg-primary text-white"
                              : "hover:bg-primary hover:text-white"
                          }`}
                        >
                          {t(sub.label, lang)}
                        </Link>
                      ) : (
                        <span
                          key={t(sub.label, lang)}
                          className="block px-4 py-2 whitespace-nowrap hover:bg-primary hover:text-white"
                        >
                          {t(sub.label, lang)}
                        </span>
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

const MobileNavigation: FC<{ lang: string }> = ({ lang }) => {
  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isActive = item.href && pathname.startsWith(item.href);
    const hasChildren = !!item.children?.length;

    return (
      <div
        key={item.href || t(item.label, lang)}
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
              {t(item.label, lang)}
            </Link>
          </SheetClose>
        ) : (
          <div className="px-4 py-3 text-lg font-medium uppercase tracking-wide">
            {t(item.label, lang)}
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
      {siteData.menu.map((item) => renderMenuItem(item))}
    </div>
  );
};

const Header: FC<{ lang?: string }> = ({ lang = "uz" }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

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
        {siteData.menu.map((item) => (
          <Dropdown
            key={item.href || t(item.label, lang)}
            items={item}
            lang={lang}
          />
        ))}

        {/* Search Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mt-1 rounded-full" variant="link" size="icon">
              <Search className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-[30vh]">
            <SheetHeader>
              <SheetTitle className="hidden">Search menu</SheetTitle>
            </SheetHeader>
            <div className="flex items-center justify-center w-full h-full">
              <div className="w-full max-w-[85%] relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-b-2 pb-4 border-black placeholder:text-black text-xl md:text-3xl font-bold font-sans uppercase focus:outline-none"
                  placeholder="Search"
                  autoFocus
                />
                <SheetClose asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-0 w-10 h-10 rounded-full top-1"
                  >
                    <XIcon className="size-7" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Mobile Navigation */}
      <div className="flex items-center space-x-2 lg:hidden">
        {/* Mobile Search */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-[30vh]">
            <SheetHeader>
              <SheetTitle className="hidden">Search menu</SheetTitle>
            </SheetHeader>
            <div className="flex items-center justify-center w-full h-full">
              <div className="w-full max-w-[85%] relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-b-2 pb-4 border-black placeholder:text-black text-xl font-bold font-sans uppercase focus:outline-none"
                  placeholder="Search"
                  autoFocus
                />
                <SheetClose asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-0 w-8 h-8 rounded-full top-1"
                  >
                    <XIcon className="size-5" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Menu */}
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
              <MobileNavigation lang={lang} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
