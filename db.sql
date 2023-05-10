
create table company
(
	cik integer primary key,
	name text,
	ticker text
)








create table submissions
(
	cik text not null,
	ts timestamp,
	accession_number text unique,
	act text,
	file_number text,
	filing_date date,
	film_number text,
	form text,
	is_in_line_xbrl int,
	is_xbrl int,
	items text,
	primary_doc_description text,
	primary_document text,
	report_date text,
	size int,
	url text,
	report_owner_cik text,
	report_owner_name text,
	report_owner_city text,
	report_owner_state text,
	report_owner_street1 text,
	report_owner_street2 text,
	report_owner_zip text,
	report_owner_is_director bool,
	report_owner_is_officer bool,
	report_owner_other bool,
	report_owner_is_ten_percent_owner bool,
	issuer_cik text,
	issuer_name text,
	issuer_trading_symbol text,
	officer_title text
)

CREATE INDEX submissions_cik ON submissions(cik);
CREATE INDEX submissions_ts ON submissions(ts);
CREATE INDEX submissions_accession_number ON submissions(accession_number);
CREATE INDEX submissions_owner_cik ON submissions(owner_cik);




create table derivative(
	accession_number text references submissions(accession_number),
	report_owner_cik text,
	report_owner_name text,
	report_owner_director bool,
	report_owner_officer bool,
	report_owner_other bool,
	report_owner_is_ten_percent_owner bool,
	report_owner_title text,
	issuer_cik text,
	issuer_name text,
	issuer_trading_symbol text,
	
	holding bool,
	transaction_date date,
	idx int,
	
	is_non_derivative bool,
	conversion_or_exercise_price decimal,
	exercise_date text,
	exercise_footnote text,
	expiration_date date,
	expiration_date_footnote date,
	
	
	direct_or_indirect_ownership text,
	nature_or_ownership text,
	ownership_footnote text,
	
	shares_owned_following_transaction int,
	
	security_title text,
	
	transaction_acquired_disposed_code text,
	transaction_price_per_share decimal,
	transaction_shares int,
	
	equity_swap_involved text,
	transaction_foot_note text,
	transaction_code text,
	transaction_form_type text
)