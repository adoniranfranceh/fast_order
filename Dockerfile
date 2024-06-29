FROM ruby:3.3.1 AS base

WORKDIR /app

FROM base AS dev
RUN apt update && \
    apt install wget gnupg unzip -y && \
   wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
    RUN apt update && \
    apt install google-chrome-stable -y
