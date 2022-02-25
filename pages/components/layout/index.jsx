import Head from 'next/head'
import styles from './layout.module.scss'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Next Playlist</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="*" />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.container}>{children}</div>
    </>
  )
}
