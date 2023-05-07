import requests
import xmltodict
from headers import headers
from lxml import etree
from conn import engine
from tables import submissions
from sqlalchemy import insert, update, select
import os.path
import click
from concurrent import futures


def download_save_submission(url: str, accession_number: str):
    xml_url = url.split("/")
    del xml_url[-2]
    xml_url = "/".join(xml_url)
    
    if os.path.isfile(f'data/form4/{accession_number}.xml'):
        print("reading saved file..")
        with open(f'data/form4/{accession_number}.xml') as f:
            raw_xml = f.read()
    else:
        response = requests.get(xml_url, headers=headers)
        with open(f'data/form4/{accession_number}.xml', 'wb') as file:
            raw_xml = response.content
            parser = etree.XMLParser(remove_blank_text=True)
            raw_xml = etree.XML(raw_xml, parser=parser)
            raw_xml = etree.tostring(raw_xml)
            file.write(raw_xml)
    return xmltodict.parse(raw_xml)


def update_owner_info(submission:dict, accession_number):
    reportingOwner = submission.get("ownershipDocument").get("reportingOwner")
    if isinstance(reportingOwner,list):
        print("its a list")
    reportingOwner = reportingOwner[0] if isinstance(reportingOwner,list) else reportingOwner

    try:
        insert_data={
                'owner_cik': reportingOwner.get("reportingOwnerId").get("rptOwnerCik"),
                'owner_name': reportingOwner.get("reportingOwnerId").get("rptOwnerName"),
                'owner_city': reportingOwner.get("reportingOwnerAddress").get("rptOwnerCity"),
                'owner_state': reportingOwner.get("reportingOwnerAddress").get("rptOwnerState"),
                'owner_street1': reportingOwner.get("reportingOwnerAddress").get("rptOwnerStreet1"),
                'owner_street2': reportingOwner.get("reportingOwnerAddress").get("rptOwnerStreet2"),
                'owner_zip': reportingOwner.get("reportingOwnerAddress").get("rptOwnerZipCode")
                }
        with engine.connect() as conn:
            update_stmnt = update(submissions).filter(submissions.c.accession_number == accession_number).values(insert_data)
            conn.execute(update_stmnt)
            conn.commit()
    except Exception as e: print(e)


def get_submissions(limit:int):
    with engine.connect() as conn:
        query = select(submissions).where(submissions.c.owner_cik.is_(None)).order_by(submissions.c.ts.desc()).limit(limit)
        return conn.execute(query).all()
    

def download_and_update_submission(url: str, accession_number: str):
    print(accession_number)
    res = download_save_submission(url, accession_number)
    update_owner_info(res, accession_number)

    

@click.command()
@click.option('--max_workers', default=1, help='Number of max workers')
def main(max_workers: str):
    records = get_submissions(100)

    while len(records):
        with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            res = [executor.submit(download_and_update_submission, record.url, record.accession_number) for record in records]
        records = get_submissions(100)



if __name__ == '__main__':
    main()
