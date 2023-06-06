import requests
import xmltodict
from headers import headers
from lxml import etree
from conn import engine
from tables import submissions, derivative
from sqlalchemy import insert, update, select
import os.path
import click
from concurrent import futures
from sqlalchemy.dialects.postgresql.dml import OnConflictDoNothing
import signal


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


def get_owner_info(submission:dict):
    ownershipDocument = submission.get("ownershipDocument",{})
    reportingOwner = ownershipDocument.get("reportingOwner",{})
    issuer = ownershipDocument.get("issuer",{})
    if isinstance(reportingOwner,list):
        print("its a list")
    reportingOwner = reportingOwner[0] if isinstance(reportingOwner,list) else reportingOwner
    footnotes = (ownershipDocument.get("footnotes") or {}).get("footnote",[])
    if footnotes:
        footnotes = {k:v for x in [{x['@id']:x['#text']} for x in footnotes] for k,v in x.items()} if isinstance(footnotes, list) else {footnotes['@id']:footnotes['#text']}
    else:
        footnotes = None

    return {
                'report_owner_cik': reportingOwner.get("reportingOwnerId",{}).get("rptOwnerCik"),
                'report_owner_name': reportingOwner.get("reportingOwnerId",{}).get("rptOwnerName"),
                'report_owner_is_director': reportingOwner.get("reportingOwnerRelationship",{}).get("isDirector"),
                'report_owner_is_officer': reportingOwner.get("reportingOwnerRelationship",{}).get("isOfficer"),
                'report_owner_is_other': reportingOwner.get("reportingOwnerRelationship",{}).get("isOther"),
                'report_owner_is_ten_percent_owner': reportingOwner.get("reportingOwnerRelationship",{}).get("isTenPercentOwner"),
                'officer_title': reportingOwner.get("reportingOwnerRelationship",{}).get("officerTitle"),
                'report_owner_city': reportingOwner.get("reportingOwnerAddress",{}).get("rptOwnerCity"),
                'report_owner_state': reportingOwner.get("reportingOwnerAddress",{}).get("rptOwnerState"),
                'report_owner_street1': reportingOwner.get("reportingOwnerAddress",{}).get("rptOwnerStreet1"),
                'report_owner_street2': reportingOwner.get("reportingOwnerAddress",{}).get("rptOwnerStreet2"),
                'report_owner_zip': reportingOwner.get("reportingOwnerAddress",{}).get("rptOwnerZipCode"),
                'issuer_cik': issuer.get("issuerCik"),
                'issuer_name': issuer.get("issuerName"),
                'issuer_trading_symbol': issuer.get("issuerTradingSymbol"),
                'footnotes':footnotes
                }

def write_owner_info(owner_info, accession_number):
    with engine.connect() as conn:
            update_stmnt = update(submissions).filter(submissions.c.accession_number == accession_number).values(owner_info)
            conn.execute(update_stmnt)
            conn.commit()


def write_derivative(derivative_values):
    insrt_stmnt = insert(derivative).values(derivative_values) 
    insrt_stmnt._post_values_clause = OnConflictDoNothing()
    with engine.connect() as conn:
        conn.execute(insrt_stmnt)
        conn.commit()


def get_submissions(limit:int):
    with engine.connect() as conn:
        query = select(submissions).where(submissions.c.report_owner_cik.is_(None)).order_by(submissions.c.ts.desc()).limit(limit)
        return conn.execute(query).all()
    



def flatten_nested_derivative(accession_number, ownershipDocument, item, k, is_non_derivative: bool, idx = 0):
    reportingOwner = ownershipDocument.get("reportingOwner")
    reportingOwner = reportingOwner[0] if isinstance(reportingOwner,list) else reportingOwner
    report_owner_cik = reportingOwner.get("reportingOwnerId",{}).get("rptOwnerCik")
    issuer_cik = ownershipDocument.get("issuer",{}).get("issuerCik"),

    return {
        "accession_number":accession_number,
        "report_owner_cik":report_owner_cik,
        "issuer_cik": issuer_cik[0] if isinstance(issuer_cik, tuple) else issuer_cik,
        "idx": idx,
        "holding": k=='nonDerivativeHolding',
        "is_non_derivative":is_non_derivative,
        "direct_or_indirect_ownership": item.get("ownershipNature",{}).get("directOrIndirectOwnership",{}).get("value"),
        "nature_of_ownership": item.get("ownershipNature",{}).get("natureOfOwnership",{}).get("value"),
        "shares_owned_following_transaction": item.get("postTransactionAmounts",{}).get("sharesOwnedFollowingTransaction",{}).get("value"),
        "ownership_footnote": item.get("postTransactionAmounts",{}).get("sharesOwnedFollowingTransaction",{}).get("footnoteId",{}).get("@id"),
        "security_title": item.get("securityTitle",{}).get("value"),
        "deemed_execution_date": item.get("deemedExecutionDate"),
        "transaction_acquired_disposed_code": item.get("transactionAmounts",{}).get("transactionAcquiredDisposedCode",{}).get("value"),
        "transaction_price_per_share": item.get("transactionAmounts",{}).get("transactionPricePerShare",{}).get("value"),
        "transaction_shares": item.get("transactionAmounts",{}).get("transactionShares",{}).get("value"),
        "equity_swap_involved": item.get("transactionCoding",{}).get("equitySwapInvolved"),
        "transaction_foot_note": item.get("transactionCoding",{}).get("footnoteId",{}).get("@id"),
        "transaction_code": item.get("transactionCoding",{}).get("transactionCode"),
        "transaction_form_type": item.get("transactionCoding",{}).get("transactionFormType"),
        "transaction_date": item.get("transactionDate",{}).get("value"),
        "conversion_or_exercise_price": item.get("conversionOrExercisePrice",{}).get("value"),
        "exercise_date": item.get("exerciseDate",{}).get("value"),
        "exercise_footnote": item.get("exerciseDate",{}).get("footnoteId",{}).get("@id"),
        "expiration_date": item.get("expirationDate",{}).get("value"),
        "expiration_date_footnote": item.get("expirationDate",{}).get("footnoteId",{}).get("@id"),
        "underlying_security_shares": item.get("underlyingSecurity",{}).get("underlyingSecurityShares",{}).get("value"),
        "underlying_security_title": item.get("underlyingSecurity",{}).get("underlyingSecurityTitle",{}).get("value"),
    }



def get_derivate(submission, accession_number):
    transactions = []
    ownershipDocument = submission.get("ownershipDocument")
    derivativeTable = ownershipDocument.get("derivativeTable")
    nonDerivativeTable = ownershipDocument.get("nonDerivativeTable")
    if nonDerivativeTable:
        for k,v in nonDerivativeTable.items():        
            if isinstance(v, dict):
                transactions.append(flatten_nested_derivative(accession_number, ownershipDocument, v, k, True))
            if isinstance(v, list):
                [transactions.append(flatten_nested_derivative(accession_number, ownershipDocument, x, k, True, idx)) for idx, x in enumerate(v)]
    if derivativeTable:
        for k,v in derivativeTable.items():
            if isinstance(v, dict):
                transactions.append(flatten_nested_derivative(accession_number, ownershipDocument, v, k, False))
            if isinstance(v, list):
                [transactions.append(flatten_nested_derivative(accession_number, ownershipDocument, x, k, False, idx)) for idx, x in enumerate(v)]
    return transactions




def download_and_update_submission(url: str, accession_number: str):
    # print(accession_number)
    submission = download_save_submission(url, accession_number)
    owner_info = get_owner_info(submission)
    write_owner_info(owner_info=owner_info, accession_number=accession_number)
    derivative_values = get_derivate(submission, accession_number)
    write_derivative(derivative_values)

@click.command()
@click.option('--max_workers', default=1, help='Number of max workers')
def main(max_workers: str):
    records = get_submissions(1000)
    print(f"Got {len(records)} records")

    while len(records):
        with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            for idx, record in enumerate(records):
                signal.alarm(59*60) #seconds
                executor.submit(download_and_update_submission, record.url, record.accession_number)
                if idx % 1000 ==0:
                    print(idx, record.accession_number)

        records = get_submissions(1000)
        print(f"Got {len(records)} records")
     



if __name__ == '__main__':
    main()
    # download_and_update_submission("https://www.sec.gov/Archives/edgar/data/1737503/000172697823000052/xslF345X04/wf-form4_168325197053897.xml","0001726978-23-000052")


