"use client";

import { useState } from "react";
import Button from "@/components/ButtonComponent/Button";
import CodeMirror from "@uiw/react-codemirror";
import { material } from "@uiw/codemirror-theme-material";

export default function TestCaseModal({
  isOpen,
  onClose,
  testCaseType,
  testCase,
  setTestCase,
  problemData,
  setProblemData,
  editingIndex,
}) {
  const [input, setInput] = useState(testCase.input || "");
  const [output, setOutput] = useState(testCase.output || "");

  const handleSave = () => {
    if (!input.trim() && !output.trim()) {
      alert("Both input and output must not be empty");
      return;
    }

    const newTestCase = {
      input,
      expected_output: output,
      is_sample: testCaseType === "sample",
    };

    if (editingIndex === -1) {
      // Add new test case
      setProblemData((prev) => ({
        ...prev,
        test_cases: [...prev.test_cases, newTestCase],
      }));
    } else {
      // Update existing test case
      setProblemData((prev) => {
        const filteredTestCases = prev.test_cases.filter((tc) =>
          testCaseType === "sample" ? tc.is_sample : !tc.is_sample
        );
        const targetTestCase = filteredTestCases[editingIndex];

        // Find the actual index in the original array
        const actualIndex = prev.test_cases.findIndex(
          (tc) =>
            tc.input === targetTestCase.input &&
            tc.expected_output === targetTestCase.expected_output &&
            tc.is_sample === targetTestCase.is_sample
        );

        const updatedTestCases = prev.test_cases.map((tc, index) =>
          index === actualIndex ? { ...tc, input, expected_output: output } : tc
        );

        return {
          ...prev,
          test_cases: updatedTestCases,
        };
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-2 border-zinc-700">
          {editingIndex === -1 ? "Add" : "Edit"}{" "}
          {testCaseType === "sample" ? "Sample" : "Regular"} Test Case
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Input
            </label>
            <div className="border border-zinc-700 rounded-md overflow-hidden">
              <CodeMirror
                value={input}
                height="16rem"
                onChange={setInput}
                theme={material}
                placeholder="Enter test case input..."
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Output
            </label>
            <div className="border border-zinc-700 rounded-md overflow-hidden">
              <CodeMirror
                value={output}
                height="16rem"
                onChange={setOutput}
                theme={material}
                placeholder="Enter expected output..."
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                }}
              />
            </div>
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
          <Button name="Save Test Case" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}
