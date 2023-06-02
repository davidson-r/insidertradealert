import React from 'react';
import pool from '../../db';
const slugify = require('../../utils/functions');
import Table from '@mui/joy/Table';
import Link from '@mui/joy/Link';
import DetailedViewModal from "../../components/modals"
import Head from 'next/head'

import Loader from "../../components/Loader"

let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const ReportOwner = ({ submissions }) => {

    return !submissions ? <Loader/> :
        submissions.length === 0 ? <div>Not Found.</div> : (<div><br /><br />
            <h1>{submissions.length > 0 && submissions[0].issuer_name}</h1>
            <Head>
                <title>{submissions[0].issuer_name} | Insider Trade Alert</title>
            </Head>
            <br />
            {submissions && <Table style={{ maxWidth: 800 }} >
                <thead>
                    <tr>
                        <th style={{ textAlign: `center`, width: `150px` }}></th>
                        <th style={{ textAlign: `center`, width: `150px` }}>Title</th>
                        <th style={{ textAlign: `center`, width: `98px` }}>Filing Date</th>
                        {/* <th style={{ textAlign: `center` }}>Issuer Name</th> */}
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
                            <td style={{ textAlign: `center` }}>
                                <Link href={`/reporter/${slugify(x.report_owner_name)}-${x.report_owner_cik}`}
                                > {x.report_owner_name}</Link></td>
                            <td style={{ textAlign: `center` }}>{x.officer_title}</td>
                            <td style={{ textAlign: `center` }}>{x.filing_date}</td>
                            {/* <td style={{ textAlign: `center` }}><Link href={`/issuer/${x.issuer_cik}-${slugify(x.issuer_name)}`}
                                > {x.issuer_name}</Link></td> */}
                            <td style={{ textAlign: `center` }}>{formatter.format(x.securities_acquired)}</td>
                            <td style={{ textAlign: `center` }}>{formatter.format(x.securities_disposed)}</td>
                            <td style={{ textAlign: `center` }}>{formatter.format(x.shares_owned_following_transaction)}</td>
                            <td style={{ textAlign: `center` }}>
                                <DetailedViewModal accession_number={x.accession_number} filing_url={x.url} />
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
    const cik = params.cik && params.cik.split('-').pop()

    var submissions = await pool.query(
        `select distinct cik,
        s.accession_number,
        report_owner_cik,issuer_cik,report_owner_name,issuer_name,
        to_char(filing_date,'yyyy-mm-dd')filing_date,
        report_owner_state,
        report_owner_street1,
        report_owner_street2,
        report_owner_zip,
        officer_title,
        url,
		securities_acquired,
		securities_disposed,
		shares_owned_following_transaction
        from submissions s
		left join (select accession_number, 
				sum(case when transaction_acquired_disposed_code='A' then transaction_shares else 0 end)securities_acquired,
				sum(case when transaction_acquired_disposed_code='D' then transaction_shares else 0 end)securities_disposed,
				sum(case when idx=0 then shares_owned_following_transaction else 0 end)shares_owned_following_transaction
			from derivative 
			where is_non_derivative and issuer_cik=$1
			group by 1 )d on s.accession_number=d.accession_number
		where issuer_cik=$1 order by filing_date desc
;`, [cik]
    );
    return {
        props: {
            submissions: submissions.rows,
            // securities,
            revalidate: false,
        },
    };

}

export async function getStaticPaths() {
    var result = await pool.query(`
    --select distinct on(cik)* from (
        --select distinct report_owner_cik cik, report_owner_name entity_name,'reporter' entity_type
          --  from submissions where report_owner_name is not null
        --)t union 
        
        select distinct on(cik)* from (
            select distinct issuer_cik cik, issuer_name entity_name,'issuer'entity_type
            from submissions where issuer_name is not null
        )t
        order by 1,2 limit 1000`)
    
    const paths = result.rows.map((x) => ({
        params: { cik: `${slugify(x.entity_name)}-${x.cik}` },
    }));

    return {
        paths,
        fallback: true,
    };
}


