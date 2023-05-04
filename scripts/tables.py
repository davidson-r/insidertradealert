from sqlalchemy import Table, Column, Integer, String, TIMESTAMP
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
)

