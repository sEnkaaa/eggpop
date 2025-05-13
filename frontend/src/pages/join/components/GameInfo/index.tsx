import React from "react"
import { useTranslation } from "react-i18next"
import Panel from "../../../../components/UI/Panel"
import styles from "./game-info.module.scss"
import Input from "../../../../components/UI/Input"
import Button from "../../../../components/UI/Button"
import useApp from "../../../../utils/hooks/useApp"
import { useNavigate, useParams } from "react-router-dom"
import useGame from "../../../../utils/hooks/useGame"

const GameInfo: React.FC = () => {
    const { t } = useTranslation()
    const {
        ws,
        nickname,
        avatar
    } = useApp()
    const {setRoom} = useGame()

    const navigate = useNavigate()
    const {id} = useParams()
    const [code, setCode] = React.useState<string>(id || "")

    const handleJoinRoom = () => {
        ws.subscribe(`/user/${ws.token}/room/${code}/joined`, (message) => {
            let roomData = message.body
            try {
                const parsedData = JSON.parse(roomData)
                roomData = parsedData
            } catch (err) {
                console.error('[WS] Failed to parse message', err)
            }
            ws.unsubscribe(`/user/${ws.token}/room/${code}/joined`)
            setRoom(roomData)
            navigate(`/game/${roomData.id}`)
        })
        let payload = {
            roomId: code,
            player: {
                nickname: nickname,
                avatar: avatar
            }
        }
        ws.send(`/app/rooms/join`, JSON.stringify(payload))
    }

    return (
        <div className={styles['game-info']}>
            <Panel
                header={
                <div className='heading-1'>
                    {t('join.game_info.title')}
                </div>
                }
            >
                <div className={styles['game-info-content']}>
                    <div>
                        <Input
                            placeholder="CODE D'INVITATION"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target?.value || "")
                            }}
                            maxLength={5}
                            error={(!!code) ? undefined : "Please enter a code"}
                        />
                    </div>
                    <div>
                        <Button
                            disabled={!(!!nickname && !!code)}
                            onClick={handleJoinRoom}
                        >
                            {t('join.game_info.join_room')}
                        </Button>
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default GameInfo