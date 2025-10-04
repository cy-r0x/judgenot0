/**
 * Bar Component - Header bar for sections
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title text to display
 * @param {boolean} [props.center=false] - Whether to center align the title
 * @returns {JSX.Element} Styled bar component
 *
 * @example
 * <Bar title="Contests" />
 * <Bar title="Login" center={true} />
 */
function Bar({ title, center = false }) {
  return (
    <div
      className={`px-5 py-3 bg-zinc-800 border-b-orange-500 border-b-4 ${
        center ? "text-center" : ""
      }`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

export default Bar;
