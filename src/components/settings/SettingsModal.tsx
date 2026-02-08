import React from "react";
import {
  Dialog,
  Toggle,
  Slider,
  Select,
  FormField,
  VStack,
  Separator,
  Text,
} from "@wisp/ui";
import { useSettings } from "../../context/SettingsContext";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Font options
// ---------------------------------------------------------------------------

const editorFontOptions = [
  {
    value: "mono",
    label: "Monospace",
    description: "JetBrains Mono",
  },
  {
    value: "sans",
    label: "Sans-serif",
    description: "Plus Jakarta Sans",
  },
];

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// ---------------------------------------------------------------------------
// SettingsModal
// ---------------------------------------------------------------------------

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Settings"
      description="Customize your Séance experience"
      size="md"
    >
      <VStack gap="lg">
        {/* Theme */}
        <FormField onSurface
          label="Theme"
          description="Switch between light and dark mode"
          orientation="horizontal"
        >
          <Select
            value={settings.theme}
            onChange={(value) =>
              updateSettings({ theme: value as "light" | "dark" })
            }
            options={themeOptions}
            size="sm"
          />
        </FormField>

        <Separator />

        {/* Font Size */}
        <FormField onSurface
          label="Font Size"
          description="Editor text size in pixels"
        >
          <Slider
            value={settings.fontSize}
            onChange={(value) => updateSettings({ fontSize: value })}
            min={10}
            max={24}
            step={1}
            showValue
            formatValue={(v) => `${v}px`}
            size="sm"
          />
        </FormField>

        <Separator />

        {/* Editor Font */}
        <FormField onSurface
          label="Editor Font"
          description="Font family for the markdown editor"
          orientation="horizontal"
        >
          <Select
            value={settings.editorFont}
            onChange={(value) =>
              updateSettings({ editorFont: value as "mono" | "sans" })
            }
            options={editorFontOptions}
            size="sm"
          />
        </FormField>

        <Separator />

        {/* Auto-save */}
        <FormField onSurface
          label="Auto-save"
          description="Automatically save changes after 1 second"
          orientation="horizontal"
        >
          <Toggle
            checked={settings.autoSave}
            onChange={(checked) => updateSettings({ autoSave: checked })}
            size="sm"
          />
        </FormField>

        <Separator />

        {/* Vault Path */}
        <FormField onSurface
          label="Vault Path"
          description="Current working directory"
        >
          <Text size="sm" color="secondary">
            {settings.vaultPath || "No vault selected"}
          </Text>
        </FormField>
      </VStack>
    </Dialog>
  );
}
