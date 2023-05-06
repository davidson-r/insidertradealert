
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
	owner_cik text,
	owner_name text,
	owner_city text,
	owner_state text,
	owner_street1 text,
	owner_street2 text,
	owner_zip text
)

CREATE INDEX submissions_cik ON submissions(cik);
CREATE INDEX submissions_ts ON submissions(ts);
CREATE INDEX submissions_accession_number ON submissions(accession_number);
CREATE INDEX submissions_owner_cik ON submissions(owner_cik);


