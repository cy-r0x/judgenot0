"use client";

export default function ContestDetailsTab({ contestData, setContestData }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If it's start_time, store it as datetime-local value (we'll convert to ISO when saving)
    setContestData((prev) => ({
      ...prev,
      contest: { ...prev.contest, [name]: value },
    }));
  };

  const handleDurationChange = (e) => {
    const minutes = parseInt(e.target.value) || 0;
    setContestData((prev) => ({
      ...prev,
      contest: { ...prev.contest, duration_seconds: minutes * 60 },
    }));
  };

  const getDurationInMinutes = () => {
    return Math.floor(contestData.contest.duration_seconds / 60);
  };

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // Convert to local timezone for display
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";

    switch (status) {
      case "UPCOMING":
        return `${baseClasses} bg-blue-600/20 text-blue-400 border border-blue-600/30`;
      case "RUNNING":
        return `${baseClasses} bg-green-600/20 text-green-400 border border-green-600/30`;
      case "ENDED":
        return `${baseClasses} bg-gray-600/20 text-gray-400 border border-gray-600/30`;
      default:
        return `${baseClasses} bg-zinc-600/20 text-zinc-400 border border-zinc-600/30`;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Contest Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Contest Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={contestData.contest.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter contest title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={contestData.contest.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter contest description"
            />
          </div>

          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formatDateTimeForInput(contestData.contest.start_time)}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Duration (Minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={getDurationInMinutes()}
              onChange={handleDurationChange}
              min="1"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. 180 for 3 hours"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Enter duration in minutes (e.g., 180 for 3 hours)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Contest Status
            </label>
            <div className="flex items-center">
              <span className={getStatusBadge(contestData.contest.status)}>
                {contestData.contest.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Status is automatically calculated based on current time
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Contest ID
            </label>
            <input
              type="number"
              value={contestData.contest.id}
              disabled
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-zinc-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Contest ID cannot be modified
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Created At
            </label>
            <input
              type="text"
              value={new Date(contestData.contest.created_at).toLocaleString()}
              disabled
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div className="p-4 bg-zinc-700/30 rounded-md border border-zinc-600">
            <h3 className="text-sm font-medium text-zinc-300 mb-2">
              Contest Summary
            </h3>
            <div className="space-y-1 text-xs text-zinc-400">
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {Math.floor(contestData.contest.duration_seconds / 3600)}h{" "}
                {Math.floor((contestData.contest.duration_seconds % 3600) / 60)}
                m
              </p>
              <p>
                <span className="font-medium">Problems:</span>{" "}
                {contestData.problems?.length || 0} problem(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
