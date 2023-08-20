FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 3000

COPY . .

RUN ADAPTER=node npm run build

USER node

CMD ["npm", "run", "start"]
