import styles from './Folder.module.scss'
import Image from 'next/image'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Folder({ onClick, name, className }) {
  return (
    <div className={`${styles.directory} ${className}`} onClick={onClick}>
      <Image src={'/folder.ico'} layout={'fixed'} priority height={'64'} width={'64'} />
      <p>{name}</p>
      {name ? name.charAt(0) === '_' ? (
        <FontAwesomeIcon className={styles.locked} icon={faLock} />
      ) : null}
    </div>
  )
}
