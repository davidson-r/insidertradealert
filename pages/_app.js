import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


export default function App({ Component, pageProps }) {
  return <>
    <Navbar expand="lg" sticky="top"  bg="light" variant="light">
      <Container>

        <Navbar.Brand href="/">InsiderTradeAlert</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav >
            <Nav.Link href="#reporter">Reporter</Nav.Link>
            <Nav.Link href="#issuer">Issuer</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar><Container><Component {...pageProps} /></Container>
  </>
}
