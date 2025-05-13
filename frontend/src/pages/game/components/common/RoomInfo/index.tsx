import React from 'react'
import Panel from '../../../../../components/UI/Panel'
import styles from './room-info.module.scss'
import { useToggle } from 'ahooks'
import Button from '../../../../../components/UI/Button'

const RoomInfo: React.FC = (props) => {
    const { roomId } = props
    const [isCodeVisible, { toggle }] = useToggle(false)

    return (
        <div className="room-info">
            <Panel>
                <div className={styles["room-info"]}>
                    <div className={styles["code-container"]}>
                        <div>ROOM CODE</div>
                        {isCodeVisible ? (
                            <div
                                className={styles["code"]}
                                onClick={toggle}
                            >
                                {roomId?.toUpperCase()}
                            </div> 
                        ) : (
                            <Button
                                size='small'
                                onClick={toggle}
                            >
                                Click to show
                            </Button>
                        )}
                    </div>
                    <div className={styles["link-container"]}>
                        Click here to copy the link 🔗
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default RoomInfo