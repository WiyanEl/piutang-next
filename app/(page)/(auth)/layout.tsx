import Link from "next/link";
import React from "react";

import { requireGuest } from "@/app/lib/auth/requireGuest"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGuest()

  return (
    <div className="relative p-6 z-1 bg-white sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  sm:p-0">
        {children}
        <div className="relative lg:w-1/2 w-full h-full bg-[url('/images/auth/bg-auth.jpg')] bg-cover bg-center lg:grid items-center hidden">
          <div className="absolute inset-0 bg-[#00000040] backdrop-blur-[11.1px]" />
          <div className="relative z-10 items-center justify-center flex">
            <div className="flex flex-col max-w-md gap-3">
              <h1 className="font-mono text-4xl md:text-6xl font-bold text-gray-100">
                Halo <br />
                KasbonApp
              </h1>
              <p className="font-sans text-white">
                Selamat Datang di Aplikasi Kasbon, catat dan kelola utang piutangmu dengan mudah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}