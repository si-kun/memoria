"use client";

import React from "react";
import {
  BoldItalicUnderlineToggles,
  CodeBlockEditorDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  InsertCodeBlock,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const customEditors: CodeBlockEditorDescriptor[] = [
  {
    language: "javascript",
    match: (lang) => lang === "javascript",
    Editor: ({ code, onChange }) => (
      <textarea
        className="w-full min-h-[100px] p-4 font-mono text-sm bg-zinc-900 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="コードをここに書いてください"
        defaultValue={code}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  },
];

const plugins = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  markdownShortcutPlugin(),
  thematicBreakPlugin(),
  codeBlockPlugin({
    defaultCodeBlockLanguage: "javascript",
    codeBlockEditorDescriptors: customEditors,
  }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "javascript",
      jsx: "javascript JSX",
      ts: "typescript",
      tsx: "typescript JSX",
      css: "css",
      html: "html",
      json: "json",
      python: "python",
    },
  }),
  toolbarPlugin({
    toolbarClassName: "custom-toolbar",
    toolbarContentsClassName: "custom-toolbar-contents",
    toolbarContents: ({ className = "" } = {}) => (
      <div className={`flex gap-2 w-full ${className}`}>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <InsertCodeBlock />
      </div>
    ),
    sticky: true,
  }),
];

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

const Editor = ({ markdown, onChange }: EditorProps) => {
  const handleEditorChange = (newMarkdown: string) => {
    onChange(newMarkdown);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col relative">
      <MDXEditor
        markdown={markdown}
        onChange={handleEditorChange}
        plugins={plugins}
        className="h-full"
        contentEditableClassName="editor-content"
      />
    </div>
  );
};

export default Editor;
