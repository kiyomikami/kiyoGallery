import Head from 'next/head'
import Image from 'next/image'
import Layout from './components/layout'
import Header from './components/header'
import Fullscreen from './components/fullscreen'
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

export default function Rule({}) {
  const [files, setFiles] = useState([])
  const [filesLength, setFilesLength] = useState(0)
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('clothed_female++long_hair+clothed+pantyhose+')
  const [fullScreen, setFullScreen] = useState(false)
  const [pageId, setPageId] = useState(0)
  const [queryError, setQueryError] = useState(false)
  const [predictions, setPredictions] = useState([])
  const [tags, setTags] = useState([])
  const [hidePredicts, setHidePredicts] = useState(true)

  async function getData() {
    fetch(
      `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${queryGenerator()}&pid=${pageId}`
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

  async function predict(query) {
    fetch(`/api/predict?query=${query}`)
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setPredictions([...res])
      })
      .catch((err) => {
        setPredictions([])
        console.log(err)
      })
  }

  function hidePredictions() {
    setHidePredicts(true)
  }
  function showPredictions() {
    setHidePredicts(false)
  }

  function queryGenerator() {
    // score:>=10 ( pokomon ~ ben_10 )

    const queryString = `sort:score:desc ${tags
      .map((t) => `${t.exclude ? '-' : ''}${t.value}`)
      .join('+')}`
    console.log(queryString)
    return queryString
  }

  do /* tags functions */ {
    function addTag(tag) {
      setTags([...tags, tag])
    }
    function clearTags() {
      setTags([])
    }
    function removeTag(tagValue) {
      setTags(tags.filter((t) => t.value !== tagValue))
    }
    function excludeTag(tagValue, exclude) {
      setTags(
        tags.map((t) => {
          if (t.value === tagValue) {
            t.exclude = exclude
            return t
          } else return t
        })
      )
    }
  } while (false)

  do /* fullscreen functions */ {
    function fsPrev() {
      if (selected - 1 < 0) setSelected(filesLength - 1)
      else setSelected(selected - 1)
    }
    function fsNext() {
      if (selected + 1 >= filesLength) setSelected(0)
      else setSelected(selected + 1)
    }
    function fsClose() {
      setFullScreen(false)
    }
  } while (false)

  function keyDownFunction(e) {
    switch (e.key) {
      case 'Escape':
        if (fullScreen) {
          setFullScreen(false)
        }
        break
      case 'ArrowLeft':
      case 'q':
        if (fullScreen) fsPrev()
        break
      case 'ArrowRight':
      case 'd':
        if (fullScreen) fsNext()
        break
      case 'Enter':
        if (!fullScreen) getData()
        break
      case 'AltGraph':
        // panic button
        break

      default:
        //console.log(e.key)
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownFunction)
    return () => document.removeEventListener('keydown', keyDownFunction)
  }, [keyDownFunction])

  return (
    <div className={styles.container}>
      <Header className={styles.header}>
        {
          <ul className={styles.tags}>
            {tags.map((tag, i) => (
              <li key={i} className={tag.exclude ? styles.exclude : ''}>
                <i className={styles.remove} onClick={() => removeTag(tag.value)}>
                  x
                </i>
                <i
                  className={styles.exclude}
                  onClick={() => excludeTag(tag.value, !tag.exclude)}
                >
                  {tag.exclude ? '+' : '-'}
                </i>
                {tag.value}
              </li>
            ))}
          </ul>
        }
        <div className={styles.search}>
          {queryError ? <div className={styles.qError}></div> : null}
          <input
            type="text"
            placeholder="Query"
            onChange={(e) => {
              setQuery(e.target.value)
              predict(e.target.value)
            }}
            onBlur={hidePredictions}
            onFocus={showPredictions}
            value={query}
          />
          <div className={[styles.prediction, hidePredicts ? styles.hide : ''].join(' ')}>
            {predictions.map((prediction, i) => (
              <div
                key={i}
                className={styles.predictionItem}
                onClick={() => addTag(prediction)}
              >
                {prediction.label}
              </div>
            ))}
          </div>
        </div>
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
        <button className={styles.searchbtn} onClick={(e) => getData()}>
          Search
        </button>
      </Header>
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
        <Fullscreen
          src={files[selected].sample_url || files[0].sample_url}
          prev={fsPrev}
          next={fsNext}
          close={fsClose}
        />
      ) : null}
    </div>
  )
}

Rule.getLayout = (page) => <Layout>{page}</Layout>
