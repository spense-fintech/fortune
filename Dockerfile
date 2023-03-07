FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY src src
COPY public public
COPY package.json package.json
COPY rollup.config.js rollup.config.js 
RUN npm install pm2 -g
RUN npm install --force

EXPOSE 3000
CMD [ "pm2-runtime", "src/app.mjs" ]