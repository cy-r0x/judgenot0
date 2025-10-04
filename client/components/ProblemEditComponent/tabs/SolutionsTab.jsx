"use client";

import Button from "@/components/ButtonComponent/Button";

export default function SolutionsTab({
  problemData,
  setProblemData,
  setShowSolutionModal,
  setCurrentSolution,
  setEditingIndex,
}) {
  const handleAddSolution = () => {
    setCurrentSolution({ language: "cpp", source: "" });
    setEditingIndex(-1);
    setShowSolutionModal(true);
  };

  const handleEditSolution = (index) => {
    setCurrentSolution({ ...problemData.solutions[index] });
    setEditingIndex(index);
    setShowSolutionModal(true);
  };

  const handleDeleteSolution = (index) => {
    setProblemData((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index),
    }));
  };

  const getLanguageLabel = (code) => {
    switch (code) {
      case "cpp":
        return "C++";
      case "c":
        return "C";
      case "java":
        return "Java";
      case "python":
        return "Python";
      default:
        return code.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2 border-zinc-700">
        <h2 className="text-xl font-bold text-white">Official Solutions</h2>
        <Button name="Add Solution" onClick={handleAddSolution} />
      </div>

      {problemData.solutions.length > 0 ? (
        <div className="space-y-4">
          {problemData.solutions.map((solution, index) => (
            <div
              key={`solution-${index}`}
              className="border border-zinc-700 rounded-md overflow-hidden bg-zinc-800/50"
            >
              <div className="flex justify-between items-center px-4 py-3 bg-zinc-700/30">
                <span className="font-semibold text-zinc-300">
                  Solution #{index + 1} - {getLanguageLabel(solution.language)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSolution(index)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSolution(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="p-3 text-xs font-mono bg-zinc-900/50 max-h-72 overflow-auto">
                <pre className="whitespace-pre-wrap">{solution.source}</pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-center">
          <p className="text-zinc-400">
            No solutions added yet. Add an official solution to validate test
            cases.
          </p>
        </div>
      )}
    </div>
  );
}
