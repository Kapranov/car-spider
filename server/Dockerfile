FROM iojs:onbuild

RUN mkdir /src
WORKDIR /src
ADD . /src

RUN npm install

EXPOSE 3000

CMD npm start
