import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import styles from './lobby.module.scss'
import useApp from "../../../../../utils/hooks/useApp"
import Button from "../../../../../components/UI/Button"
import useGame from "../../../../../utils/hooks/useGame"

const Lobby: React.FC = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const {ws} = useApp()
    const {room} = useGame()
    
    return (
        <div className={styles['lobby']}>
            <b>{t('game.lobby.waiting')}</b>
            {room?.players?.find(p => p.isMe && p.isLeader) && (
                <div>
                    
                    <Button
                        loading={loading}
                        onClick={() => {
                            setLoading(true)
                            ws.send(`/app/rooms/${room?.id}/start`)
                        }}
                    >
                        {t('game.lobby.start')}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Lobby