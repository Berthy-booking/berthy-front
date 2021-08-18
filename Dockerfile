FROM node:lts-alpine as build-stage
WORKDIR /app
ENV VUE_APP_BERTHY_API http://127.0.0.1:8080/api/
ENV VUE_APP_BERTHY_WEB_SOCKET wss://127.0.0.1:8080/socket
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]