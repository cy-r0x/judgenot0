"use client";

export default function LimitsTab({ problemData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Time and Memory Limits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="time_limit"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Time Limit (seconds)
          </label>
          <input
            type="number"
            id="time_limit"
            name="time_limit"
            value={problemData.time_limit}
            onChange={handleInputChange}
            min="1"
            step="1"
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-xs text-zinc-400">
            Recommended: 1 second for most problems
          </p>
        </div>

        <div>
          <label
            htmlFor="memory_limit"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Memory Limit (MB)
          </label>
          <input
            type="number"
            id="memory_limit"
            name="memory_limit"
            value={problemData.memory_limit}
            onChange={handleInputChange}
            min="16"
            step="16"
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-xs text-zinc-400">
            Recommended: 256MB for most problems
          </p>
        </div>
      </div>
    </div>
  );
}
