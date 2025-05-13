import React, {useEffect, useState} from "react"
import { useParams, useNavigate } from 'react-router-dom'
import PlayerList from "./components/common/PlayerList"
import styles from "./game.module.scss"
import RoomInfo from "./components/common/RoomInfo"
import Panel from "../../components/UI/Panel"
import useApp from "../../utils/hooks/useApp"
import useGame from "../../utils/hooks/useGame"
import Lobby from "./components/gameStatus/Lobby"
import Watching from "./components/gameStatus/Watching"
import SubtitlePhase from "./components/gameStatus/SubtitlePhase"
import VotePhase from "./components/gameStatus/VotePhase"
import VoteResults from "./components/gameStatus/VoteResults"
import Podium from "./components/gameStatus/Podium"

const GamePage: React.FC = () => {

    const [loading, setLoading] = useState(true)

    const {id: roomId} = useParams()

    const {ws} = useApp()
    const {room, setRoom} = useGame()

    const navigate = useNavigate()
    
    useEffect(() => {
        ws.subscribe(`/user/${ws.token}/room/${roomId}`, (message) => {
            let roomData = message.body
            try {
                const parsedData = JSON.parse(roomData)
                roomData = parsedData
            } catch (err) {
                console.error('[WS] Failed to parse message', err)
            }
            setRoom(roomData)
        })
        if (!room) {
            ws.send(`/app/rooms/get`, roomId)
        }
        ws.onError((message) => {
            navigate('/')
        })
        return () => {       
            setRoom(null)
            ws.unsubscribe(`/user/${ws.token}/room/${roomId}`)
            ws.unsubscribe(`/user/${ws.token}/room/info`)
        }
    }, [])

    useEffect(() => {
        if (room) {
            setLoading(false)
        }
    }, [room])

    if (loading) {
        return (
            <div className={styles["loading"]}>
                <img
                    src="/assets/UI/spinner.png"
                    alt="loading"
                    className={styles['spinner']}
                />
                <div>
                    LOADING
                </div>
            </div>
        )
    }

    const renderRoomStage = () => {
        switch (room?.status) {
            case "LOBBY":
                return <Lobby />
            case "WATCHING_CLIP":
            case "WATCHING_ALL_CLIPS":
                return <Watching />
            case "SUBTITLE_PHASE":
                return <SubtitlePhase />
            case "VOTE_PHASE":
                return <VotePhase />
            case "VOTE_RESULTS":
                return <VoteResults />
            case "PODIUM":
                return <Podium /> 
            default:
                return <div>Statut inconnu</div>
        }
    }

    return (
        <div className={styles["game-container"]}>
            <div className={styles["player-list"]}>
                <RoomInfo
                    roomId={roomId}
                />
                <PlayerList />
            </div>
            <div className={styles["game"]}>      
                <Panel>
                    {renderRoomStage()}
                </Panel>
            </div>
        </div>
    )
}

export default GamePage