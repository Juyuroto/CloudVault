# use official Golang image
FROM golang:1.25-alpine AS builder

# set working directory
WORKDIR /app

# Copy and download dependencies first (better build cache)
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go app
RUN go build -o api ./cmd/server

#EXPOSE the port
EXPOSE 8000

# Run the executable
CMD ["./api"]