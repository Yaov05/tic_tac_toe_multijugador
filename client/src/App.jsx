import { useEffect, useState } from "react";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";
const wsUrl = backendUrl.replace("http", "ws") + "/ws";

function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  const [player, setPlayer] = useState(null); // {name, symbol}
  const [room, setRoom] = useState(null);
  const [turn, setTurn] = useState(null);
  const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill("")));

  useEffect(() => {
    console.log("Conectando al WebSocket...");
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      setConnected(true);
      console.log("Conexión WebSocket establecida");
    };
    socket.onclose = () => {
      setConnected(false);
      console.log("Conexión WebSocket cerrada");
    };
    setWs(socket);

    return () => socket.close();
  }, []);

  useEffect(() => {
    console.log("Escuchando mensajes del WebSocket...", ws);
    if (!ws) {
      console.log("WebSocket no está disponible");
      return;
    }
    ws.onmessage = (event) => {
      console.log("Mensaje recibido del WebSocket:", event);
      const msg = JSON.parse(event.data);
      console.log("📩", msg);

      if (msg.type === "roomCreated") {
        console.log(`Sala creada: ${msg.room}`);
        setRoom(msg.room);
      }
      if (msg.type === "joinRoom") {
        console.log(`Juego iniciado en sala: ${msg.room}`);
        setRoom(msg.room);
        setPlayer({ name: player?.name, symbol: msg.symbol });
        setTurn(msg.turn);
      }
      if (msg.type === "playMove") {
        console.log(`Movimiento jugado en sala: ${msg.room}`);
        console.log("Estado actual del tablero:", board, turn, player, room);
        const newBoard = board.map(row => [...row]);
        newBoard[msg.row][msg.col] = msg.by === player?.name ? player.symbol : (player.symbol === "X" ? "O" : "X");
        setBoard(newBoard);
        setTurn(msg.turn);
      }
      if (msg.type === "error") {
        console.log("Error:", msg.message);
      }
    };
  }, [ws, board, player]);

  const sendMessage = (msg) => {
    if (ws && connected) {
      console.log("📤Mensaje enviado al backend:", msg);
      ws.send(JSON.stringify(msg));
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      {!room ? (
        <Lobby sendMessage={sendMessage} setPlayer={setPlayer} />
      ) : (
        <GameBoard board={board} turn={turn} player={player} room={room} sendMessage={sendMessage} />
      )}
    </div>
  );
}

export default App;
