# base image
FROM node:alpine AS builder
# set working directory
WORKDIR /app
# copy source files to directory
COPY . .
# create production build
RUN npm install
RUN npm run build


FROM node:alpine
WORKDIR /app

COPY --from=builder /app/build .

RUN npm install -g serve
CMD ["serve", "-p", "3000", "-s", "."]
