FROM node:lts-slim
WORKDIR /mqtt
ADD ./package.json /mqtt/
ADD ./tsconfig.json /mqtt/
RUN npm install
EXPOSE 8000
CMD [ "npm", "run", "run" ]