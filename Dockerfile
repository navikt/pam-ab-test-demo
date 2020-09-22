FROM navikt/node-express:latest

WORKDIR /usr/src/app

COPY dist ./dist
COPY server ./server
COPY package.json package-lock.json ./

RUN npm config set strict-ssl false
RUN npm ci --production

ENV PORT=8080

EXPOSE 8080
CMD ["npm", "run", "serve-express"]
