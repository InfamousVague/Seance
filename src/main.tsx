import React from "react";
import ReactDOM from "react-dom/client";
import { WispProvider } from "@wisp/ui";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { App } from "./App.web";

function WispThemeBridge({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  return <WispProvider mode={settings.theme}>{children}</WispProvider>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <WispThemeBridge>
        <App />
      </WispThemeBridge>
    </SettingsProvider>
  </React.StrictMode>
);
