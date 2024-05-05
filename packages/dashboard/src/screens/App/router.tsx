import { ORGA_ROLES, USER_ROLES } from "@maracuja/shared/constants"
import ImageCropper from "../../components/ImageCropper"
import * as ROUTES from "../../constants/routes"
import ChallengeActivities from "../Challenges/Activities"
import ChallengeActivityEdition from "../Challenges/Activities/Form"
import ChallengeConfigurationPage from "../Challenges/ChallengeConfiguration"
import ChallengePage from "../Challenges/ChallengePageTraining"
import ClubsPage from "../Clubs"
import GamesChallengePage from "../Games"
import IcebreakerQuestionSets from "../Icebreaker/QuestionSets"
// import NotificationsLotteriesPage from '../Lotteries'
import NotificationsChallengePage from "../Notifications"
import NotificationsFromPlayers from "../Captains"
import NotificationsAnimationForm from "../Notifications/NotificationForm"
import Organisations from "../Organisations"
import Organisation from "../Organisations/Organisation"
import Calendar from "../Calendar"
import HiddenQuestionSets from "../Calendar/HiddenQuestionSets"
import UsersChallengePage from "../Players"
import RefereesPage from "../Players/Referees"
import UserChallengePage from "../Players/UserPage"
import QuestionSetEditor from "../QuestionSets/ContentsEditor"
import QuestionSetsPage from "../QuestionSets"
import QuestionSetForm from "../QuestionSets/QuestionSetForm"
import Rankings from "../Rankings"
import SignInPage from "../SignIn"
import StatsPage from "../Stats"
import ClubsChallengePage from "../Teams"
import TeamEdition from "../Teams/TeamEdition"
import TeamsScores from "../Teams/TeamsScores"
import ClubChallengePage from "../Teams/TeamPage"
import TribesPage from "../Tribes"
import User from "../Users/User"
import Whitelist from "../Whitelist"
import Modules from "../Library"
import Editor from "../Library/ContentsEditor"
import OrgaSettings from "../Organisations/Settings"
import ResetPassword from "../SignIn/ResetPassword"
import Settings from "../Settings"
import IdeasBoxes from "../IdeasBoxes"
import IdeasBoxEdition from "../IdeasBoxes/IdeasBoxEditions"
import IdeasBoxCreation from "../IdeasBoxes/IdeasBoxCreation"
import IdeasBox from "../IdeasBoxes/IdeasBoxDetails"
import Module from "../Library/Module"
import Surveys from "../Surveys"
import SurveyCreation from "../Surveys/SurveyCreation"
import SurveyEditions from "../Surveys/SurveyEdition"

const routes = [
  {
    key: "home",
    path: ROUTES.HOME,
    component: SignInPage,
    showSideMenu: false,
  },
  {
    key: "reset-password",
    path: ROUTES.RESET_PASSWORD,
    component: ResetPassword,
    showSideMenu: false,
  },
  { path: "/crop", component: ImageCropper, userRoles: [USER_ROLES.ADMIN] },
  { path: ROUTES.HOME, component: Organisations, userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CLUBS, component: ClubsPage, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.TRIBES, component: TribesPage, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.STATS, component: StatsPage, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.USER, component: User, userRoles: [USER_ROLES.SUPER_ADMIN] },
  { path: ROUTES.HOME, component: Organisation, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.ORGANISATION,component: Organisation, userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.MODULES, component: Modules, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.MODULE, component: Module, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.THEME, component: Editor, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.ORGANISATION_SETTINGS, component: OrgaSettings, userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.ORGANISATIONS, component: Organisations, userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.ORGANISATIONS, component: Organisations, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.HOME, component: ChallengePage, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { key: "challenge", path: ROUTES.CHALLENGE, component: ChallengePage, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_ACTIVITIES, component: ChallengeActivities, userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_ACTIVITY_CREATION, component: ChallengeActivityEdition, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_ACTIVITY_EDITION, component: ChallengeActivityEdition, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_CONFIGURATION, component: ChallengeConfigurationPage, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_SETTINGS, component: Settings, userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_ICEBREAKER, component: IcebreakerQuestionSets, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore

  { path: ROUTES.CHALLENGE_IDEASBOXES, component: IdeasBoxes, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_IDEASBOX_CREATION, component: IdeasBoxCreation, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_IDEASBOX,component: IdeasBox, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_IDEASBOX_EDITION,component: IdeasBoxEdition, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore

  { path: ROUTES.CHALLENGE_SURVEYS, component: Surveys, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_SURVEY_CREATION, component: SurveyCreation, userRoles: [USER_ROLES.ADMIN], organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_SURVEY_EDITION,component: SurveyEditions, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore

  { path: ROUTES.CHALLENGE_HIDDEN_QUESTION_SETS,component: HiddenQuestionSets, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_CALENDAR,component: Calendar, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_PHASE,component: QuestionSetsPage, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_RANKINGS,component: Rankings, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_QUESTION_SET_FORM,component: QuestionSetForm, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_QUESTIONSET_EDITOR,component: QuestionSetEditor, userRoles: [USER_ROLES.ADMIN],organisationRoles: [ORGA_ROLES.ADMIN]}, // prettier-ignore
  { key: "player",path: ROUTES.CHALLENGE_PLAYER, component: UserChallengePage,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_PLAYERS, component: UsersChallengePage,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_REFEREES, component: RefereesPage,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_TEAMS, component: ClubsChallengePage,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_TEAMS_SCORES, component: TeamsScores,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_TEAM, component: ClubChallengePage,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_TEAM_EDITION, component: TeamEdition,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_GAMES, component: GamesChallengePage,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_NOTIFICATIONS, component: NotificationsChallengePage,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_NOTIFICATIONS_PLAYERS, component: NotificationsFromPlayers,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_NOTIFICATIONS_HISTORY, component: NotificationsChallengePage,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_NOTIFICATION, component: NotificationsAnimationForm,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_NOTIFICATION_NEW, component: NotificationsAnimationForm,userRoles: [USER_ROLES.SUPER_ADMIN]}, // prettier-ignore
  { path: ROUTES.CHALLENGE_WHITELIST, component: Whitelist,userRoles: [USER_ROLES.ADMIN]}, // prettier-ignore
  // { path: ROUTES.CHALLENGE_LOTTERIES, component: NotificationsLotteriesPage, userRoles: [USER_ROLES.SUPER_ADMIN] }
]

export default routes
