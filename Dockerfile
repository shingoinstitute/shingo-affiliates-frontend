### STEP 1: Build ### 
FROM node:8.9-alpine as builder
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mkdir /ng-app && mv ./node_modules /ng-app/node_modules
ENV NODE_ENV production
WORKDIR /ng-app
COPY . .
RUN $(npm bin)/ng build --prod -aot -vc -v -pr --base-href=/ --output-hashing=all

### STEP 2: Nginx ### 
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
