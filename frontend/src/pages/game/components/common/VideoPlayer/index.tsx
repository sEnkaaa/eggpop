import React, { useEffect, useState, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"
import classNames from "classnames"
import styles from './video-player.module.scss'
import useGame from "../../../../../utils/hooks/useGame"
import Button from "../../../../../components/UI/Button"
import useApp from "../../../../../utils/hooks/useApp"

const VideoPlayer: React.FC<{ onClipsWatched?: () => void }> = ({ onClipsWatched }) => {
  const { t } = useTranslation()
  const { room } = useGame()
  const { ws } = useApp()

  const isWatchingAllClips = room?.status === 'WATCHING_ALL_CLIPS'
  const totalPlays = isWatchingAllClips ? (room?.shuffledPlayerInputs?.length || 0) : 2

  const [phase, setPhase] = useState<'fade' | 'countdown' | 'playing' | 'done'>('fade')
  const [currentTime, setCurrentTime] = useState(3)
  const [playIndex, setPlayIndex] = useState(0)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState<any>(undefined)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (phase === 'fade') {
      const timeout = setTimeout(() => setPhase('countdown'), 1000)
      return () => clearTimeout(timeout)
    }

    if (phase === 'countdown') {
      let timeLeft = 3
      setCurrentTime(timeLeft)
      const interval = setInterval(() => {
        timeLeft -= 1
        setCurrentTime(timeLeft)
        if (timeLeft <= 0) {
          clearInterval(interval)
          setPhase('playing')
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [phase])

  useEffect(() => {
    if (room?.status === 'WATCHING_CLIP') {
      setPhase('countdown')
    }
  }, [room?.currentClip, room?.status])

  useEffect(() => {
    if (phase !== 'playing' || !videoRef.current) return

    const video = videoRef.current

    const handlePlaying = () => {
      console.log('🎥 Video actually playing!')
      setShowPlayButton(false)
      prepareSubtitle()
    }

    const tryPlay = async () => {
      try {
        await video.play()
      } catch (err) {
        console.warn('⛔ Autoplay play() rejected, showing button')
        setShowPlayButton(true)
      }
    }

    video.addEventListener('playing', handlePlaying)
    tryPlay()

    return () => {
      video.removeEventListener('playing', handlePlaying)
    }
  }, [phase, playIndex])

  const prepareSubtitle = useCallback(() => {
    const subtitlesToUse = room?.subtitles?.map(sub => {
      if (!sub.editable) return sub
      if (isWatchingAllClips) {
        const playerInput = room.shuffledPlayerInputs[playIndex]?.content
        return {
          ...sub,
          content: playerInput?.trim() || ''
        }
      }
      return sub
    }) || []

    subtitlesToUse.forEach(sub => {
      setTimeout(() => setCurrentSubtitle(sub), sub.startTime)
      setTimeout(() => setCurrentSubtitle(undefined), sub.endTime)
    })
  }, [room, isWatchingAllClips, playIndex])

  const handleVideoEnd = useCallback(() => {
    if (playIndex + 1 < totalPlays) {
      setPlayIndex(playIndex + 1)
      setPhase('countdown')
    } else {
      setPhase('done')
      onClipsWatched?.()
    }
  }, [playIndex, totalPlays, onClipsWatched])

  const handleManualPlay = () => {
    videoRef.current?.play()
    setShowPlayButton(false)
  }

  const handleSkipClip = () => {
    ws.send(`/app/rooms/${room.id}/status/watching-clip/change-clip`)
    setPlayIndex(0)
    setCurrentTime(3)
  }

  if (phase === 'done') return null

  return (
    <div className={styles.container}>
      {phase === 'fade' && <div className={`${styles.screen} ${styles['fade-in']}`} />}

      {phase === 'countdown' && (
        <div className={styles.screen}>
          <div className={styles['overlay-text']}>
            <div className={styles.countdownText}>
              {`${t('game.watching.video_player.round')} ${room.round}/${room.maxRounds}`}
            </div>
            <div className={styles.countdown}>{currentTime}</div>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className={styles.screen}>
          <video
            ref={videoRef}
            playsInline
            className={styles.video}
            onEnded={handleVideoEnd}
          >
            <source
              src={`/assets/clips/${room.currentClip}.mp4`}
              type="video/mp4"
            />
            {t('game.watching.video_player.unsupported')}
          </video>

          {showPlayButton && (
            <div className={styles['play-overlay']}>
              <Button onClick={handleManualPlay}>
                ▶️ {t('game.watching.video_player.play')}
              </Button>
            </div>
          )}

          {currentSubtitle && (
            <div className={classNames(
              styles['subtitle'],
              {
                [styles['subtitle-editable']]: currentSubtitle?.editable
              }
            )}>
              {currentSubtitle?.content}
            </div>
          )}

          {room?.status === 'WATCHING_CLIP' && room?.players?.find(p => p.isMe && p.isLeader) && (
            <div className={styles.skipButton}>
              <Button onClick={handleSkipClip} size="small">
                ⏭ {t('game.watching.video_player.skip')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
