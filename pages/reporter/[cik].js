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



let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const ReportOwner = ({ submissions }) => {

    return submissions && (
        <div><br /><br />
            <h1>{submissions.length>0 && submissions[0].report_owner_name}</h1>
            <br /><div style={{ width: `50rem` }}>
                {submissions && <Table >
                    <thead>
                        <tr>
                            <th style={{ textAlign: `center` }}>Filing Date</th>
                            <th style={{ textAlign: `center` }}>Issuer Name</th>
                            <th style={{ textAlign: `center` }}> Acquired</th>
                            <th style={{ textAlign: `center` }}> Disposed</th>
                            <th style={{ textAlign: `center`, whiteSpace:`initial` }}> Owned after Transaction</th>
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
                                <td style={{ textAlign: `center` }}> <DetailedViewModal accession_number={x.accession_number} filing_url={x.url}/>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </Table>

                }</div>
        </div>
    );
};

export default ReportOwner;



const DetailedViewModal = ({accession_number, filing_url }) => {
    const [open, setOpen] = React.useState(false);
    const { status, data } = useFetch(`/api/securities/${accession_number}`, open)

    return <React.Fragment>
        <Button variant="outlined" color="neutral" size='sm' onClick={() => setOpen(true)}>
             View
        </Button>
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={() => setOpen(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            width='1000px'
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 1000,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    maxHeight:`75vh`,
                    overflowY:`auto`
                }}
            >
                <ModalClose
                    variant="outlined"
                    sx={{
                        top: 'calc(-1/4 * var(--IconButton-size))',
                        right: 'calc(-1/4 * var(--IconButton-size))',
                        boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                        borderRadius: '50%',
                        bgcolor: 'background.body',
                    }}
                />
                <div style={{display:`flex`, alignItems:`center`}}><Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                >
                    Detailed View 
                </Typography><a href={filing_url} target='_blank' style={{paddingInline:`1rem`}}>Filing</a></div>
                
                <Typography id="modal-desc" textColor="text.tertiary">

                {data && <NonDerivative securities={data} />}
                {data &&
                    <Derivative securities={data} />
                }

                </Typography>
            </Sheet>
        </Modal>
    </React.Fragment>
}


const Derivative = ({ securities }) => {
    var derivative = securities && securities.filter(x => !x.is_non_derivative)
    if (derivative.length === 0) {
        return
    }
    return (
        <><i>Derivative Securities Acquired, Disposed of, or Beneficially Owned
            (e.g., puts, calls, warrants, options, convertible securities)</i>
            <Table size="sm" style={{width:`100%`}}>
                <thead>
                    <tr>
                        {/* <th>Holding</th>
                    <th>idx</th> */}
                        <th style={{width:`150px`}}>Title</th>
                        <th> Date</th>
                        <th> Code</th>
                        <th>Transaction</th>
                        <th> Price</th>
                        <th> Amount</th>
                        <th style={{whiteSpace:`initial`}}> Owned after Transaction</th>
                        <th>Ownership</th>
                        <th style={{whiteSpace:`initial`}}>Ownership Nature</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        derivative.map((x, i) => <tr key={i}>
                            {/* <td>{x.holding}</td>
                        <td>{x.idx}</td> */}
                            <td>{x.security_title}</td>
                            <td>{x.transaction_date}</td>
                            <td>{x.transaction_code}</td>
                            <td>{x.transaction_acquired_disposed_code}</td>
                            <td>{x.transaction_price_per_share}</td>
                            <td>{x.transaction_shares}</td>
                            <td>{x.shares_owned_following_transaction}</td>
                            <td>{x.direct_or_indirect_ownership}</td>
                            <td>{x.nature_of_ownership}</td>
                        </tr>)
                    }
                </tbody></Table><br />
        </>
    )
}


const NonDerivative = ({ securities }) => {
    var nonderivative = securities && securities.filter(x => x.is_non_derivative)

    if (nonderivative.length === 0) {
        return
    }
    return (
        <><i>Non-Derivative Securities Acquired, Disposed of, or Beneficially Owned</i><Table size="sm">
            <thead>
                <tr>
                    {/* <th>Holding</th>
                    <th>idx</th> */}
                    <th style={{width:`150px`}}>Title</th>
                    <th> Date</th>
                    <th> Code</th>
                    <th>Transaction</th>
                    <th> Price</th>
                    <th> Amount</th>
                    <th style={{whiteSpace:`initial`}}> Owned after Transaction</th>
                    <th>Ownership</th>
                    <th style={{whiteSpace:`initial`}}>Ownership Nature</th>
                </tr>
            </thead>
            <tbody>
                {
                    nonderivative.map((x, i) => <tr key={i}>
                        {/* <td>{String(x.holding)}</td>
                        <td>{x.idx}</td> */}
                        <td>{x.security_title}</td>
                        <td>{x.transaction_date}</td>
                        <td>{x.transaction_code}</td>
                        <td>{x.transaction_acquired_disposed_code}</td>
                        <td>{x.transaction_price_per_share}</td>
                        <td>{formatter.format(x.transaction_shares)}</td>
                        <td>{formatter.format(x.shares_owned_following_transaction)}</td>
                        <td>{x.direct_or_indirect_ownership}</td>
                        <td>{x.nature_of_ownership}</td>
                    </tr>)
                }
            </tbody></Table><br /><br /></>
    )
}


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
		shares_owned_following_transaction
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
            notFound:true
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



const cache = {};
const useFetch = (url, open) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!url) return;
        if (!open)return;

        const fetchData = async () => {
            setStatus('fetching');
            if (cache[url]) {
                const data = cache[url];
                setData(data);
                setStatus('fetched');
            } else {
                const response = await fetch(url);
                const data = await response.json();
                cache[url] = data; // set response in cache;
                setData(data);
                setStatus('fetched');
            }
        };

        fetchData();
    }, [url, open]);

    return { status, data };
};
