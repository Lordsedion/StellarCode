/// <reference types="react-scripts" />
declare module '*.mp3';
declare module '*jpg';
declare module '*png';

declare module '@monaco-editor/react' {
    import { editor } from 'monaco-editor';
    import * as React from 'react';
  
    export interface EditorProps {
      width?: string | number;
      height?: string | number;
      value?: string;
      defaultValue?: string;
      language?: string;
      defaultLanguage?: string;
      theme?: string;
      options?: editor.IStandaloneEditorConstructionOptions;
      overrideServices?: editor.IEditorOverrideServices;
      className?: string;
      wrapperClassName?: string;
      editorDidMount?: (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void;
      editorWillMount?: (monaco: typeof import('monaco-editor')) => void | editor.IStandaloneEditorConstructionOptions;
      editorWillUnmount?: (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void;
      onChange?: (value: string | undefined, event: editor.IModelContentChangedEvent) => void;
      beforeMount?: (monaco: typeof import('monaco-editor')) => void;
      onMount?: (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void;
    }
  
    const Editor: React.FC<EditorProps>;
    export default Editor;
  }
