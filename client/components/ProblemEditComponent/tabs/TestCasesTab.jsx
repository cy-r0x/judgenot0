"use client";
import Button from "@/components/ButtonComponent/Button";
import TestCaseItem from "../components/TestCaseItem";

export default function TestCasesTab({
  problemData,
  setProblemData,
  setShowTestCaseModal,
  setCurrentTestCaseType,
  setCurrentTestCase,
  setEditingIndex,
}) {
  const handleAddTestCase = (type) => {
    setCurrentTestCaseType(type);
    setCurrentTestCase({ input: "", output: "" });
    setEditingIndex(-1); // -1 indicates we're adding a new test case
    setShowTestCaseModal(true);
  };

  const handleEditTestCase = (type, index) => {
    const sampleTestCases = problemData.test_cases.filter((tc) => tc.is_sample);
    const regularTestCases = problemData.test_cases.filter(
      (tc) => !tc.is_sample
    );
    const testCases = type === "sample" ? sampleTestCases : regularTestCases;

    setCurrentTestCaseType(type);
    setCurrentTestCase({
      input: testCases[index].input,
      output: testCases[index].expected_output,
    });
    setEditingIndex(index);
    setShowTestCaseModal(true);
  };

  const handleDeleteTestCase = (type, index) => {
    setProblemData((prev) => {
      const filteredTestCases = prev.test_cases.filter((tc) =>
        type === "sample" ? tc.is_sample : !tc.is_sample
      );
      const testCaseToDelete = filteredTestCases[index];

      // Find the actual index in the original array
      const actualIndex = prev.test_cases.findIndex(
        (tc) =>
          tc.input === testCaseToDelete.input &&
          tc.expected_output === testCaseToDelete.expected_output &&
          tc.is_sample === testCaseToDelete.is_sample
      );

      return {
        ...prev,
        test_cases: prev.test_cases.filter((_, i) => i !== actualIndex),
      };
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Test Cases
      </h2>

      <div className="space-y-6">
        {/* Sample Test Cases */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-lg font-medium text-zinc-300">
              Sample Test Cases
            </label>
            <Button
              name="Add Sample Test Case"
              onClick={() => handleAddTestCase("sample")}
            />
          </div>

          {problemData.test_cases.filter((tc) => tc.is_sample).length > 0 ? (
            <div className="space-y-4">
              {problemData.test_cases
                .filter((tc) => tc.is_sample)
                .map((testCase, index) => (
                  <TestCaseItem
                    key={`sample-${testCase.id || index}`}
                    testCase={{
                      input: testCase.input,
                      output: testCase.expected_output,
                    }}
                    index={index}
                    onEdit={() => handleEditTestCase("sample", index)}
                    onDelete={() => handleDeleteTestCase("sample", index)}
                  />
                ))}
            </div>
          ) : (
            <div className="p-4 bg-zinc-700/30 rounded-md text-zinc-400 text-center">
              No sample test cases added yet. Click the button above to add one.
            </div>
          )}
        </div>

        {/* Regular Test Cases */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-lg font-medium text-zinc-300">
              Regular Test Cases
            </label>
            <Button
              name="Add Regular Test Case"
              onClick={() => handleAddTestCase("regular")}
            />
          </div>

          {problemData.test_cases.filter((tc) => !tc.is_sample).length > 0 ? (
            <div className="space-y-4">
              {problemData.test_cases
                .filter((tc) => !tc.is_sample)
                .map((testCase, index) => (
                  <TestCaseItem
                    key={`regular-${testCase.id || index}`}
                    testCase={{
                      input: testCase.input,
                      output: testCase.expected_output,
                    }}
                    index={index}
                    onEdit={() => handleEditTestCase("regular", index)}
                    onDelete={() => handleDeleteTestCase("regular", index)}
                  />
                ))}
            </div>
          ) : (
            <div className="p-4 bg-zinc-700/30 rounded-md text-zinc-400 text-center">
              No regular test cases added yet. Click the button above to add
              one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
