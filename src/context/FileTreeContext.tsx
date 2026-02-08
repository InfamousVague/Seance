import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { FileEntry } from "../types/files";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_FILES: FileEntry[] = [
  {
    name: "Welcome.md",
    path: "/Welcome.md",
    is_directory: false,
  },
  {
    name: "Ideas",
    path: "/Ideas",
    is_directory: true,
    children: [
      {
        name: "App Ideas.md",
        path: "/Ideas/App Ideas.md",
        is_directory: false,
      },
      {
        name: "Design.md",
        path: "/Ideas/Design.md",
        is_directory: false,
      },
    ],
  },
  {
    name: "Journal",
    path: "/Journal",
    is_directory: true,
    children: [
      {
        name: "Today.md",
        path: "/Journal/Today.md",
        is_directory: false,
      },
    ],
  },
];

const MOCK_CONTENT: Record<string, string> = {
  "/Welcome.md": `# Welcome to Séance

Channeling words from the other side.

This is your **markdown editor** — a quiet place to write, think, and organize your notes.

## Getting Started

- Create new files with \`Cmd+N\`
- Organize with folders
- Write in *markdown* and watch it come alive

> "The pen is mightier than the sword." — Edward Bulwer-Lytton

Happy writing!
`,
  "/Ideas/App Ideas.md": `# App Ideas

## Séance — Markdown Note Editor
A minimal, beautiful note-taking app with a spooky twist.

### Features
- Live markdown rendering
- File tree sidebar
- Dark and light themes
- Warm amber accents

### Stack
- React + TypeScript
- CodeMirror 6
- Tauri (desktop)
- Rust backend (future)
`,
  "/Ideas/Design.md": `# Design Notes

## Color Palette
- Background: Deep dark canvas
- Accent: Warm amber \`#F59E0B\`
- Text: Cool gray scale

## Typography
- UI: Plus Jakarta Sans
- Editor: JetBrains Mono (mono) or Plus Jakarta Sans (sans)

## Layout
- Two-pane: sidebar + editor
- Collapsible file tree
- Overlay titlebar for macOS
`,
  "/Journal/Today.md": `# Today's Entry

## Morning Thoughts
The fog rolled in early this morning. Perfect writing weather.

## Tasks
- [x] Set up the project
- [x] Build the sidebar
- [ ] Add the editor
- [ ] Polish the theme

## Notes
Sometimes the best ideas come when you're not looking for them.

---

*Written in Séance*
`,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface FileTreeContextValue {
  files: FileEntry[];
  selectedFile: string | null;
  fileContent: string;
  setSelectedFile: (path: string | null) => void;
  createFile: (parentPath: string, name: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  deleteEntry: (path: string) => void;
  renameEntry: (path: string, newName: string) => void;
  updateFileContent: (path: string, content: string) => void;
}

const FileTreeContext = createContext<FileTreeContextValue | null>(null);

export function useFileTree() {
  const ctx = useContext(FileTreeContext);
  if (!ctx)
    throw new Error("useFileTree must be used within <FileTreeProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function insertEntry(
  files: FileEntry[],
  parentPath: string,
  entry: FileEntry
): FileEntry[] {
  // Root level
  if (parentPath === "" || parentPath === "/") {
    return [...files, entry];
  }

  return files.map((f) => {
    if (f.path === parentPath && f.is_directory) {
      return { ...f, children: [...(f.children || []), entry] };
    }
    if (f.children) {
      return { ...f, children: insertEntry(f.children, parentPath, entry) };
    }
    return f;
  });
}

function removeEntry(files: FileEntry[], path: string): FileEntry[] {
  return files
    .filter((f) => f.path !== path)
    .map((f) => {
      if (f.children) {
        return { ...f, children: removeEntry(f.children, path) };
      }
      return f;
    });
}

function renameInTree(
  files: FileEntry[],
  path: string,
  newName: string
): FileEntry[] {
  return files.map((f) => {
    if (f.path === path) {
      const parentDir = path.replace(/\/[^/]+$/, "") || "";
      const newPath = parentDir + "/" + newName;
      return { ...f, name: newName, path: newPath };
    }
    if (f.children) {
      return { ...f, children: renameInTree(f.children, path, newName) };
    }
    return f;
  });
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function FileTreeProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileEntry[]>(MOCK_FILES);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [contentMap, setContentMap] = useState<Record<string, string>>(MOCK_CONTENT);

  const fileContent = selectedFile ? contentMap[selectedFile] || "" : "";

  const createFile = useCallback((parentPath: string, name: string) => {
    const safeName = name.endsWith(".md") ? name : name + ".md";
    const fullPath =
      parentPath === "" || parentPath === "/"
        ? "/" + safeName
        : parentPath + "/" + safeName;

    const entry: FileEntry = {
      name: safeName,
      path: fullPath,
      is_directory: false,
    };

    setFiles((prev) => insertEntry(prev, parentPath, entry));
    setContentMap((prev) => ({ ...prev, [fullPath]: `# ${name.replace(".md", "")}\n\n` }));
    setSelectedFile(fullPath);
  }, []);

  const createFolder = useCallback((parentPath: string, name: string) => {
    const fullPath =
      parentPath === "" || parentPath === "/"
        ? "/" + name
        : parentPath + "/" + name;

    const entry: FileEntry = {
      name,
      path: fullPath,
      is_directory: true,
      children: [],
    };

    setFiles((prev) => insertEntry(prev, parentPath, entry));
  }, []);

  const deleteEntry = useCallback(
    (path: string) => {
      setFiles((prev) => removeEntry(prev, path));
      if (selectedFile === path) {
        setSelectedFile(null);
      }
    },
    [selectedFile]
  );

  const renameEntry = useCallback((path: string, newName: string) => {
    setFiles((prev) => renameInTree(prev, path, newName));
    setContentMap((prev) => {
      const content = prev[path];
      if (content !== undefined) {
        const parentDir = path.replace(/\/[^/]+$/, "") || "";
        const newPath = parentDir + "/" + newName;
        const next = { ...prev, [newPath]: content };
        delete next[path];
        return next;
      }
      return prev;
    });
  }, []);

  const updateFileContent = useCallback((path: string, content: string) => {
    setContentMap((prev) => ({ ...prev, [path]: content }));
  }, []);

  const value = useMemo(
    () => ({
      files,
      selectedFile,
      fileContent,
      setSelectedFile,
      createFile,
      createFolder,
      deleteEntry,
      renameEntry,
      updateFileContent,
    }),
    [files, selectedFile, fileContent, createFile, createFolder, deleteEntry, renameEntry, updateFileContent]
  );

  return (
    <FileTreeContext.Provider value={value}>
      {children}
    </FileTreeContext.Provider>
  );
}
