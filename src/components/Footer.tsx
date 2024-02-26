import { useState } from "react";

import Link from "next/link";

import ContactModal from "./modals/ContactModal";

const footerLinks = [
  {
    title: "Home",
    url: "/",
  },
  // {
  //   title: "Contact Us",
  //   url: "/contact",
  // },
  // {
  //   title: "Beta",
  //   url: "/beta",
  // },
  {
    title: "Privacy Policy",
    url: "/privacy",
  },
  {
    title: "Terms of Service",
    url: "/terms",
  },
  {
    title: "About",
    url: "/about",
  },
];

const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <footer className="footer footer-center border border-t-2 border-secondary bg-primary bg-opacity-70 p-10 text-secondary-content">
        <div className="flex gap-x-4 justify-center items-center">
          <div className="flex flex-wrap justify-center gap-x-4">
            {footerLinks.map((link) => (
              <Link
                href={link.url}
                className="no link-hover link whitespace-nowrap"
                key={link.url}
              >
                {link.title}
              </Link>
            ))}
            <button
              aria-label="Contact Us"
              className="hover:underline"
              onClick={() => setIsContactOpen(true)}
            >
              Contact Us
            </button>
          </div>
        </div>

        <div>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            SmartApply.app
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
