import React from "react"
import classNames from 'classnames'
import Panel from "../../../../../components/UI/Panel"
import useGame from "../../../../../utils/hooks/useGame"
import useApp from "../../../../../utils/hooks/useApp"
import styles from './player-list.module.scss'
import Dropdown from "../../../../../components/UI/Dropdown"

const PlayerList: React.FC = () => {

    const {ws} = useApp()
    const {room} = useGame()

    const amILeader = room?.players.find((player) => player.isLeader && player.isMe)

    return (
        <Panel
            header={
                <div>Players</div>
            }
        >
            <div className={styles["player-list"]}>
                {room?.players.map((player) => (
                    <div className={styles["player"]} key={player.id}>
                        <div className={styles["image-wrapper"]}>
                            <img
                                src="/assets/characters/frame-full.png"
                                alt="Frame"
                                className={styles["frame"]}
                            />
                            <img
                                src={player.avatar}
                                alt={'avatar'}
                                className={styles["avatar"]}
                            />
                        </div>
                        <div
                            className={classNames(styles["nickname-container"], {
                                [styles["nickname-container-disconnected"]]: !player.connected,
                                [styles["disconnected"]]: !player.connected,
                            })}
                        >
                            <div>
                                {player.nickname}
                            </div>
                            {!!(player.isLeader) && (
                                <div className={styles["me"]}>
                                    <img
                                        src="/assets/UI/crown.png"
                                        alt="leader"
                                        className={styles["nickname-icon"]}
                                    />
                                </div>
                            )}
                            {!!(amILeader && !player.isMe) && (
                                <Dropdown
                                    trigger={
                                    <img
                                        src="/assets/UI/settings.png"
                                        alt="settings"
                                        className={styles['nickname-icon']}
                                    />
                                    }
                                    items={[
                                    {
                                        label: "Expulser",
                                        onClick: () => ws.send(`/app/rooms/${room.id}/kick`, player.id)
                                    },
                                    {
                                        label: "Nommer chef",
                                        onClick: () => ws.send(`/app/rooms/${room.id}/make-leader`, player.id)
                                    }
                                    ]}
                                />
                            )}                   
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    )
}

export default PlayerList