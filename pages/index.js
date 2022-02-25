import Head from 'next/head'
import Image from 'next/image'
import Layout from './components/layout'
import Header from './components/header'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.scss'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home({}) {
  return <div className={styles.container}></div>
}

Home.getLayout = (page) => (
  <Layout>
    <Header className={styles.header}>yooo</Header>
    {page}
  </Layout>
)
