import Head from 'next/head'
import pool from '../db';
import Link from '@mui/joy/Link';
const slugify = require('../utils/functions');
import DetailedViewModal from "../components/modals"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let formatter = Intl.NumberFormat('en', { notation: 'compact' });



export default function Home({page_data}) {
  return (
    <>
      <Head>
        <title>Insider Trade Alert</title>
      </Head>
      <main>
        <br />
        <br />
        <br />
        <br />
        <h1>
          Recent Filings.</h1><br/>
          {page_data && <TableContainer component={Paper}> <Table size="small" style={{minWidTableCell: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: `center`}}>Filing Date</TableCell>
                            <TableCell style={{ textAlign: `center` }}>Issuer Name</TableCell>
                            <TableCell style={{ textAlign: `center` }}>Report Owner Name</TableCell>
                            <TableCell style={{ textAlign: `center` }}> Acquired</TableCell>
                            <TableCell style={{ textAlign: `center` }}> Disposed</TableCell>
                            <TableCell style={{ textAlign: `center`, whiteSpace:`nowrap` }}> Owned after Transaction</TableCell>
                            <TableCell style={{ textAlign: `center` }}>Detailed View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            page_data.map((x, i) => <TableRow key={i}>
                                <TableCell style={{ textAlign: `center`, whiteSpace:'nowrap',maxWidTableCell:'100%' }}>{x.filing_date}</TableCell>
                                <TableCell style={{ textAlign: `center`, whiteSpace:'nowrap',maxWidTableCell:'100%'  }}><Link href={`/issuer/${slugify(x.issuer_name)}-${x.issuer_cik}`}
                                > {x.issuer_name}</Link></TableCell>
                                <TableCell style={{ textAlign: `center`, whiteSpace:'nowrap',maxWidTableCell:'100%'  }}>{x.report_owner_name}</TableCell>
                                <TableCell style={{ textAlign: `center` }}>{formatter.format(x.securities_acquired)}</TableCell>
                                <TableCell style={{ textAlign: `center` }}>{formatter.format(x.securities_disposed)}</TableCell>
                                <TableCell style={{ textAlign: `center` }}>{formatter.format(x.shares_owned_following_transaction)}</TableCell>
                                <TableCell style={{ textAlign: `center` }}>
                                     <DetailedViewModal accession_number={x.accession_number} filing_url={x.url}/>
                                </TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                </Table></TableContainer>
                }
      </main>
    </>
  )
}



export async function getStaticProps() {
    var index_query = await pool.query(
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
          shares_owned_following_transaction, to_char(ts,'yyyy-mm-dd')ts
          from submissions s
          left join (select accession_number, 
          sum(case when transaction_acquired_disposed_code='A' then transaction_shares else 0 end)securities_acquired,
          sum(case when transaction_acquired_disposed_code='D' then transaction_shares else 0 end)securities_disposed,
          sum(case when idx=0 then shares_owned_following_transaction else 0 end)shares_owned_following_transaction
          from derivative 
          where accession_number in (select accession_number from recent_filings)
            and is_non_derivative 
          group by 1 )d on s.accession_number=d.accession_number
          where s.accession_number in (select accession_number from recent_filings)
          order by ts desc
          ;
;` );
    return {
        props: {
            page_data: index_query.rows,
            revalidate: 4320
        },
    };

}

