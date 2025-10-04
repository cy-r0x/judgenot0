"use client";

import "./globals.css";
import Navbar from "@/components/NavbarComponent/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
