FROM node:latest as builder

WORKDIR /usr/src/app

COPY dist/ ./dist
COPY server/ ./server
COPY package.json package-lock.json ./

RUN npm --version
RUN npm config set strict-ssl false
RUN npm ci

FROM navikt/node-express:latest

WORKDIR /usr/src/app

COPY server/ ./server
COPY dist/ ./dist
COPY package.json ./

COPY --from=builder /usr/src/app/dist/ ./dist
COPY --from=builder /usr/src/app/server/ ./server
COPY --from=builder /usr/src/app/package.json ./

RUN npm config set strict-ssl false
RUN npm ci --production

ENV PORT=8080

EXPOSE 8080
CMD ["npm", "run", "serve-express"]
