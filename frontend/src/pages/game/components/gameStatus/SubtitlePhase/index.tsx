import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styles from './subtitle-phase.module.scss'
import useApp from "../../../../../utils/hooks/useApp"
import Button from "../../../../../components/UI/Button"
import useGame from "../../../../../utils/hooks/useGame"
import Input from "../../../../../components/UI/Input"

const SubtitlePhase: React.FC = () => {
    const { t } = useTranslation()
    const [timer, setTimer] = useState(60)
    const [inputValue, setInputValue] = useState('')
    const [hasFinishedWriting, setHasFinishedWriting] = useState(false)
    const {ws} = useApp()
    const {room} = useGame()

    useEffect(() => {
        if (!room?.phaseEndTimestamp) return
        const updateTimer = () => {
            const now = Date.now()
            const diff = Math.max(0, Math.ceil((room.phaseEndTimestamp - now) / 1000))
            setTimer(diff)
        }
        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [room?.phaseEndTimestamp])
    
    return (
        <div className={styles['subtitle-phase']}>
            { hasFinishedWriting ? (
                <div>
                    {t('words.waiting')}
                </div>
            ) : (
                <>
                    <div className={styles['timer']}>
                        <div>
                            {t('game.subtitle_phase.remaining_time')}
                        </div>
                        <div
                            className={styles['digits']}
                        >
                            {timer}
                        </div>
                    </div>
                    <div className={styles['input-container']}>
                        <div>
                            {t('game.subtitle_phase.write_your_best_subtitle')}
                        </div>
                        <Input
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value)
                                ws.send(`/app/rooms/${room?.id}/status/subtitle-phase/submit-subtitle`, e.target.value || "")
                            }}
                            block={true}
                        />
                        <Button
                            onClick={() => {
                                if (!hasFinishedWriting) {
                                    ws.send(`/app/rooms/${room?.id}/status/subtitle-phase/ready-subtitle`)
                                    setHasFinishedWriting(true)
                                }   
                            }}
                        >
                            {t('words.validate')}
                        </Button>
                    </div>
                </>
            ) }
        </div>
    )
}

export default SubtitlePhase