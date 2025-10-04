"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ButtonComponent/Button";
import NotificationComponent from "@/components/NotificationComponent/NotificationComponent";
import contestModule from "@/api/contest/contest";

export default function CreateContestModal({ isOpen, onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    duration_seconds: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({
      isVisible: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      showNotification("Contest title is required", "error");
      return;
    }

    if (!formData.start_time) {
      showNotification("Start time is required", "error");
      return;
    }

    if (
      !formData.duration_seconds ||
      parseInt(formData.duration_seconds) <= 0
    ) {
      showNotification("Valid duration is required", "error");
      return;
    }

    try {
      setLoading(true);

      // Convert duration from minutes to seconds and format start_time to RFC3339
      const contestData = {
        title: formData.title,
        description: formData.description,
        start_time: new Date(formData.start_time).toISOString(),
        duration_seconds: parseInt(formData.duration_seconds) * 60,
      };

      const { data, error } = await contestModule.createContest(contestData);

      if (error) {
        showNotification(error, "error");
      } else if (data && data.id) {
        showNotification("Contest created successfully!", "success");
        // Redirect to edit page after short delay
        setTimeout(() => {
          router.push(`/edit/contest/${data.id}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      showNotification("Failed to create contest. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-zinc-700">
          <h2 className="text-2xl font-bold text-white">Create New Contest</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Contest Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter contest title"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter contest description"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="duration_seconds"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              Duration (Minutes)
            </label>
            <input
              type="number"
              id="duration_seconds"
              name="duration_seconds"
              value={formData.duration_seconds}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. 180 for 3 hours"
              disabled={loading}
              required
            />
            <p className="mt-1 text-xs text-zinc-400">
              Enter duration in minutes (e.g., 180 for 3 hours)
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <Button
              name={loading ? "Creating..." : "Create Contest"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>

        {/* Notification Component */}
        <NotificationComponent
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      </div>
    </div>
  );
}
