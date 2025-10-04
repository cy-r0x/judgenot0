"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BasicInfoTab from "./tabs/BasicInfoTab";
import DescriptionTab from "./tabs/DescriptionTab";
import TestCasesTab from "./tabs/TestCasesTab";
import LimitsTab from "./tabs/LimitsTab";
import SolutionsTab from "./tabs/SolutionsTab";
import TestCaseModal from "./modals/TestCaseModal";
import SolutionModal from "./modals/SolutionModal";
import Button from "@/components/ButtonComponent/Button";
import NotificationComponent from "@/components/NotificationComponent/NotificationComponent";
import problemMoudle from "@/api/problem/problem";

export default function ProblemEditComponent({ problemId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [problemData, setProblemData] = useState({
    id: 0,
    slug: "",
    title: "",
    statement: "",
    input_statement: "",
    output_statement: "",
    time_limit: 1,
    memory_limit: 256,
    test_cases: [],
    solutions: [],
    created_by: 0,
    created_at: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);

        // Validate problemId
        if (!problemId) {
          throw new Error("No problem ID provided");
        }

        // Fetch problem data
        const { data, error } = await problemMoudle.getProblem(problemId);

        if (error) {
          // Check if it's an authentication error
          if (
            error === "No access token found" ||
            error === "Invalid or expired token"
          ) {
            // Redirect to login page
            router.push("/login");
            return;
          }
          throw new Error(error);
        }

        // Set the problem data (getProblem now handles test_cases normalization)
        if (data) {
          setProblemData(data);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        showNotification(
          error.message || "Failed to load problem data",
          "error"
        );

        // Optionally redirect back or show error state
        // You might want to redirect to problem list or show an error page
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]); // Added dependency to re-fetch if problemId changes

  // Modal states
  const [showTestCaseModal, setShowTestCaseModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [currentTestCaseType, setCurrentTestCaseType] = useState("sample"); // "sample" or "regular"
  const [currentTestCase, setCurrentTestCase] = useState({
    input: "",
    output: "",
  });
  const [currentSolution, setCurrentSolution] = useState({
    language: "cpp",
    source: "",
  });
  const [editingIndex, setEditingIndex] = useState(-1); // -1 for new, >= 0 for editing existing

  // Notification states
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

  //solution has not been implemented yet!
  const tabs = ["Basic Info", "Problem Description", "Test Cases", "Limits"];

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const { data, error } = await problemMoudle.updateProblem(problemData);

      if (error) {
        // Handle API error response
        showNotification(error, "error");
      } else if (data) {
        // Success - update local data with response and show success message
        setProblemData(data);
        showNotification("Problem updated successfully!", "success");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error saving problem:", error);
      showNotification("Failed to save problem. Please try again.", "error");
    }
  };

  return (
    <div className="p-2">
      <div className="max-w-6xl mx-auto bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header with Tabs and Save Button */}
        <div className="flex justify-between items-center border-b border-zinc-700">
          <div className="flex">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index)}
                className={`px-4 py-3 transition-colors cursor-pointer ${
                  activeTab === index
                    ? "bg-orange-500 text-white font-medium"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }`}
                disabled={loading}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="pr-6">
            <Button
              name={loading ? "Loading..." : "Save Changes"}
              onClick={handleSave}
              disabled={loading}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="text-zinc-300 text-lg">
                  Loading problem data...
                </span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 0 && (
                <BasicInfoTab
                  problemData={problemData}
                  handleInputChange={handleInputChange}
                />
              )}
              {activeTab === 1 && (
                <DescriptionTab
                  problemData={problemData}
                  setProblemData={setProblemData}
                />
              )}
              {activeTab === 2 && (
                <TestCasesTab
                  problemData={problemData}
                  setProblemData={setProblemData}
                  setShowTestCaseModal={setShowTestCaseModal}
                  setCurrentTestCaseType={setCurrentTestCaseType}
                  setCurrentTestCase={setCurrentTestCase}
                  setEditingIndex={setEditingIndex}
                />
              )}
              {activeTab === 3 && (
                <LimitsTab
                  problemData={problemData}
                  handleInputChange={handleInputChange}
                />
              )}
              {activeTab === 4 && (
                <SolutionsTab
                  problemData={problemData}
                  setProblemData={setProblemData}
                  setShowSolutionModal={setShowSolutionModal}
                  setCurrentSolution={setCurrentSolution}
                  setEditingIndex={setEditingIndex}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTestCaseModal && (
        <TestCaseModal
          isOpen={showTestCaseModal}
          onClose={() => setShowTestCaseModal(false)}
          testCaseType={currentTestCaseType}
          testCase={currentTestCase}
          setTestCase={setCurrentTestCase}
          problemData={problemData}
          setProblemData={setProblemData}
          editingIndex={editingIndex}
        />
      )}

      {showSolutionModal && (
        <SolutionModal
          isOpen={showSolutionModal}
          onClose={() => setShowSolutionModal(false)}
          solution={currentSolution}
          setSolution={setCurrentSolution}
          problemData={problemData}
          setProblemData={setProblemData}
          editingIndex={editingIndex}
        />
      )}

      {/* Notification Component */}
      <NotificationComponent
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}
