import StatusComponent from "../StatusComponent/StatusComponent";

function ContestListComponent({ data }) {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(data.start_time));

  // Convert duration_seconds to human readable format
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const durationText = data.duration_seconds
    ? formatDuration(data.duration_seconds)
    : data.duration || "Unknown";

  return (
    <div className="border-4 border-zinc-800 flex w-full justify-between items-center px-4 py-2 bg-zinc-800 rounded-lg text-base hover:border-orange-500 hover:scale-[100.2%]  transition-all cursor-pointer">
      <div className="space-y-2">
        <p className="lg:text-xl font-semibold">{data.title}</p>
        <p className="text-sm lg:text-base">Starting: {formattedTime}</p>
        <p className="text-sm lg:text-base">
          Duration: <span className="font-semibold">{durationText}</span>
        </p>
      </div>
      <div>
        <StatusComponent status={data.status} />
      </div>
    </div>
  );
}

export default ContestListComponent;
