import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route } from 'react-router-dom'
import ROUTES from '../../constants/routes'
import { GameContextProvider } from '../../contexts'
import Game from '../Game/Game'
import GameCongrats from '../Game/GameCongrats'
import GameIntro from '../Game/GameIntro'
import ContestIntro from './ContestIntro'

export default () => {
  return (
    <GameContextProvider>
      <IonRouterOutlet>
        <Route exact path={ROUTES.CONTEST_INTRO} component={ContestIntro} />
        <Route exact path={ROUTES.CONTEST_PLAY} component={Game} />
        <Route exact path={ROUTES.CONTEST_CONGRATS} component={GameCongrats} />
      </IonRouterOutlet>
    </GameContextProvider>
  )
}
