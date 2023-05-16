#!/bin/sh
cd ~/insidertradealert && curl https://www.sec.gov/Archives/edgar/daily-index/bulkdata/submissions.zip -o submissions.zip -A davidson1987@gmail.com && unzip -q -o submissions.zip -d submissions && rm -f submissions.zip


