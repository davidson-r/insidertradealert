import React from 'react';
import pool from '../../db';
const slugify = require('../../utils/functions');
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Link from '@mui/joy/Link';
import Head from 'next/head'

import DetailedViewModal from "../../components/modals"
import Loader from "../../components/Loader"


let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const ReportOwner = ({ submissions }) => {

    return !submissions ? <Loader/> :
        submissions.length === 0 ? <div>Not Found.</div> : (
            <div><br /><br />
                <h1>{submissions.length > 0 && submissions[0].report_owner_name}</h1>
                <Head>
                    <title>{submissions[0].report_owner_name} | Insider Trade Alert</title>
                </Head>
                {submissions[0].officer_title && <i>{submissions.length > 0 && submissions[0].officer_title}<br /></i>}
                <h5>
                    {
                        submissions[0].report_owner_city &&
                        <span style={{ color: `#aaa` }}>{submissions[0].report_owner_city},&nbsp; </span>
                    }
                    <span style={{ color: `#aaa` }}>{submissions.length > 0 && submissions[0].report_owner_state}</span>
                </h5>
                {submissions &&  <TableContainer  component={Paper}> <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell >Filing Date</TableCell>
                            <TableCell >Issuer Name</TableCell>
                            <TableCell > Acquired</TableCell>
                            <TableCell > Disposed</TableCell>
                            <TableCell style={{ textAlign: `center`, whiteSpace: `initial` }}> Owned after Transaction</TableCell>
                            <TableCell >Detailed View</TableCell>
                            {/* <th >Filing</th> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            submissions.map((x, i) => <TableRow key={i}>
                                <TableCell >{x.filing_date}</TableCell>
                                <TableCell ><Link href={`/issuer/${slugify(x.issuer_name)}-${x.issuer_cik}`}
                                > {x.issuer_name}</Link></TableCell>
                                <TableCell >{formatter.format(x.securities_acquired)}</TableCell>
                                <TableCell >{formatter.format(x.securities_disposed)}</TableCell>
                                <TableCell >{formatter.format(x.shares_owned_following_transaction)}</TableCell>
                                <TableCell > <DetailedViewModal accession_number={x.accession_number} filing_url={x.url} />
                                </TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                </Table></TableContainer>
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
    // var result = await pool.query(`
    // select distinct on(cik)* from (
    //     select distinct report_owner_cik cik, report_owner_name entity_name,'reporter' entity_type
    //         from submissions where report_owner_name is not null
    //     )t 
    //     --union 
        
    //     --select distinct on(cik)* from (
    //     --    select distinct issuer_cik cik, issuer_name entity_name,'issuer'entity_type
    //     --    from submissions where issuer_name is not null
    //     --)t
    //     order by 1,2 limit 10`)
    
    const paths = [].map((x) => ({
        params: { cik: `${slugify(x.entity_name)}-${x.cik}` },
    }));

    return {
        paths,
        fallback: true,
    };
}


