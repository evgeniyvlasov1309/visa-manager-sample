FROM node:18.13-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build
CMD ["npm", "start"]