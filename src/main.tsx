import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0E15",
        color: "#F7F8FA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <h1>Séance</h1>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
