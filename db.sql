
create table company
(
	cik integer primary key,
	name text,
	ticker text
)








create table submissions
(

)

CREATE INDEX submissions_cik ON submissions(cik);
CREATE INDEX submissions_ts ON submissions(ts);
CREATE INDEX submissions_accession_number ON submissions(accession_number);
CREATE INDEX submissions_owner_cik ON submissions(owner_cik);
CREATE INDEX submissions_issuer_cik ON submissions(issuer_cik);


CREATE INDEX derivative_accession_number ON derivative(accession_number);
CREATE INDEX derivative_report_owner_cik ON derivative(report_owner_cik);
CREATE INDEX derivative_issuer_cik ON derivative(issuer_cik);
 
-- CREATE INDEX submissions_report_owner_name ON submissions(report_owner_name);
-- CREATE INDEX submissions_issuer_name ON submissions(issuer_name);



create table derivative(
	accession_number text references submissions(accession_number),
	report_owner_cik text, 
	issuer_cik text,

	is_non_derivative bool,
	holding bool,
	transaction_date date,
	idx int,
	
	
	conversion_or_exercise_price decimal,
	conversion_or_exercise_price_footnote text,
	exercise_date date,
	exercise_footnote text,
	expiration_date date,
	expiration_date_footnote text,
	
	deemed_execution_date date,
	
	
	direct_or_indirect_ownership text,
	nature_of_ownership text,
	ownership_footnote text,
	
	shares_owned_following_transaction decimal,
	shares_owned_following_transaction_footnote text,
	
	security_title text,
	
	transaction_acquired_disposed_code text,
	transaction_price_per_share decimal,
	transaction_shares decimal,
	
	equity_swap_involved text,
	transaction_foot_note text,
	transaction_code text,
	transaction_form_type text,
	underlying_security_shares text,
	underlying_security_title text,
	unique(accession_number, is_non_derivative, holding, idx)
)



