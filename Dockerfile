# Base stage for both Bun and Node.js
FROM alpine:3.14 as base
WORKDIR /app
COPY package.json .

# Bun stage
FROM oven/bun:1 as bun-builder
WORKDIR /app
COPY --from=base /app/package.json .
COPY . .
RUN bun install
RUN bun run build

# Node.js stage
FROM node:18-alpine as node-builder
WORKDIR /app
COPY --from=base /app/package.json .
COPY . .
RUN npm install
RUN npm run build

# Final Bun image
FROM oven/bun:1-alpine AS bun
WORKDIR /app
COPY --from=bun-builder /app .
EXPOSE 3000
CMD ["bun", "/app/build/index.js"]

# Final Node.js image
FROM node:20-alpine AS node
WORKDIR /app
COPY --from=node-builder /app .
EXPOSE 3000
CMD ["node", "/app/build/index.js"]