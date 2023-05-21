import { Html, Head, Main, NextScript } from 'next/document'
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
// import theme from '../components/theme'


export default function Document() {

  return (
    <Html lang="en">
      <Head />
      {/* <ThemeProvider theme={theme}> */}
      <body>
        <Main  />
        <Footer />
        <NextScript />
      </body>
      {/* </ThemeProvider>, */}

    </Html>
  )
}


const Footer = () => {

  return <Sheet
    variant="solid"
    color='neutral'
    invertedColors
    sx={{
      flexGrow: 1,
      p: 2,
      marginTop:`2rem`,
      // background:`#eee`,
      borderRadius: { xs: 0, sm: 'xs' },
    }}
  >
    <Divider sx={{ my: 2 }} />
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
        size="sm"
        orientation="horizontal"
        wrap
        sx={{ flexGrow: 0, '--ListItem-radius': '8px' }}
      >
        <ListItem nested sx={{ width: { xs: '50%', md: 300 } }}>
          <ListSubheader>Sitemap</ListSubheader>
          <List>
            <ListItem>
              <ListItemButton component="a" href='/about-us'>
                About Us
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href='/insider-trading-basics'>
                Insider Trading Basics
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href='/insider-trading-laws-and-regulations'>
                Insider Trading Laws and Regulations
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href='/insider-trading-resources'>
                Insider Trading Resources
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href='/insider-trading-strategies'>
                Insider Trading Strategies
              </ListItemButton>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Box>
    <Divider sx={{ my: 2 }} />
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography
        level="body2"
        startDecorator={<Typography textColor="text.tertiary">by</Typography>}
      >
        InsiderTradeAlert.com
      </Typography>

      <Typography level="body3" sx={{ ml: 'auto' }}>
        Copyright 2023
      </Typography>
    </Box>
  </Sheet>
}