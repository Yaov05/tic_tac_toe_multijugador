import { useState } from "react"

function Lobby({ sendMessage, setPlayer }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const createRoom = () => {
        setPlayer({ name });
        sendMessage({ type: "createRoom", room, name });
    };

    const joinRoom = () => {
        setPlayer({ name });
        sendMessage({ type: "joinRoom", room, name });
    };

    return (
        <div>
            <h2>Lobby</h2>
            <input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="ID de sala" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button onClick={createRoom}>Crear sala</button>
            <button onClick={joinRoom}>Unirse</button>
        </div>
    );
}

export default Lobby;
