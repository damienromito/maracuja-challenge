import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route } from 'react-router-dom'
import ROUTES from '../../constants/routes'
import { GameContextProvider } from '../../contexts'
import Game from '../Game/Game'
import GameCongrats from '../Game/GameCongrats'
import TrainingIntro from './TrainingIntro'

export default () => {
  return (
    <GameContextProvider>
      <IonRouterOutlet>
        <Route exact path={ROUTES.TRAINING_INTRO} component={TrainingIntro} />
        <Route exact path={ROUTES.TRAINING_PLAY} component={Game} />
        <Route exact path={ROUTES.TRAINING_CONGRATS} component={GameCongrats} />
      </IonRouterOutlet>
    </GameContextProvider>
  )
}
