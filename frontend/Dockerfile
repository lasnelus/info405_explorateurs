FROM node:20-alpine As base

ENV NODE_ENV=production

FROM base As installer



WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build

EXPOSE 3001