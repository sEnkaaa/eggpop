import React from "react"

import styles from "./player-setup.module.scss"
import Panel from "../../../../components/UI/Panel"
import CharacterSelect from "../../../../components/CharacterSelect"

const PlayerSetup: React.FC = () => {

  return (
    <div className={styles['player-setup']}>
      <Panel
        header={
          <div className='heading-1'>
            Choisis ton personnage
          </div>
        }
      >
        <CharacterSelect />
      </Panel>
    </div>
  )
}

export default PlayerSetup
