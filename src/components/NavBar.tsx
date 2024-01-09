import { useAuth } from "@clerk/nextjs";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useAppStore } from "~/store/store";

import Logo from "./Logo";
import UserWidget from "./UserWidget";

// import ContactIcons from "./ContactIcons";

interface NavBarLinkData {
  label: string;
  url: string;
}

const publicLinks: NavBarLinkData[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "New Application",
    url: "/new",
  },
];

const protectedLinks: NavBarLinkData[] = [
  {
    label: "Saved Application",
    url: "/applications",
  },
];

const actionLinks: NavBarLinkData[] = [
  {
    label: "Cover Letter",
    url: "/coverletter",
  },
  {
    label: "Interview",
    url: "/interview",
  },
  {
    label: "Test",
    url: "/test",
  },
];

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState("");
  const [linkColor, setLinkColor] = useState("text-primary");
  const { isSignedIn } = useAuth();

  const router = useRouter();
  const { application } = useAppStore();

  const setTransparentNavBar = (transparent: boolean) => {
    if (transparent) {
      setNavBg("bg-transparent");
      setLinkColor("text-primary");
    } else {
      setNavBg("bg-base-100");
      setLinkColor("text-primary");
    }
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 64) {
        setShadow(true);
        setTransparentNavBar(false);
      } else {
        setShadow(false);
        setTransparentNavBar(true);
      }
    };
    window.addEventListener("scroll", handleShadow);

    return () => {
      window.removeEventListener("scroll", handleShadow);
    };
  }, [router]);

  const showNavBar = () => {
    setNav(true);
  };

  const hideNavBar = () => {
    setNav(false);
  };

  const navBarLinks = useMemo(() => {
    const links = [...publicLinks];
    if (isSignedIn) {
      links.push(...protectedLinks);
    }
    if (application) {
      const applicationLinks = actionLinks.map((l) => ({
        ...l,
        url: `${l.url}/${application.id}`,
      }));
      links.push(...applicationLinks);
    }
    return links;
  }, [isSignedIn, application]);

  return (
    <div
      className={`${
        shadow ? "shadow-sm shadow-secondary" : ""
      }  ${navBg} fixed z-30  h-16 w-full `}
    >
      {/* Desktop version */}
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-2 2xl:px-4">
        <div className="flex w-full flex-row items-center justify-between">
          {/* Burger icon, show on small displays */}
          <div onClick={showNavBar} className=" md:hidden">
            <Bars3Icon className="h-6 w-6" />
          </div>

          <div className="flex items-baseline justify-start">
            <Link href={`${isSignedIn ? "/applications" : "/"}`}>
              <Logo />
            </Link>

            <ul className={`hidden flex-1 flex-grow  md:flex ${linkColor}`}>
              {navBarLinks.map((l) => (
                <Link
                  key={`desktop-menu-${l.label}`}
                  href={l.url}
                  className="link-hover link underline-offset-8"
                >
                  <li className="${linkColor} ml-10 text-sm font-semibold uppercase">
                    {l.label}
                  </li>
                </Link>
              ))}
            </ul>
          </div>

          <div className="flex-0 text-right">
            <UserWidget />
          </div>
        </div>
      </div>

      {/* Mobile version       */}
      <div
        className={nav ? "fixed left-0 top-0 h-screen w-full bg-black/70" : ""}
      >
        <div
          className={`fixed top-0 h-screen w-[75%] bg-base-100 p-4 duration-200 ease-in sm:w-[60%] md:w-[45%] ${
            nav ? "left-0 " : "left-[-100%]"
          }`}
        >
          <div>
            <div className="relative flex w-full items-center justify-between">
              {/* Logo */}
              <Link
                className="absolute left-[50%] translate-x-[-50%]"
                href={`${isSignedIn ? "/applications" : "/"}`}
              >
                <Logo />
              </Link>
              <button
                onClick={hideNavBar}
                className="  btn-accent btn-circle btn"
              >
                <XMarkIcon className="h-4 w-4 font-bold" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <ul className="flex flex-col gap-y-4 uppercase">
              {navBarLinks.map((l) => (
                <Link key={`mobile-menu-${l.label}`} href={l.url}>
                  <li
                    onClick={hideNavBar}
                    className={`${linkColor} font-semibold`}
                  >
                    {l.label}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
