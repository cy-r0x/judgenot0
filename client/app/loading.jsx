/**
 * Root Loading Component
 * Used as fallback for all SSR pages without specific loading.jsx
 */
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)]">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
