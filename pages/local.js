import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Local.module.scss'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Folder from './components/folder'

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
  'TIFF'
]

const baseUrl = 'http://localhost:3001'

export default function Home({}) {
  const [files, setFiles] = useState([''])
  const [filesLength, setFilesLength] = useState(0)
  const [directory, setDirectory] = useState([''])
  const [selected, setSelected] = useState(0)
  const [passKey, setPassKey] = useState('')
  const [fullScreen, setFullScreen] = useState(false)
  const [fsZoom, setFsZoom] = useState(1)

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

  const keyDownFunction = (e) => {
    switch (e.key) {
      case 'Escape':
        setFullScreen(false)
        break
      case 'ArrowLeft':
      case 'q':
        fsPrev()
        break
      case 'ArrowRight':
      case 'd':
        fsNext()
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

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="key"
        onChange={(e) => {
          setPassKey(e.target.value)
        }}
        value={passKey}
      />
      <div className={styles.filesContainer}>
        {files && directory ? (
          files.map((item, index) =>
            imageExtensions.includes(item.split('.')[item.split('.').length - 1]) ? (
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
                  layout={'fill'}
                  objectFit={'cover'}
                  width={'100px'}
                  height={'100px'}
                  quality={1}
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
        <div className={styles.fullscreen} onClick={(e) => e.preventDefault()}>
          {imageExtensions.includes(
            files[selected].split('.')[files[selected].split('.').length - 1]
          ) ? (
            <div
              className={styles.fullscreenImage}
              style={{ transform: `scale(${fsZoom})` }}
              onClick={(e) => {
                e.preventDefault()
                fsZoom === 1 ? setFsZoom(2) : setFsZoom(1)
              }}
            >
              <Image
                loader={imageLoader}
                src={files[selected] || files[0]}
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <Folder
              name={files[selected]}
              className={styles.directory}
              onClick={() => {
                getData(files[selected])
              }}
            />
          )}
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.fullscreenClose}
            onClick={() => setFullScreen(false)}
          />
          <FontAwesomeIcon
            icon={faAngleLeft}
            className={styles.fullscreenNavPrev}
            onClick={fsPrev}
          />
          <FontAwesomeIcon
            icon={faAngleRight}
            className={styles.fullscreenNavNext}
            onClick={fsNext}
          />
        </div>
      ) : null}
    </div>
  )
}
