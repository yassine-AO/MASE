import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

type ConnectionState = "checking" | "connected" | "disconnected";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function App() {
  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: HealthResponse = await res.json();
        setHealth(data);
        setConnection("connected");
        setError(null);
      } catch (err) {
        setConnection("disconnected");
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    checkHealth();
  }, []);

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "640px",
        margin: "4rem auto",
        padding: "0 1.5rem",
        lineHeight: 1.6,
      }}
    >
      <h1>MASE V2</h1>
      <p>Multi-Agent Simulation Engine with Learned Routing</p>

      <section
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          border: "1px solid #d0d7de",
          borderRadius: "8px",
          backgroundColor: "#f6f8fa",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>
          Backend Connection Status
        </h2>
        <p>
          <strong>Status:</strong>{" "}
          {connection === "checking" && "Checking..."}
          {connection === "connected" && "Connected"}
          {connection === "disconnected" && "Disconnected"}
        </p>
        <p>
          <strong>API URL:</strong> <code>{API_BASE_URL}</code>
        </p>
        {health && (
          <p>
            <strong>Service:</strong> {health.service} (v{health.version})
          </p>
        )}
        {error && (
          <p style={{ color: "#cf222e" }}>
            <strong>Error:</strong> {error}
          </p>
        )}
      </section>
    </main>
  );
}
