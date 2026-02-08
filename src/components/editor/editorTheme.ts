import { EditorView } from "@codemirror/view";
import type { ThemeColors } from "@wisp/ui";

/**
 * Creates a CodeMirror 6 theme that maps Wisp theme colors + warm amber accent.
 *
 * The amber (#F59E0B) is used for:
 * - Links
 * - Inline code borders/background
 * - Blockquote left border
 * - Active heading markers
 */
export function createSeanceTheme(
  colors: ThemeColors,
  fontSize: number,
  fontFamily: string,
  isDark: boolean = true
) {
  const amber = "#F59E0B";
  const amberSubtle = "rgba(245, 158, 11, 0.08)";
  const amberBorder = "rgba(245, 158, 11, 0.25)";

  return EditorView.theme(
    {
      "&": {
        backgroundColor: colors.background.canvas,
        color: colors.text.primary,
        fontSize: `${fontSize}px`,
        fontFamily,
        height: "100%",
      },
      ".cm-content": {
        caretColor: colors.text.primary,
        fontFamily,
        lineHeight: "1.7",
        padding: "16px 0",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: colors.text.primary,
        borderLeftWidth: "2px",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
          backgroundColor: "rgba(245, 158, 11, 0.15)",
        },
      ".cm-activeLine": {
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.02)",
      },
      ".cm-gutters": {
        backgroundColor: colors.background.canvas,
        borderRight: "none",
        color: colors.text.muted,
      },
      ".cm-lineNumbers .cm-gutterElement": {
        color: colors.text.muted,
        fontSize: "11px",
        opacity: "0.5",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
      },
      ".cm-scroller": {
        overflow: "auto",
        fontFamily,
      },
      // Search panel
      ".cm-panels": {
        backgroundColor: colors.background.raised,
        color: colors.text.primary,
        borderBottom: `1px solid ${colors.border.subtle}`,
      },
      ".cm-searchMatch": {
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        outline: `1px solid ${amberBorder}`,
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "rgba(245, 158, 11, 0.35)",
      },
      // Focus ring
      "&.cm-focused": {
        outline: "none",
      },
      // Tooltip
      ".cm-tooltip": {
        backgroundColor: colors.background.raised,
        color: colors.text.primary,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: "6px",
      },

      // --- Markdown-specific token styles ---

      // Heading markers (#, ##, etc.) — dimmed amber
      ".cm-heading-marker": {
        color: amber,
        opacity: "0.4",
      },

      // Heading text — scaled by level
      ".cm-header-1": {
        fontSize: "1.8em",
        fontWeight: "700",
        lineHeight: "1.3",
        color: colors.text.primary,
      },
      ".cm-header-2": {
        fontSize: "1.4em",
        fontWeight: "700",
        lineHeight: "1.4",
        color: colors.text.primary,
      },
      ".cm-header-3": {
        fontSize: "1.2em",
        fontWeight: "600",
        lineHeight: "1.5",
        color: colors.text.primary,
      },

      // Bold markers (**) — dimmed
      ".cm-formatting-bold": {
        color: colors.text.muted,
        opacity: "0.4",
      },

      // Italic markers (*) — dimmed
      ".cm-formatting-italic": {
        color: colors.text.muted,
        opacity: "0.4",
      },

      // Strikethrough markers (~~) — dimmed
      ".cm-formatting-strikethrough": {
        color: colors.text.muted,
        opacity: "0.4",
      },

      // Code formatting backticks — dimmed
      ".cm-formatting-code": {
        color: colors.text.muted,
        opacity: "0.4",
      },

      // Inline code content — amber tinted
      ".cm-inline-code": {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.9em",
        backgroundColor: amberSubtle,
        borderRadius: "3px",
        padding: "1px 4px",
      },

      // Blockquote — amber left border
      ".cm-blockquote-line": {
        borderLeft: `3px solid ${amber}`,
        paddingLeft: "12px",
        color: colors.text.secondary,
      },

      // Blockquote marker (>) — dimmed
      ".cm-formatting-quote": {
        color: amber,
        opacity: "0.4",
      },

      // Links — amber text
      ".cm-link": {
        color: amber,
        textDecoration: "none",
      },
      ".cm-url": {
        color: colors.text.muted,
        opacity: "0.5",
      },

      // List markers — subtle
      ".cm-formatting-list": {
        color: colors.text.muted,
      },

      // HR
      ".cm-hr": {
        borderTop: `1px solid ${colors.border.subtle}`,
        color: "transparent",
      },

      // Task list checkboxes
      ".cm-task-marker": {
        color: amber,
      },
    },
    { dark: isDark }
  );
}
