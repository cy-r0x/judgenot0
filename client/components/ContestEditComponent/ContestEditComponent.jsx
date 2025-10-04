"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContestDetailsTab from "./tabs/ContestDetailsTab";
import ManageUsersTab from "./tabs/ManageUsersTab";
import ManageProblemsTab from "./tabs/ManageProblemsTab";
import Button from "@/components/ButtonComponent/Button";
import NotificationComponent from "@/components/NotificationComponent/NotificationComponent";
import contestModule from "@/api/contest/contest";

export default function ContestEditComponent({ contestId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [contestData, setContestData] = useState({
    contest: {
      id: 0,
      title: "",
      description: "",
      start_time: "",
      duration_seconds: 0,
      status: "",
      created_at: "",
    },
    problems: [],
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);

        // Validate contestId
        if (!contestId) {
          throw new Error("Contest ID not provided");
        }

        // Fetch contest data
        const { data, error } = await contestModule.getContest(contestId);

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

        // Set the contest data
        if (data) {
          setContestData(data);
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        showNotification(
          error.message || "Failed to load contest data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId, router]);

  const tabs = ["Contest Details", "Manage Users", "Manage Problems"];

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleSave = async () => {
    console.log(contestData);
    try {
      // Convert start_time to ISO format before sending
      const contestToUpdate = {
        ...contestData.contest,
        start_time: new Date(contestData.contest.start_time).toISOString(),
      };

      const { data, error } = await contestModule.updateContest(
        contestToUpdate
      );

      if (error) {
        showNotification(error, "error");
      } else if (data) {
        setContestData((prev) => ({ ...prev, contest: data }));
        showNotification("Contest updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving contest:", error);
      showNotification("Failed to save contest. Please try again.", "error");
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
                  Loading contest data...
                </span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 0 && (
                <ContestDetailsTab
                  contestData={contestData}
                  setContestData={setContestData}
                />
              )}
              {activeTab === 1 && (
                <ManageUsersTab
                  contestData={contestData}
                  setContestData={setContestData}
                  showNotification={showNotification}
                />
              )}
              {activeTab === 2 && (
                <ManageProblemsTab
                  contestData={contestData}
                  setContestData={setContestData}
                  showNotification={showNotification}
                />
              )}
            </>
          )}
        </div>
      </div>

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
