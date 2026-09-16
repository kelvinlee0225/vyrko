# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# --- Production dependencies stage ---
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# --- Runtime stage ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=deps /app/node_modules ./node_modules
ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem ./certs/rds-ca-bundle.pem
RUN chmod 644 ./certs/rds-ca-bundle.pem
COPY --from=build /app/dist ./dist
COPY package.json ./

USER nestjs

EXPOSE 3000
CMD ["node", "dist/main"]
