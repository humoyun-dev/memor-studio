import React from "react";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t py-12 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Memor Studio
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a
              href="#"
              className="hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Maxfiylik Siyosati
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Xizmat Shartlari
            </a>
            <a
              href="/contact"
              className="hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Aloqa
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {year} Memor Studio. Barcha huquqlar himoyalangan.
            Litsenziyali, kafolatlangan va sug'urtalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
