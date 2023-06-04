FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update 
RUN apt-get install busybox-suid -y 


# ADD crontab /etc/cron.d/my-cron-file

# RUN chmod 0644 /etc/cron.d/my-cron-file

# RUN crontab /etc/cron.d/my-cron-file

ENTRYPOINT ["true"]
