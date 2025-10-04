"use client";

import { useState, useEffect } from "react";
import { FaUser, FaClock, FaMemory } from "react-icons/fa";
import { GoFileCode, GoVersions, GoHash } from "react-icons/go";
import {
  MdOutlineDone,
  MdClose,
  MdLoop,
  MdAccessTime,
  MdMemory,
  MdError,
} from "react-icons/md";
import Link from "next/link";
import submissionModule from "@/api/submission/submission";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import PageLoading from "@/components/LoadingSpinner/PageLoading";
import { getRelativeTime } from "@/utils/dateFormatter";
import EmptyState from "@/components/EmptyState/EmptyState";
import { getVerdictName, getVerdictColor } from "@/utils/verdictFormatter";

export default function SubmissionsTable({ params }) {
  const [contestId, setContestId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Unwrap params
    Promise.resolve(params).then(({ contestId }) => {
      setContestId(contestId);
    });
  }, [params]);

  useEffect(() => {
    if (!contestId) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      const { data, error } = await submissionModule.getSubmissions();

      if (error) {
        setError(error);
      } else {
        setSubmissions(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [contestId]);

  if (!contestId || loading) {
    return (
      <PageLoading
        text="Loading submissions..."
        height="h-[calc(100vh-200px)]"
      />
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-16 py-6">
        <div className="mb-6">
          <Link
            href={`/contests/${contestId}`}
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
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
            Back to Contest
          </Link>
        </div>
        <ErrorMessage message={error} type="error" fullWidth={true} />
      </div>
    );
  }

  const getStatusIcon = (verdict) => {
    const lowerVerdict = verdict?.toLowerCase();

    switch (lowerVerdict) {
      case "ac":
      case "accepted":
        return <MdOutlineDone className="text-green-500" title="Accepted" />;
      case "wa":
      case "wrong answer":
        return <MdClose className="text-red-500" title="Wrong Answer" />;
      case "tle":
      case "time limit exceeded":
        return (
          <MdAccessTime
            className="text-purple-500"
            title="Time Limit Exceeded"
          />
        );
      case "mle":
      case "memory limit exceeded":
        return (
          <MdMemory className="text-orange-500" title="Memory Limit Exceeded" />
        );
      case "re":
      case "runtime error":
        return <MdError className="text-pink-500" title="Runtime Error" />;
      case "ce":
      case "compilation error":
        return (
          <MdClose className="text-yellow-500" title="Compilation Error" />
        );
      case "pending":
        return (
          <GoVersions
            className="text-yellow-400 animate-pulse duration-1000"
            title="Pending"
          />
        );
      case "running":
        return (
          <MdLoop className="text-blue-500 animate-spin" title="Running" />
        );
      default:
        return <MdClose className="text-gray-500" title={verdict} />;
    }
  };

  const getLanguageDisplay = (language) => {
    switch (language) {
      case "cpp":
        return "C++";
      case "python":
        return "Python";
      case "java":
        return "Java";
      default:
        return language;
    }
  };

  return (
    <div className="px-6 md:px-16 py-6">
      <div className="mb-6">
        <Link
          href={`/contests/${contestId}`}
          className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
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
          Back to Contest
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Contest Submissions</h2>

      {submissions.length === 0 ? (
        <EmptyState
          title="No Submissions Yet"
          description="Submit a solution to see it here"
          icon={
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border-2 border-zinc-800">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-zinc-900 text-zinc-300 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <FaUser />
                    User
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <GoHash />
                    Language
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <GoFileCode />
                    Problem
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <MdLoop />
                    Verdict
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <FaClock />
                    Time
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <FaMemory />
                    Memory
                  </div>
                </th>
                <th className="py-3 px-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {submissions.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800 transition-colors duration-150"
                >
                  <td className="py-3 px-4 font-mono text-orange-500 hover:underline">
                    <Link
                      href={`/contests/${contestId}/submissions/${item.id}`}
                    >
                      #{item.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{item.username}</td>
                  <td className="py-3 px-4">
                    {getLanguageDisplay(item.language)}
                  </td>
                  <td className="py-3 px-4 text-blue-400 hover:underline">
                    <Link href={`/contests/${contestId}/${item.problem_id}`}>
                      {String.fromCharCode(
                        "A".charCodeAt(0) + item.problem_id - 1
                      )}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.verdict)}
                      <span
                        className={`font-medium ${getVerdictColor(
                          item.verdict
                        )}`}
                      >
                        {getVerdictName(item.verdict)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {item.execution_time
                      ? `${item.execution_time * 1000} ms`
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {item.memory_used ? `${item.memory_used} KB` : "—"}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {getRelativeTime(item.submitted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
