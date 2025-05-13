import React from "react"

import styles from './panel.module.scss'

interface PanelProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

const Panel: React.FC<PanelProps> = (props) => {
  const {
    header,
    footer,
    children
  } = props

  return (
    <div className={styles['panel']}>
      {header && (
        <div className={styles['panel-header']}>
          {header}
        </div>
      )}
      <div className={styles['panel-body']}>
        {children}
      </div>
      {footer && (
        <div className={styles['panel-footer']}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Panel