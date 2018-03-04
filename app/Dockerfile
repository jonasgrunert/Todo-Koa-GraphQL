FROM node:9.4

# Create app directory
RUN mkdir /opt/app

# Bundle app source
COPY . /opt/app

WORKDIR /opt/app

EXPOSE 3000
CMD [ "npm", "start" ]