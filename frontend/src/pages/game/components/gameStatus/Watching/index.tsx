import React from "react"
import { useTranslation } from "react-i18next"
import styles from './watching.module.scss'
import useGame from "../../../../../utils/hooks/useGame"
import VideoPlayer from "../../common/VideoPlayer"
import useApp from "../../../../../utils/hooks/useApp"

const Watching: React.FC = () => {
  const { t } = useTranslation()
  const { ws } = useApp()
  const { room } = useGame()

  const watchingPlayers = room?.players?.filter(p => p.isWatching) || []

  return (
    <div
      className={styles['watching-container']}
    >
      {watchingPlayers.length > 0 && (
        <>
          <div>
            <strong>
              {t('game.watching.waiting')}
            </strong>
          </div>
          <div>
            {watchingPlayers.map(p => p.nickname || "").join(', ')}
          </div>
        </>
      )}
      <VideoPlayer
        onClipsWatched={() => {
          if (room.status === 'WATCHING_CLIP') {
            ws.send(`/app/rooms/${room?.id}/status/watching-clip/stopwatch`)
          } else if (room.status === 'WATCHING_ALL_CLIPS') {
            ws.send(`/app/rooms/${room?.id}/status/watching-all-clips/stopwatch`)
          }
        }}
      />
    </div>
  )
}

export default Watching