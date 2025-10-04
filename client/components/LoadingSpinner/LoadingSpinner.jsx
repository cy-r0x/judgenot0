/**
 * Loading Spinner Component - Reusable loading indicator
 *
 * @param {Object} props - Component props
 * @param {string} [props.size="md"] - Spinner size: "sm", "md", "lg", or "xl"
 * @param {string} [props.text="Loading..."] - Loading text to display
 * @param {boolean} [props.fullScreen=false] - Whether to render as fullscreen overlay
 * @returns {JSX.Element} Loading spinner component
 *
 * @example
 * <LoadingSpinner size="lg" text="Loading data..." />
 * <LoadingSpinner fullScreen={true} />
 */
const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`animate-spin rounded-full border-b-2 border-orange-500 ${sizes[size]}`}
      ></div>
      {text && (
        <span className="text-zinc-300 text-sm md:text-base">{text}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
