module.exports = {
  HOME: "/",
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
  RESET_PASSWORD: "/reset-password",
  ORGANISATIONS: "/organisations",
  ORGANISATION: "/organisations/:organisationId",
  ORGANISATION_SETTINGS: "/organisations/:organisationId/settings",
  MODULES: "/organisations/:organisationId/modules",
  MODULE: "/organisations/:organisationId/modules/:moduleId",
  THEME: "/organisations/:organisationId/themes/:themeId",
  CHALLENGES: "/challenges",
  CHALLENGE: "/challenges/:challengeId",
  CHALLENGE_ACTIVITIES: "/challenges/:challengeId/activities",
  CHALLENGE_ACTIVITY_CREATION: "/challenges/:challengeId/activities/new",
  CHALLENGE_ACTIVITY_EDITION: "/challenges/:challengeId/activities/:activityId/edit",
  CHALLENGE_CONFIGURATION: "/challenges/:challengeId/configuration",
  CHALLENGE_SETTINGS: "/challenges/:challengeId/settings/:settingId",
  CHALLENGE_GAMES: "/challenges/:challengeId/games",
  CHALLENGE_LOTTERIES: "/challenges/:challengeId/lotteries",

  CHALLENGE_IDEASBOXES: "/challenges/:challengeId/ideas-boxes",
  CHALLENGE_IDEASBOX: "/challenges/:challengeId/ideas-boxes/:ideasBoxId",
  CHALLENGE_IDEASBOX_EDITION: "/challenges/:challengeId/ideas-boxes/:ideasBoxId/edition",
  CHALLENGE_IDEASBOX_CREATION: "/challenges/:challengeId/ideas-boxes/new",

  CHALLENGE_SURVEYS: "/challenges/:challengeId/surveys",
  CHALLENGE_SURVEY: "/challenges/:challengeId/surveys/:surveyId",
  CHALLENGE_SURVEY_EDITION: "/challenges/:challengeId/surveys/:surveyId/edition",
  CHALLENGE_SURVEY_CREATION: "/challenges/:challengeId/surveys/new",

  CHALLENGE_ICEBREAKER: "/challenges/:challengeId/icebreaker",
  CHALLENGE_NOTIFICATIONS: "/challenges/:challengeId/notifications",
  CHALLENGE_NOTIFICATIONS_PLAYERS: "/challenges/:challengeId/notifications/players",
  CHALLENGE_NOTIFICATIONS_HISTORY: "/challenges/:challengeId/notifications?filter=history",
  CHALLENGE_NOTIFICATION_NEW: "/challenges/:challengeId/notifications/new",
  CHALLENGE_NOTIFICATION: "/challenges/:challengeId/notifications/:notificationId",
  CHALLENGE_QUESTION_SET_FORM: "/challenges/:challengeId/questionSets/:questionSetId",
  CHALLENGE_HIDDEN_QUESTION_SETS: "/challenges/:challengeId/hiddenQuestionSets",
  CHALLENGE_QUESTIONSET_EDITOR: "/challenges/:challengeId/questionSets/:questionSetId/editor/",
  CHALLENGE_PHASE_QUESTIONSETS: "/challenges/:challengeId/phases/:phaseId",
  CHALLENGE_PHASE: "/challenges/:challengeId/phases/:phaseId",
  CHALLENGE_CALENDAR: "/challenges/:challengeId/phases",
  CHALLENGE_PLAYER: "/challenges/:challengeId/players/:playerId",
  CHALLENGE_PLAYERS: "/challenges/:challengeId/players",
  CHALLENGE_REFEREES: "/challenges/:challengeId/referees",
  CHALLENGE_RANKINGS: "/challenges/:challengeId/rankings",
  CHALLENGE_TEAM: "/challenges/:challengeId/teams/:teamId",
  CHALLENGE_TEAM_EDITION: "/challenges/:challengeId/teams/:teamId/edition",
  CHALLENGE_TEAMS: "/challenges/:challengeId/teams",
  CHALLENGE_TEAMS_SCORES: "/challenges/:challengeId/teams-scores",
  CHALLENGE_WHITELIST: "/challenges/:challengeId/whitelist",
  QUESTIONSETS: "/questionSets",
  QUESTIONS: "/questions",
  CLUBS: "/clubs",
  TRIBES: "/tribes",
  STATS: "/stats",
  USERS: "/users",
  USER: "/users/:userId",
  ACCOUNT: "/account",
  ADMIN: "/admin",
  PASSWORD_FORGET: "/pw-forget",
  ADMIN_DETAILS: "/admin/:id",
}