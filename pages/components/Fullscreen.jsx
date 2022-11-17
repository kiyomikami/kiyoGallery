import styles from '../../styles/components/fullscreen.module.scss'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  faXmark,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fullscreen({ prev, next, close, src }) {
  const [zoom, setZoom] = useState(1)
  const [diapo, setDiapo] = useState(false)
  const [timeoutHandle, setTimeoutHandle] = useState(null)

  const isVideo = src.includes('mp4')

  return (
    <div className={styles.fullscreen} onClick={(e) => e.preventDefault()}>
      <div
        className={styles.fullscreenImage}
        style={{ transform: `scale(${zoom})` }}
      >
        {isVideo ? (
          <video
            className={styles.fullscreenVideo}
            src={src}
            autoPlay
            loop
            muted
            controls
          />
        ) : (
          <Image
            src={src}
            layout="fill"
            objectFit="contain"
            priority={true}
            alt="image"
            onClick={(e) => {
              e.preventDefault()
              zoom === 1 ? setZoom(2) : setZoom(1)
            }}
            onLoad={() => {
              if (timeoutHandle) clearTimeout(timeoutHandle)
              if (diapo) setTimeoutHandle(setTimeout(() => next(), 2000))
            }}
          />
        )}
      </div>
      <div className={styles.fsHeader}>
        <label htmlFor="fs-checkbox">Diapo</label>
        <input
          type="checkbox"
          id="fs-checkbox"
          onClick={() => {
            setDiapo(!diapo)
          }}
          className={[styles.fsCheckbox, diapo ? styles.fsChecked : ''].join(
            ' '
          )}
        />
      </div>
      <FontAwesomeIcon
        icon={faXmark}
        className={styles.fullscreenClose}
        onClick={() => {
          close()
          setZoom(1)
        }}
      />
      <FontAwesomeIcon
        icon={faAngleLeft}
        className={styles.fullscreenNavPrev}
        onClick={() => {
          setZoom(1)
          prev()
        }}
      />
      <FontAwesomeIcon
        icon={faAngleRight}
        className={styles.fullscreenNavNext}
        onClick={() => {
          setZoom(1)
          next()
        }}
      />
    </div>
  )
}
