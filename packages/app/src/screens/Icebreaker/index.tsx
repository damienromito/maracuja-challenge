import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route } from 'react-router-dom'
import ROUTES from '../../constants/routes'
import { GameContextProvider } from '../../contexts'
import Game from '../Game/Game'
import GameCongrats from '../Game/GameCongrats'
import IcebreakerIntro from './IcebreakerIntro'

export default () => {
  return (
    <GameContextProvider>
      <IonRouterOutlet>
        <Route exact path={ROUTES.ICEBREAKER_INTRO} component={IcebreakerIntro} />
        <Route exact path={ROUTES.ICEBREAKER_PLAY} component={Game} />
        <Route exact path={ROUTES.ICEBREAKER_CONGRATS} component={GameCongrats} />
      </IonRouterOutlet>
    </GameContextProvider>
  )
}
