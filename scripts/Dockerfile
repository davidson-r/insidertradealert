FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY crontab /etc/crontab
RUN chmod 0644 /etc/crontab
# RUN /usr/bin/crontab 
CMD ["cron", "-f"]
