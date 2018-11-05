FROM node:8-alpine as build
WORKDIR /usr/src/app
COPY . .
RUN npm install --silent
ENV NODE_ENV production
RUN npx ng build --prod --aot --base-href=/ --output-hashing=all

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html
COPY ./frontend.conf /etc/nginx/conf.d/default.conf
