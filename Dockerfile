FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 3000

COPY . .

RUN ADAPTER=node npm run build

CMD ["npm", "run", "start"]