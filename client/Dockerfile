FROM node:13.6 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM node:13.6-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build ./
COPY index.js ./
COPY package.json ./
EXPOSE 3001
CMD ["node", "index.js"]