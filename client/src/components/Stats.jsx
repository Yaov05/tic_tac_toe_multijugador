import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

function Ranking() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        // console.log("Cargando estadísticas...");
        fetch(backendUrl + "/stats")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // console.log("Datos de estadísticas recibidos:", data);
                setStats(data);
            })
            .catch(error => {
                console.error("Error fetching stats:", error);
            });
    }, []);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0"
        }}>
            <table style={{
                border: "3px solid purple",
                borderRadius: "12px",
                backgroundColor: "#f8f5ff",
                padding: "20px",
                boxShadow: "0 6px 12px rgba(128, 0, 128, 0.3)",
                borderCollapse: "separate",
                borderSpacing: "0"
            }}>
                <thead>
                    <tr>
                        <th colSpan="3" style={{
                            textAlign: "center",
                            padding: "15px",
                            color: "purple",
                            fontSize: "1.3rem",
                            borderBottom: "2px solid purple"
                        }}>
                            Aquí los Top Globales
                        </th>
                    </tr>
                    <tr>
                        <th style={{
                            padding: "10px 15px",
                            color: "purple",
                            borderBottom: "1px solid #ddd",
                            textAlign: "center"
                        }}>#</th>
                        <th style={{
                            padding: "10px 15px",
                            color: "purple",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left"
                        }}>Jugador</th>
                        <th style={{
                            padding: "10px 15px",
                            color: "purple",
                            borderBottom: "1px solid #ddd",
                            textAlign: "center"
                        }}>Victorias</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.length > 0 ? stats.map((p, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f0f0f0" }}>
                            <td style={{
                                padding: "8px 15px",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "#cd7f32" : "black"
                            }}>
                                {i + 1}
                            </td>
                            <td style={{
                                padding: "8px 15px",
                                fontWeight: i < 3 ? "bold" : "normal"
                            }}>
                                {i === 0 ? "👑 " : ""}{p.name}
                            </td>
                            <td style={{
                                padding: "8px 15px",
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>
                                {p.wins}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" style={{
                                padding: "20px",
                                textAlign: "center",
                                color: "#666",
                                fontStyle: "italic"
                            }}>
                                No hay estadísticas disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Ranking;
