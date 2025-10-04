"use client";

import { useState } from "react";

export default function TestCaseItem({ testCase, index, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-zinc-700 rounded-md overflow-hidden bg-zinc-800/50">
      <div className="flex justify-between items-center px-4 py-3 bg-zinc-700/30">
        <div className="flex items-center">
          <span className="font-semibold text-zinc-300">
            Test Case #{index + 1}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-3 text-zinc-400 hover:text-white transition-colors"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-zinc-400 mb-1">Input:</div>
            <pre className="p-2 bg-zinc-900 rounded-md text-zinc-300 whitespace-pre-wrap overflow-auto max-h-48">
              {testCase.input}
            </pre>
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-400 mb-1">
              Output:
            </div>
            <pre className="p-2 bg-zinc-900 rounded-md text-zinc-300 whitespace-pre-wrap overflow-auto max-h-48">
              {testCase.output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
