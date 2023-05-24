import React, { useState, useEffect } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';


import useFetch from "../components/fetch"

let formatter = Intl.NumberFormat('en', { notation: 'compact' });

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

export default DetailedViewModal

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
