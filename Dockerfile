# Base stage for both Bun and Node.js
FROM alpine:3.14 AS base
WORKDIR /app
COPY package.json .

# Bun stage
FROM oven/bun:1.2.9-alpine AS bun-builder
WORKDIR /app
COPY --from=base /app/package.json .
COPY . .
RUN bun install
RUN ADAPTER=bun bun run build

# Node.js stage
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY --from=base /app/package.json .
COPY . .
RUN npm install --no-lockfile
RUN ADAPTER=node npm run build

# Final Node.js image
FROM node:20-alpine AS node
USER node
WORKDIR /app
COPY --from=node-builder /app/build /app/build
COPY --from=node-builder /app/node_modules /app/node_modules
COPY --from=node-builder /app/package.json /app/package.json
EXPOSE 3000
CMD ["node", "build/index.js"]

# Final Bun image
FROM oven/bun:1.2.9-alpine AS bun
WORKDIR /app
COPY --from=bun-builder /app/build /app/build
COPY --from=bun-builder /app/node_modules /app/node_modules
EXPOSE 3000
USER bun
CMD ["bun", "build/index.js"]