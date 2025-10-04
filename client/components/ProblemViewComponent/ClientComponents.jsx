"use client";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/EditorComponent/EditorComponent";
import Button from "@/components/ButtonComponent/Button";
import submissionModule from "@/api/submission/submission";
import { useRouter } from "next/navigation";

// Client-side component for copying text to clipboard
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`absolute top-2 right-2 p-1 rounded  transition-colors ${
        copied ? "bg-orange-500" : " bg-zinc-800 hover:bg-zinc-700"
      }`}
      title="Copy to clipboard"
      disabled={copied}
    >
      {copied ? <p>Copied</p> : <p>Copy</p>}
    </button>
  );
}

// Client-side component for the editor section
export function EditorSection({ problemData, contestId }) {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
  });

  const router = useRouter();

  // Effect to hide the banner after 5 seconds
  useEffect(() => {
    let timer;
    if (feedback.visible) {
      timer = setTimeout(() => {
        setFeedback((prev) => ({ ...prev, visible: false }));
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [feedback.visible]);

  const handleCompileRun = () => {
    console.log("Compile and Run - Problem Data:", problemData);
    console.log(code);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setFeedback({
        visible: true,
        message: "Source code cannot be empty",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback((prev) => ({ ...prev, visible: false }));

    const activeContestId = contestId ?? problemData.contest_id;

    const { data, error } = await submissionModule.submitSubmission({
      problem_id: problemData.id,
      contest_id: activeContestId,
      source_code: code,
      language: selectedLanguage,
    });

    if (error) {
      setFeedback({
        visible: true,
        message: error,
      });
      setIsSubmitting(false);
      return;
    }

    const submissionId =
      data?.submission_id || data?.id || data?.submission?.id;

    if (!submissionId) {
      setFeedback({
        visible: true,
        message: "Submission succeeded but no submission ID returned",
      });
      setIsSubmitting(false);
      return;
    }

    router.push(`/contests/${activeContestId}/submissions/${submissionId}`);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className="w-[40%] border-l flex flex-col px-4 py-2">
      <div className="mb-3 flex justify-between items-center">
        <div>
          <select
            name="language"
            id="language-select"
            className="p-2 border rounded w-full bg-zinc-800"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-3">
          <Button name={"Compile and Run"} onClick={handleCompileRun} />
          <Button
            name={isSubmitting ? "Submitting..." : "Submit"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex-grow">
        <CodeEditor
          handleChange={setCode}
          selectedLanguage={selectedLanguage}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            syntaxHighlighting: true,
            bracketMatching: true,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightActiveLine: false,
            highlightSelectionMatches: true,
            closeBrackets: false,
            autocompletion: false,
            tabSize: 2,
          }}
        />
      </div>
      {/* Result Banner */}
      {feedback.visible ? (
        <div className="mt-3 rounded border border-red-500 px-3 py-2 text-sm text-red-300">
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
}
