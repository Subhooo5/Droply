"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

interface ShadcnProviderProps {
  children: React.ReactNode;
  navigate?: (href: string, options?: any) => void;
}

export function ShadcnProvider({ children, navigate }: ShadcnProviderProps) {
  const router = useRouter();

  const handleNavigate = (href: string, options?: any) => {
    if (navigate) {
      navigate(href, options);
    } else {
      router.push(href);
    }
  };

  return (
      <div>
        {children}
      </div>
  );
}
