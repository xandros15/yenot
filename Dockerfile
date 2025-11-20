FROM node:20.13.1-alpine
WORKDIR /app
COPY ./ ./
RUN npm ci
CMD ["node", "index.js"]
