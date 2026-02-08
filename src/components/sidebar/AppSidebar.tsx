import React from "react";
import {
  Sidebar,
  SidebarSection,
  SidebarItem,
  Button,
  Text,
  useThemeColors,
} from "@wisp/ui";
import {
  FolderOpen,
  Settings,
  FilePlus,
  FolderPlus,
  Search,
} from "lucide-react";

interface AppSidebarProps {
  vaultPath: string;
  onOpenFolder: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenSettings: () => void;
  children?: React.ReactNode;
}

export function AppSidebar({
  vaultPath,
  onOpenFolder,
  onNewFile,
  onNewFolder,
  onOpenSettings,
  children,
}: AppSidebarProps) {
  const colors = useThemeColors();

  const folderName = vaultPath ? vaultPath.split("/").pop() || "" : "";
  const parentPath = vaultPath
    ? vaultPath
        .replace(/\/[^/]+$/, "")
        .replace(/^\/Users\/[^/]+/, "~")
    : "";

  return (
    <Sidebar
      width="default"
      position="left"
      style={{
        paddingTop: 36,
        borderRadius: 16,
        borderRight: "none",
      }}
    >
      {/* Drag region — allows window dragging from sidebar header */}
      <div
        style={{
          // @ts-expect-error WebkitAppRegion is non-standard
          WebkitAppRegion: "drag",
          padding: "8px 16px 4px",
          userSelect: "none",
        }}
      >
        <Text size="sm" weight="bold" color="white">
          Séance
        </Text>
      </div>

      {/* Vault info + action toolbar */}
      {vaultPath ? (
        <div
          style={{
            // @ts-expect-error WebkitAppRegion is non-standard
            WebkitAppRegion: "no-drag",
            padding: "4px 12px 0",
          }}
        >
          {/* Vault label */}
          <div style={{ padding: "0 4px 6px" }}>
            <Text size="xs" color="tertiary">
              {parentPath}/
            </Text>
            <Text size="sm" weight="bold" color="white">
              {folderName}
            </Text>
          </div>

          {/* Obsidian-style action toolbar — compact icon row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "2px 0 6px",
            }}
          >
            <Button
              variant="tertiary"
              onSurface
              size="xs"
              iconLeft={<FilePlus size={14} />}
              title="New File (Cmd+N)"
              onClick={onNewFile}
            />
            <Button
              variant="tertiary"
              onSurface
              size="xs"
              iconLeft={<FolderPlus size={14} />}
              title="New Folder (Cmd+Shift+N)"
              onClick={onNewFolder}
            />
            <Button
              variant="tertiary"
              onSurface
              size="xs"
              iconLeft={<FolderOpen size={14} />}
              title="Open Folder"
              onClick={onOpenFolder}
            />
          </div>
        </div>
      ) : (
        /* No vault — show Open Folder button prominently */
        <div
          style={{
            // @ts-expect-error WebkitAppRegion is non-standard
            WebkitAppRegion: "no-drag",
            padding: "8px 12px",
          }}
        >
          <Button
            variant="primary"
            onSurface
            size="sm"
            iconLeft={<FolderOpen size={16} />}
            fullWidth
            onClick={onOpenFolder}
          >
            Open Folder
          </Button>
        </div>
      )}

      {/* File tree — injected as children */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          // @ts-expect-error WebkitAppRegion is non-standard
          WebkitAppRegion: "no-drag",
        }}
      >
        {children}
      </div>

      {/* Bottom section */}
      <SidebarSection>
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          onClick={onOpenSettings}
        />
      </SidebarSection>
    </Sidebar>
  );
}
