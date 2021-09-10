FROM ghcr.io/caritasdeutschland/caritas-onlineberatung-nginx/nginx-image:dockerimage.v.6.release-2021-06-22
COPY ./ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
