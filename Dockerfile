FROM navikt/node-express:latest

WORKDIR /usr/src/app

COPY server/ ./server
COPY dist/ ./dist

ENV PORT=8080

EXPOSE 8080
CMD ["npm", "run", "serve-express"]
