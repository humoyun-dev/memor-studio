"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme.toggle";

const navigationItems = [
  { href: "/", label: "Bosh Sahifa" },
  { href: "/projects", label: "Loyihalar" },
  { href: "/about", label: "Biz Haqimizda" },
  { href: "/news", label: "Yangiliklar" },
  { href: "/awards", label: "Mukofotlar" },
  { href: "/contact", label: "Aloqa" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = useMemo(() => {
    if (!mounted) return "/logo/logo_light.png";
    return resolvedTheme === "dark"
      ? "/logo/logo_dark.png"
      : "/logo/logo_light.png";
  }, [mounted, resolvedTheme]);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt="Memor Studio logo"
              width={600}
              height={600}
              className="rounded-md w-14 aspect-square"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            {/*<Button>*/}
            {/*  Narx Olish*/}
            {/*  <ArrowRight className="ml-2 h-4 w-4" />*/}
            {/*</Button>*/}
            <ModeToggle />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {/*<div className="px-4 pt-4">*/}
              {/*  <Button className="w-full">*/}
              {/*    Narx Olish*/}
              {/*    <ArrowRight className="ml-2 h-4 w-4" />*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
