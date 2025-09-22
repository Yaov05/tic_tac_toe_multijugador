FROM golang:1.23.1 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8081
CMD ["./server"]