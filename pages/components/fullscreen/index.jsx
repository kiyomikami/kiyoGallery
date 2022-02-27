import styles from './fullscreen.module.scss'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  faXmark,
  faAngleLeft,
  faAngleRight,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Fullscreen({ prev, next, close, src }) {
  const [zoom, setZoom] = useState(1)

  return (
    <div className={styles.fullscreen} onClick={(e) => e.preventDefault()}>
      <div
        className={styles.fullscreenImage}
        style={{ transform: `scale(${zoom})` }}
        onClick={(e) => {
          e.preventDefault()
          zoom === 1 ? setZoom(2) : setZoom(1)
        }}
      >
        <div className={styles.fsHeader}>{/**/}</div>
        <Image src={src} layout="fill" objectFit="contain" priority={true} />
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
        onClick={prev}
      />
      <FontAwesomeIcon
        icon={faAngleRight}
        className={styles.fullscreenNavNext}
        onClick={next}
      />
    </div>
  )
}
