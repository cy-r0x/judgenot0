"use client";

import { memo } from "react";
import TipTapEditor from "@/components/TipTapEditor/TipTapEditor";

// Extracted to its own memoized component to prevent re-renders
const TipTapWrapper = memo(({ field, initialContent, setProblemData }) => {
  const handleUpdate = (newContent) => {
    setProblemData((prev) => ({
      ...prev,
      [field]: newContent,
    }));
  };

  return (
    <div className="tiptap-container border border-zinc-600 rounded-md overflow-hidden">
      <TipTapEditor initialContent={initialContent} onUpdate={handleUpdate} />
    </div>
  );
});

TipTapWrapper.displayName = "TipTapWrapper";

export default function DescriptionTab({ problemData, setProblemData }) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white border-b pb-2 border-zinc-700">
        Problem Description
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Problem Statement
          </label>
          <p className="text-zinc-400 text-xs mb-2">
            Describe the problem in detail. You can use math expressions with
            $...$ for inline and $$...$$ for block math.
          </p>
          <TipTapWrapper
            field="statement"
            initialContent={problemData.statement}
            setProblemData={setProblemData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Input Description
          </label>
          <p className="text-zinc-400 text-xs mb-2">
            Describe the input format in detail.
          </p>
          <TipTapWrapper
            field="input_statement"
            initialContent={problemData.input_statement}
            setProblemData={setProblemData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Output Description
          </label>
          <p className="text-zinc-400 text-xs mb-2">
            Describe the expected output format in detail.
          </p>
          <TipTapWrapper
            field="output_statement"
            initialContent={problemData.output_statement}
            setProblemData={setProblemData}
          />
        </div>
      </div>
    </div>
  );
}
