import React from "react"
import { useTranslation } from 'react-i18next'
import styles from "./player-setup.module.scss"
import Panel from "../../../../components/UI/Panel"
import CharacterSelect from "../../../../components/CharacterSelect"

const PlayerSetup: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles['player-setup']}>
      <Panel
        header={
          <div className='heading-1'>
            {t('home.player_setup.select_character')}
          </div>
        }
      >
        <CharacterSelect />
      </Panel>
    </div>
  )
}

export default PlayerSetup
