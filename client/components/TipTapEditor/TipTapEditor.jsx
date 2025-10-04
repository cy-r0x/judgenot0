"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import katex from "katex";
import "katex/dist/katex.min.css";
import MenuBar from "./MenuBar";
import "./editorStyle.css";
import { useEffect, useRef, useCallback } from "react";

export default function TipTapEditor({ initialContent = "", onUpdate = null }) {
  const editorRef = useRef(null);
  const contentRef = useRef(initialContent);

  // Create a stable onUpdate callback that doesn't trigger re-renders
  const handleUpdate = useCallback(
    ({ editor }) => {
      if (!onUpdate) return;

      const json = editor.getJSON();
      // Convert to string for comparison
      const jsonString = JSON.stringify(json);
      // Only update if content has actually changed
      if (jsonString !== contentRef.current) {
        contentRef.current = jsonString;
        onUpdate(json);
      }
    },
    [onUpdate]
  );

  // Create editor instance with a stable configuration
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Mathematics.configure({
          renderLabel: "KaTeX",
          katex,
          delimiters: [
            { left: "$", right: "$", type: "inline" },
            { left: "$$", right: "$$", type: "block" },
          ],
        }),
      ],
      content:
        typeof initialContent === "string"
          ? initialContent.startsWith("{")
            ? JSON.parse(initialContent)
            : initialContent
          : initialContent,
      editorProps: {
        attributes: {
          class: "tiptap-editor-content",
        },
      },
      onUpdate: handleUpdate,
      // Fix for SSR hydration mismatch
      immediatelyRender: false,
    },
    [] // Empty dependency array ensures editor is only created once
  );

  // Handle initialContent changes from props
  useEffect(() => {
    if (!editor) return;

    const currentContent = contentRef.current;
    const newContent =
      typeof initialContent === "string"
        ? initialContent
        : JSON.stringify(initialContent);

    if (newContent !== currentContent) {
      contentRef.current = newContent;
      // Parse JSON if it's a string representation
      const contentToSet =
        typeof initialContent === "string" && initialContent.startsWith("{")
          ? JSON.parse(initialContent)
          : initialContent;
      // Use transaction to avoid losing selection/focus
      editor.commands.setContent(contentToSet, false);
    }
  }, [editor, initialContent]);

  return (
    <div className="tiptap-editor-wrapper" ref={editorRef}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
