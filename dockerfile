#build environment
FROM node:19 as build

EXPOSE 3000

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY . ./

RUN npm run build

#production environment
FROM nginx:stable

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]