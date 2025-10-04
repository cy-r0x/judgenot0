// This utility function converts TipTap JSON document to HTML
// while preserving CSS classes for proper rendering with KaTeX

function convertTiptapToHtml(doc) {
  if (!doc || !doc.content) return "";

  return renderNodes(doc.content);
}

function renderNodes(nodes) {
  if (!nodes || !Array.isArray(nodes)) return "";

  return nodes.map((node) => renderNode(node)).join("");
}

function renderNode(node) {
  if (!node) return "";

  switch (node.type) {
    case "doc":
      return `<div class="katex-content-view">${renderNodes(
        node.content
      )}</div>`;

    case "paragraph":
      return `<p>${renderNodes(node.content)}</p>`;

    case "text":
      let text = node.text;

      // Apply marks (bold, italic, etc.)
      if (node.marks && node.marks.length > 0) {
        node.marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              text = `<strong>${text}</strong>`;
              break;
            case "italic":
              text = `<em>${text}</em>`;
              break;
            case "underline":
              text = `<u>${text}</u>`;
              break;
            case "strike":
              text = `<s>${text}</s>`;
              break;
            case "code":
              text = `<code>${text}</code>`;
              break;
          }
        });
      }

      return text;

    case "bulletList":
      return `<ul>${renderNodes(node.content)}</ul>`;

    case "orderedList":
      return `<ol>${renderNodes(node.content)}</ol>`;

    case "listItem":
      return `<li>${renderNodes(node.content)}</li>`;

    case "heading":
      const level = node.attrs && node.attrs.level ? node.attrs.level : 1;
      return `<h${level}>${renderNodes(node.content)}</h${level}>`;

    case "blockquote":
      return `<blockquote>${renderNodes(node.content)}</blockquote>`;

    case "codeBlock":
      const language =
        node.attrs && node.attrs.language ? node.attrs.language : "";
      return `<pre><code class="language-${language}">${renderNodes(
        node.content
      )}</code></pre>`;

    case "horizontalRule":
      return "<hr>";

    case "hardBreak":
      return "<br>";

    case "mathBlock":
      // Handling block math without background
      return `<div data-type="mathBlock">${renderNodes(node.content)}</div>`;

    case "mathInline":
      // Handling inline math
      return `<span class="math-inline">${renderNodes(node.content)}</span>`;

    default:
      return renderNodes(node.content) || "";
  }
}

export default convertTiptapToHtml;
