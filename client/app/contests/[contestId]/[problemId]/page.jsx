"use client";

import { useState, useEffect } from "react";
import { EditorSection } from "@/components/ProblemViewComponent/ClientComponents";
import ProblemViewComponent from "@/components/ProblemViewComponent/ProblemViewComponent";
import problemModule from "@/api/problem/problem";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import PageLoading from "@/components/LoadingSpinner/PageLoading";

export default function ProblemDescription({ params }) {
  const [contestId, setContestId] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Unwrap params
    Promise.resolve(params).then(({ contestId, problemId }) => {
      setContestId(contestId);
      setProblemId(problemId);
    });
  }, [params]);

  useEffect(() => {
    if (!problemId) return;

    const fetchProblem = async () => {
      setLoading(true);
      const { data, error } = await problemModule.getProblem(problemId);

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Problem not found");
        setLoading(false);
        return;
      }

      // Parse JSON strings in-place
      const parsedData = { ...data };
      if (typeof parsedData.statement === "string") {
        try {
          parsedData.statement = JSON.parse(parsedData.statement);
        } catch (e) {
          console.error("Error parsing statement:", e);
        }
      }
      if (typeof parsedData.input_statement === "string") {
        try {
          parsedData.input_statement = JSON.parse(parsedData.input_statement);
        } catch (e) {
          console.error("Error parsing input_statement:", e);
        }
      }
      if (typeof parsedData.output_statement === "string") {
        try {
          parsedData.output_statement = JSON.parse(parsedData.output_statement);
        } catch (e) {
          console.error("Error parsing output_statement:", e);
        }
      }

      // Add contest_id to the problem response
      parsedData.contest_id = contestId;

      setProblemData(parsedData);
      setLoading(false);
    };

    fetchProblem();
  }, [problemId, contestId]);

  if (!contestId || !problemId || loading) {
    return <PageLoading text="Loading problem..." size="xl" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)] p-8">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} type="error" fullWidth={true} />
        </div>
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)] p-8">
        <div className="max-w-md w-full">
          <ErrorMessage
            message="Problem not found"
            type="error"
            fullWidth={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] overflow-hidden">
      <div className="flex flex-grow overflow-hidden">
        {/* Problem description - 60% width */}
        <div className="w-[60%] overflow-auto">
          <ProblemViewComponent problem={problemData} contestId={contestId} />
        </div>
        {/* Editor section - 40% width - Client-side rendered */}
        <EditorSection problemData={problemData} contestId={contestId} />
      </div>
    </div>
  );
}
