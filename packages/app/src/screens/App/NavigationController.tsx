import { NotFound } from "@maracuja/shared/components"
import { ReactNode, useEffect } from "react"
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom"
import { Spinner } from "../../components"
import ROUTES from "../../constants/routes"
import { useApp, useAuthUser, useCurrentChallenge, useCurrentOrganisation, useDevice } from "../../contexts"
import { checkPlayerHasRequiredChallengeInfo } from "../../utils/helpers"
import JoinChallenge from "../Challenge/Join"
import JoinWithId from "../Challenge/JoinWithId"
import OnboardingPlayerCard from "../Challenge/OnboardingPlayerCard"
import ChallengeRules from "../Challenge/Rules"
import ContestController from "../Contest"
import DebriefingController from "../Debriefing"
import Event from "../Event"
import EventSubscriptionSaved from "../Event/SubscriptionSaved"
import ExternalActivity from "../ExternalActivity"
import GameController from "../Game"
import HomePage from "../Home"
import IcebreakerController from "../Icebreaker"
import IcebreakerCreateQuestion from "../Icebreaker/CreateQuestion"
import IcebreakerCreateQuestionSuccess from "../Icebreaker/CreateQuestionSuccess"
import IdeasBox from "../IdeasBox"
import Landing from "../Landing"
import MobileOnly from "../Landing/MobileOnly"
import Lottery from "../Lottery"
import OnboardingNeedCaptain from "../Onboarding/NeedCaptain"
import OnboardingWelcome from "../Onboarding/Welcome"
import PlayerCalendar from "../Player/Calendar"
import ViewPlayerCard from "../Player/Card"
import EditCurrentPlayer from "../Player/Edit"
import SettingsPage from "../Settings"
import CleanPage from "../Settings/Clean"
import Restricted from "../SignUp/Restricted"
import SignUpClub from "../SignUp/SignUpClub"
import SignUpClubPicker from "../SignUp/SignUpClubPicker"
import SignUpConfirm from "../SignUp/SignUpConfirm"
import SignUpEmailPassword from "../SignUp/SignUpEmailPassword"
import SignUpEmailPasswordConfirm from "../SignUp/SignUpEmailPasswordConfirm"
import SignUpEmailPasswordValidation from "../SignUp/SignUpEmailPasswordValidation"
import SignUpInfo from "../SignUp/SignUpInfo"
import SignUpLeaguePicker from "../SignUp/SignUpLeaguePicker"
import SignUpLicense from "../SignUp/SignUpLicense"
import SignUpPasswordForget from "../SignUp/SignUpPasswordForget"
import SignUpPhone from "../SignUp/SignUpPhone"
import SignUpPhoneConfirm from "../SignUp/SignUpPhoneConfirm"
import SignUpReferral from "../SignUp/SignUpReferral"
import SignUpWhiteList from "../SignUp/SignUpWhiteList"
import Survey from "../Survey"
import EditClub from "../Team/Edit"
import TrainingController from "../Training"
import ProtectedRoute from "./ProtectedRoute"
import TabsController from "./TabsController"

export default ({ children }: { children: ReactNode }) => {
  const { currentChallengeLoading, currentChallenge, currentPlayer, currentTeam } = useCurrentChallenge()
  const { currentOrganisationLoading } = useCurrentOrganisation()
  const { platform } = useDevice()

  const { authUserLoading } = useAuthUser()

  if (currentChallengeLoading || authUserLoading || currentOrganisationLoading) {
    return <Spinner />
  }

  return (
    <Router>
      <>
        {children}
        {!currentChallenge ? (
          <DefaultRouter />
        ) : platform === "web" && !process.env.REACT_APP_DEBUG && !currentChallenge.webAppEnabled ? (
          <Switch>
            <Route exact component={MobileOnly} />
          </Switch>
        ) : !currentPlayer || !currentTeam ? (
          <OnboardingRouter />
        ) : (
          <PlayerRouter />
        )}
      </>
    </Router>
  )
}

const DefaultRouter = () => {
  const location: any = useLocation<any>()

  const { logEvent } = useApp()
  useEffect(() => {
    if (location.pathname) {
      logEvent("view - " + location.pathname)
    }
  }, [location.pathname])
  return (
    <Switch>
      <Route exact path="/mobile-only" component={MobileOnly} />
      <Route exact path={ROUTES.HOME} component={Landing} />
      <Route exact path="/clean" component={CleanPage} />
      <ProtectedRoute exact path={ROUTES.SETTINGS} component={SettingsPage} />
      <Route exact path={ROUTES.SIGN_UP__EMAIL_VERIFIED} component={SignUpEmailPasswordConfirm} />
      <Route exact path={ROUTES.ONBOARDING_WELCOME} component={OnboardingWelcome} />{" "}
      {/* HACK car ça envoi sur la page avant d'etre connecté */}
      <Route exact path={ROUTES.JOIN_CHALLENGE} component={JoinChallenge} />
      <Route exact path={ROUTES.CHALLENGE_WITH_ID} component={JoinWithId} />
      <Route exact component={NotFound} />
    </Switch>
  )
}

const OnboardingRouter = () => {
  const location: any = useLocation<any>()

  const { logEvent } = useApp()
  useEffect(() => {
    if (location.pathname) {
      logEvent("view - " + location.pathname)
    }
  }, [location.pathname])
  return (
    <Switch>
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path="/mobile-only" component={MobileOnly} />
      <Route exact path="/clean" component={CleanPage} />
      <Route exact path={ROUTES.JOIN_CHALLENGE} component={JoinChallenge} />
      <Route exact path={ROUTES.CHALLENGE_WITH_ID} component={JoinWithId} />
      <Route exact path={ROUTES.SIGN_UP_LEAGUEPICKER} component={SignUpLeaguePicker} />
      <Route exact path={ROUTES.SIGN_UP_REFERRAL} component={SignUpReferral} />
      <Route exact path={ROUTES.SIGN_UP_CLUBPICKER} component={SignUpClubPicker} />
      <Route exact path={ROUTES.SIGN_UP__CONFIRM} component={SignUpConfirm} />
      <Route exact path={ROUTES.SIGN_UP__CLUB} component={SignUpClub} />
      {/* <Route path={'/authorize'} component={SignUpFacebookConfirm} /> */}
      <Route exact path={ROUTES.SIGN_UP__RESTRICTED} component={Restricted} />
      <Route exact path={ROUTES.SIGN_UP__PHONE} component={SignUpPhone} />
      <Route exact path={ROUTES.SIGN_UP__EMAILPASSWORD} component={SignUpEmailPassword} />
      {/* <Route path={ROUTES.SIGN_UP__FACEBOOK} component={SignUpFacebook} /> */}
      <Route exact path={ROUTES.SIGN_UP__LICENSE} component={SignUpLicense} />
      <Route exact path={ROUTES.SIGN_UP__WHITE_LIST} component={SignUpWhiteList} />
      <Route exact path={ROUTES.SIGN_UP__PASSWORD_FORGET} component={SignUpPasswordForget} />
      <Route exact path={ROUTES.SIGN_UP__PHONE_CONFIRM} component={SignUpPhoneConfirm} />
      <Route exact path={ROUTES.SIGN_UP__EMAIL_VERIFIED} component={SignUpEmailPasswordConfirm} />
      <ProtectedRoute exact path={ROUTES.SETTINGS} component={SettingsPage} />
      <Route exact path={ROUTES.ONBOARDING_WELCOME} component={OnboardingWelcome} />{" "}
      {/* HACK car ça envoi sur la page avant d'etre connecté */}
      <Route exact component={NotFound} />
    </Switch>
  )
}

const PlayerRouter = () => {
  const location: any = useLocation<any>()
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const history = useHistory()
  const { logEvent } = useApp()
  useEffect(() => {
    if (location.pathname) {
      logEvent("view - " + location.pathname)
    }
  }, [location.pathname])
  useEffect(() => {
    if (currentPlayer) {
      if (checkVerifiedEmail()) {
        checkPlayerInfo()
      }
    }
  }, [currentPlayer])

  const checkPlayerInfo = () => {
    if (window.location.pathname === ROUTES.SIGN_UP__EMAIL_VERIFIED) return
    if (!checkPlayerHasRequiredChallengeInfo(currentPlayer, currentChallenge)) {
      history.push(ROUTES.SIGN_UP__INFO)
    }
  }

  const checkVerifiedEmail = () => {
    if (
      currentChallenge &&
      authUser &&
      currentChallenge.verifyEmail &&
      !authUser.emailVerified &&
      authUser.providerData &&
      authUser.providerData[0].providerId === "password"
    ) {
      // if (currentChallenge && authUser && currentChallenge.verifyEmail && authUser.providerData[0].providerId === 'password') {
      return history.push(ROUTES.SIGN_UP__EMAILPASSWORD_VALIDATION, { email: authUser.email })
    } else {
      localStorage.removeItem("authStates")
      return true
    }
  }

  return (
    <Switch>
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.SIGN_UP__INFO} component={SignUpInfo} />
      <Route exact path="/clean" component={CleanPage} />
      <Route exact path={ROUTES.SETTINGS} component={SettingsPage} />
      <Route exact path={ROUTES.SIGN_UP__EMAILPASSWORD_VALIDATION} component={SignUpEmailPasswordValidation} />
      <Route exact path={ROUTES.SIGN_UP__EMAIL_VERIFIED} component={SignUpEmailPasswordConfirm} />
      <Route exact path={ROUTES.CHALLENGE_WITH_ID} component={JoinWithId} />
      <Route exact path={ROUTES.JOIN_CHALLENGE} component={JoinChallenge} />
      <Route exact path="/mobile-only" component={MobileOnly} />

      <Redirect exact path="/challenge" to="/challenge/home" />
      <Route path={ROUTES.EDIT_ACTIVE_CLUB} component={EditClub} />
      <Route path="/challenge" component={TabsController} />
      <Route exact path={ROUTES.ONBOARDING_WELCOME} component={OnboardingWelcome} />
      <Route exact path={ROUTES.ONBOARDING_NEED_CAPTAIN} component={OnboardingNeedCaptain} />
      <Route exact path={ROUTES.SIGN_UP__ONBOARDING_PLAYERCARD} component={OnboardingPlayerCard} />
      <Route path={ROUTES.GAMES} component={GameController} />
      <Route path={ROUTES.CONTEST} component={ContestController} />
      <Route path={ROUTES.TRAINING} component={TrainingController} />
      <Route path={ROUTES.DEBRIEFING} component={DebriefingController} />
      <Route path={ROUTES.ICEBREAKER} component={IcebreakerController} />
      <Route exact path={ROUTES.ICEBREAKER_CREATE_QUESTION} component={IcebreakerCreateQuestion} />
      <Route exact path={ROUTES.ICEBREAKER_CREATE_QUESTION_SUCCESS} component={IcebreakerCreateQuestionSuccess} />

      <Route exact path={ROUTES.CHALLENGE_RULES} component={ChallengeRules} />
      <Route exact path={ROUTES.LOTTERY} component={Lottery} />
      <Route exact path={ROUTES.SURVEY} component={Survey} />
      <Route exact path={ROUTES.EXTERNAL_ACTIVITY} component={ExternalActivity} />
      <Route exact path={ROUTES.IDEAS_BOX} component={IdeasBox} />
      <Route exact path={ROUTES.EVENT} component={Event} />
      <Route exact path={ROUTES.EVENT_SUBSCRIPTION_SAVED} component={EventSubscriptionSaved} />
      <Route path={ROUTES.EDIT_CURRENT_PLAYER} component={EditCurrentPlayer} />
      <Route path={ROUTES.VIEW_PLAYER_CARD} component={ViewPlayerCard} />
      <Route path={ROUTES.PLAYER_CALENDAR} component={PlayerCalendar} />
      <Route exact component={NotFound} />
    </Switch>
  )
}
