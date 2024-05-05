
import { IonPage } from '@ionic/react'
import { NotFound } from '@maracuja/shared/components'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { TabBar } from '../../components'
import ROUTES from '../../constants/routes'
import Challenge from '../Challenge'
import Club from '../Team'
import Calendar from '../Calendar'
import Ranking from '../Ranking'

export default () => {
  return (
    <IonPage>
      <Switch>
        <Route exact path={ROUTES.CHALLENGE} component={Challenge} />
        <Route exact path={ROUTES.ACTIVE_CLUB} component={Club} />
        <Route exact path={ROUTES.CLUB} component={Club} />
        <Route exact path={ROUTES.ACTIVE_RANKING} component={Ranking} />
        <Route exact path={ROUTES.RANKING} component={Ranking} />
        <Route path={ROUTES.CALENDAR} component={Calendar} />
        <Route component={NotFound} />
      </Switch>
      <TabBar />
    </IonPage>
  )
}
