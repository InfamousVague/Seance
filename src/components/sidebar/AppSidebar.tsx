import React from "react";
import {
  Sidebar,
  SidebarSection,
  SidebarItem,
  Button,
  Text,
  useThemeColors,
} from "@wisp/ui";
import { FolderOpen, Settings, FilePlus, FolderPlus } from "lucide-react";

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
          padding: "8px 16px 12px",
          userSelect: "none",
        }}
      >
        <Text size="sm" weight="bold" color="white">
          Séance
        </Text>
      </div>

      {/* Vault info */}
      {vaultPath ? (
        <div
          style={{
            // @ts-expect-error WebkitAppRegion is non-standard
            WebkitAppRegion: "no-drag",
            padding: "0 16px 8px",
          }}
        >
          <Text size="xs" color="tertiary">
            {parentPath}/
          </Text>
          <Text size="sm" weight="bold" color="white">
            {folderName}
          </Text>
        </div>
      ) : null}

      {/* Open Folder — primary button */}
      <div
        style={{
          // @ts-expect-error WebkitAppRegion is non-standard
          WebkitAppRegion: "no-drag",
          padding: "4px 12px 8px",
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

      {/* New File / New Folder actions */}
      {vaultPath && (
        <SidebarSection>
          <SidebarItem
            icon={<FilePlus size={18} />}
            label="New File"
            onClick={onNewFile}
          />
          <SidebarItem
            icon={<FolderPlus size={18} />}
            label="New Folder"
            onClick={onNewFolder}
          />
        </SidebarSection>
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
