import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route } from 'react-router-dom'
import ROUTES from '../../constants/routes'
import { GameContextProvider } from '../../contexts'
import Game from '../Game/Game'
import GameCongrats from '../Game/GameCongrats'
import GameIntro from '../Game/GameIntro'
import DebriefingIntro from './DebriefingIntro'

export default () => {
  return (
    <GameContextProvider>
      <IonRouterOutlet>
        <Route exact path={ROUTES.DEBRIEFING_INTRO} component={DebriefingIntro} />
        <Route exact path={ROUTES.DEBRIEFING_PLAY} component={Game} />
        <Route exact path={ROUTES.DEBRIEFING_CONGRATS} component={GameCongrats} />
      </IonRouterOutlet>
    </GameContextProvider>
  )
}
