FROM node:alpine

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/app

RUN npm install --global pm2

COPY ./package*.json ./

RUN npm install --production

COPY ./ ./

RUN npm run build

EXPOSE 3000

USER node

# Run npm start script with PM2 when container starts
CMD ["wait-for-db.sh"]
