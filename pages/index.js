import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import pool from '../db';
import Table from '@mui/joy/Table';
import Link from '@mui/joy/Link';
const slugify = require('../utils/functions');
import DetailedViewModal from "../components/modals"
import useFetch from "../components/fetch"

let formatter = Intl.NumberFormat('en', { notation: 'compact' });



export default function Home({page_data}) {
  return (
    <>
      <Head>
        <title>Insider Trade Alert</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <br />
        <br />
        <br />
        <br />
        <h1>
          Recent Filings...</h1>
          {page_data && <Table style={{maxWidth:800}}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: `center`, width:`98px` }}>Filing Date</th>
                            <th style={{ textAlign: `center`, width:`120px` }}>Issuer Name</th>
                            <th style={{ textAlign: `center`, width:`120px` }}>Report Owner Name</th>
                            <th style={{ textAlign: `center` }}> Acquired</th>
                            <th style={{ textAlign: `center` }}> Disposed</th>
                            <th style={{ textAlign: `center`, whiteSpace:`initial` }}> Owned after Transaction</th>
                            <th style={{ textAlign: `center` }}>Detailed View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            page_data.map((x, i) => <tr key={i}>
                                <td style={{ textAlign: `center` }}>{x.filing_date}</td>
                                <td style={{ textAlign: `center` }}><Link href={`/issuer/${x.issuer_cik}-${slugify(x.issuer_name)}`}
                                > {x.issuer_name}</Link></td>
                                <td style={{ textAlign: `center` }}>{x.report_owner_name}</td>
                                <td style={{ textAlign: `center` }}>{formatter.format(x.securities_acquired)}</td>
                                <td style={{ textAlign: `center` }}>{formatter.format(x.securities_disposed)}</td>
                                <td style={{ textAlign: `center` }}>{formatter.format(x.shares_owned_following_transaction)}</td>
                                <td style={{ textAlign: `center` }}>
                                     <DetailedViewModal accession_number={x.accession_number} filing_url={x.url}/>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                }




      </main>
    </>
  )
}





export async function getStaticProps() {
    var index_query = await pool.query(
        `
          select distinct cik,
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
            revalidate: false,
            notFound:true
        },
    };

}

