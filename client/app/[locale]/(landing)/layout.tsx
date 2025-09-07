import React from "react";
import Navigation from "@/components/header";
import Footer from "@/components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />

      <div className={`min-h-screen container mx-auto`}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
