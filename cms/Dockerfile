FROM node:22-alpine AS build

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /opt/app

ENV NODE_ENV=production
COPY --from=build --chown=node:node /opt/app/node_modules ./node_modules
COPY --from=build --chown=node:node /opt/app/package.json ./package.json
COPY --from=build --chown=node:node /opt/app/package-lock.json ./package-lock.json
COPY --from=build --chown=node:node /opt/app/config ./config
COPY --from=build --chown=node:node /opt/app/public ./public
COPY --from=build --chown=node:node /opt/app/src ./src
COPY --from=build --chown=node:node /opt/app/build ./build
RUN mkdir -p database/migrations public/uploads \
  && chown -R node:node database public/uploads

USER node
EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget --quiet --spider http://127.0.0.1:1337/_health || exit 1

CMD ["npm", "run", "start"]
