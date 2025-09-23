# Tic-Tac-Toe Multijugador (Go + React + PostgreSQL)


## 🛠️ Tecnologías
- Backend: Go (net/http, gorilla/websocket, pgx)
- Frontend: React con Vite
- Base de datos: PostgreSQL
- Contenedores: Docker + Docker Compose


## 📦 Requisitos
- Docker y Docker Compose instalados


## Instalación y ejecución

1. Clonar el repositorio
   ```bash
   git clone https://github.com/Yaov05/tic_tac_toe_multijugador.git
   cd tic_tac_toe_multijugador

2. Levantar los servicios con Docker Compose
    ```bash
    docker compose up --build

Esto construirá las imágenes y levantará el api en Go, el cliente en React y una BD en PostgreSQL de respaldo

## Acceder a la aplicación

- 🎨 **Frontend (UI del juego):**  
  👉 [http://localhost:5173](http://localhost:5173)

- ⚙️ **Backend (API + WebSocket):**  
  👉 [http://localhost:8081](http://localhost:8081)

- 🔌 **WebSocket endpoint:**  
  👉 `ws://localhost:8081/ws`

- 🏆 **Ranking jugadores (REST API):**  
  👉 [http://localhost:8081/stats](http://localhost:8081/stats)
