
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
	accession_number text,
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
	unique(cik, accession_number)
)

CREATE INDEX submissions_cik ON submissions(cik);
CREATE INDEX submissions_ts ON submissions(ts);


