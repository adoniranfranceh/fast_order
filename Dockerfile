FROM ruby:3.3.6 AS base

ENV NODE_VERSION=22.4.1
ENV YARN_VERSION=1.22.22

WORKDIR /app

RUN apt-get update && apt-get install -y \
  curl \
  tar \
  xvfb \
  libgtk2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/* \
  && apt-get clean

ENV PATH="/usr/local/node/bin:$PATH"
RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
  /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
  npm install -g yarn@${YARN_VERSION} && \
  rm -rf /tmp/node-build-master


COPY package.json yarn.lock ./

RUN yarn install

FROM base AS dev
