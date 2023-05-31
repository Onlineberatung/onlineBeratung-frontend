ARG DOCKER_MATRIX=ghcr.io
FROM $DOCKER_MATRIX/onlineberatung/onlineberatung-nginx/onlineberatung-nginx:dockerimage.v.001-main
COPY storybook-static /usr/share/nginx/html/storybook
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
