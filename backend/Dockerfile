FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn prisma generate && yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]
