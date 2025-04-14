# Stage 1: Build
FROM node:20-alpine AS build

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
