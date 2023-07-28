FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 3000

COPY . .

RUN ADAPTER=node npm run build

RUN chown -R node /app

USER node

CMD ["npm", "run", "start"]
