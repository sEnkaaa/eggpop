import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styles from './podium.module.scss'
import useGame from "../../../../../utils/hooks/useGame"
import Button from "../../../../../components/UI/Button"
import useApp from "../../../../../utils/hooks/useApp"

const Podium: React.FC = () => {
  const { t } = useTranslation()
  const { room } = useGame()
  const {ws} = useApp()
  const [orderedPlayers, setOrderedPlayers] = useState([])
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (room?.players) {
      const sorted = [...room.players].sort((a, b) => a.points - b.points)
      setOrderedPlayers(sorted)
      setVisibleCount(0)
    }
  }, [room])

  useEffect(() => {
    if (orderedPlayers.length === 0) return

    const interval = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= orderedPlayers.length) {
          clearInterval(interval)
          return count
        }
        return count + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [orderedPlayers])

  return (
    <div className={styles.podium}>
        <h1>
          {t('game.podium.title')}
        </h1>
        <div className={styles['players-container']}>
            {orderedPlayers.map((player, idx) => (
                <div
                    key={player.sessionId}
                    className={`${styles.spot} ${idx < visibleCount ? styles.visible : ""}`}
                >
                <div className={styles.info}>
                    <div className={styles.name}>
                        <span>#{orderedPlayers.length - idx}</span>
                        <span>{player.nickname}</span>
                    </div>
                    <div className={styles.points}>{player.points} pts</div>
                </div>
                </div>
            ))}
        </div>
        <div
            className={styles['actions']}
        >
          <Button
            onClick={() => {
              ws.send(`/app/rooms/${room?.id}/restart`)
            }}
          >
            {t('game.podium.play_again')}
          </Button>
        </div>
    </div>
  )
}

export default Podium