/**
 * Page Loading Component - Consistent loading states for CSR pages
 *
 * @param {Object} props - Component props
 * @param {string} [props.text="Loading..."] - Loading text to display
 * @param {string} [props.size="lg"] - Spinner size: "sm", "md", "lg", or "xl"
 * @param {string} [props.height="h-[calc(100vh-70px)]"] - Container height class
 * @returns {JSX.Element} Page loading component
 *
 * @example
 * <PageLoading text="Loading submission..." />
 * <PageLoading text="Loading..." height="py-12" />
 */
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const PageLoading = ({
  text = "Loading...",
  size = "lg",
  height = "h-[calc(100vh-70px)]",
}) => {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <LoadingSpinner size={size} text={text} />
    </div>
  );
};

export default PageLoading;
