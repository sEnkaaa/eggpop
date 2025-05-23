import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import styles from './vote-phase.module.scss'
import useApp from "../../../../../utils/hooks/useApp"
import Button from "../../../../../components/UI/Button"
import useGame from "../../../../../utils/hooks/useGame"

const VotePhase: React.FC = () => {
    const { t } = useTranslation()
    const [timer, setTimer] = useState(60)
    const [playerVoted, setPlayerVoted] = useState(false)
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
        <div className={styles['vote-phase']}>
            <div className={styles['timer']}>
                <div>
                    {t('game.vote_phase.remaining_time')}
                </div>
                <div
                    className={styles['digits']}
                >
                    {timer}
                </div>
            </div>
            {playerVoted ? (
                <div>
                    {t('words.waiting')}
                </div>
            ) : (
                <div className={styles['player-inputs-container']}>
                    {room?.shuffledPlayerInputs?.map((playerInput) => (
                        <Button
                            key={playerInput.id}
                            className={styles['player-input']}
                            buttonType="secondary"
                            onClick={() => {
                                if (!playerInput.isMine) {
                                    ws.send(`/app/rooms/${room?.id}/status/vote-phase/vote`, playerInput.id)
                                    setPlayerVoted(true)
                                }
                            }}
                            disabled={playerInput.isMine}
                        >
                            {playerInput.content}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VotePhase