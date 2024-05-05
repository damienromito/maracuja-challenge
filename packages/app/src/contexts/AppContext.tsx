import { IonAlert, IonApp } from "@ionic/react"
import { PLAYER_ROLES } from "@maracuja/shared/constants"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import firebase from "firebase/app"
import moment from "moment"
import { createContext, useContext, useEffect, useState } from "react"
import "whatwg-fetch"
import { Modal, Spinner, Text2 } from "../components"
import { useAppFlow, useNativeAppUpdate } from "../hooks"
import useStatusBar from "../hooks/useStatusBar"
import { DeepLinkManager } from "../managers/DeepLinkManager"
import { GameManager } from "../managers/GameManager"
import { PushNotificationManager } from "../managers/PushNotificationManager"
import { AppFlowContextProvider } from "../screens/App/AppFlowManager"
import NavigationController from "../screens/App/NavigationController"
import NetworkManager from "../screens/App/NetworkManager"
import ThemeManager from "../screens/App/ThemeManager"
import { useDevice } from "./DeviceContext"

import { AppLauncher } from "@capacitor/app-launcher"
import { SplashScreen } from "@capacitor/splash-screen"
import mixpanel from "mixpanel-browser"

moment.locale("fr")

const AppContextProvider = () => {
  const { isUpdatingApp } = useAppFlow()
  const { platform } = useDevice()
  const { currentPlayer, currentTeam, currentRanking, currentChallenge, setCurrentChallengeById } =
    useCurrentChallenge()
  const { appOrganisationId } = useDevice()
  const { currentOrganisation, setCurrentOrganisationById, currentOrganisationLoading } = useCurrentOrganisation()

  const { needAppUpdate } = useNativeAppUpdate()
  const { setStatusBarLight } = useStatusBar()

  const [loading, setLoading] = useState<any>(false)
  const [popupAlert, setPopupAlert] = useState<any>(null)
  const [popupInfos, setPopupInfos] = useState<any>(null)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    SplashScreen.hide()
    let mixpanelProjectToken
    if (process.env.REACT_APP_ENV === "production" && !process.env.REACT_APP_DEBUG) {
      console.log = function () {}
      mixpanel.init(process.env.REACT_APP_MIXPANEL_PROJECT_TOKEN)
    } else {
      mixpanelProjectToken = mixpanel.init(process.env.REACT_APP_DEV_MIXPANEL_PROJECT_TOKEN, {
        debug: true,
      })
    }
  }

  useEffect(() => {
    if (isUpdatingApp) {
      openInfoAppIsUpdating()
    }
  }, [isUpdatingApp])

  useEffect(() => {
    // if (!process.env.REACT_APP_DEBUG && !currentOrganisationLoading) {
    if (!process.env.REACT_APP_DEBUG && !currentOrganisationLoading && currentOrganisation) {
      if (currentOrganisation.appId) {
        const nativeOrganisation = process.env.REACT_APP_FORCE_ORGA || appOrganisationId
        if (nativeOrganisation !== currentOrganisation.id) {
          alert(
            "Ce challenge est accessible depuis l'application Sport Challenge CROS NA téléchargable sur iPhone et Android"
          )
          setCurrentChallengeById(null)
          setCurrentOrganisationById(null)
        }
      }
    }
  }, [currentOrganisation, currentOrganisationLoading])

  useEffect(() => {
    if (needAppUpdate && currentOrganisation) {
      // TODO NOT IN GAME
      openPopupUpdateAvailable()
    }
  }, [needAppUpdate, currentOrganisation])

  // const checkWebAppVersion = () => {
  //   if (platform === 'web') {
  //     currentChallenge.
  //     const appversion
  //   }
  // }
  const openPopupUpdateAvailable = () => {
    const message = `Ton application n'est pas à jour et risque de ne plus fonctionner normalement. Rends-toi sur ${
      platform === "ios" ? "l'AppStore" : "Google Play Store"
    } pour la télécharger`
    openPopup({
      title: "Mise à jour disponible ! 😎",
      message,
      buttonText: "Mettre à jour",
      callback: async () => {
        const storeUrl =
          platform === "android"
            ? currentOrganisation?.storesUrls?.native?.android || process.env.REACT_APP_ANDROID_URL
            : currentOrganisation?.storesUrls?.native?.ios || process.env.REACT_APP_IOS_URL
        await AppLauncher.openUrl({ url: "com.getcapacitor.myapp://page?id=portfolio" })
      },
    })
  }

  const logEvent = (eventId: string, { label }: { label?: any } = {}) => {
    console.log("eventId:", eventId)
    const params = {
      label,
      // playerUsername: currentPlayer?.username,
      // playerId: currentPlayer?.id,
      isCaptain: currentPlayer?.hasRole(PLAYER_ROLES.CAPTAIN),
      isReferee: currentPlayer?.hasRole(PLAYER_ROLES.REFEREE),
      challengeId: currentChallenge?.id,
      challengeName: currentChallenge?.name,
      teamId: currentTeam?.id,
      teamName: currentTeam?.name,
      teamRank: currentRanking?.currentTeamRank,
      gameCount: currentPlayer?.gameCount,
    }
    console.log("[Log Event]", eventId, params)
    firebase.analytics().logEvent(eventId, params)
    mixpanel.track(eventId, params)
  }

  const openInfoAppIsUpdating = () => {
    openPopup({
      title: "Chargement en cours...",
      message:
        "« La réussite appartient à tout le monde. C'est au travail d'équipe qu'en revient le mérite. » Franck Piccard",
    })
  }

  // interface OpenPopupTypes {
  //   message?: any
  //   title?: any
  //   callback?: any
  //   buttonText?: any
  //   children?: any
  // }

  interface openPopupProps {
    message: any
    title: any
    callback?: any
    buttonText?: any
    children?: any
  }
  const openPopup = ({ message, title, callback, buttonText, children }: openPopupProps) => {
    setPopupInfos({ message, callback, title, buttonText, children })
  }

  // interface OpenAlertTypes {
  //   message: string
  //   buttons: [string]
  //   title: string
  // }
  const openAlert = ({ message, buttons = ["Ok"], title }: any) => {
    // Exemple sur la methode openError
    setPopupAlert({ message, buttons, title })
  }
  const openError = (error: any) => {
    setPopupAlert({
      title: "Une erreur s'est produite",
      message:
        'Appuyez sur "OK" et réessayez. Si le problème persiste, envoyez une capture d\'écran à bonjour@maracuja.ac \r\n' +
        error,
      buttons: ["Annuler", { text: "OK", handler: () => setPopupAlert(false) }],
    })
  }

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        openPopup,
        setStatusBarLight,
        logEvent,
        openError,
        openAlert,
      }}
    >
      <ThemeManager>
        <IonApp>
          <AppFlowContextProvider>
            <NavigationController>
              {loading && <Spinner />}
              <NetworkManager />
              <PushNotificationManager />
              <DeepLinkManager />
              <GameManager />

              {popupAlert && (
                <IonAlert
                  isOpen={popupAlert !== false}
                  header={popupAlert.title}
                  message={popupAlert.message}
                  buttons={popupAlert.buttons}
                  onDidDismiss={() => setPopupAlert(false)}
                />
              )}

              {popupInfos && (
                <>
                  <Modal
                    isOpen={!!popupInfos}
                    onClose={() => {
                      setPopupInfos(null)
                    }}
                    title={popupInfos.title && popupInfos.title}
                    validTextButton={popupInfos.buttonText}
                    validActionButton={() => popupInfos.callback && popupInfos.callback()}
                  >
                    {popupInfos.children ? popupInfos.children : null}
                    <Text2 style={{ textAlign: "center" }}>
                      <span dangerouslySetInnerHTML={{ __html: popupInfos.message }} />
                    </Text2>
                  </Modal>
                </>
              )}
            </NavigationController>
          </AppFlowContextProvider>
        </IonApp>
      </ThemeManager>
    </AppContext.Provider>
  )
}

const AppContext = createContext<any>(null)

const useApp = () => useContext(AppContext)

export { useApp, AppContextProvider }
