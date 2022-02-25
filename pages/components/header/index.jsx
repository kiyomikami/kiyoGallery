import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './header.module.scss'

import { useRouter } from 'next/router'

function NavElement({ href, name }) {
  const router = useRouter()
  return (
    <Link href={href}>
      <a className={router.pathname == href ? styles.active : null}>{name}</a>
    </Link>
  )
}

export default function Header({ children, className }) {
  const [open, setOpen] = useState(false)

  const [isLogged, setIsLogged] = useState(false)

  if (typeof document !== 'undefined')
    document.addEventListener('click', (e) => {
      if (e.target.closest('header')) return
      setOpen(false)
    })

  return (
    <header className={[styles.header, className].join(' ')}>
      <div
        className={[styles.burger, open ? styles.open : null].join(' ')}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </div>
      <nav className={open ? styles.open : null}>
        <NavElement href="/" name="Home" />
        <NavElement href="/local" name="Local" />
        <NavElement href="/rule34" name="Rule34" />
      </nav>
      <div className={styles.headerContent}>{children}</div>
    </header>
  )
}
