"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLoading from "@/components/LoadingSpinner/PageLoading";
import { USER_ROLES } from "@/utils/constants";

export default function App() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Redirect based on role
      if (role === USER_ROLES.ADMIN) {
        router.push("/admin");
      } else if (role === USER_ROLES.SETTER) {
        router.push("/setter");
      } else {
        router.push("/contests");
      }
    }
  }, [loading, isAuthenticated, role, router]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <PageLoading text="Redirecting..." />
    </div>
  );
}
