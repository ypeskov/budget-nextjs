FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

COPY .env.docker .env

RUN npm run build

RUN npm ci --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start"]