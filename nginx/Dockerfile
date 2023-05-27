# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80
EXPOSE 433

# Launch NGINX
CMD [ "ninx", "-g", "daemon off;" ]

# CMD ["while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\""]
