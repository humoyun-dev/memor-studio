"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Facebook, MessageCircle } from "lucide-react";
import Link from "next/link";

const SocialSidebar = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/yourhandle",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/company/yourcompany",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://facebook.com/yourpage",
    },
    {
      name: "WeChat",
      icon: <MessageCircle className="h-5 w-5" />,
      url: "#wechat",
    },
  ];

  return (
    <motion.div
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-gray-800 text-white p-3 rounded-l-lg shadow-lg"
    >
      <div className="flex flex-col space-y-3">
        {socialLinks.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label={item.name}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialSidebar;
