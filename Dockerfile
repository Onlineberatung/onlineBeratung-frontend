FROM viartifacts-docker.jfrog.io/caritas-online-beratung/nginx:master-6
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
