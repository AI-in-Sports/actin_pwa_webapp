FROM node:16

RUN mkdir -p /usr/src/actin
WORKDIR /usr/src/actin

COPY ./ /usr/src/actin

RUN yarn install

ARG EXPRESS_BACKEND
ENV EXPRESS_BACKEND=${EXPRESS_BACKEND}

RUN yarn build

EXPOSE 3000

CMD ["node",".output/server/index.mjs"]