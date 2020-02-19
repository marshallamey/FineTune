FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/build .
RUN npm install -g serve
CMD ["serve","-p","80","-s","."]
