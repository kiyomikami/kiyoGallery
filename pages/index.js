import Head from 'next/head'
import styles from '../styles/pages/Index.module.scss'
import Header from './_components/Header'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kiyo Galery - Home</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}></main>
    </div>
  )
}
