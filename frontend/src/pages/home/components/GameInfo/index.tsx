import React, { useEffect, useState } from "react"

import styles from "./game-info.module.scss"
import Panel from "../../../../components/UI/Panel"
import Button from "../../../../components/UI/Button"
import useApp from "../../../../utils/hooks/useApp"
import useGame from "../../../../utils/hooks/useGame"
import { useNavigate } from "react-router-dom"

const slides = [
  {
    text: (
      <div>
        Crée une partie ou rejoins-en une.<br />
        Rassemble ta bande et prépare-toi à pondre du lourd !
      </div>
    ),
    image: "/assets/how_to/1.png"
  },
  {
    text: (
      <div>
        Tout le monde regarde le même extrait en même temps 📽️<br />
        Ouvre grand les yeux, il passe deux fois !
      </div>
    ),
    image: "/assets/how_to/2.png"
  },
  {
    text: (
      <div>
        Invente la phrase la plus marrante pour ton extrait 🎯<br />
        (Tu peux être sérieux... ou complètement stupide 🤪)
      </div>
    ),
    image: "/assets/how_to/3.png"
  },
  {
    text: (
      <div>
        Découvrez les sous-titres de tout le monde 😂<br />
        Prépare-toi pour des moments mythiques !
      </div>
    ),
    image: "/assets/how_to/4.png"
  },
  {
    text: (
      <div>
        Vote pour ton sous-titre préféré 🗳️<br />
        À la fin : Oeuf en or... et fous rires garantis !
      </div>
    ),
    image: "/assets/how_to/5.png"
  },
]

const GameInfo: React.FC = () => {
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

  return (
    <div className={styles['game-info']}>
      <Panel
        header={
          <div className='heading-1'>
            À toi de jouer !
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
              Créer une partie
            </Button>
            <Button
              buttonType="secondary"
              size="small"
              disabled={!(!!nickname)}
              onClick={() => {
                navigate('/join')
              }}
            >
              Rejoindre  des amis
            </Button>
          </div>
        </div> 
      </Panel>
    </div>
  );
};

export default GameInfo