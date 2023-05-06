import json
from conn import engine
from sqlalchemy import insert
from tables import submissions
from sqlalchemy.dialects.postgresql.dml import OnConflictDoNothing
import os
from concurrent import futures
from datetime import datetime 
import platform

start_time = datetime.now() 



def get_filings(file_name: str):
    filings = []
    with open(file_name)as f:
        if "-submissions" in file_name:
            recent = json.load(f)
            cik = str(int( file_name.split('/')[-1].split("-")[0][3:]))

        else:
            file = json.load(f)
            recent = file['filings']['recent']
            cik = str(int(file['cik']))


        for acceptanceDateTime, accessionNumber, act,fileNumber,filingDate,filmNumber,form,isInlineXBRL,isXBRL,items,primaryDocDescription,primaryDocument,reportDate,size in zip(
            recent['acceptanceDateTime'],
            recent['accessionNumber'],
            recent['act'],
            recent['fileNumber'],
            recent['filingDate'],
            recent['filmNumber'],
            recent['form'],
            recent['isInlineXBRL'],
            recent['isXBRL'],
            recent['items'],
            recent['primaryDocDescription'],
            recent['primaryDocument'],
            recent['reportDate'],
            recent['size']):
            
            
            filings.append({
                "cik":cik,
                "ts":acceptanceDateTime,
                "accession_number":accessionNumber,
                "act":act,
                "file_number":fileNumber,
                "filing_date":filingDate,
                "film_number":filmNumber,
                "form":form,
                "is_in_line_xbrl":isInlineXBRL,
                "is_xbrl":isXBRL,
                "items":items,
                "primary_doc_description":primaryDocDescription,
                "primary_document":primaryDocument,
                "report_date":reportDate,
                "size":size,
                "url":f"https://www.sec.gov/Archives/edgar/data/{cik}/{accessionNumber.replace('-','')}/{primaryDocument}"
            })

    return filings



submissions_path="/Users/home2418a/Downloads/submissions" if platform.system()=='Darwin' else "submissions"

all_submissions = os.listdir(submissions_path)
all_submissions = [x for x in all_submissions if x.startswith("CIK")]


def upload_filing(file):
    print(file)
    filings = get_filings(f"{submissions_path}/{file}")
    filings = [x for x in filings if x['form'] in ('3','4','5')]
    if len(filings)>0:
        insrt_stmnt = insert(submissions).values(filings) 

        insrt_stmnt._post_values_clause = OnConflictDoNothing()


        with engine.connect() as conn:
            conn.execute(insrt_stmnt)
            conn.commit()



with futures.ThreadPoolExecutor(max_workers=10) as executor:
    future_res = dict((executor.submit(upload_filing, file), file)
                         for file in all_submissions)



time_elapsed = datetime.now() - start_time 
print('Time elapsed (hh:mm:ss.ms) {}'.format(time_elapsed))
