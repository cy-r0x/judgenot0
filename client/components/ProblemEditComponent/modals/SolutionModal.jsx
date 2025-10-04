"use client";

import { useState } from "react";
import Button from "@/components/ButtonComponent/Button";
import CodeEditor from "@/components/EditorComponent/EditorComponent";

export default function SolutionModal({
  isOpen,
  onClose,
  solution,
  setSolution,
  problemData,
  setProblemData,
  editingIndex,
}) {
  const [source, setSource] = useState(solution.source || "");
  const [language, setLanguage] = useState(solution.language || "cpp");

  const handleSave = () => {
    if (!source.trim()) {
      alert("Solution source code must not be empty");
      return;
    }

    const newSolution = { language, source };

    if (editingIndex === -1) {
      // Add new solution
      setProblemData((prev) => ({
        ...prev,
        solutions: [...prev.solutions, newSolution],
      }));
    } else {
      // Update existing solution
      setProblemData((prev) => {
        const updatedSolutions = [...prev.solutions];
        updatedSolutions[editingIndex] = newSolution;
        return {
          ...prev,
          solutions: updatedSolutions,
        };
      });
    }

    onClose();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-2 border-zinc-700">
          {editingIndex === -1 ? "Add" : "Edit"} Solution
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Source Code
          </label>
          <div className="border border-zinc-700 rounded-md overflow-hidden h-96">
            <CodeEditor
              handleChange={setSource}
              selectedLanguage={language}
              initialValue={source}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-700 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button name="Save Solution" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}
