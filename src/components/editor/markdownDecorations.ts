import {
  ViewPlugin,
  Decoration,
  type DecorationSet,
  type EditorView,
  type ViewUpdate,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

// ---------------------------------------------------------------------------
// Decoration marks — applied via CSS classes defined in editorTheme.ts
// ---------------------------------------------------------------------------

const headingMarkerDeco = Decoration.mark({ class: "cm-heading-marker" });
const header1Deco = Decoration.mark({ class: "cm-header-1" });
const header2Deco = Decoration.mark({ class: "cm-header-2" });
const header3Deco = Decoration.mark({ class: "cm-header-3" });
const formattingBoldDeco = Decoration.mark({ class: "cm-formatting-bold" });
const formattingItalicDeco = Decoration.mark({ class: "cm-formatting-italic" });
const formattingStrikethroughDeco = Decoration.mark({ class: "cm-formatting-strikethrough" });
const formattingCodeDeco = Decoration.mark({ class: "cm-formatting-code" });
const inlineCodeDeco = Decoration.mark({ class: "cm-inline-code" });
const blockquoteLineDeco = Decoration.line({ class: "cm-blockquote-line" });
const formattingQuoteDeco = Decoration.mark({ class: "cm-formatting-quote" });
const linkDeco = Decoration.mark({ class: "cm-link" });
const urlDeco = Decoration.mark({ class: "cm-url" });
const formattingListDeco = Decoration.mark({ class: "cm-formatting-list" });
const taskMarkerDeco = Decoration.mark({ class: "cm-task-marker" });
const hrDeco = Decoration.line({ class: "cm-hr" });

// ---------------------------------------------------------------------------
// Build decorations from the Lezer markdown syntax tree
// ---------------------------------------------------------------------------

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const tree = syntaxTree(view.state);

  // Track line decorations separately (they must be added in order)
  const lineDecos: { pos: number; deco: Decoration }[] = [];

  tree.iterate({
    enter(node) {
      const { from, to, name } = node;

      // --- Headings ---
      if (name === "ATXHeading1" || name === "ATXHeading2" || name === "ATXHeading3") {
        const headerDeco =
          name === "ATXHeading1" ? header1Deco
          : name === "ATXHeading2" ? header2Deco
          : header3Deco;

        // Find the heading mark (# symbols)
        const line = view.state.doc.lineAt(from);
        const text = line.text;
        const match = text.match(/^(#{1,3})\s/);

        if (match) {
          const markEnd = from + match[1].length;
          // Dim the # symbols
          builder.add(from, markEnd, headingMarkerDeco);
          // Scale the heading text
          if (markEnd + 1 <= to) {
            builder.add(markEnd, to, headerDeco);
          }
        } else {
          // Fallback: style the whole heading
          builder.add(from, to, headerDeco);
        }
      }

      // --- Bold (StrongEmphasis) ---
      if (name === "StrongEmphasis") {
        const text = view.state.sliceDoc(from, to);
        const marker = text.startsWith("**") ? "**" : "__";
        const mLen = marker.length;

        if (to - from > mLen * 2) {
          builder.add(from, from + mLen, formattingBoldDeco);
          builder.add(from + mLen, to - mLen, Decoration.mark({ class: "cm-bold", tagName: "strong" }));
          builder.add(to - mLen, to, formattingBoldDeco);
        }
      }

      // --- Italic (Emphasis) ---
      if (name === "Emphasis") {
        const text = view.state.sliceDoc(from, to);
        const marker = text.startsWith("*") ? "*" : "_";
        const mLen = marker.length;

        if (to - from > mLen * 2) {
          builder.add(from, from + mLen, formattingItalicDeco);
          builder.add(from + mLen, to - mLen, Decoration.mark({ class: "cm-italic", tagName: "em" }));
          builder.add(to - mLen, to, formattingItalicDeco);
        }
      }

      // --- Strikethrough ---
      if (name === "Strikethrough") {
        const text = view.state.sliceDoc(from, to);
        if (text.startsWith("~~") && text.endsWith("~~") && to - from > 4) {
          builder.add(from, from + 2, formattingStrikethroughDeco);
          builder.add(from + 2, to - 2, Decoration.mark({ class: "cm-strikethrough", tagName: "s" }));
          builder.add(to - 2, to, formattingStrikethroughDeco);
        }
      }

      // --- Inline Code ---
      if (name === "InlineCode") {
        const text = view.state.sliceDoc(from, to);
        if (text.startsWith("`") && text.endsWith("`") && to - from > 2) {
          builder.add(from, from + 1, formattingCodeDeco);
          builder.add(from + 1, to - 1, inlineCodeDeco);
          builder.add(to - 1, to, formattingCodeDeco);
        }
      }

      // --- Blockquote ---
      if (name === "Blockquote") {
        // Add line decoration for each line in the blockquote
        const startLine = view.state.doc.lineAt(from).number;
        const endLine = view.state.doc.lineAt(to).number;
        for (let i = startLine; i <= endLine; i++) {
          const line = view.state.doc.line(i);
          lineDecos.push({ pos: line.from, deco: blockquoteLineDeco });

          // Dim the > marker
          const qMatch = line.text.match(/^(\s*>)/);
          if (qMatch) {
            builder.add(line.from, line.from + qMatch[1].length, formattingQuoteDeco);
          }
        }
      }

      // --- Links ---
      if (name === "Link") {
        // Find [text](url) parts
        const text = view.state.sliceDoc(from, to);
        const linkMatch = text.match(/^\[([^\]]*)\]\(([^)]*)\)$/);
        if (linkMatch) {
          const textStart = from + 1;
          const textEnd = textStart + linkMatch[1].length;
          const urlStart = textEnd + 2; // ](
          const urlEnd = to - 1; // )

          builder.add(from, from + 1, formattingCodeDeco); // [
          builder.add(textStart, textEnd, linkDeco); // link text
          builder.add(textEnd, urlStart, formattingCodeDeco); // ](
          if (urlStart < urlEnd) {
            builder.add(urlStart, urlEnd, urlDeco); // url
          }
          builder.add(to - 1, to, formattingCodeDeco); // )
        }
      }

      // --- List items ---
      if (name === "ListMark") {
        builder.add(from, to, formattingListDeco);
      }

      // --- Task list markers ---
      if (name === "TaskMarker") {
        builder.add(from, to, taskMarkerDeco);
      }

      // --- Horizontal rule ---
      if (name === "HorizontalRule") {
        const line = view.state.doc.lineAt(from);
        lineDecos.push({ pos: line.from, deco: hrDeco });
      }
    },
  });

  // Add line decorations in document order
  lineDecos.sort((a, b) => a.pos - b.pos);
  for (const { pos, deco } of lineDecos) {
    builder.add(pos, pos, deco);
  }

  return builder.finish();
}

// ---------------------------------------------------------------------------
// ViewPlugin — rebuilds decorations on doc/viewport changes
// ---------------------------------------------------------------------------

export const markdownDecorations = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
