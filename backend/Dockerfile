FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY . .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npx", "ts-node", "src/index.ts"] 