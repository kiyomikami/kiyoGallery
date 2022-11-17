/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/pages/rule.module.scss'
import Header from './components/Header'
import Fullscreen from './components/Fullscreen'
import { faXmark, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Rule() {
  const [files, setFiles] = useState([])
  const [filesLength, setFilesLength] = useState(0)
  const [selected, setSelected] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const [query, setQuery] = useState('')
  const [pageId, setPageId] = useState(0)
  const [queryError, setQueryError] = useState(false)
  const [predictions, setPredictions] = useState([])
  const [tags, setTags] = useState([])
  const [hidePredicts, setHidePredicts] = useState(true)
  const [orTags, setOrTags] = useState([])
  const [orFlag, setOrFlag] = useState(false)

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
        if (err) console.log(err)
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

  function queryGenerator() {
    // score:>=10 ( pokomon ~ ben_10 )

    const queryString = `sort:score:desc ${tags
      .map((t) => `${t.exclude ? '-' : ''}${t.value}`)
      .join('+')}`
    console.log(queryString)
    return queryString
  }

  function addTag(tag) {
    setTags([...tags, tag])
    setTimeout(() => {
      setQuery('')
    })
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

  const fsPrev = () =>
    setSelected(selected - 1 < 0 ? filesLength - 1 : selected - 1)
  const fsNext = () =>
    setSelected(selected + 1 >= filesLength ? 0 : selected + 1)
  const fsClose = () => setFullScreen(false)

  const hidePredictions = () => setHidePredicts(true)
  const showPredictions = () => setHidePredicts(false)

  const keyDownFunction = (e) => {
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

  const or = () => {
    let val = ''
    for (let i = 0; i < orTags.length; i++) {
      const t = orTags[i]
      if (i === 0) val += '('
      // ( thighhighs ~ pantyhose+%29+zelda_%28breath_of_the_wild%29+
      val += `${i !== 0 ? ' ~' : ''} +${t.label.split('(')[0]}`
      if (i === orTags.length - 1) val += ')'
    }
    return {
      label: val,
      value: val,
      or: true,
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kiyo Galery - Rule34</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header className={styles.header}>
        <ul className={styles.tags}>
          {tags.map((tag, i) => (
            <li key={i} className={tag?.exclude ? styles.exclude : ''}>
              <i className={styles.remove} onClick={() => removeTag(tag.value)}>
                x
              </i>
              <i
                className={styles.exclude}
                onClick={() => excludeTag(tag.value, !tag.exclude)}
              >
                {tag?.exclude ? '+' : '-'}
              </i>
              {tag?.value}
            </li>
          ))}
        </ul>
        <FontAwesomeIcon icon={faXmark} onClick={clearTags} />
        <FontAwesomeIcon
          icon={faPause}
          style={{ color: orFlag ? '#f00' : '#fff' }}
          onClick={() => {
            if (orFlag) {
              setOrFlag(false)
              if (orTags.length > 0) addTag(or())
              setOrTags([])
            } else {
              setOrFlag(true)
            }
          }}
        />
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
          <div
            className={[
              styles.prediction,
              hidePredicts ? styles.hide : '',
            ].join(' ')}
          >
            {predictions.map((prediction, i) => (
              <div
                key={i}
                className={styles.predictionItem}
                onClick={() => {
                  orFlag ? orTags.push(prediction) : addTag(prediction)
                }}
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
        <button className={styles.searchbtn} onClick={() => getData()}>
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
                alt={JSON.stringify(item.tags)}
              />
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {fullScreen ? (
        <Fullscreen
          src={files[selected].file_url || files[0].sample_url}
          prev={fsPrev}
          next={fsNext}
          close={fsClose}
        />
      ) : null}
    </div>
  )
}
