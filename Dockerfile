FROM docker.pkg.github.com/caritasdeutschland/caritas-onlineberatung-nginx/nginx-image:dockerimage.v.1
COPY ./ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf