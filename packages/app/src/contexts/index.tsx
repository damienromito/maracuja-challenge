import {
  ChallengeContextProvider,
  useCurrentChallenge,
  AuthUserContextProvider,
  useAuthUser,
  ApiContextProvider,
  useApi,
  OrganisationContextProvider,
  useCurrentOrganisation
} from '@maracuja/shared/contexts'

import { NotificationContextProvider, NotificationContext, useNotification } from './NotificationContext'
import { GameContextProvider, GameContext } from './GameContext'
import { AppContextProvider, useApp } from './AppContext'
import { DeviceContextProvider, useDevice } from './DeviceContext'

export {
  useDevice,
  DeviceContextProvider,

  useApi,
  ApiContextProvider,

  useAuthUser,
  AuthUserContextProvider,

  ChallengeContextProvider,
  useCurrentChallenge,

  AppContextProvider,
  useApp,

  useNotification,
  NotificationContext,
  NotificationContextProvider,

  GameContext,
  GameContextProvider,

  OrganisationContextProvider,
  useCurrentOrganisation
}
