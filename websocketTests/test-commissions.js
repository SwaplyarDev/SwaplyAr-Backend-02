

const { io } = require("socket.io-client");
const URL = "http://localhost:3001";

console.log("Probando WebSocket: COMMISSIONS ...");
const socket = io(URL, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Conectado (Commissions):", socket.id);
  socket.emit("ping-commissions", { msg: "hola desde commissions" });
});

socket.on("pong-commissions", (data) => {
  console.log("Respuesta (Commissions):", data);
});

socket.on("disconnect", (reason) => {
  console.log("Desconectado (Commissions):", reason);
});



