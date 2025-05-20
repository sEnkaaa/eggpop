import React from "react"

import styles from './layout.module.scss'
import { useNavigate } from "react-router-dom"
import useApp from "../../utils/hooks/useApp"
import LanguageSelector from "./components/LanguageSelector"

interface Props {
  children: React.ReactNode
}

const AppLayout: React.FC<Props> = (props) => {
  const {children} = props
  const navigate = useNavigate()
  const {avatar} = useApp()

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <img
          onClick={() => navigate('/')}
          src="/assets/logo.png"
          alt="Logo"
          className={styles.logo}
        />
        <LanguageSelector />
      </div>
      <div className={styles.main}>
        {children}
      </div>
      <div className={styles.footer}>
        <div>
          &copy; {new Date().getFullYear()} - EGGPOP
        </div>
        <div>
          <a href="https://github.com/sEnkaaa/eggpop" target="_blank">
            Github
          </a>
        </div>
      </div>
    </div>
  )
}

export default AppLayout