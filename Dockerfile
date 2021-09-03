FROM node:16-bullseye-slim

EXPOSE 8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install -g node-gyp; \
    npm install --only=prod --no-optional

COPY . /usr/src/app

CMD ["npm", "start"]
