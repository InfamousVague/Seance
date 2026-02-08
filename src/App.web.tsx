import React, { useState, useCallback } from "react";
import { useThemeColors, Text } from "@wisp/ui";
import { Edit3 } from "lucide-react";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { useSettings } from "./context/SettingsContext";

export function App() {
  const colors = useThemeColors();
  const { settings, updateSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenFolder = useCallback(() => {
    // Mock: set a fake vault path for now
    updateSettings({ vaultPath: "/Users/demo/Documents/My Notes" });
  }, [updateSettings]);

  const handleNewFile = useCallback(() => {
    // Placeholder — Phase 5 will implement
  }, []);

  const handleNewFolder = useCallback(() => {
    // Placeholder — Phase 5 will implement
  }, []);

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
      />

      {/* Main editor area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Empty state — no file selected */}
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
      </main>
    </div>
  );
}
