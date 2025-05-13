import React from "react"

import styles from './join.module.scss'
import PlayerSetup from "./components/PlayerSetup"
import GameInfo from "./components/GameInfo"

const JoinPage: React.FC = () => {
    return (
        <div className={styles.join}>
            <PlayerSetup />
            <GameInfo />
        </div>
    )
}

export default JoinPage