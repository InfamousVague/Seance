import React, { useMemo } from "react";
import { TreeView } from "@wisp/ui";
import type { TreeNode } from "@wisp/ui";
import { FileText, Folder } from "lucide-react";
import { useFileTree } from "../../context/FileTreeContext";
import type { FileEntry } from "../../types/files";

// ---------------------------------------------------------------------------
// Convert FileEntry[] → TreeNode[]
// ---------------------------------------------------------------------------

function toTreeNodes(entries: FileEntry[]): TreeNode[] {
  // Sort: directories first, then alphabetical
  const sorted = [...entries].sort((a, b) => {
    if (a.is_directory && !b.is_directory) return -1;
    if (!a.is_directory && b.is_directory) return 1;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((entry) => {
    const node: TreeNode = {
      id: entry.path,
      label: entry.is_directory
        ? entry.name
        : entry.name.replace(/\.md$/, ""),
      icon: entry.is_directory ? Folder : FileText,
    };

    if (entry.is_directory && entry.children) {
      node.children = toTreeNodes(entry.children);
    }

    return node;
  });
}

// ---------------------------------------------------------------------------
// FileTree
// ---------------------------------------------------------------------------

export function FileTree() {
  const { files, selectedFile, setSelectedFile } = useFileTree();

  const nodes = useMemo(() => toTreeNodes(files), [files]);

  const handleSelect = (id: string) => {
    // Only select files, not directories
    const isDir = findEntry(files, id)?.is_directory;
    if (!isDir) {
      setSelectedFile(id);
    }
  };

  return (
    <TreeView
      nodes={nodes}
      size="md"
      selectedId={selectedFile ?? undefined}
      onSelect={handleSelect}
      defaultExpanded={[]}
    />
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findEntry(
  entries: FileEntry[],
  path: string
): FileEntry | undefined {
  for (const entry of entries) {
    if (entry.path === path) return entry;
    if (entry.children) {
      const found = findEntry(entry.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
