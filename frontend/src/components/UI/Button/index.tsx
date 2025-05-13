import React from 'react'
import classNames from 'classnames'

import styles from './button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  buttonType?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    buttonType = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    ...rest
  } = props

  return (
    <div className={styles['button-container']}>
     
      <button
        {...rest}
        className={classNames(
          styles['button'],
          {
            [styles['primary']]: buttonType === 'primary',
            [styles['secondary']]: buttonType === 'secondary',
            [styles['small']]: size === 'small',
            [styles['large']]: size === 'large',
            [styles['disabled']]: disabled,
            [styles['loading']]: loading
          },
        )}
      >
        { loading && (
          <img
            src="/assets/UI/spinner.png"
            alt="loading"
            className={styles['spinner']}
          />
        )}      
        {children}
      </button>
    </div>
  )
}

export default Button