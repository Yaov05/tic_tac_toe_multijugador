import { useEffect, useState } from "react";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import Stats from "./components/Stats";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";
const wsUrl = backendUrl.replace("http", "ws") + "/ws";

function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  const [player, setPlayer] = useState(null);
  const [playerX, setPlayerX] = useState(null);
  const [playerO, setPlayerO] = useState(null);
  const [room, setRoom] = useState(null);
  const [turn, setTurn] = useState(null);
  const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill("")));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

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
    // console.log("Escuchando mensajes del WebSocket...", ws);
    if (!ws) {
      // console.log("WebSocket no está disponible");
      return;
    }
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("Mensaje", msg);

      if (msg.type === "roomCreated") {
        setRoom(msg.room);
        setPlayerX(player?.name);
        setPlayer({ name: player?.name, symbol: "X" });
        setTurn("X");
        // reiniciar
        setGameOver(false);
        setWinner(null);
        setBoard(Array(3).fill().map(() => Array(3).fill("")));
      }
      if (msg.type === "joinRoom") {
        // console.log(`Juego iniciado en sala: ${msg.room}`);
        setRoom(msg.room);
        setPlayer({ name: player?.name, symbol: msg.symbol });
        setTurn(msg.turn);

        setPlayerX(msg.playerX);
        setPlayerO(msg.playerO);
        // reiniciar
        setGameOver(false);
        setWinner(null);
        setBoard(Array(3).fill().map(() => Array(3).fill("")));
      }
      if (msg.type === "playMove") {
        // console.log(`Movimiento jugado en sala: ${msg.room}`);
        // console.log("Estado actual del tablero:", board, turn, player, room);
        const newBoard = board.map(row => [...row]);
        const previousTurn = turn;
        newBoard[msg.row][msg.col] = previousTurn;
        setBoard(newBoard);
        setTurn(msg.turn);
      }
      if (msg.type === "gameOver") {
        setGameOver(true);
        setWinner(msg.winner);
      }
      if (msg.type === "error") {
        console.log("Error:", msg.message);
      }
    };
  }, [ws, board, player]);

  const sendMessage = (msg) => {
    if (ws && connected) {
      // console.log("Mensaje enviado al back:", msg);
      ws.send(JSON.stringify(msg));
    }
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      padding: 20,
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8f0fe 0%, #f3e5f5 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {!room ? (
          <Lobby sendMessage={sendMessage} setPlayer={setPlayer} />
        ) : (
          <GameBoard
            board={board}
            turn={turn}
            player={player}
            playerX={playerX}
            playerO={playerO}
            room={room}
            gameOver={gameOver}
            winner={winner}
            sendMessage={sendMessage}
          />
        )}
      </div>

      <Stats />

      <div style={{
        position: "fixed",
        top: 10,
        right: 10,
        fontSize: 12,
        color: connected ? "green" : "red",
        backgroundColor: "white",
        padding: "5px 10px",
        borderRadius: "15px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </div>
    </div>
  );
}

export default App;
