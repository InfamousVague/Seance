import React, { useState, useCallback } from "react";
import { useThemeColors, Text } from "@wisp/ui";
import { Edit3, FolderOpen } from "lucide-react";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { FileTree } from "./components/sidebar/FileTree";
import { useSettings } from "./context/SettingsContext";
import { useFileTree } from "./context/FileTreeContext";

export function App() {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettings();
  const { selectedFile, fileContent, createFile, createFolder } = useFileTree();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenFolder = useCallback(() => {
    // Mock: set a fake vault path for now
    updateSettings({ vaultPath: "/Users/demo/Documents/My Notes" });
  }, [updateSettings]);

  const handleNewFile = useCallback(() => {
    const name = prompt("File name:");
    if (name) {
      createFile("", name);
    }
  }, [createFile]);

  const handleNewFolder = useCallback(() => {
    const name = prompt("Folder name:");
    if (name) {
      createFolder("", name);
    }
  }, [createFolder]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        backgroundColor: colors.background.canvas,
        overflow: "hidden",
      }}
    >
      <AppSidebar
        vaultPath={settings.vaultPath}
        onOpenFolder={handleOpenFolder}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onOpenSettings={() => setSettingsOpen(true)}
      >
        {settings.vaultPath ? <FileTree /> : null}
      </AppSidebar>

      {/* Main editor area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!settings.vaultPath ? (
          /* No vault open */
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <FolderOpen size={32} color={colors.text.muted} strokeWidth={1.5} />
            <Text size="sm" color="tertiary">
              Open a folder to get started
            </Text>
          </div>
        ) : selectedFile ? (
          /* File selected — show content preview (CodeMirror in Phase 6) */
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: 32,
            }}
          >
            <pre
              style={{
                fontFamily:
                  settings.editorFont === "mono"
                    ? "'JetBrains Mono', monospace"
                    : "'Plus Jakarta Sans', sans-serif",
                fontSize: settings.fontSize,
                lineHeight: 1.7,
                color: colors.text.primary,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {fileContent}
            </pre>
          </div>
        ) : (
          /* Vault open but no file selected */
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Edit3 size={32} color={colors.text.muted} strokeWidth={1.5} />
            <Text size="sm" color="tertiary">
              Select a file to begin editing
            </Text>
          </div>
        )}
      </main>
    </div>
  );
}
