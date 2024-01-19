ARG NODE_VERSION=14.21.1
ARG PORT=80

FROM node:$NODE_VERSION as proxyBuild

USER node
WORKDIR /app
COPY proxy /app

ENV NODE_ENV=development
ENV PORT=$PORT

# Currently nothing to build inside
# RUN npm run install
# RUN npm run build
# RUN rm /app/node_modules

###
# Build is done on github so no need for docker build
#FROM node:$NODE_VERSION as frontendBuild
#
#USER node
#WORKDIR /app
#COPY . /app
#
#ENV NODE_ENV=development
#ENV PORT=$PORT
#
#RUN npm install --ignore-scripts
#RUN npm run build

# Prod build
FROM node:$NODE_VERSION

USER node
WORKDIR /app
EXPOSE $PORT
COPY --from=proxyBuild /app ./
COPY build /app/build

ENV NODE_ENV=production
ENV PORT=$PORT

RUN npm install --ignore-scripts

CMD ["npm", "run", "start"]