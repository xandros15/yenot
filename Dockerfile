FROM node:20.19-alpine
WORKDIR /app
COPY ./ ./
RUN npm ci
CMD ["node", "index.js"]
