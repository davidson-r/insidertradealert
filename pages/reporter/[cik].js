import React from 'react';
import pool from '../../db';
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';
const slugify = require('../../utils/functions');
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const ReportOwner = ({ submissions }) => {
    const [modalShow, setModalShow] = React.useState(false);


    const report_owner_name = submissions && submissions[0].report_owner_name
    return (
        <div><br /><br />
            <h1>{report_owner_name}</h1>
            <br /><div style={{width:`50rem`}}>
                {submissions && <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{ textAlign: `center`, width:`150px` }}>Filing Date</th>
                            <th style={{ textAlign: `center` }}>Issuer Name</th>
                            <th style={{ textAlign: `center` }}>Securities Acquired</th>
                            <th style={{ textAlign: `center` }}>Securities Disposed</th>
                            <th style={{ textAlign: `center` }}>Shares Owned Following Transaction</th>
                            <th style={{ textAlign: `center` }}>Detailed View</th>
                            <th style={{ textAlign: `center` }}>Filing</th>
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
                                <td><>
                                    <Button variant="primary" size='sm' onClick={() => setModalShow(true)} variant="outline-info">
                                         View
                                    </Button>

                                    <SecuritiesDetailedView
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                </></td>
                                <td style={{textAlign:`center`}}><a target="_blank" href={x.url}>View</a> </td>

                            </tr>)
                        }
                    </tbody>
                </Table>
                }</div>
        </div>
    );
};

export default ReportOwner;



const Derivative = ({ securities }) => {
    var derivative = securities && securities.filter(x => !x.is_non_derivative)
    if (derivative.length === 0) {
        return
    }
    return (
        <Table bordered hover>
            <thead>
                <tr>
                    {/* <th>Holding</th>
                    <th>idx</th> */}
                    <th>Transaction Date</th>
                    <th>Title</th>
                    <th>Transaction Code</th>
                    <th>Transaction</th>
                    <th>Transaction Price</th>
                    <th>Transaction Amount</th>
                    <th>Shares Owned Following Transaction</th>
                    <th>Ownership</th>
                    <th>Ownership Nature</th>
                </tr>
            </thead>
            <tbody>
                {
                    derivative.map((x, i) => <tr key={i}>
                        {/* <td>{x.holding}</td>
                        <td>{x.idx}</td> */}
                        <td>{x.transaction_date}</td>
                        <td>{x.security_title}</td>
                        <td>{x.transaction_code}</td>
                        <td>{x.transaction_acquired_disposed_code}</td>
                        <td>{x.transaction_price_per_share}</td>
                        <td>{x.transaction_shares}</td>
                        <td>{x.shares_owned_following_transaction}</td>
                        <td>{x.direct_or_indirect_ownership}</td>
                        <td>{x.nature_of_ownership}</td>
                    </tr>)
                }
            </tbody></Table>)
}


const NonDerivative = ({ securities }) => {
    var nonderivative = securities && securities.filter(x => x.is_non_derivative)

    if (nonderivative.length === 0) {
        return
    }
    return (
        <Table bordered hover size="sm">
            <thead>
                <tr>
                    {/* <th>Holding</th>
                    <th>idx</th> */}
                    <th>Transaction Date</th>
                    <th>Title</th>
                    <th>Transaction Code</th>
                    <th>Transaction</th>
                    <th>Transaction Price</th>
                    <th>Transaction Amount</th>
                    <th>Shares Owned Following Transaction</th>
                    <th>Ownership</th>
                    <th>Ownership Nature</th>
                </tr>
            </thead>
            <tbody>
                {
                    nonderivative.map((x, i) => <tr key={i}>
                        {/* <td>{String(x.holding)}</td>
                        <td>{x.idx}</td> */}
                        <td>{x.transaction_date}</td>
                        <td>{x.security_title}</td>
                        <td>{x.transaction_code}</td>
                        <td>{x.transaction_acquired_disposed_code}</td>
                        <td>{x.transaction_price_per_share}</td>
                        <td>{formatter.format(x.transaction_shares)}</td>
                        <td>{formatter.format(x.shares_owned_following_transaction)}</td>
                        <td>{x.direct_or_indirect_ownership}</td>
                        <td>{x.nature_of_ownership}</td>
                    </tr>)
                }
            </tbody></Table>)
}


function SecuritiesDetailedView(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
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

    // var securities = await pool.query(
    //     `SELECT 
    //     accession_number,
    //     is_non_derivative, 
    //     holding,
    //     to_char(transaction_date,'yyyy-mm-dd')transaction_date,
    //     idx,
    //     conversion_or_exercise_price,
    //     to_char(exercise_date,'yyyy-mm-dd')exercise_date,
    //     to_char(expiration_date,'yyyy-mm-dd')expiration_date,
    //     direct_or_indirect_ownership,
    //     nature_of_ownership,
    //     shares_owned_following_transaction,
    //     security_title,
    //     transaction_acquired_disposed_code,
    //     transaction_price_per_share,
    //     transaction_shares,
    //     transaction_code
    // FROM  derivative where report_owner_cik=$1
    // order by accession_number,is_non_derivative,holding,idx	`, [cik]
    // )

    submissions = submissions.rows
    // securities = securities.rows


    // for (let i = 0; i < submissions.length; i++) {
    //     submissions[i].securities = securities.filter(x => x.accession_number == submissions[i].accession_number)
    // }

    // console.log(submissions)
    return {
        props: {
            submissions,
            // securities,
            revalidate: false,
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