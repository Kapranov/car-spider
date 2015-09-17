FROM iojs:onbuild

RUN mkdir /app
WORKDIR /app
ADD . /app

RUN npm install -g bower
RUN npm install
RUN bower install --allow-root

EXPOSE 8080

CMD npm start
