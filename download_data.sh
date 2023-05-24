#!/bin/sh
cd ~/insidertradealert 
curl https://www.sec.gov/Archives/edgar/daily-index/bulkdata/submissions.zip -o submissions.zip -A davidson1987@gmail.com
unzip -q -o submissions.zip -d submissions 
rm -f submissions.zip
python3 scripts/ingest_submissions.py --max_workers 2

sudo docker-compose down && sudo docker-compose up --build -d
