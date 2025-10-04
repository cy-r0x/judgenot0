"use client";

import { useState, useEffect } from "react";
import { SubmissionCodeViewer } from "./client";
import Link from "next/link";
import submissionModule from "@/api/submission/submission";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import PageLoading from "@/components/LoadingSpinner/PageLoading";
import { getRelativeTime } from "@/utils/dateFormatter";
import {
  getVerdictName,
  getVerdictColor,
  getVerdictBgColor,
} from "@/utils/verdictFormatter";

export default function SubmissionPage({ params }) {
  const [contestId, setContestId] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Unwrap params
    Promise.resolve(params).then(({ contestId, submissionId }) => {
      setContestId(contestId);
      setSubmissionId(submissionId);
    });
  }, [params]);

  useEffect(() => {
    if (!submissionId) return;

    const fetchSubmission = async () => {
      setLoading(true);
      const { data, error } = await submissionModule.getSubmission(
        submissionId
      );

      if (error) {
        setError(error);
      } else {
        setSubmissionData(data);
      }
      setLoading(false);
    };

    fetchSubmission();
  }, [submissionId]);

  if (!contestId || !submissionId || loading) {
    return <PageLoading text="Loading submission..." />;
  }

  if (error) {
    return (
      <div className="px-6 md:px-16 py-6">
        <ErrorMessage message={error} type="error" fullWidth={true} />
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="px-6 md:px-16 py-6">
        <ErrorMessage
          message="Submission not found"
          type="error"
          fullWidth={true}
        />
      </div>
    );
  }

  // Format the submitted date as "time ago"
  const timeAgo = getRelativeTime(submissionData.submitted_at);

  return (
    <div className="px-6 md:px-16 py-6">
      <Link
        href={`/contests/${contestId}/${submissionData.problem_id}`}
        className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Problem
      </Link>
      <h2 className="text-2xl font-bold mb-6">Submission Details</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Submission ID</div>
          <div className="font-mono text-lg text-orange-500">
            #{submissionData.id}
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Verdict</div>
          <div
            className={`font-medium text-lg ${getVerdictColor(
              submissionData.verdict
            )}`}
          >
            {getVerdictName(submissionData.verdict)}
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Execution Time</div>
          <div className="font-medium text-lg">
            {submissionData.execution_time
              ? `${submissionData.execution_time * 1000} ms`
              : "—"}
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Memory Used</div>
          <div className="font-medium text-lg">
            {submissionData.memory_used
              ? `${submissionData.memory_used} KB`
              : "—"}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Username</div>
          <div className="font-medium text-lg">{submissionData.username}</div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Submitted At</div>
          <div className="font-medium text-lg">{timeAgo}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-medium">Solution Code</div>
          <div className="text-zinc-400">
            Language:{" "}
            <span className="text-white">
              {submissionData.language === "cpp"
                ? "C++"
                : submissionData.language === "python"
                ? "Python"
                : submissionData.language === "java"
                ? "Java"
                : submissionData.language}
            </span>
          </div>
        </div>

        <div className="border-2 border-zinc-800 rounded-lg overflow-hidden">
          <SubmissionCodeViewer
            code={submissionData.source_code}
            language={submissionData.language}
          />
        </div>
      </div>
    </div>
  );
}
