ARG DOCKER_MATRIX=ghcr.io
FROM $DOCKER_MATRIX/onlineberatung/onlineberatung-nginx/onlineberatung-nginx:dockerimage.v.005-main
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
