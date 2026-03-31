FROM golang:1.25 AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o api ./cmd/server

EXPOSE 8000

CMD ["./api"]
