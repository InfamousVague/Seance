import { useEffect, useRef } from "react";
import { useSettings } from "../context/SettingsContext";

/**
 * Debounced auto-save hook.
 *
 * Calls `onSave` 1 second after the last content change.
 * Respects `settings.autoSave` toggle.
 * Currently just logs — Rust backend will handle persistence later.
 */
export function useAutoSave(
  filePath: string | null,
  content: string,
  onSave?: (path: string, content: string) => void
) {
  const { settings } = useSettings();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevContentRef = useRef(content);

  useEffect(() => {
    if (!settings.autoSave || !filePath) return;
    if (content === prevContentRef.current) return;

    prevContentRef.current = content;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (onSave) {
        onSave(filePath, content);
      } else {
        // eslint-disable-next-line no-console
        console.log(`[Séance] Auto-saved: ${filePath}`);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, filePath, settings.autoSave, onSave]);
}
