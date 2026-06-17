import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AppSidebar />
      <div className="flex-1 pb-16 md:pb-0 relative overflow-hidden">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
