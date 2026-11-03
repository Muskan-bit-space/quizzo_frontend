import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, DEMO_MODE } from "../../config.js";
import { socketCommand } from "../lib/live-session.js";

export function useLiveSession(id, token) {
  const socketRef = useRef(null);
  const [state, setState] = useState({ session: null, connection: "connecting", error: "", serverOffset: 0 });
  useEffect(() => {
    if (DEMO_MODE) return;
    let active = true;
    let synchronized = false;
    const socket = io(BACKEND_URL || undefined, { auth: { token }, autoConnect: false });
    socketRef.current = socket;
    function receive(session, offset) {
      if (!active || session.id !== id) return;
      setState(previous => {
        if (previous.session?.serverNow > session.serverNow) return previous;
        return { session, connection: "connected", error: "", serverOffset: offset ?? previous.serverOffset };
      });
    }
    function fail(error) {
      if (active) setState(previous => ({ ...previous, error: error.message, connection: error.status === 401 || error.data?.status === 401 ? "unauthorized" : "disconnected" }));
    }
    async function sync() {
      const sentAt = Date.now();
      try {
        const { session } = await socketCommand(socket, "session:sync", { sessionId: id });
        const receivedAt = Date.now();
        synchronized = true;
        receive(session, session.serverNow - (sentAt + receivedAt) / 2);
      } catch (error) { fail(error); }
    }
    const onState = session => receive(session, synchronized ? undefined : session.serverNow - Date.now());
    const onDisconnect = () => { synchronized = false; if (active) setState(previous => ({ ...previous, connection: "disconnected" })); };
    const onError = error => fail(Object.assign(new Error(error.message), { status: error.status }));
    socket.on("connect", sync);
    socket.on("session:state", onState);
    socket.on("session:completed", onState);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", fail);
    socket.on("session:error", onError);
    socket.connect();
    // Periodic synchronization also repairs a missed event or timed-out ACK.
    const interval = setInterval(() => { if (socket.connected) void sync(); }, 15000);
    return () => {
      active = false;
      clearInterval(interval);
      socket.off("connect", sync);
      socket.off("session:state", onState);
      socket.off("session:completed", onState);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", fail);
      socket.off("session:error", onError);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [id, token]);
  const command = useCallback(async (event, payload = {}) => {
    const data = await socketCommand(socketRef.current, event, { ...payload, sessionId: id });
    if (data.session) setState(previous => previous.session?.serverNow > data.session.serverNow ? previous : { ...previous, session: data.session });
    return data;
  }, [id]);
  const reconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket?.connected) void socketCommand(socket, "session:sync", { sessionId: id }).then(data => {
      setState(previous => ({ ...previous, session: data.session, error: "", connection: "connected" }));
    }).catch(error => setState(previous => ({ ...previous, error: error.message })));
    else socket?.connect();
  }, [id]);
  return { ...state, command, reconnect };
}
