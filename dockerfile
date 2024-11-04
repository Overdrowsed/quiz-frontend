FROM node:alpine as build

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /dist /usr/share/nginx/html

EXPOSE 80
