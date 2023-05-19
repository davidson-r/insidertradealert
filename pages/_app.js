import '@/styles/globals.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function App({ Component, pageProps }) {


  return <>
    <AppBar position="static" >
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography
          variant="h6" component="div" sx={{ flexGrow: 1 }}
        >
          InsiderTradeAlert
        </Typography>
      </Toolbar>
    </AppBar>
    <Container maxWidth="lg" >
      <Component {...pageProps} />
    </Container>

  </>
  {/* <Component {...pageProps} /> */ }
  // </ThemeProvider>

  // <>
  //   <Navbar expand="lg" sticky="top"  bg="light" variant="light">
  //     <Container>

  //       <Navbar.Brand href="/">InsiderTradeAlert</Navbar.Brand>
  //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //       <Navbar.Collapse id="basic-navbar-nav">
  //         <Nav >
  //           <Nav.Link href="#reporter">Reporter</Nav.Link>
  //           <Nav.Link href="#issuer">Issuer</Nav.Link>
  //         </Nav>
  //       </Navbar.Collapse>

  //     </Container>
  //   </Navbar><Container><Component {...pageProps} /></Container>
  // </>
}

// const theme = createTheme({
//   typography: {
//     fontFamily: [
//       '-apple-system',
//       'BlinkMacSystemFont',
//       '"Segoe UI"',
//       'Roboto',
//       '"Helvetica Neue"',
//       'Arial',
//       'sans-serif',
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(','),
//   },
// });
