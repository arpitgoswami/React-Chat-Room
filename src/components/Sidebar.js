"use client";

import { useEffect, useState } from "react";
import { useAuth, signOutUser } from "../app/firebase";
import { BiHome, BiLibrary } from "react-icons/bi";
import { BsGlobe } from "react-icons/bs";
import { RiLightbulbLine } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutDialog from "./LogoutDialog";
import { NavLink } from "./common/NavLink";

export default function Sidebar({ isOpen, onClose, onNewThread }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const navItems = [
    { icon: <BiHome className="w-5 h-5" />, text: "Home", href: "/home" },
    {
      icon: <BsGlobe className="w-5 h-5" />,
      text: "Discover",
      href: "/discover",
    },
    {
      icon: <RiLightbulbLine className="w-5 h-5" />,
      text: "Spaces",
      href: "/spaces",
    },
    {
      icon: <BiLibrary className="w-5 h-5" />,
      text: "Library",
      href: "/library",
    },
  ];

  const baseClasses =
    "fixed top-0 min-h-screen bottom-0 z-30 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 ease-in-out";

  const responsiveClasses = isOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "n" && event.shiftKey) {
        event.preventDefault();
        if (onNewThread) {
          onNewThread();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewThread]);

  return (
    <div className={`${baseClasses} ${responsiveClasses}`}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 md:hidden"
        aria-label="Close menu"
      >
        <IoCloseOutline className="w-6 h-6" />
      </button>

      <div className="px-4 pt-6 flex items-center mb-8 group cursor-pointer">
        <div className="w-10 h-10 mr-3 transition-transform group-hover:scale-105">
          <img src="/logo_no_text.svg" alt="Logo" className="w-full h-full" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            Academy
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Research Platform
          </p>
        </div>
      </div>

      <div className="px-4 space-y-6 text-sm flex-1 overflow-y-auto">
        <button
          onClick={onNewThread}
          className="flex justify-between items-center py-3 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 w-full transition-all duration-200 shadow-sm hover:shadow group"
        >
          <span className="font-semibold text-white flex items-center">
            <span className="mr-2 text-teal-100">+</span>
            New Thread
          </span>
          <div className="flex items-center space-x-1 text-xs text-teal-100">
            <kbd className="px-2 py-0.5 rounded bg-teal-600/50 font-medium">
              ⇧
            </kbd>
            <kbd className="px-2 py-0.5 rounded bg-teal-600/50 font-medium">
              N
            </kbd>
          </div>
        </button>

        <nav className="space-y-2" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.text}
              {...item}
              isActive={pathname === item.href}
              className="group"
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t dark:border-slate-800/50 pt-4">
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ring-teal-600/80 transition-transform hover:scale-105">
              <Image
                src="https://lh3.googleusercontent.com/a/ACg8ocJpA8Svo0a7n73bbHyAKUmXPhM6gJclx0UDzVfHdafVXuU=s96-c"
                width={100}
                height={100}
                alt="User Profile"
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[120px] text-slate-900 dark:text-white">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            aria-label="Sign out"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onLogout={signOutUser}
      />
    </div>
  );
}
