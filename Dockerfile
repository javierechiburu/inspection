#stage1
FROM node:18.17-alpine3.17 as build-step
RUN mkdir -p /app
RUN npm cache clear --force
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build:prod

#stage2
FROM nginx:1.25-alpine3.18
COPY --from=build-step /app/dist /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]