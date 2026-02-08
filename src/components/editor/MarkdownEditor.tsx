import React, { useRef, useEffect, useState, useCallback } from "react";
import { useThemeColors } from "@wisp/ui";
import type { ThemeColors } from "@wisp/ui";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { createSeanceTheme } from "./editorTheme";
import { markdownDecorations } from "./markdownDecorations";
import { EditorToolbar } from "./EditorToolbar";
import { useSettings } from "../../context/SettingsContext";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// ---------------------------------------------------------------------------
// MarkdownEditor
// ---------------------------------------------------------------------------

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const colors = useThemeColors();
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  // Track the latest onChange to avoid stale closures
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Track whether we're programmatically updating the doc
  const isExternalUpdate = useRef(false);

  const fontFamily =
    settings.editorFont === "mono"
      ? "'JetBrains Mono', monospace"
      : "'Plus Jakarta Sans', sans-serif";

  // Create editor on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = settings.theme === "dark";
    const theme = createSeanceTheme(colors as ThemeColors, settings.fontSize, fontFamily, isDark);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && !isExternalUpdate.current) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: content,
      extensions: [
        // Keymaps
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        history(),

        // Markdown language
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),

        // Appearance
        theme,
        highlightSelectionMatches(),

        // Bear-style live decorations
        markdownDecorations,

        // Change listener
        updateListener,

        // Wrapping
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    setEditorView(view);

    return () => {
      view.destroy();
      viewRef.current = null;
      setEditorView(null);
    };
    // Only re-create editor when theme/font settings change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, settings.fontSize, settings.editorFont, settings.theme]);

  // Sync external content changes (e.g. switching files)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== content) {
      isExternalUpdate.current = true;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: content,
        },
      });
      isExternalUpdate.current = false;
    }
  }, [content]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <EditorToolbar editorView={editorView} />

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "0 24px",
        }}
      />
    </div>
  );
}
