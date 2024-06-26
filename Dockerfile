FROM node:lts-alpine as build-stage
WORKDIR /app
ENV VUE_APP_BERTHY_API https://berthy.tk/api/
ENV VUE_APP_BERTHY_WEB_SOCKET wss://berthy.tk/socket
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY nginx-front.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8888
CMD ["nginx", "-g", "daemon off;"]