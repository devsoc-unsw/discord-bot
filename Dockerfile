from node:23-bookworm

workdir /app

copy package.json .
run npm i

copy . .

cmd ['npx', 'tsx', 'src/index.ts']
