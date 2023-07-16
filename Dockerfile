FROM node:16

RUN mkdir -p /usr/src/actin
WORKDIR /usr/src/actin

COPY ./ /usr/src/actin

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["node",".output/server/index.mjs"]