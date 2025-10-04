"use client";
import Button from "../ButtonComponent/Button";
import { useState } from "react";
import setterModule from "@/api/setter/setter";
import { useRouter } from "next/navigation";

function CreateProblem({ setModalActive }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Problem title is required");
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await setterModule.createProblem(title);
    if (error) {
      setError(error);
      setIsSubmitting(false);
      return;
    }
    if (data && data.id) {
      router.push(`/edit/problem/${data.id}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-2">
          Create New Problem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-white font-medium">
              Problem Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              placeholder="Enter a descriptive title"
              className={`w-full px-3 py-2 bg-zinc-700 border ${
                error ? "border-red-500" : "border-zinc-600"
              } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-700 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 transition-colors"
              onClick={() => setModalActive(false)}
            >
              Cancel
            </button>
            <Button
              name={isSubmitting ? "Creating..." : "Create Problem"}
              disabled={isSubmitting}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProblem;
