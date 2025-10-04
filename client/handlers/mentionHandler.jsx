function FormatMention({ text }) {
  const highlightedText = text.replace(
    /(\S*?@\S*)/g,
    '<span class="text-orange-500 font-semibold">$1</span>'
  );

  return <p dangerouslySetInnerHTML={{ __html: highlightedText }}></p>;
}

export default FormatMention;
