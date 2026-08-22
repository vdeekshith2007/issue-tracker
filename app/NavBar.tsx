"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-black font-semibold text-lg"
        >
          <AiFillBug size={24} />
          <span>Issue Tracker</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          {links.map((link) => {
            const isActive = currentPath === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={classnames(
                    "transition-colors",
                    {
                      "text-zinc-900 font-semibold": isActive,
                      "text-zinc-500": !isActive,
                      "hover:text-zinc-800": true,
                    }
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

       
      </div>
    </nav>
  );
};

export default NavBar;