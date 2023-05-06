import requests
import xmltodict
from headers import headers
from lxml import etree
from conn import engine
from tables import submissions
from sqlalchemy import insert, update, select



def save_submission(url: str, accession_number: str):

    xml_url = url.split("/")
    del xml_url[-2]
    xml_url = "/".join(xml_url)
    response = requests.get(xml_url, headers=headers)

    with open(f'data/form4/{accession_number}.xml', 'wb') as file:
        raw_xml = response.content
        parser = etree.XMLParser(remove_blank_text=True)
        raw_xml = etree.XML(raw_xml, parser=parser)
        file.write(etree.tostring(raw_xml))

    return xmltodict.parse(response.content)


def update_submission(submission:dict, accession_number):
    reportingOwner = submission.get("ownershipDocument").get("reportingOwner")

    with engine.connect() as conn:
        update_stmnt = update(submissions).filter(submissions.c.accession_number == accession_number).values({
            'owner_cik': reportingOwner.get("reportingOwnerId").get("rptOwnerCik"),
            'owner_name': reportingOwner.get("reportingOwnerId").get("rptOwnerName"),
            'owner_city': reportingOwner.get("reportingOwnerAddress").get("rptOwnerCity"),
            'owner_state': reportingOwner.get("reportingOwnerAddress").get("rptOwnerState"),
            'owner_street1': reportingOwner.get("reportingOwnerAddress").get("rptOwnerStreet1"),
            'owner_street2': reportingOwner.get("reportingOwnerAddress").get("rptOwnerStreet2"),
            'owner_zip': reportingOwner.get("reportingOwnerAddress").get("rptOwnerZipCode")
            })
        conn.execute(update_stmnt)
        conn.commit()

def get_submissions(limit:int):
    with engine.connect() as conn:
        query = select(submissions).where(submissions.c.owner_cik.is_(None)).order_by(submissions.c.ts.desc()).limit(limit)
        return conn.execute(query).all()
records = get_submissions(100)

for record in records:
    print(record.accession_number)
    res = save_submission(record.url, record.accession_number)
    update_submission(res, record.accession_number)





