import '@/styles/globals.css';

import Head from 'next/head'

import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
// import Link from 'next/link';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Box from '@mui/material/Box';
// import {Search as SearchIcon} from '@mui/icons-material';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';


export default function App({ Component, pageProps }) {


  return <>
    <Head>
      <meta name="description" content="Your trusted source for comprehensive insider trading information and analysis." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />
    <Container maxWidth="lg" style={{ minHeight: `80vh` }} >
      <Component {...pageProps} />
    </Container>
  </>
}

const Header = () => {
  return <AppBar position="sticky" color="transparent" style={{
    backdropFilter: `blur(15px)`,
    background: `rgba(255 255 255 / 0.5)`
  }
  }
  >
    <Toolbar  >
      <Link href='/' sx={{ fontSize: `1.5rem`, flexGrow: 1 }} id="brand-title">
        InsiderTradeAlert
      </Link>
      <Search />
    </Toolbar>
  </AppBar>

}

const Search = () => {
  const [open, setOpen] = useState(false);
  const hits = [
    {
      "name": "Musk Elon",
      "url": "/reporter/musk-elon-0001494730"
    }, {
      "name": "Tesla, Inc.",
      "url": "/issuer/tesla-inc-0001318605"
    }
  ]

  return <>
    <Button variant="outlined" onClick={() => setOpen(true)}>
      <SearchIcon />
      <span style={{ marginLeft: `.5rem`, paddingRight: `2rem` }}>Search...</span>
    </Button>

    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        margin: `1rem`
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: `100%`,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <Input
          fullWidth
          className='Joy-focused Mui-focused'
          placeholder='Search...'
          size="lg"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'flex-start' },
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <List
            size="md"
            orientation="horizontal"
            wrap
            sx={{ flexGrow: 0, '--ListItem-radius': '8px', width: `100%` }}
          >
            <ListItem nested sx={{ width: { xs: '100%', width: `100%` } }}>
              <ListSubheader>Results</ListSubheader>
              <List>
                {
                  hits.map((x, i) => <ListItem key={i} >
                    <ListItemButton component="a" href={x.url} >
                      {x.name}
                    </ListItemButton>
                  </ListItem>
                  )
                }
              </List>
            </ListItem>
          </List>
        </Box>
      </Sheet>
    </Modal>
  </>




}

const SearchIcon = () => <svg height="1.2rem" className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-ft2su1" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
