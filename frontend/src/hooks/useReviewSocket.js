import { useCallback, useRef, useState } from "react";

const WS_BASE =
  (import.meta.env.VITE_WS_URL || "ws://localhost:8000") + "/ws/review";

export const useReviewSocket = () => {
  const [status, setStatus]   = useState("idle");   // idle | connecting | reviewing | done | error
  const [chunks, setChunks]   = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const wsRef = useRef(null);

  const startReview = useCallback((code, token) => {
    // Reset state
    setChunks([]);
    setTotalChunks(0);
    setErrorMsg(null);
    setStatus("connecting");

    const ws = new WebSocket(`${WS_BASE}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("reviewing");
      ws.send(JSON.stringify({ code }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.event === "start") {
        setTotalChunks(msg.total_chunks);
      } else if (msg.event === "chunk") {
        setChunks((prev) => {
          // Insert in correct order by chunk_index
          const updated = [...prev, msg.data].sort(
            (a, b) => a.chunk_index - b.chunk_index
          );
          return updated;
        });
      } else if (msg.event === "done") {
        setStatus("done");
      } else if (msg.event === "error") {
        setErrorMsg(msg.message);
        setStatus("error");
      }
    };

    ws.onerror = () => {
      setErrorMsg("WebSocket connection failed. Is the backend running?");
      setStatus("error");
    };

    ws.onclose = () => {
      if (status !== "done" && status !== "error") {
        setStatus((prev) => (prev === "reviewing" ? "done" : prev));
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    setStatus("idle");
    setChunks([]);
    setTotalChunks(0);
    setErrorMsg(null);
  }, []);

  return { status, chunks, totalChunks, errorMsg, startReview, reset };
};
