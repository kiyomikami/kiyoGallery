import Head from 'next/head'
import Image from 'next/image'
import Layout from './components/layout'
import Header from './components/header'
import { useEffect, useState } from 'react'
import styles from '../styles/Rule.module.scss'
import {
  faXmark,
  faAngleLeft,
  faAngleRight,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
 * TODO:
 * - local storage store fav list
 * - add fav page
 * - add tags //  https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index
 */

function LocalHeader() {}

export default function Home({}) {
  const [files, setFiles] = useState([])
  const [filesLength, setFilesLength] = useState(100)
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('clothed_female++long_hair+clothed+pantyhose+')
  const [fullScreen, setFullScreen] = useState(false)
  const [fsZoom, setFsZoom] = useState(1)
  const [pageId, setPageId] = useState(0)
  const [queryError, setQueryError] = useState(false)

  const getData = async (event) => {
    fetch(
      `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${query}&pid=${pageId}`
    )
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res) {
          setFiles([...res])
          setFilesLength([...res].length)
          setSelected(0)
          setFullScreen(false)
          setQueryError(false)
        }
      })
      .catch((err) => {
        // console.log(err)
        setQueryError(true)
      })
  }

  function fsPrev() {
    console.log('prev', selected, selected - 1, filesLength)
    if (selected - 1 < 0) {
      setSelected(filesLength - 1)
      console.log('max')
    } else {
      setSelected(selected - 1)
    }
    setFsZoom(1)
  }
  async function fsNext() {
    console.log('next', selected, selected + 1, filesLength)
    if (selected + 1 >= filesLength) {
      setSelected(0)
      console.log('max')
    } else {
      setSelected(selected + 1)
    }
    setFsZoom(1)
  }

  const keyDownFunction = (e) => {
    switch (e.key) {
      case 'Escape':
        setFullScreen(false)
        setFsZoom(1)
        break
      case 'ArrowLeft':
      case 'q':
        fsPrev()
        break
      case 'ArrowRight':
      case 'd':
        fsNext()
        break
      case 'Enter':
        getData()
        break
      case 'AltGraph':
        // panic button
        break

      default:
        console.log(e.key)
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownFunction)
    return () => document.removeEventListener('keydown', keyDownFunction)
  }, [keyDownFunction])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {queryError ? <div className={styles.qError}></div> : null}
        <input
          type="text"
          placeholder="Query"
          onChange={(e) => {
            setQuery(e.target.value)
          }}
          value={query}
        />
        <button
          className={styles.minus}
          onClick={() => setPageId(pageId === 0 ? 0 : pageId - 1)}
        >
          -
        </button>
        <p className={styles.page}>{pageId}</p>
        <button className={styles.plus} onClick={() => setPageId(pageId + 1)}>
          +
        </button>
        <button className={styles.searchbtn} onClick={getData}>
          Search
        </button>
      </div>
      <div className={styles.filesContainer}>
        {files ? (
          files.map((item, index) => (
            <div
              className={`${styles.image}`}
              key={index}
              onClick={() => {
                setFullScreen(true)
                setSelected(index)
              }}
            >
              <Image
                src={item.preview_url}
                objectFit={'cover'}
                width={'100px'}
                height={'100px'}
                quality={25}
              />
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {fullScreen ? (
        <div className={styles.fullscreen} onClick={(e) => e.preventDefault()}>
          <div
            className={styles.fullscreenImage}
            style={{ transform: `scale(${fsZoom})` }}
            onClick={(e) => {
              e.preventDefault()
              fsZoom === 1 ? setFsZoom(2) : setFsZoom(1)
            }}
          >
            <div className={styles.fsHeader}>{/**/}</div>
            <Image
              // loader={imageLoader}
              src={files[selected].sample_url || files[0].sample_url}
              layout="fill"
              objectFit="contain"
              priority={true}
            />
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.fullscreenClose}
            onClick={() => {
              setFsZoom(1)
              setFullScreen(false)
            }}
          />
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={styles.fullscreenNavPrev}
            onClick={() => fsPrev()}
          />
          <FontAwesomeIcon
            icon={faAngleRight}
            className={styles.fullscreenNavNext}
            onClick={() => fsNext()}
          />
        </div>
      ) : null}
    </div>
  )
}

// Home.getLayout = (page) => (
//   <Layout>
//     <Header>{LocalHeader}</Header>
//     {page}
//   </Layout>
// )
