import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import './_sql-editor.scss';

const SQLEditor = ({ value, onChange, onRun, loading }) => {
  const editorRef = useRef(null);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Fix: use monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter for proper Ctrl+Enter
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => { onRun(); }
    );

    // Focus the editor on mount
    editor.focus();
  };

  return (
    <div className="sql-editor">
      <div className="sql-editor__header">
        <h3 className="sql-editor__title">SQL Query</h3>
        <div className="sql-editor__header-right">
          <span className="sql-editor__hint">Ctrl+Enter to run</span>
          <button
            className="sql-editor__run-btn"
            onClick={onRun}
            disabled={loading}
          >
            {loading ? (
              <><span className="sql-editor__btn-spinner"></span> Running...</>
            ) : (
              <>▶ Run Query</>
            )}
          </button>
        </div>
      </div>
      <div className="sql-editor__wrapper">
        <Editor
          height="220px"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>
    </div>
  );
};

export default SQLEditor;
