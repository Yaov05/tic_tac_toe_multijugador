function GameBoard({ board, turn, player, playerX, playerO, room, gameOver, winner, sendMessage }) {

    const playMove = (row, col) => {
        // console.log("Intentando jugar movimiento en:", row, col);
        // console.log("Estado actual del tablero:", board, turn, player, playerX, playerO, room);
        // console.log("Celda ocupada:", board[row][col] !== "");
        // console.log("No es mi turno:", turn !== player?.symbol);

        // Validate that cell is empty, it's the player's turn, both players are present, and game is not over
        if (board[row][col] !== "" || turn !== player?.symbol || !player?.symbol || !playerO || gameOver) {
            console.log("Movimiento bloqueado - Celda ocupada:", board[row][col] !== "",
                "No es mi turno:", turn !== player?.symbol,
                "Falta jugador O:", !playerO,
                "Juego terminado:", gameOver);
            return;
        }

        sendMessage({
            type: "playMove",
            room,
            nameX: playerX,
            nameO: playerO,
            move: [row, col]
        });
    };

    const isMyTurn = turn === player?.symbol;
    const gameReady = playerX && playerO && !gameOver;

    // Pura IA
    return (
        <table style={{ border: "3px solid purple", borderRadius: "12px", backgroundColor: "#f8f5ff", margin: "20px auto", padding: "20px", boxShadow: "0 6px 12px rgba(128, 0, 128, 0.3)" }}>
            <tbody>
                <tr>
                    <td style={{ textAlign: "center", padding: "15px" }}>
                        <h2 style={{ color: "purple", margin: "0 0 10px 0" }}>Juego en sala {room}</h2>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: "center", padding: "10px" }}>
                        <p style={{ margin: "5px 0", fontSize: "1.1rem" }}>
                            <span style={{ color: "red", fontWeight: "bold" }}>Jugador X:</span> {playerX} |
                            <span style={{ color: "blue", fontWeight: "bold" }}> Jugador O:</span> {playerO || "Esperando..."}
                        </p>
                        <p style={{ margin: "5px 0" }}>Turno actual: {turn} | Tú eres {player?.symbol}</p>
                    </td>
                </tr>

                {gameOver && (
                    <tr>
                        <td style={{ textAlign: "center", padding: "10px" }}>
                            <div style={{
                                backgroundColor: winner === "draw" ? "#ffa500" : "#4caf50",
                                color: "white",
                                padding: "15px",
                                borderRadius: "8px",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                            }}>
                                {winner === "draw" ? "¡EMPATE!" : `¡${winner} HA GANADO!`}
                            </div>
                        </td>
                    </tr>
                )}

                <tr>
                    <td style={{ textAlign: "center", padding: "10px" }}>
                        <p style={{
                            color: gameOver ? "purple" : (isMyTurn && gameReady ? "green" : "red"),
                            fontWeight: "bold",
                            margin: "10px 0"
                        }}>
                            {gameOver ?
                                "Juego terminado" :
                                (!gameReady ? "Esperando al segundo jugador..." :
                                    isMyTurn ? "¡Es tu turno!" : "Espera tu turno")
                            }
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style={{ textAlign: "center", padding: "20px" }}>
                        <table style={{
                            border: "2px solid purple",
                            borderCollapse: "collapse",
                            margin: "0 auto",
                            backgroundColor: "white"
                        }}>
                            <tbody>
                                {board.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td
                                                key={`${i}-${j}`}
                                                onClick={() => playMove(i, j)}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    border: "2px solid purple",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    fontSize: "2.5rem",
                                                    fontWeight: "bold",
                                                    cursor: isMyTurn && gameReady && cell === "" ? "pointer" : "not-allowed",
                                                    backgroundColor: isMyTurn && gameReady && cell === "" ? "#f0f8ff" : "#f5f5f5",
                                                    color: cell === "X" ? "red" : cell === "O" ? "blue" : "black"
                                                }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default GameBoard;
