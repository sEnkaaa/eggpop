import React, {useEffect} from "react"

import styles from './home.module.scss'
import PlayerSetup from "./components/PlayerSetup"
import GameInfo from "./components/GameInfo"

const HomePage: React.FC = () => {
    return (
        <div className={styles.home}>
            <PlayerSetup />
            <GameInfo />
        </div>
    )
}

export default HomePage