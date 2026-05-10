FROM node:20-alpine As base

ENV NODE_ENV="production"

FROM base AS installer

# Sinon prisma bug
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY  ./package*.json ./

RUN npm install --include=dev

COPY  . .

RUN npx prisma generate

RUN npm run build

FROM base as prunner
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY ./package*.json ./

RUN npm prune --omit=dev

FROM base AS runner
WORKDIR /app

ENV TZ=Europe/Paris

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && apk del tzdata

COPY --from=prunner /app/package.json ./package.json
COPY --from=installer /app/dist ./dist
COPY --from=prunner /app/node_modules ./node_modules
COPY --from=installer /app/start.sh ./start.sh
COPY --from=installer /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "start.sh"]