"use client";
import { useUser } from "@/app/lib/userContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminLinks,
  doctorLinks,
  patientLinks,
} from "@/app/constants/routeLinks";

interface SidebarLinkProps {
  href: string;
  name: string;
  icon: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  name,
  icon,
  isActive,
}) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 rounded transition-colors duration-200 ${
      isActive ? "bg-[#ECFDF6] text-[#018969]" : "hover:bg-[#ECFDF6]"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    <img src={icon} alt={`${name} icon`} className="h-5 w-5 mr-2" />
    {name}
  </Link>
);

const Sidebar = () => {
  const { role } = useUser();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const getLinks = () => {
    switch (role) {
      case "admin":
        return adminLinks;
      case "doctor":
        return doctorLinks;
      case "patient":
        return patientLinks;
      default:
        return [];
    }
  };

  return (
    <nav
      className="bg-white text-white w-48 h-[calc(100vh-4rem)] p-4 mt-16 fixed border-r border-gray-300 md:block hidden"
      aria-label="Sidebar Navigation"
    >
      <ul className="space-y-6 text-[#464646] font-semibold">
        {getLinks().map((link) => (
          <li key={link.href}>
            <SidebarLink {...link} isActive={currentPath === link.href} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
