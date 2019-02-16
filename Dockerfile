FROM node:11
RUN cd /root && touch ".builded.$(date +%F_%R)"
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
WORKDIR /app
RUN npm install && \
    npm cache clean
COPY . /app
EXPOSE 8080
EXPOSE 5000
# CMD ["yarn", "serveServer"]