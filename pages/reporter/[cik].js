import React, { useState, useEffect } from 'react';
import pool from '../../db';
const slugify = require('../../utils/functions');
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
// import Link from 'next/link';

import Link from '@mui/joy/Link';

import DetailedViewModal from "../../components/modals"


let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const ReportOwner = ({ submissions }) => {

    return submissions && (
        <div><br /><br />
            <h1>{submissions.length > 0 && submissions[0].report_owner_name}</h1>
            <i>{submissions.length > 0 && submissions[0].officer_title}
            </i><br />
            <h5><span style={{color:`#aaa`}}>{submissions.length > 0 && submissions[0].report_owner_city}</span>&emsp;
                <span style={{color:`#aaa`}}>{submissions.length > 0 && submissions[0].report_owner_state}</span>
            </h5>
            {submissions && <Table style={{ maxWidth: 800 }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: `center`, width: `98px` }}>Filing Date</th>
                        <th style={{ textAlign: `center`, width: `120px` }}>Issuer Name</th>
                        <th style={{ textAlign: `center` }}> Acquired</th>
                        <th style={{ textAlign: `center` }}> Disposed</th>
                        <th style={{ textAlign: `center`, whiteSpace: `initial` }}> Owned after Transaction</th>
                        <th style={{ textAlign: `center` }}>Detailed View</th>
                        {/* <th style={{ textAlign: `center` }}>Filing</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        submissions.map((x, i) => <tr key={i}>
                            <td style={{ textAlign: `center` }}>{x.filing_date}</td>
                            <td style={{ textAlign: `center` }}><Link href={`/issuer/${x.issuer_cik}-${slugify(x.issuer_name)}`}
                            > {x.issuer_name}</Link></td>
                            <td style={{ textAlign: `center` }}>{formatter.format(x.securities_acquired)}</td>
                            <td style={{ textAlign: `center` }}>{formatter.format(x.securities_disposed)}</td>
                            <td style={{ textAlign: `center` }}>{formatter.format(x.shares_owned_following_transaction)}</td>
                            <td style={{ textAlign: `center` }}> <DetailedViewModal accession_number={x.accession_number} filing_url={x.url} />
                            </td>
                        </tr>)
                    }
                </tbody>
            </Table>
            }
        </div>
    );
};

export default ReportOwner;



export async function getStaticProps(context) {
    const { params } = context;
    const cik = params.cik && params.cik.split('-')[0]

    var submissions = await pool.query(
        `select distinct cik,
        s.accession_number,
        report_owner_cik,issuer_cik,report_owner_name,issuer_name,
        to_char(filing_date,'yyyy-mm-dd')filing_date,
        report_owner_state,
        report_owner_street1,
        report_owner_street2,
        report_owner_zip,
        url,
		securities_acquired,
		securities_disposed,
		shares_owned_following_transaction,
        officer_title,
        report_owner_city,
        report_owner_state
        from submissions s
		left join (select accession_number, 
				sum(case when transaction_acquired_disposed_code='A' then transaction_shares else 0 end)securities_acquired,
				sum(case when transaction_acquired_disposed_code='D' then transaction_shares else 0 end)securities_disposed,
				sum(case when idx=0 then shares_owned_following_transaction else 0 end)shares_owned_following_transaction
			from derivative 
			where is_non_derivative and report_owner_cik=$1
			group by 1 )d on s.accession_number=d.accession_number
		where report_owner_cik=$1 order by filing_date desc
;`, [cik]
    );
    return {
        props: {
            submissions: submissions.rows,
            // securities,
            revalidate: false,
            notFound: true
        },
    };

}

export async function getStaticPaths() {

    const paths = [].map((x) => ({
        params: { cik: x },
    }));

    return {
        paths,
        fallback: true,
    };
}


