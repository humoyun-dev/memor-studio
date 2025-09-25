import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className={`min-h-screen`}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
