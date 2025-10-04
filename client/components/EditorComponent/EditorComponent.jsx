import { monokai } from "@uiw/codemirror-theme-monokai";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

function CodeEditor({ handleChange, selectedLanguage }) {
  const languageExtensions = {
    cpp: cpp(),
    python: python(),
    java: java(),
  };

  const lang = languageExtensions[selectedLanguage] || cpp();
  const changeCode = (value) => {
    handleChange(value);
  };

  return (
    <CodeMirror
      height="calc(100vh - 150px)"
      extensions={[lang]}
      onChange={changeCode}
      theme={monokai}
    />
  );
}

export default CodeEditor;
