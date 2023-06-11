import React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
            <TableContainer component={Paper}> <Table size="small" >
                <TableHead>
                    <TableRow>
                        {/* <th>Holding</th>
                    <th>idx</th> */}
                        <TableCell style={{width:`150px`}}>Title</TableCell>
                        <TableCell> Date</TableCell>
                        <TableCell> Code</TableCell>
                        <TableCell>Transaction</TableCell>
                        <TableCell> Price</TableCell>
                        <TableCell> Amount</TableCell>
                        <TableCell style={{whiteSpace:`initial`}}> Owned after Transaction</TableCell>
                        <TableCell>Ownership</TableCell>
                        <TableCell style={{whiteSpace:`initial`}}>Ownership Nature</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        derivative.map((x, i) => <TableRow key={i}>
                            {/* <td>{x.holding}</td>
                        <td>{x.idx}</td> */}
                            <TableCell>{x.security_title}</TableCell>
                            <TableCell>{x.transaction_date}</TableCell>
                            <TableCell>{x.transaction_code}</TableCell>
                            <TableCell>{x.transaction_acquired_disposed_code}</TableCell>
                            <TableCell>{x.transaction_price_per_share}</TableCell>
                            <TableCell>{x.transaction_shares}</TableCell>
                            <TableCell>{x.shares_owned_following_transaction}</TableCell>
                            <TableCell>{x.direct_or_indirect_ownership}</TableCell>
                            <TableCell>{x.nature_of_ownership}</TableCell>
                        </TableRow>)
                    }
                </TableBody></Table></TableContainer><br />
        </>
    )
}


const NonDerivative = ({ securities }) => {
    var nonderivative = securities && securities.filter(x => x.is_non_derivative)

    if (nonderivative.length === 0) {
        return
    }
    return (
        <><i>Non-Derivative Securities Acquired, Disposed of, or Beneficially Owned</i>
        <TableContainer component={Paper}> <Table size="small" >
            <TableHead>
                <TableRow>
                    {/* <th>Holding</th>
                    <th>idx</th> */}
                    <TableCell style={{width:`150px`}}>Title</TableCell>
                    <TableCell> Date</TableCell>
                    <TableCell> Code</TableCell>
                    <TableCell>Transaction</TableCell>
                    <TableCell> Price</TableCell>
                    <TableCell> Amount</TableCell>
                    <TableCell style={{whiteSpace:`initial`}}> Owned after Transaction</TableCell>
                    <TableCell>Ownership</TableCell>
                    <TableCell style={{whiteSpace:`initial`}}>Ownership Nature</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    nonderivative.map((x, i) => <TableRow key={i}>
                        {/* <td>{String(x.holding)}</td>
                        <td>{x.idx}</td> */}
                        <TableCell>{x.security_title}</TableCell>
                        <TableCell>{x.transaction_date}</TableCell>
                        <TableCell>{x.transaction_code}</TableCell>
                        <TableCell>{x.transaction_acquired_disposed_code}</TableCell>
                        <TableCell>{x.transaction_price_per_share}</TableCell>
                        <TableCell>{formatter.format(x.transaction_shares)}</TableCell>
                        <TableCell>{formatter.format(x.shares_owned_following_transaction)}</TableCell>
                        <TableCell>{x.direct_or_indirect_ownership}</TableCell>
                        <TableCell>{x.nature_of_ownership}</TableCell>
                    </TableRow>)
                }
            </TableBody></Table>
            </TableContainer>
            <br /><br /></>
    )
}
