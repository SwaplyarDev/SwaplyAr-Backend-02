

const { io } = require("socket.io-client");

const URL = "http://localhost:3001";

console.log("Probando WebSocket: CONVERSIONS ...");

const socket = io(URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(`Conectado (Conversions): ${socket.id}`);

  socket.emit("ping-conversions", { msg: "hola desde conversions" });

  setTimeout(() => {
    console.log("\n Enviando solicitud de cálculo total...\n");

    socket.emit("calculateTotal", {
      from: "USD",
      to: "EUR",
      amount: 100,
      fromPlatform: "PayPal USD",
      toPlatform: "Payoneer EUR",
    });
  }, 1500);
});

socket.on("pong-conversions", (data) => {
  console.log("Respuesta (ping-conversions):", data);
});

socket.on("rate-update", (data) => {
  console.log("\n Actualización de divisa (global):");
  console.log(JSON.stringify(data, null, 2));
});

socket.on("commission-update", (data) => {
  console.log("\n Actualización de comisión (global):");
  console.log(JSON.stringify(data, null, 2));
});

socket.on("calculationResult", (data) => {
  console.log("\n Resultado completo recibido:");
  console.log(JSON.stringify(data, null, 2));
});

socket.on("calculationError", (err) => {
  console.log("\n Error en el cálculo:");
  console.error(err);
});

socket.on("disconnect", (reason) => {
  console.log(`\n Desconectado (Conversions): ${reason}`);
});

socket.on("connect_error", (err) => {
  console.log("\n Error de conexión:", err.message);
});




