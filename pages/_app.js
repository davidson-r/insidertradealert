import '@/styles/globals.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
// import Link from 'next/link';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';


export default function App({ Component, pageProps }) {


  return <>
    <Header />
    <Container maxWidth="lg" style={{ minHeight: `80vh` }} >
      <Component {...pageProps} />
    </Container>
  </>
}



const Header = () => {
  return <AppBar position="static"  >
    <Toolbar>
      <Link href='/' sx={{ color: `white`, fontSize: `1.5rem` }}>

        InsiderTradeAlert</Link>
    </Toolbar>
  </AppBar>

}