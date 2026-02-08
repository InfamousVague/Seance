import React, { useState, useCallback } from "react";
import { useThemeColors, Text } from "@wisp/ui";
import { Edit3, FolderOpen } from "lucide-react";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { FileTree } from "./components/sidebar/FileTree";
import { MarkdownEditor } from "./components/editor/MarkdownEditor";
import { useSettings } from "./context/SettingsContext";
import { useFileTree } from "./context/FileTreeContext";
import { useAutoSave } from "./hooks/useAutoSave";
import { SettingsModal } from "./components/settings/SettingsModal";

export function App() {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettings();
  const {
    selectedFile,
    fileContent,
    createFile,
    createFolder,
    updateFileContent,
  } = useFileTree();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auto-save hook — logs to console for now
  useAutoSave(selectedFile, fileContent);

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

  const handleContentChange = useCallback(
    (content: string) => {
      if (selectedFile) {
        updateFileContent(selectedFile, content);
      }
    },
    [selectedFile, updateFileContent]
  );

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
            <FolderOpen
              size={32}
              color={colors.text.muted}
              strokeWidth={1.5}
            />
            <Text size="sm" color="tertiary">
              Open a folder to get started
            </Text>
          </div>
        ) : selectedFile ? (
          /* File selected — CodeMirror editor */
          <MarkdownEditor
            content={fileContent}
            onChange={handleContentChange}
          />
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

      {/* Settings modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
