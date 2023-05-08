import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import UserWidget from "./UserWidget";
import Logo from "./Logo";
import { useAppStore } from "~/store/store";

// import ContactIcons from "./ContactIcons";

interface NavBarLinkData {
  label: string;
  url: string;
}

const navBarLinks: NavBarLinkData[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "New Application",
    url: "/new",
  },
];

const navBarActionLinks: NavBarLinkData[] = [
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
  const [linkColor, setLinkColor] = useState("text-base-content");

  const router = useRouter();
  const { applicant, job } = useAppStore();
  const showActions = !!applicant && !!job;

  const setTransparentNavBar = (transparent: boolean) => {
    if (transparent) {
      setNavBg("bg-transparent");
      setLinkColor("text-base-content");
    } else {
      setNavBg("bg-base-200");
      setLinkColor("text-base-content");
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

  return (
    <div
      className={`${
        shadow ? "shadow-sm shadow-base-300" : ""
      }  ${navBg} fixed z-30  h-16 w-full `}
    >
      {/* Desktop version */}
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-2 2xl:px-4">
        <div className="flex w-full flex-row items-center justify-between">
          {/* Burger icon, show on small displays */}
          <div onClick={showNavBar} className="md:hidden">
            <Bars3Icon className="h-6 w-6" />
          </div>

          <div className="flex items-baseline justify-start">
            <Logo />
            <ul className={`hidden flex-1 flex-grow  md:flex ${linkColor}`}>
              {navBarLinks.map((l) => (
                <Link key={`desktop-menu-${l.label}`} href={l.url}>
                  <li className="${linkColor} ml-10 border-secondary text-sm uppercase hover:border-b">
                    {l.label}
                  </li>
                </Link>
              ))}
              {showActions &&
                navBarActionLinks.map((l) => (
                  <Link key={`desktop-menu-${l.label}`} href={l.url}>
                    <li className="${linkColor} ml-10 border-secondary text-sm uppercase hover:border-b">
                      {l.label}
                    </li>
                  </Link>
                ))}
              {/* {sessionStatus === "authenticated" &&
              navBarProtectedLinks.map((l) => (
                <Link key={`desktop-menu-${l.label}`} href={l.url}>
                  <li className="border-secondary-400 ml-10 text-sm uppercase hover:border-b">
                    {l.label}
                  </li>
                </Link>
              ))} */}
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
          className={
            nav
              ? "fixed left-0 top-0 h-screen w-[75%] bg-neutral p-4 duration-200 ease-in sm:w-[60%] md:w-[45%]"
              : "fixed left-[-100%] top-0 p-10 duration-200 ease-in"
          }
        >
          <div>
            <div className="flex w-full  items-center justify-between">
              {/* Logo */}
              <Logo />

              <button
                onClick={hideNavBar}
                className="  btn-primary btn-circle btn"
              >
                <XMarkIcon className="h-4 w-4 font-bold" />
              </button>
            </div>
          </div>
          <div className="flex flex-col py-4">
            <ul className="uppercase">
              {navBarLinks.map((l) => (
                <Link key={`mobile-menu-${l.label}`} href={l.url}>
                  <li onClick={hideNavBar} className="py-4 text-sm">
                    {l.label}
                  </li>
                </Link>
              ))}
              {showActions &&
                navBarActionLinks.map((l) => (
                  <Link key={`mobile-menu-${l.label}`} href={l.url}>
                    <li onClick={hideNavBar} className="py-4 text-sm">
                      {l.label}
                    </li>
                  </Link>
                ))}
              {/* {navBarProtectedLinks.map((l) => (
                <Link key={`mobile-menu-${l.label}`} href={l.url}>
                  <li onClick={hideNavBar} className="py-4 text-sm">
                    {l.label}
                  </li>
                </Link>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
