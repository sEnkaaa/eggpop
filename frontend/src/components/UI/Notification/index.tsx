import React, { useState, useEffect } from 'react'
import styles from './notification.module.scss'

type NotificationType = 'error' | 'info' | 'success'

type NotificationItem = {
  id: number
  message: string
  type: NotificationType
}

let addNotification: ((msg: string, type?: NotificationType) => void) | null = null

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    addNotification = (msg: string, type: NotificationType = 'error') => {
      const id = Date.now()
      setNotifications((prev) => [...prev, { id, message: msg, type }])
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 10000)
    }

    return () => {
      addNotification = null
    }
  }, [])

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className={styles['notification-container']}>
      {notifications.map((n) => (
        <div
            key={n.id}
            className={`${styles.notification} ${styles[n.type]}`}
        >
            <div>
                {n.message}
            </div>
            <div
                className={styles.closeButton}
                onClick={() => removeNotification(n.id)}
            >
                ×
            </div>
        </div>
      ))}
    </div>
  )
}

export default Notification

Notification.push = (msg: string, type: NotificationType = 'error') => {
  if (addNotification) {
    addNotification(msg, type)
  } else {
    console.warn('[Notification] Component not mounted')
  }
}