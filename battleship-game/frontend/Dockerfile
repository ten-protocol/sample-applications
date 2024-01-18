FROM node:18-buster as runner
# setup container data structure
RUN mkdir -p /battleship-game/
COPY ./frontend /battleship-game/frontend

WORKDIR /battleship-game/frontend
RUN npm install

EXPOSE 80