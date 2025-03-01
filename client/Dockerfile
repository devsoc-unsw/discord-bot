FROM node:23-bookworm

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]
