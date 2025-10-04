import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <LoadingSpinner size="lg" text="Loading submissions..." />
    </div>
  );
}
