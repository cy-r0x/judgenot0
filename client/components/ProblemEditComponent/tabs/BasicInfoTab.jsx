"use client";

export default function BasicInfoTab({ problemData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Problem Basic Information
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Problem Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={problemData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter a descriptive problem title"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Problem Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={problemData.slug}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="problem-slug-format"
          />
        </div>

        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Problem ID
          </label>
          <input
            type="number"
            id="id"
            name="id"
            value={problemData.id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Problem ID"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
