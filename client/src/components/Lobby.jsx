import { useState } from "react"

function Lobby({ sendMessage, setPlayer }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const createRoom = () => {
        setPlayer({ name });
        sendMessage({ type: "createRoom", room, nameX: name });
    };

    const joinRoom = () => {
        setPlayer({ name });
        sendMessage({ type: "joinRoom", room, nameO: name });
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh"
        }}>
            <div style={{
                border: "3px solid purple",
                borderRadius: "15px",
                backgroundColor: "#f8f5ff",
                padding: "30px",
                boxShadow: "0 6px 12px rgba(128, 0, 128, 0.3)",
                textAlign: "center",
                minWidth: "350px"
            }}>
                <h2 style={{ color: "purple", marginBottom: "25px" }}>Lobby</h2>

                <div style={{ marginBottom: "20px" }}>
                    <input
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "1rem",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            boxSizing: "border-box"
                        }}
                    />
                    <input
                        placeholder="ID de sala"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "1rem",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button
                        onClick={createRoom}
                        style={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#4caf50"}
                    >Crear sala
                    </button>
                    <button
                        onClick={joinRoom}
                        style={{
                            backgroundColor: "#2196f3",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#1976d2"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#2196f3"}
                    >Unirse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;
