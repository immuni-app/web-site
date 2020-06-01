FROM node:10 as builder
WORKDIR /app

COPY  . .

RUN yarn install --network-timeout 100000
RUN yarn build

FROM nginx:1.17.10-alpine

ARG HTPASSWD

COPY nginx.conf /etc/nginx/nginx.conf

RUN echo "${HTPASSWD}" > /etc/nginx/auth.htpasswd

COPY --from=builder /app/dist /static
