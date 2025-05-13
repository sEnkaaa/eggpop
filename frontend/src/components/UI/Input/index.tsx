import React, { useState } from 'react'
import classNames from 'classnames'

import styles from './input.module.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  block?: boolean;  // Nouvelle prop block
}

const Input: React.FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className={styles['input-container']}>
      <div
        className={classNames(
          styles['input-wrapper'],
          {
            [styles['focused']]: isFocused,
            [styles['error']]: props.error,
            [styles['block']]: props.block, // ⬅️ appliquer au wrapper
          }
        )}
      >
        <input
          {...props}
          className={
            classNames(
              styles['input'],
              {
                [styles['block']]: props.block,
              }
            )
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {props.error && (
        <div className={styles['error-message']}>
          {props.error}
        </div>
      )}
    </div>
  )
}

export default Input
