FROM ruby:3.3.1 AS base

ENV NODE_VERSION=22.4.1
ENV YARN_VERSION=1.22.22

WORKDIR /app

RUN apt-get update && apt-get install -y \
  curl \
  tar && \
  apt-get clean
  
ENV PATH="/usr/local/node/bin:$PATH"
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
  /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
  npm install -g yarn@${YARN_VERSION} && \
  rm -rf /tmp/node-build-master


COPY package.json yarn.lock ./

RUN yarn install

FROM base AS dev