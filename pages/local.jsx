/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from '../styles/pages/local.module.scss'
import Header from './_components/Header'
import Fullscreen from './_components/fullscreen'
import Folder from './_components/Folder'

const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'webp',
  'svg',
  'tiff',
  'JPG',
  'JPEG',
  'PNG',
  'GIF',
  'BMP',
  'WEBP',
  'SVG',
  'TIFF',
]

const baseUrl = 'http://localhost:3001'

export default function Local() {
  const [files, setFiles] = useState([''])
  const [filesLength, setFilesLength] = useState(0)
  const [directory, setDirectory] = useState([''])
  const [selected, setSelected] = useState(0)
  const [passKey, setPassKey] = useState('')
  const [fullScreen, setFullScreen] = useState(false)

  const getData = async (item = '') => {
    const back = item === '..'
    const dir = back ? directory.slice(0, -1).join('/') : directory.join('/')
    fetch(`${baseUrl}/${dir}${back ? '' : `/${item}`}?key=${passKey}`)
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.directory && res.fileList) {
          setFiles(res.fileList /*.slice(1, res.fileList.length)*/)
          setFilesLength(res.fileList.length)
          setDirectory(
            res.directory
              .replace('//', '/')
              .split('/')
              .filter((item) => item.trim() !== '')
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const imageLoader = ({ src }) =>
    encodeURI(`${baseUrl}/${directory.join('/')}/${src}?key=${passKey}`)

  function fsPrev() {
    console.log('prev', selected, selected - 1, filesLength)
    if (selected - 1 < 0) {
      setSelected(filesLength - 1)
      console.log('max')
    } else {
      setSelected(selected - 1)
    }
  }
  function fsNext() {
    console.log('next', selected, selected + 1, filesLength)
    if (selected + 1 >= filesLength) {
      setSelected(0)
      console.log('max')
    } else {
      setSelected(selected + 1)
    }
  }
  const fsClose = () => setFullScreen(false)

  const keyDownFunction = (e) => {
    switch (e.key) {
      case 'Escape':
        if (fullScreen) setFullScreen(false)
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
        if (!fullScreen) getData(files)
        break
      case 'AltGraph':
        // panic button
        break
      default:
        console.log(e.key)
        break
    }
  }

  useEffect(getData, [])

  useEffect(() => {
    document.addEventListener('keydown', keyDownFunction)
    return () => document.removeEventListener('keydown', keyDownFunction)
  }, [keyDownFunction])

  const fsUrl = imageExtensions.includes(
    files[selected].split('.')[files[selected].split('.').length - 1]
  )
    ? `${baseUrl}/${directory.join('/')}/${files[selected]}?key=${passKey}`
    : '/folder.ico'

  return (
    <div className={styles.container}>
      <Head>
        <title>Kiyo Galery - Local</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <input
          type="text"
          placeholder="key"
          onChange={(e) => {
            setPassKey(e.target.value)
          }}
          value={passKey}
        />
      </Header>
      <main className={styles.main}>
        <div className={styles.filesContainer}>
          {files && directory ? (
            files.map((item, index) =>
              imageExtensions.includes(
                item.split('.')[item.split('.').length - 1]
              ) ? (
                <div
                  className={`${styles.image}`}
                  key={index}
                  onClick={() => {
                    setFullScreen(true)
                    setSelected(index)
                  }}
                >
                  <Image
                    loader={imageLoader}
                    src={item}
                    objectFit={'cover'}
                    width={'100px'}
                    height={'100px'}
                    quality={1}
                    alt={JSON.stringify(item)}
                  />
                </div>
              ) : (
                <Folder
                  key={index}
                  name={item}
                  onClick={() => {
                    getData(item)
                  }}
                />
              )
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
        {fullScreen ? (
          <Fullscreen
            src={fsUrl}
            // name={files[selected]}
            close={fsClose}
            prev={fsPrev}
            next={fsNext}
          />
        ) : null}
      </main>
    </div>
  )
}
