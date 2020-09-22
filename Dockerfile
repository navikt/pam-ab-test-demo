FROM navikt/node-express:latest

WORKDIR /usr/src/app

COPY server/ ./server
COPY dist/ ./dist
COPY package.json package-lock.json ./

RUN npm ci --production

ENV PORT=8080

EXPOSE 8080
CMD ["npm", "run", "serve-express"]
