import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onNewFile: () => void;
  onNewFolder: () => void;
  onForceSave: () => void;
  onOpenSettings: () => void;
}

/**
 * Registers global keyboard shortcuts for the app.
 *
 * | Shortcut        | Action       |
 * |-----------------|-------------|
 * | Cmd+N           | New file     |
 * | Cmd+Shift+N     | New folder   |
 * | Cmd+S           | Force save   |
 * | Cmd+,           | Open settings|
 */
export function useKeyboardShortcuts({
  onNewFile,
  onNewFolder,
  onForceSave,
  onOpenSettings,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      if (!meta) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          if (e.shiftKey) {
            onNewFolder();
          } else {
            onNewFile();
          }
          break;

        case "s":
        case "S":
          e.preventDefault();
          onForceSave();
          break;

        case ",":
          e.preventDefault();
          onOpenSettings();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewFile, onNewFolder, onForceSave, onOpenSettings]);
}
