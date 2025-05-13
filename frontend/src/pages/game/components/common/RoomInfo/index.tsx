import React from 'react'
import { useTranslation } from 'react-i18next'
import Panel from '../../../../../components/UI/Panel'
import styles from './room-info.module.scss'
import { useToggle } from 'ahooks'
import Button from '../../../../../components/UI/Button'

const RoomInfo: React.FC = (props) => {
    const { t } = useTranslation()
    const { roomId } = props
    const [isCodeVisible, { toggle }] = useToggle(false)

    return (
        <div className="room-info">
            <Panel>
                <div className={styles["room-info"]}>
                    <div className={styles["code-container"]}>
                        <div>
                            {t('game.common.room_info.code')}
                        </div>
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
                                {t('game.common.room_info.click_to_show')}
                            </Button>
                        )}
                    </div>
                    <div className={styles["link-container"]}>
                        {t('game.common.room_info.click_to_copy')}
                    </div>
                </div>
            </Panel>
        </div>
    )
}

export default RoomInfo