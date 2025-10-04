"use client";

import { useEffect } from "react";
import katex from "katex";
import "./katexContent.css";

// Function to process LaTeX in HTML content
function renderKatexInHTML(html) {
  // Create temporary element
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Find all elements containing $ or $$ and replace with rendered KaTeX
  const textNodes = [];
  const walk = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  while ((node = walk.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    if (text.includes("$")) {
      const fragments = [];
      let lastIndex = 0;

      // Regex for inline math: $...$ but not $$...$$
      const inlineRegex = /\$([^\$]+?)\$/g;
      let match;

      while ((match = inlineRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          fragments.push(
            document.createTextNode(text.substring(lastIndex, match.index))
          );
        }

        // Create span for KaTeX
        const span = document.createElement("span");
        span.className = "math-inline"; // Add the math-inline class for styling
        try {
          katex.render(match[1], span, { displayMode: false });
        } catch (e) {
          span.textContent = match[0]; // fallback to original text if KaTeX fails
          console.error("KaTeX rendering error:", e);
        }
        fragments.push(span);

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        fragments.push(document.createTextNode(text.substring(lastIndex)));
      }

      // Replace the text node with rendered fragments
      const parent = textNode.parentNode;
      fragments.forEach((fragment) => {
        parent.insertBefore(fragment, textNode);
      });
      parent.removeChild(textNode);
    }
  });

  return tempDiv.innerHTML;
}

// Client component that handles KaTeX rendering
export default function KatexRenderer({ html }) {
  useEffect(() => {
    const elements = document.querySelectorAll(".katex-content");
    elements.forEach((element) => {
      element.innerHTML = renderKatexInHTML(element.innerHTML);
    });
  }, [html]);

  return (
    <div
      className="katex-content katex-content-view"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
