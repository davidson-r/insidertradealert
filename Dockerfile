FROM node:alpine

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/app

RUN npm install --global pm2

COPY ./package*.json ./

RUN npm install --production

COPY ./ ./

RUN chmod +x /usr/app/wait-for-it.sh

ENTRYPOINT ["/bin/sh","-c","/usr/app/wait-for-it.sh db:5432 -t 30 -- echo 'Database running...'"]

RUN npm run build

EXPOSE 3000

USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]