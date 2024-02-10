FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN ADAPTER=bun npm run build

FROM oven/bun:alpine

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build

EXPOSE 3000

USER bun

CMD ["bun", "/app/build/index.js"]
