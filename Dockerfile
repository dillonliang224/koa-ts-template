FROM node:10.16.3-alpine

WORKDIR /www
RUN mkdir -p /www

RUN npm install pm2 -g

COPY . .

RUN echo "Installing node moduloes ..." \
  && npm i yarn typescript -g \
  && yarn install \
  && echo "build ..." \
  && npm run build \
  && echo "Clean up ..." \
  && rm -rf /tmp ~/.npm /usr/local/share/.cache

STOPSIGNAL SIGTERM

EXPOSE 8080

CMD ["pm2-runtime", "start", "pm2/api.docker.yml"]
