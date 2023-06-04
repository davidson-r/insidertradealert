FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apk add --update busybox-suid


# ADD crontab /etc/cron.d/my-cron-file

# RUN chmod 0644 /etc/cron.d/my-cron-file

# RUN crontab /etc/cron.d/my-cron-file

ENTRYPOINT ["cron", "-f"]
