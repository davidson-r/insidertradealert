from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, JSON, Boolean, DATE, DECIMAL
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
    Column("officer_title", String),
    Column("footnotes",JSON)
)



derivative = Table(
    "derivative",
    metadata_obj,
    Column("accession_number", String),
    Column("report_owner_cik", String),
    Column("issuer_cik", String),
    Column("is_non_derivative", Boolean),
    Column("holding", Boolean),
    Column("transaction_date", DATE),
    Column("idx", Integer),
    Column("conversion_or_exercise_price", DECIMAL),
    Column("conversion_or_exercise_price_footnote", String),
    Column("exercise_date", DATE),
    Column("exercise_footnote", String),
    Column("expiration_date", DATE),
    Column("expiration_date_footnote", String),
    Column("deemed_execution_date", DATE),
    Column("direct_or_indirect_ownership", String),
    Column("nature_of_ownership", String),
    Column("ownership_footnote", String),
    Column("shares_owned_following_transaction", DECIMAL),
    Column("shares_owned_following_transaction_footnote", String),
    Column("security_title", String),
    Column("transaction_acquired_disposed_code", String),
    Column("transaction_price_per_share", DECIMAL),
    Column("transaction_shares", DECIMAL),
    Column("equity_swap_involved", String),
    Column("transaction_foot_note", String),
    Column("transaction_code", String),
    Column("transaction_form_type", String),
    Column("underlying_security_shares", String),
    Column("underlying_security_title", String),
)

	
	
    