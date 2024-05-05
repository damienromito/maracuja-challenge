import { GENERATED_NOTIFICATION_TYPES } from "@maracuja/shared/constants"

export default {
  isTemplate: false,
  audience: {
    filters: {
      region: [],
      // tribe: [],
      crosCollectivity: [],
      department: [],
      sportFederation: [],
    },
    clubCellPropertyInBadge: "",
    searchPickerHelp: 'Écris "Girondins" pour "Girondins de Bordeaux" et/ou entre le code postal',
    leaguePickerClubProperty: "",
    whitelist: "none",
    whitelistMessage: "Ce challenge est réservé ; ton email te permettra de vérifier ton identité !",
    whitelistWithPhoneNumber: false,
    whitelistWithCaptains: false,
    whitelistWithTeams: true,
  },
  calendar: {
    spreadsheetUrl: "",
  },
  cguLink: "https://www.maracuja-academy.com/cgu",
  checkLicense: false,
  captainCanMotivate: false,
  captains: {
    maxPerTeam: 1,
  },
  coachEnabled: false,
  coach: {
    firstName: "",
    lastName: "",
    userId: "",
    bio: "Pascaline est ton chef d’orchestre pour la formation SST.",
  },
  colors: {
    primary: "#2C29AB",
    secondary: "#F37B21",
  },
  code: "NOCODE",
  description: "",
  debriefing: {
    enabledDuringContest: false,
  },
  emails: {
    mailingListEnabled: false,
    optinMandatory: false,
  },
  endDate: new Date(),
  faq: "",
  scenarioType: false,
  trainingActions: {
    dates: [],
    label: "Formation",
    name: "Accompagnement au changement",
  },
  googleSpreadSheetId: "",
  hidden: false,
  highlighted: false,
  image: "",
  modules: {},
  name: "Nom du challenge",
  editionName: "",
  notifications: {
    generated: {
      [GENERATED_NOTIFICATION_TYPES.START]: { delay: 0 },
      [GENERATED_NOTIFICATION_TYPES.WAKE_UP]: { delay: -2 },
      [GENERATED_NOTIFICATION_TYPES.DEBRIEFING]: { delay: 0 },
      [GENERATED_NOTIFICATION_TYPES.CAPTAIN]: { delay: 7 },
    },
  },
  periodString: "A venir",
  playerInfos: {
    birthday: false,
  },
  sharingEnabled: false,
  sharing: {
    intro: "Il manque des joueurs de ton équipe ?",
    title: "Invite un.e joueur.se de l'équipe !",
    description: "Il manque des joueurs dans l’équipe ?! Invite-les pour défendre les couleurs de ton équipe !",
    buttonText: "Inviter un.e joueur.se",
    captain: {
      title: "Invite ton capitaine!",
      description:
        "Ton capitaine n’est pas inscris alors qu’il est indispensable pour motiver ton équipe pendant le challenge. Envoie-lui une invitation ! 💪 En plus, il a des supers pouvoirs dans l’application; ça serait dommage de s’en priver",
    },
  },
  dynamicLink: {
    image: "",
    title: "Rejoins-moi sur le challenge !",
    info: "",
    message: "Salut ! Rejoins-moi pour participer au nouveau challenge Maracuja ! 🔥",
  },
  dynamicLinkReferral: {
    image: "",
    title: "Rejoins-moi sur le challenge !",
    message: "Salut ! Rejoins-moi pour participer au nouveau challenge Maracuja ! 🔥",
  },
  playersAvatarWithoutBackground: false,
  playersAvatarInOnboarding: false,
  privacyLink: "",
  quiz: {
    displayAMaxOfChoices: false,
    questionsHaveNegativeVersion: false,
  },
  requiredAppBuild: {
    appFlow: 0,
    ios: 0,
    android: 0,
  },
  optins: [],
  optinRoles: [
    { label: "licencié", value: "licensee" },
    { label: "captain", value: "CAPTAIN" },
  ],
  rules: "Joue tous les jours pour faire grimper ton équipe au classement !",
  sheetId: "0",
  showCaptainMotivationExample: true,
  signUpMethods: [],
  startDate: new Date(),
  theme: "default",
  topPlayers: { members: 0, referees: 0 },
  topPlayersEnabled: false,
  verifyEmail: false,
  ranking: {
    displayActivities: false,
    displayMaracujaTeam: false,
  },
  team: {
    displayColorLogo: false,
    displayOnlyCurrentWeek: false,
  },
  icebreakerEnabled: false,
  icebreaker: {
    title: "Découvre tes coéquipiers !",
    description: "Un icebreaker entre joueurs de le même équipe : 2 vérités 1 mensonge ! 🤪",
  },
  ideasBoxesEnabled: false,

  lotteriesEnabled: false,
  lotteriesInfo: {
    title: "La lotery",
    description: "Tu as réalisé le quiz du jour, tu peux maintenant participer à la loterie !",
    rulesUrl: "",
  },
  nextChallenge: undefined,
  surveysEnabled: false,
  externalActivitiesEnabled: false,
  onboarding: {
    joinPopup: {
      buttonDescriptionText: "",
      buttonText: "S'inscrire au challenge",
    },
    needCaptain: false,
    playerCountMinimum: 0,
    subscriptionSms: {
      message: "Avant ta formation XXX, abordes-en le sujet avec les autres apprenants dès maintenant !",
      messageRetry:
        "ta formation XXX commence bientot, rejoins les autres apprenants qui découvrent déjà le sujet de la formation !",
    },
    subscriptionEmail: {
      title: "Ton équipe t'attend !",
      titleRetry: "les autres apprenants s'entrainent déjà ! 🔥",
      introduction:
        "dans le cadre de ta prochaine formation du XXX, tu vas pouvoir vivre une véritable expérience d'apprentissage digitale en équipe !",
      description:
        '😍 Découvre tes co-équipiers parmi les autres apprenants <br/>📝 Entraine-toi et apprends-en plus sur la formation "XXX"<br/>🏆 Fais monter ton équipe au classement grâce aux épreuves pédagogiques',
      planning:
        "➡️ XXX au XXX : Découvre l'application et tes coéquipiers<br/> ➡️ XXX au XXX : Des épreuves pédagogiques pour se préparer en équipe<br/>➡️ XX/XX : Formation en présentiel  <br/>➡️ XX/XX au XX/XX : Dernière ligne droite avant le classement final<br/>",
    },
  },
  referralEnabled: false,
  referral: {
    onboarding: {
      joinPopup: {
        buttonDescriptionText: "Tu n'es pas membre d'un club",
        buttonText: "Entrer le code de parrainage",
      },
    },
    sharing: {
      choiceIntro: "Invite un.e ami.e pour vous aider à gagner !",
      choiceButton: "Un ami.e n’est pas licencié ?",
      inviteAReferee: "Parraine un joueur",
      title: "Parraine un.e ami.e !",
      intro: "Invite un.e ami.e pour vous aider à gagner !",
      description: "Invite un joueur du club pour participer au challenge.",
      buttonText: "Parrainer un.e ami.e",
    },
  },
  recruitment: {
    email: false,
    emailSubject: "Rejoins l’équipe pour la formation 4x Sécurité",
    emailBody:
      " pour la formation 4x Sécurité qui va bientôt avoir lieu. 🔥 C’est une expérience d’apprentissage ludique en équipe 💪  Voici le lien pour télécharger l’application qui va nous préparer à cette formation. ",
    onlyForCaptain: false,
  },
  webAppEnabled: false,
  wording: {
    captain: "capitaine",
    captains: "capitaines",
    captainMotivationExample:
      'Suggestion : "Plus que 8 points avant de dépasser l’équipe suivante", "Invitez d\'autres joueurs"',
    firstTribes: "premiers équipes",
    theFirstTribe: "la premiere équipe",
    friends: "amis",
    inviteAPlayer: "Invite un joueur",
    ofTheTribe: "de l'équipe",
    player: "joueur",
    players: "joueurs",
    referee: "recrue",
    referees: "recrues",
    referer: "parrain",
    member: "licencié.e",
    members: "licenciés",
    quiz: "épreuve",
    quizzes: "épreuves",
    theTribe: "l'équipe",
    tribe: "équipe",
    tribes: "équipes",
    yourTribe: "ton équipe",
    zeroPointsMessage: "C'est pas terribe ça",
  },
}
