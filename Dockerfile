FROM navikt/node-express:12.2.0

WORKDIR /app

COPY dist ./dist
COPY server ./server
COPY package.json package-lock.json ./

RUN npm ci

CMD ["npm", "./server/server.js"]
