FROM node:16-bullseye-slim AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
# COPY tsconfig*.json ./
COPY . .
RUN npm run build

FROM node:16-bullseye-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod --no-optional

COPY --from=builder /usr/src/app/dist dist/

EXPOSE 8080
CMD ["npm", "start"]
