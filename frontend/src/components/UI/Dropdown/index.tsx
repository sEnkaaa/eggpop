import React, { useState, useRef, useEffect } from "react"
import styles from "./dropdown.module.scss"

export type DropdownItem = {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className={styles.trigger}>
        {trigger}
      </div>
      {open && (
        <div className={styles.menu}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={styles.item}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown