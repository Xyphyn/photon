FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./

RUN bun install

EXPOSE 3000

COPY . .

RUN ADAPTER=bun bun run build

USER bun

CMD ["bun", "run", "bunstart"]
