"use client";
import { useUser } from "@/app/lib/userContext";
import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "@/components/icons/icons";
import NotificationBadge from "./notification-badge";

const TopNav = () => {
  const { role } = useUser();

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white text-gray-800 p-4 flex justify-between items-center border-b border-gray-300 z-50"
      role="banner"
    >
      <nav className="flex space-x-4">
        {role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="hover:underline"
            aria-label="Admin Dashboard"
          >
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
          </Link>
        )}
        {role === "doctor" && (
          <Link
            href="/doctor/appointments"
            className="hover:underline"
            aria-label="Doctor Appointments"
          >
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
          </Link>
        )}
        {role === "patient" && (
          <Link
            href="/patient/appointments"
            className="hover:underline"
            aria-label="Patient Appointments"
          >
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
          </Link>
        )}
      </nav>
      <div className="flex items-center space-x-4">
        <button className="relative" title="Notifications">
          <BellIcon className="h-6 w-6 text-gray-800" />
          <NotificationBadge />
        </button>
        <Image
          src="/profile.svg"
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
          width={50}
          height={50}
        />
      </div>
    </header>
  );
};

export default TopNav;
