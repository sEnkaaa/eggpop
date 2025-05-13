import React, { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'

import styles from "./game-info.module.scss"
import Panel from "../../../../components/UI/Panel"
import Button from "../../../../components/UI/Button"
import useApp from "../../../../utils/hooks/useApp"
import useGame from "../../../../utils/hooks/useGame"
import { useNavigate } from "react-router-dom"

const GameInfo: React.FC = () => {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [resetKey, setResetKey] = useState(0)

  const navigate = useNavigate()

  const {nickname, avatar, ws} = useApp()
  const {creatingRoom, setCreatingRoom} = useGame()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
      setResetKey((prevKey) => prevKey + 1)
    }, 10000);

    return () => clearInterval(interval)
  }, [currentSlide])

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
    setResetKey((prevKey) => prevKey + 1)
  }

  const slides = [
    {
      text: (
        <div>
          {t('home.game_info.slider.slide_1.sentence_1')}<br />
          {t('home.game_info.slider.slide_1.sentence_2')}
        </div>
      ),
      image: "/assets/how_to/1.png"
    },
    {
      text: (
        <div>
          {t('home.game_info.slider.slide_2.sentence_1')}<br />
          {t('home.game_info.slider.slide_2.sentence_2')}
        </div>
      ),
      image: "/assets/how_to/2.png"
    },
    {
      text: (
        <div>
          {t('home.game_info.slider.slide_3.sentence_1')}<br />
          {t('home.game_info.slider.slide_3.sentence_2')}
        </div>
      ),
      image: "/assets/how_to/3.png"
    },
    {
      text: (
        <div>
          {t('home.game_info.slider.slide_4.sentence_1')}<br />
          {t('home.game_info.slider.slide_4.sentence_2')}
        </div>
      ),
      image: "/assets/how_to/4.png"
    },
    {
      text: (
        <div>
          {t('home.game_info.slider.slide_5.sentence_1')}<br />
          {t('home.game_info.slider.slide_5.sentence_2')}
        </div>
      ),
      image: "/assets/how_to/5.png"
    },
  ]


  return (
    <div className={styles['game-info']}>
      <Panel
        header={
          <div className='heading-1'>
            {t('home.game_info.title')}
          </div>
        }
      >
        <div className={styles['game-info-content']}>
          <div>
            <div className={styles['slide']}>
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
              />
              <p>{slides[currentSlide].text}</p>
            </div>
            <div className={styles['dots']}>
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={styles['dot']}
                  onClick={() => handleDotClick(index)}
                >
                  {currentSlide === index && (
                    <svg key={resetKey} className={styles['dot-loader']} viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles['actions']}>
            <Button
              size="large"
              disabled={!(!!nickname)}
              onClick={() => {
                if (!!nickname) {
                  setCreatingRoom(true)
                  ws.createRoom({
                    nickname,
                    avatar,
                  })
                }
              }}
              loading={creatingRoom}
            >
              {t('home.game_info.create_room')}
            </Button>
            <Button
              buttonType="secondary"
              size="small"
              disabled={!(!!nickname)}
              onClick={() => {
                navigate('/join')
              }}
            >
              {t('home.game_info.join_room')}
            </Button>
          </div>
        </div> 
      </Panel>
    </div>
  );
};

export default GameInfo