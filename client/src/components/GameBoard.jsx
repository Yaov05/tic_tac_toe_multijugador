function GameBoard({ board, turn, player, room, sendMessage }) {

    const playMove = (row, col) => {
        console.log("Intentando jugar movimiento en:", row, col);
        console.log("Estado actual del tablero:", board, turn, player, room);
        console.log("Celda ocupada:", board[row][col] !== "");
        console.log("No es mi turno:", turn !== player?.symbol);
        
        // Validate that cell is empty and it's the player's turn
        if (board[row][col] !== "" || turn !== player?.symbol || !player?.symbol) {
            console.log("Movimiento bloqueado");
            return;
        }
        
        console.log("Enviando movimiento...");
        sendMessage({ type: "playMove", room, name: player.name, move: [row, col] });
    };

    const isMyTurn = turn === player?.symbol;

    return (
        <div>
            <h2>Juego en sala {room}</h2>
            <p>Turno actual: {turn} | Tú eres {player?.symbol}</p>
            <p style={{ color: isMyTurn ? "green" : "red", fontWeight: "bold" }}>
                {isMyTurn ? "¡Es tu turno!" : "Espera tu turno"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
                {board.map((row, i) =>
                    row.map((cell, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => playMove(i, j)}
                            style={{
                                width: 100,
                                height: 100,
                                border: "1px solid black",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                cursor: isMyTurn && cell === "" ? "pointer" : "not-allowed",
                                backgroundColor: isMyTurn && cell === "" ? "#f0f8ff" : "#f5f5f5"
                            }}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default GameBoard;
