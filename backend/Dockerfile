FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY prisma ./prisma
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma generate && yarn prisma migrate deploy && yarn dev"]
