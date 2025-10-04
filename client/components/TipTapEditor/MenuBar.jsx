// MenuBar.jsx
"use client";

import React from "react";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaUndo,
  FaRedo,
  FaHeading,
  FaSquareRootAlt,
  FaSuperscript,
} from "react-icons/fa";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const insertInlineMath = () => {
    const math = prompt(
      "Enter LaTeX for inline math: (without $ symbols)",
      "x^2 + y^2 = z^2"
    );
    if (math) {
      editor.chain().focus().insertContent(`$${math}$`).run();
    }
  };

  const insertBlockMath = () => {
    const math = prompt(
      "Enter LaTeX for block math: (without $$ symbols)",
      "\\int_0^1 x^2 dx"
    );
    if (math) {
      editor.chain().focus().insertContent(`$$${math}$$`).run();
    }
  };

  return (
    <div className="menu-bar">
      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
          title="Bold"
        >
          <FaBold />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
          title="Italic"
        >
          <FaItalic />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
          title="Heading 2"
        >
          <FaHeading />
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active" : ""}
          title="Bullet List"
        >
          <FaListUl />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active" : ""}
          title="Ordered List"
        >
          <FaListOl />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active" : ""}
          title="Blockquote"
        >
          <FaQuoteLeft />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active" : ""}
          title="Code Block"
        >
          <FaCode />
        </button>
      </div>

      <div className="menu-group math-buttons">
        <button onClick={insertInlineMath} title="Insert Inline Math ($ ... $)">
          <FaSuperscript /> Inline
        </button>

        <button onClick={insertBlockMath} title="Insert Block Math ($$ ... $$)">
          <FaSquareRootAlt /> Block
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
}
