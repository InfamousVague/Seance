import React from "react";
import { useTheme, Text, Button } from "@wisp/ui";

export function App() {
  const { colors, mode, toggleMode } = useTheme();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        backgroundColor: colors.background.canvas,
      }}
    >
      <Text size="display-md" weight="bold" color="primary">
        Séance
      </Text>
      <Text size="sm" color="secondary">
        Channeling words from the other side
      </Text>
      <Button onClick={toggleMode} size="md">
        {mode === "dark" ? "Switch to Light" : "Switch to Dark"}
      </Button>
    </div>
  );
}
