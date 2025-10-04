/**
 * Empty State Component - Displays when there's no data to show
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.icon=null] - Icon element to display
 * @param {string} [props.title="No Data Found"] - Title text
 * @param {string} [props.description="There's nothing to display yet."] - Description text
 * @param {Function} [props.action=null] - Optional action button click handler
 * @param {string} [props.actionLabel="Get Started"] - Action button label
 * @returns {JSX.Element} Empty state display
 *
 * @example
 * <EmptyState
 *   icon={<MdFolder />}
 *   title="No Contests Found"
 *   description="Create your first contest to get started."
 *   action={handleCreate}
 *   actionLabel="Create Contest"
 * />
 */
const EmptyState = ({
  icon = null,
  title = "No Data Found",
  description = "There's nothing to display yet.",
  action = null,
  actionLabel = "Get Started",
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4"
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mb-4 p-3 bg-zinc-800/50 rounded-full text-zinc-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
