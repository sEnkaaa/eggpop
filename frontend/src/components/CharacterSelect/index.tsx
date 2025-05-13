import React, { useState, useEffect } from "react"

import styles from './character-select.module.scss'
import Input from "../UI/Input"
import useApp from "../../utils/hooks/useApp"

interface CharacterSelectProps {}

export const characters = [
  "/assets/characters/agent.png",
  "/assets/characters/cook.png",
  "/assets/characters/hero.png",
  "/assets/characters/hippie.png",
  "/assets/characters/pirate.png",
  "/assets/characters/rapper.png",
  "/assets/characters/skeleton.png",
  "/assets/characters/soldier.png",
  "/assets/characters/viking.png",
  "/assets/characters/wizard.png"
]

const CharacterSelect: React.FC<CharacterSelectProps> = () => {
  const { nickname, setNickname, avatar, setAvatar } = useApp()

   const [index, setIndex] = useState(() => {
    const existingIndex = characters.findIndex(c => c === avatar)
    return existingIndex !== -1 ? existingIndex : 0
  })

  useEffect(() => {
    const existingIndex = characters.findIndex(c => c === avatar)
    if (existingIndex !== -1) {
      setIndex(existingIndex)
    }
  }, [avatar])

  useEffect(() => {
    if (characters[index] !== avatar) {
      setAvatar(characters[index])
    }
  }, [index])

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + characters.length) % characters.length)
  }

  const handleNext = () => {
    setIndex(prev => (prev + 1) % characters.length)
  }

  const handleSelectAll = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    target.select()
  }

  return (
    <div className={styles['character-select']}>
      <div className={styles["avatar-select"]}>
        <div onClick={handlePrev} className={styles["arrow"]}>
          <img src="/assets/UI/arrow-left.png" alt="Previous" />
        </div>
        <div className={styles["image-wrapper"]}>
          <img
            src="/assets/characters/frame.png"
            alt="Frame"
            className={styles["frame"]}
          />
          <img
            src={characters[index]}
            alt={`Character ${index + 1}`}
            className={styles["image"]}
          />
        </div>
        <div onClick={handleNext} className={styles["arrow"]}>
          <img src="/assets/UI/arrow-right.png" alt="Next" />
        </div>
      </div>
      <Input
        placeholder="Enter your name"
        maxLength={30}
        onClick={handleSelectAll}
        onChange={(e) => setNickname(e.target.value)}
        value={nickname}
        error={!!nickname ? undefined : "Please enter a name"}
      />
    </div>
  )
}

export default CharacterSelect
