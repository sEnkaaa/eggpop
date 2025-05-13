import React, { useState } from "react"
import styles from './lobby.module.scss'
import useApp from "../../../../../utils/hooks/useApp"
import Button from "../../../../../components/UI/Button"
import useGame from "../../../../../utils/hooks/useGame"

const Lobby: React.FC = () => {
    const [loading, setLoading] = useState(false)

    const {ws} = useApp()
    const {room} = useGame()
    
    return (
        <div className={styles['lobby']}>
            <b>Waiting for game to start...</b>
            {room?.players?.find(p => p.isMe && p.isLeader) && (
                <div>
                    
                    <Button
                        loading={loading}
                        onClick={() => {
                            setLoading(true)
                            ws.send(`/app/rooms/${room?.id}/start`)
                        }}
                    >
                        Start
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Lobby