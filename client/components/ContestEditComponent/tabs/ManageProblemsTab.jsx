"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ButtonComponent/Button";
import {
  MdAdd,
  MdDelete,
  MdSearch,
  MdEdit,
  MdDragIndicator,
} from "react-icons/md";
import Link from "next/link";
import contestModule from "@/api/contest/contest";

export default function ManageProblemsTab({
  contestData,
  setContestData,
  showNotification,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [newProblem, setNewProblem] = useState({ problemId: "" });
  const [loading, setLoading] = useState(false);
  const [contestProblems, setContestProblems] = useState([]);

  // Fetch contest problems on component mount
  useEffect(() => {
    fetchContestProblems();
  }, [contestData.contest.id]);

  const fetchContestProblems = async () => {
    try {
      setLoading(true);
      const { data, error } = await contestModule.getContestProblems(
        contestData.contest.id
      );

      if (error) {
        showNotification(error, "error");
      } else if (data) {
        setContestProblems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching contest problems:", error);
      showNotification("Failed to load contest problems", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();

    if (!newProblem.problemId) {
      showNotification("Please enter a problem ID", "error");
      return;
    }

    const problemId = parseInt(newProblem.problemId);
    if (isNaN(problemId) || problemId <= 0) {
      showNotification("Please enter a valid problem ID", "error");
      return;
    }

    // Check if problem already exists in contest
    const exists = contestProblems.some((p) => p.problem_id === problemId);
    if (exists) {
      showNotification("Problem already exists in this contest", "error");
      return;
    }

    try {
      setLoading(true);

      const contestProblem = {
        contest_id: contestData.contest.id,
        problem_id: problemId,
      };

      const { data, error } = await contestModule.assignProblem(contestProblem);

      if (error) {
        showNotification(error, "error");
      } else if (data) {
        setNewProblem({ problemId: "" });
        setShowAddProblem(false);
        showNotification("Problem assigned successfully!", "success");

        // Refresh the problems list
        await fetchContestProblems();
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      showNotification("Failed to add problem. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProblem = async (problemId) => {
    try {
      setLoading(true);

      // TODO: Implement remove problem API call when available
      // For now, just remove from local state
      setContestProblems((prev) =>
        prev.filter((p) => p.problem_id !== problemId)
      );

      showNotification("Problem removed successfully!", "success");
    } catch (error) {
      console.error("Error removing problem:", error);
      showNotification("Failed to remove problem. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleIndexChange = async (problemId, newIndex) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await contestModule.updateProblemIndex(contestData.contest.id, problemId, newIndex);

      // Mock implementation
      setContestProblems((prev) =>
        prev
          .map((p) =>
            p.problem_id === problemId ? { ...p, index: parseInt(newIndex) } : p
          )
          .sort((a, b) => a.index - b.index)
      );

      showNotification("Problem order updated!", "success");
    } catch (error) {
      console.error("Error updating problem order:", error);
      showNotification("Failed to update problem order.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = contestProblems.filter(
    (problem) =>
      problem.problem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.problem_id.toString().includes(searchTerm)
  );

  const getNextIndex = () => {
    if (contestProblems.length === 0) return "1";
    const maxIndex = Math.max(...contestProblems.map((p) => p.index));
    return (maxIndex + 1).toString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Manage Contest Problems
      </h2>

      {/* Add Problem Section */}
      <div className="bg-zinc-700/30 rounded-lg p-6 border border-zinc-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Contest Problems</h3>
          <Button
            name="Add Problem"
            icon={<MdAdd />}
            onClick={() => setShowAddProblem(!showAddProblem)}
            disabled={loading}
          />
        </div>

        {showAddProblem && (
          <form
            onSubmit={handleAddProblem}
            className="space-y-4 border-t border-zinc-600 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="problemId"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Problem ID
                </label>
                <input
                  type="number"
                  id="problemId"
                  value={newProblem.problemId}
                  onChange={(e) =>
                    setNewProblem((prev) => ({
                      ...prev,
                      problemId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter problem ID"
                  min="1"
                  disabled={loading}
                  required
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Enter the ID of the problem you want to assign
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddProblem(false)}
                className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                name={loading ? "Adding..." : "Add Problem"}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        )}
      </div>

      {/* Problems List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            Problems in Contest ({contestProblems.length})
          </h3>

          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MdSearch className="absolute left-3 top-2.5 text-zinc-400" />
          </div>
        </div>

        {filteredProblems.length > 0 ? (
          <div className="bg-zinc-800/70 rounded-lg overflow-hidden shadow-lg border border-zinc-700/50">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Problem ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Problem Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Index
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-zinc-800/30 divide-y divide-zinc-700/50">
                {filteredProblems.map((problem, displayIndex) => (
                  <tr
                    key={problem.problem_id}
                    className="hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MdDragIndicator className="text-zinc-500 mr-2" />
                        <span className="text-zinc-300 font-mono">
                          {String.fromCharCode(65 + displayIndex)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-100">
                        {problem.problem_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-100">
                        {problem.problem_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-400">
                        {problem.problem_author || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={problem.index}
                        onChange={(e) =>
                          handleIndexChange(problem.problem_id, e.target.value)
                        }
                        className="w-20 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        min="1"
                        disabled={loading}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <div className="flex space-x-3">
                        <Link href={`/edit/problem/${problem.problem_id}`}>
                          <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                            <MdEdit />
                            <span>Edit</span>
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleRemoveProblem(problem.problem_id)
                          }
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                          disabled={loading}
                        >
                          <MdDelete />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
            <MdAdd className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-2 text-sm font-medium text-zinc-300">
              No problems found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {searchTerm
                ? "No problems match your search."
                : "No problems added to this contest yet."}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <Button
                  name="Add Your First Problem"
                  icon={<MdAdd />}
                  onClick={() => setShowAddProblem(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
