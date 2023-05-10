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
    reportingOwner = submission.get("ownershipDocument",{}).get("reportingOwner",{})
    issuer = submission.get("ownershipDocument",{}).get("issuer",{})
    if isinstance(reportingOwner,list):
        print("its a list")
    reportingOwner = reportingOwner[0] if isinstance(reportingOwner,list) else reportingOwner

    try:
        insert_data={
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
                'issuer_trading_symbol': issuer.get("issuerTradingSymbol")
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

    

# @click.command()
# @click.option('--max_workers', default=1, help='Number of max workers')
# def main(max_workers: str):
#     records = get_submissions(100)

#     while len(records):
#         with futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
#             res = [executor.submit(download_and_update_submission, record.url, record.accession_number) for record in records]
#         records = get_submissions(100)



# if __name__ == '__main__':
#     main()


accession_number = "0001209191-23-004678"
item = download_save_submission("https://www.sec.gov/Archives/edgar/data/922224/000120919123004678/xslF345X03/doc4.xml","0001209191-23-004678")

ownershipDocument = item.get("ownershipDocument")

derivativeTable = ownershipDocument.get("derivativeTable")
nonDerivativeTable = ownershipDocument.get("nonDerivativeTable")

footnotes = ownershipDocument.get("footnotes",{}).get("footnote")
footnotes = {k:v for x in [{x['@id']:x['#text']} for x in footnotes] for k,v in x.items()}

def get_footnote(footnotes: list, id: str):
    if id:
        return [x for x in footnotes if x['@id']==id][0].get('#text')


def flatten_nested(ownershipDocument, item, k, is_non_derivative: bool, idx = 0):
    # print(item)

    reportingOwner = ownershipDocument.get("reportingOwner")
    reportingOwner = reportingOwner[0] if isinstance(reportingOwner,list) else reportingOwner
    report_owner_cik = reportingOwner.get("reportingOwnerId").get("rptOwnerCik")
    issuer_cik = ownershipDocument.get("issuer").get("issuerCik"),

    return {
        "report_owner_cik":report_owner_cik,
        "issuer_cik":issuer_cik,
        "idx": idx,
        "holding": k=='nonDerivativeHolding' if is_non_derivative else None,
        "is_non_derivative":is_non_derivative,
        "direct_or_indirect_ownership": item.get("ownershipNature",{}).get("directOrIndirectOwnership",{}).get("value"),
        "nature_or_ownership": item.get("ownershipNature",{}).get("natureOfOwnership",{}).get("value"),
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
        "conversion_or_exercise_price": item.get("conversionOrExercisePrice",{}).get("footnoteId",{}).get("@id"),
        "exercise_date": item.get("exerciseDate",{}).get("value"),
        "exercise_footnote": item.get("exerciseDate",{}).get("footnoteId",{}).get("@id"),
        "expiration_date": item.get("expirationDate",{}).get("value"),
        "expiration_date_footnote": item.get("expirationDate",{}).get("footnoteId",{}).get("@id"),
        "underlying_security_shares": item.get("underlyingSecurity",{}).get("underlyingSecurityShares",{}).get("value"),
        "underlying_security_title": item.get("underlyingSecurity",{}).get("underlyingSecurityTitle",{}).get("value"),
    }

transactions = []
    

if nonDerivativeTable:
    for k,v in nonDerivativeTable.items():        
        if isinstance(v, dict):
            transactions.append(flatten_nested(ownershipDocument, v, k, True))
        if isinstance(v, list):
            [transactions.append(flatten_nested(ownershipDocument, x, k, True, idx)) for idx, x in enumerate(v)]
            

if derivativeTable:
    for k,v in derivativeTable.items():
        if isinstance(v, dict):
            transactions.append(flatten_nested(ownershipDocument, v, k, False))
        if isinstance(v, list):
            [transactions.append(flatten_nested(ownershipDocument, x, k, False, idx)) for idx, x in enumerate(v)]


        
print(transactions)
