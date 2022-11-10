#build environment
FROM node:19-alpine as builder

EXPOSE 3000

WORKDIR /answerking-react

COPY package.json yarn.lock ./

#RUN yarn install --immutable --immutable-cache --check-cache
RUN yarn install

COPY . .

RUN npm run build
