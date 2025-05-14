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
  console.log('pppapaapa', avatar)

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
        &copy; {new Date().getFullYear()} - EGGPOP
      </div>
    </div>
  )
}

export default AppLayout