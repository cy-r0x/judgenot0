/**
 * Status Component - Displays contest status badge
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Contest status: "ENDED", "UPCOMING", "ONGOING", or "RUNNING"
 * @returns {JSX.Element} Styled status badge
 *
 * @example
 * <StatusComponent status="RUNNING" />
 * <StatusComponent status="ENDED" />
 */
function StatusComponent({ status }) {
  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toUpperCase();

    const configs = {
      ENDED: {
        color: "bg-red-500",
        label: "ENDED",
      },
      UPCOMING: {
        color: "bg-blue-500",
        label: "UPCOMING",
      },
      ONGOING: {
        color: "bg-green-500",
        label: "ONGOING",
        animated: true,
      },
      RUNNING: {
        color: "bg-green-500",
        label: "RUNNING",
        animated: true,
      },
    };

    return configs[normalizedStatus] || configs.UPCOMING;
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`${config.color} relative py-2 px-3 rounded min-w-28 text-center font-medium`}
      role="status"
      aria-label={`Contest status: ${config.label}`}
    >
      {config.animated && (
        <>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 animate-ping rounded-full bg-blue-500"></div>
        </>
      )}
      {config.label}
    </div>
  );
}

export default StatusComponent;
