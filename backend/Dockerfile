# STEPS SHARED BETWEEN BACKEND AND UI DOCKERFILES
FROM node:10-slim

RUN apt-get update && \
  apt-get install -y apt-transport-https curl gnupg gnupg2 gnupg1 && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && \
  apt-get install -y yarn git lsof && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# BACKEND SPECIFIC STEPS:

HEALTHCHECK --interval=3s --timeout=2s --start-period=300s \
  CMD lsof -i :3030 || \
  exit 1

RUN mkdir -p /usr/src/external-storage-demo-server

COPY . /usr/src/external-storage-demo-server/

WORKDIR /usr/src/external-storage-demo-server

RUN yarn install

CMD [ "sh", "/usr/src/external-storage-demo-server/docker-run.sh" ]
