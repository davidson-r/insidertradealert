from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, Boolean
from sqlalchemy import MetaData
metadata_obj = MetaData()

submissions = Table(
    "submissions",
    metadata_obj,
    Column("cik", String),
    Column("ts", TIMESTAMP),
    Column("accession_number", String),
    Column("act", String),
    Column("file_number", String),
    Column("filing_date", String),
    Column("film_number", String),
    Column("form", String),
    Column("is_in_line_xbrl", Integer),
    Column("is_xbrl", Integer),
    Column("items", String),
    Column("primary_doc_description", String),
    Column("primary_document", String),
    Column("report_date", String),
    Column("size", Integer),
    Column("url", String),
    Column("report_owner_cik", String),
    Column("report_owner_name", String),
    Column("report_owner_city", String),
    Column("report_owner_state", String),
    Column("report_owner_street1", String),
    Column("report_owner_street2", String),
    Column("report_owner_zip", String),
    Column("report_owner_is_director", String),
    Column("report_owner_is_officer", String),
    Column("report_owner_is_other", String),
    Column("report_owner_is_ten_percent_owner", String),
    Column("issuer_cik", String),
    Column("issuer_name", String),
    Column("issuer_trading_symbol", String),
    Column("officer_title", String)
)

