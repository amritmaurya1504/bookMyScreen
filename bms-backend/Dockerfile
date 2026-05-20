# FROM node:20

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 9000

# RUN chmod +x start.sh

# CMD ["sh", "start.sh"]

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# build production stage

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .
COPY start.sh .

RUN chmod +x start.sh

USER node

EXPOSE 9000

CMD [ "sh", "start.sh" ]