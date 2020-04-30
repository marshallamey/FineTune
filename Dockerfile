# base image
FROM node:14 AS builder
# set working directory
WORKDIR /app
# copy source files to directory
COPY . .
# create production build
RUN npm install
RUN npm run build


FROM node:14
WORKDIR /app

COPY --from=builder /app/build .

RUN npm install -g serve
CMD ["serve", "-p", "80", "-s", "."]
