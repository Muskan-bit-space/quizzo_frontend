export function normalizeRoomCode(value) {
  const code = value.trim().toUpperCase();
  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) throw new Error("Enter the 8-character live room code shared by the organiser.");
  return code;
}
export function remainingSeconds(deadline, serverNow) {
  if (!deadline) return 0;
  return Math.max(0, Math.min(30, Math.ceil((new Date(deadline).getTime() - serverNow) / 1000)));
}
export function socketCommand(socket, event, payload) {
  if (!socket?.connected) return Promise.reject(new Error("You are disconnected. Reconnect before sending an answer or starting the quiz."));
  return new Promise((resolve, reject) => {
    socket.timeout(10000).emit(event, payload, (timeout, response) => {
      if (timeout) return reject(new Error("The server did not confirm this request. Synchronizing will show whether it was recorded."));
      if (!response?.ok) {
        const error = new Error(response?.error?.message || "The live request failed.");
        error.status = response?.error?.status;
        return reject(error);
      }
      resolve(response.data);
    });
  });
}
