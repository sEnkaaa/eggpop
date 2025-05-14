import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalStorageState } from 'ahooks'
import styles from './language-selector.module.scss'

const languages = [
    { code: 'en', label: 'English', flag: '/assets/flags/en.png' },
    { code: 'fr', label: 'Français', flag: '/assets/flags/fr.png' },
]

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation()
    const [language, setLanguage] = useLocalStorageState<string>('language', { defaultValue: 'fr' })
    const [open, setOpen] = useState(false)

    const selected = languages.find((l) => l.code === language) || languages[0]

    const handleSelect = (lang: typeof selected) => {
        setLanguage(lang.code)
        i18n.changeLanguage(lang.code)
        setOpen(false)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.selector} onClick={() => setOpen(!open)}>
                <img src={selected.flag} alt={selected.code} className={styles.flag} />
                {selected.code.toUpperCase()}
            </div>
            {open && (
                <div className={styles.dropdown}>
                {languages.map((lang) => (
                    <div
                        key={lang.code}
                        className={styles.option}
                        onClick={() => handleSelect(lang)}
                    >
                        <img src={lang.flag} alt={lang.code} className={styles.flag} />
                        <span>{lang.label}</span>
                    </div>
                ))}
                </div>
            )}
        </div>
  )
}

export default LanguageSelector
