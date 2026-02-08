import React, { useCallback } from "react";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  Button,
} from "@wisp/ui";
import type { EditorView } from "@codemirror/view";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Code,
  Link,
  Quote,
  Minus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditorToolbarProps {
  editorView: EditorView | null;
}

// ---------------------------------------------------------------------------
// Markdown insertion helpers
// ---------------------------------------------------------------------------

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);

  view.dispatch({
    changes: { from, to, insert: before + selected + after },
    selection: {
      anchor: from + before.length,
      head: to + before.length,
    },
  });
  view.focus();
}

function insertAtLineStart(view: EditorView, prefix: string) {
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);

  view.dispatch({
    changes: { from: line.from, to: line.from, insert: prefix },
    selection: { anchor: line.from + prefix.length },
  });
  view.focus();
}

function insertText(view: EditorView, text: string) {
  const { from, to } = view.state.selection.main;

  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  });
  view.focus();
}

// ---------------------------------------------------------------------------
// EditorToolbar
// ---------------------------------------------------------------------------

export function EditorToolbar({ editorView }: EditorToolbarProps) {
  const wrap = useCallback(
    (before: string, after: string) => {
      if (editorView) wrapSelection(editorView, before, after);
    },
    [editorView]
  );

  const lineStart = useCallback(
    (prefix: string) => {
      if (editorView) insertAtLineStart(editorView, prefix);
    },
    [editorView]
  );

  const insert = useCallback(
    (text: string) => {
      if (editorView) insertText(editorView, text);
    },
    [editorView]
  );

  return (
    <Toolbar size="sm" variant="transparent">
      {/* Text formatting */}
      <ToolbarGroup gap="xs">
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Bold size={14} />}
          title="Bold (Cmd+B)"
          onClick={() => wrap("**", "**")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Italic size={14} />}
          title="Italic (Cmd+I)"
          onClick={() => wrap("*", "*")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Strikethrough size={14} />}
          title="Strikethrough"
          onClick={() => wrap("~~", "~~")}
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarGroup gap="xs">
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Heading1 size={14} />}
          title="Heading 1"
          onClick={() => lineStart("# ")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Heading2 size={14} />}
          title="Heading 2"
          onClick={() => lineStart("## ")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Heading3 size={14} />}
          title="Heading 3"
          onClick={() => lineStart("### ")}
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarGroup gap="xs">
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<List size={14} />}
          title="Bullet list"
          onClick={() => lineStart("- ")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<ListOrdered size={14} />}
          title="Ordered list"
          onClick={() => lineStart("1. ")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<ListChecks size={14} />}
          title="Checklist"
          onClick={() => lineStart("- [ ] ")}
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Insert */}
      <ToolbarGroup gap="xs">
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Code size={14} />}
          title="Inline code"
          onClick={() => wrap("`", "`")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Link size={14} />}
          title="Link"
          onClick={() => insert("[text](url)")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Quote size={14} />}
          title="Blockquote"
          onClick={() => lineStart("> ")}
        />
        <Button
          size="xs"
          variant="tertiary"
          iconLeft={<Minus size={14} />}
          title="Horizontal rule"
          onClick={() => insert("\n---\n")}
        />
      </ToolbarGroup>
    </Toolbar>
  );
}
