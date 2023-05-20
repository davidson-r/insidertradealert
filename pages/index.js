import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Insider Trade Alert</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
      Welcome to Insider Trade Alert!</h1>

      <p>

At InsiderTradeAlert.com, we strive to keep you informed about the latest insider trading activities in the financial market. Our website provides comprehensive and up-to-date information on Form 4 filings, ensuring you have access to crucial issuer and reporter details.
</p><p>
What is insider trading, you may ask? Insider trading refers to the buying or selling of securities by individuals with access to non-public information about the company. These individuals, known as insiders, can include company executives, directors, or major shareholders. By monitoring insider trading activities, investors can gain valuable insights into the market and potentially make more informed investment decisions.
</p><p>

On our home page, you will find a user-friendly interface that allows you to search and browse through the latest Form 4 filings. Our database is constantly updated, ensuring you have access to the most recent insider trading information. You can search for specific issuers or reporters, or explore the latest filings across different industries.
</p><p>

Each Form 4 filing displayed on our website provides detailed information about the transaction, including the date of the trade, the type of security involved, the transaction price, and the number of shares bought or sold. Additionally, we provide comprehensive profiles of issuers and reporters, giving you a deeper understanding of their roles within the company and their historical trading activities.
</p><p>

At Insider Trade Alert, we understand the importance of staying ahead of the curve when it comes to insider trading. Our platform not only serves as a valuable resource for investors and traders but also aims to promote transparency and integrity in the financial market.
</p><p>

Whether you are a seasoned investor or just starting to explore the world of insider trading, InsiderTradeAlert.com is your go-to destination for timely and reliable information. Join us today and gain an edge in your investment strategies with our insider trading insights.
</p><p>

Disclaimer: The information provided on InsiderTradeAlert.com is for informational purposes only and should not be considered financial advice. Always conduct thorough research and consult with a qualified financial advisor before making any investment decisions.

</p>




      </main>
    </>
  )
}
