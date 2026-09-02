FROM node:22-alpine AS deps
WORKDIR /opt/app
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS runner
WORKDIR /opt/app
RUN apk add --no-cache vips-dev
ENV NODE_ENV=development
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN cp public/favicon.ico favicon.ico
EXPOSE 1337
CMD ["npm", "run", "develop"]
