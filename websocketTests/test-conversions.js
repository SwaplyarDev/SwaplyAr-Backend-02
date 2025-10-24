

const { io } = require("socket.io-client");
const URL = "http://localhost:3001";

console.log("Probando WebSocket: CONVERSIONS ...");
const socket = io(URL, { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Conectado (Conversions):", socket.id);
  socket.emit("ping-conversions", { msg: "hola desde conversions" });
});

socket.on("pong-conversions", (data) => {
  console.log("Respuesta (Conversions):", data);
});

socket.on("disconnect", (reason) => {
  console.log("Desconectado (Conversions):", reason);
});


