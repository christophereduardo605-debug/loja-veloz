
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node server.js tracing.js ./

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["node", "--require", "./tracing.js", "server.js"]
