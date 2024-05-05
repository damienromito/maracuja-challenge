import { IonRouterOutlet } from '@ionic/react'
import React from 'react'
import { Route } from 'react-router-dom'
import ROUTES from '../../constants/routes'
import { GameContextProvider } from '../../contexts'
import Game from './Game'
import GameCongrats from './GameCongrats'
import GameIntro from './GameIntro'

export default () => {
  return (
    <GameContextProvider>
      <IonRouterOutlet>
        <Route exact path={ROUTES.GAMES_INTRO} component={GameIntro} />

        <Route exact path={ROUTES.GAMES_PLAY} component={Game} />
        {/* <Route exact path={ROUTES.GAMES_TEST} component={Game} name="test" /> */}
        <Route exact path={ROUTES.GAMES_CONGRATS} component={GameCongrats} />
        {/* <Route path={ROUTES.GAMES_FUN_FACT} component={GameFunFact} /> */}
      </IonRouterOutlet>
    </GameContextProvider>
  )
}
