/*
 * SHARED CONTEXT
 */

import { objectSubset } from "@maracuja/shared/helpers"
import moment from "moment"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuthUser, useCurrentOrganisation } from ".."
import { ACTIVITY_TYPES } from "../../constants"
import { currentDate } from "../../helpers"
import { useInterval } from "../../hooks"
import { Challenge, Phase, Player, QuestionSet, Ranking, Team } from "../../models"
import useObjectListener from "../useObjectListener"
import {
  getNeareastQuestionSet as getNeareastQuestionSet_,
  getNextQuestionSet as getNextQuestionSet_,
  getPreviousQuestionSet as getPreviousQuestionSet_,
  initQuestionSets,
} from "./questionSets"

const ChallengeContextProvider = (props: any) => {
  const { authUser } = useAuthUser()
  const { currentOrganisation, setCurrentOrganisationById } = useCurrentOrganisation()

  const {
    object: currentPlayer,
    clear: clearPlayer,
    init: initPlayer,
    loading: playerLoading,
    error: playerError,
  } = useObjectListener()
  const {
    object: currentChallenge,
    clear: clearChallenge,
    init: initChallenge,
    error: challengeError,
  } = useObjectListener()
  const { object: currentTeam, clear: clearTeam, init: initTeam, error: teamError } = useObjectListener()
  const { object: currentRanking, clear: clearRanking, init: initRanking } = useObjectListener()

  const [currentChallengeLoading, setCurrentChallengeLoading] = useState<any>(true)
  const [currentQuestionSets, setCurrentQuestionSets] = useState<any>(undefined)
  const [currentPhase, setCurrentPhase] = useState<any>(undefined)
  const [currentQuestionSet, setCurrentQuestionSet] = useState<any>(undefined)
  const [currentActivities, setCurrentActivities] = useState<any>(undefined)
  const [currentDebriefingContest, setCurrentDebriefingContest] = useState<any>()
  const [currentScoreType, setCurrentScoreType] = useState<any>()

  useEffect(() => {
    const savedChallengeId = localStorage.getItem("challengeId")
    if (savedChallengeId) {
      setCurrentChallengeById(savedChallengeId)
    } else {
      setCurrentChallengeLoading(false)
    }
  }, [])

  useEffect(() => {
    if (challengeError) {
      setCurrentChallengeLoading(false)
    }
  }, [challengeError])

  useEffect(() => {
    if (playerError) {
      clearTeam()
      clearRanking()
      alert("Erreur: Vous avez été désinscrit.e du challenge, si besoin, contactez nous à admin@maracuja.ac")
      setCurrentChallengeById(null)
      window.location.href = "/"
    }
  }, [playerError])

  useEffect(() => {
    if (teamError) {
      clearPlayer()
      clearRanking()
      alert("Erreur: Votre équipe n'existe plus, si besoin, contactez nous à admin@maracuja.ac")
      setCurrentChallengeById(null)
      window.location.href = "/"
    }
  }, [teamError])

  useEffect(() => {
    if (currentChallenge) {
      buildQuestionSets()
    }
  }, [currentPlayer, currentChallenge])

  useEffect(() => {
    if (currentChallenge && currentPlayer) {
      loadCurrentDebriefingContest()
    }
  }, [currentQuestionSet])

  useEffect(() => {
    if (currentChallenge) {
      const orgaId = currentChallenge.organisationsIds?.[0]
      if (!currentOrganisation || (orgaId && orgaId !== currentOrganisation.id)) {
        setCurrentOrganisationById(orgaId)
      }
      refreshCurrentChallenge()
      addChallengeToHistory(currentChallenge)
    }
  }, [currentChallenge])

  useEffect(() => {
    if (currentQuestionSets) {
      refreshCurrentChallenge()
      if (currentTeam) {
        setCurrentChallengeLoading(false)
      }
    }
  }, [currentQuestionSets])

  useEffect(() => {
    if (playerLoading) {
      setCurrentChallengeLoading(true)
    }
  }, [playerLoading])

  useEffect(() => {
    if (process.env.REACT_APP_TYPE === "app") {
      loadCurrentPlayerDocuments()
    } else if (currentChallenge) {
      setCurrentChallengeLoading(false)
    }
  }, [authUser, currentChallenge])

  const loadCurrentPlayerDocuments = () => {
    if (!currentChallenge || (currentPlayer && !authUser)) {
      clearTeam()
      clearPlayer()
      clearRanking()
    } else if (
      authUser?.challengeIds?.includes(currentChallenge.id) &&
      (!currentPlayer || currentPlayer.id !== authUser.id) &&
      !playerLoading
    ) {
      initPlayer(Player, { id: authUser.id, challengeId: currentChallenge.id })
    } else if (!playerLoading) {
      setCurrentChallengeLoading(false)
    }
  }

  useEffect(() => {
    if (currentChallenge && currentPlayer && (!currentTeam || currentPlayer.clubId !== currentTeam.id)) {
      initTeam(Team, {
        challengeId: currentChallenge.id,
        id: currentPlayer.clubId,
      })
      refreshCurrentChallenge()
    }
  }, [currentPlayer])

  useEffect(() => {
    if (currentChallenge && currentTeam) {
      if (currentPhase && (!currentRanking || currentRanking.phaseId !== currentPhase.id)) {
        initRanking(Ranking, {
          challengeId: currentChallenge.id,
          phase: currentPhase,
          team: currentTeam,
          displayMaracujaTeam: currentChallenge.ranking.displayMaracujaTeam,
        })
      } else {
        setCurrentChallengeLoading(false)
      }
    }
  }, [currentTeam, currentPhase])

  useEffect(() => {
    if (currentRanking) {
      setCurrentChallengeLoading(false)
    }
  }, [currentRanking])

  useInterval(() => {
    if (currentChallenge) {
      refreshCurrentChallenge()
    }
  }, 5000)

  // ACTIONS
  const setCurrentChallengeById = (cId) => {
    if (cId) {
      setCurrentChallengeLoading(true)
      localStorage.setItem("challengeId", cId)
      initChallenge(Challenge, { id: cId })
    } else {
      localStorage.removeItem("hiddenSuggestions")
      setCurrentChallengeLoading(false)
      localStorage.removeItem("challengeId")
      clearChallenge()
    }
  }

  const refreshCurrentChallenge = () => {
    const now = currentDate()
    if (currentChallenge.phases) {
      const phase = currentChallenge.getCurrentPhase()
      if (!currentPhase || phase?.id !== currentPhase?.id) {
        setCurrentPhase(phase)
      }
    }

    if (currentChallenge.activities && currentPlayer) {
      const activities = currentChallenge.activities.filter((a) => a.startDate < now && a.endDate > now)

      const availableActivities = []
      for (const activity of activities) {
        if (activity.authorizedTeams?.length > 0 && !activity.authorizedTeams.includes(currentPlayer.club.id)) {
          continue
        }

        switch (activity.type) {
          case ACTIVITY_TYPES.LOTTERY:
            if (currentChallenge.lotteriesEnabled && currentPlayer) {
              const playerActivityCount =
                currentPlayer?.scores?.[activity.phaseId]?.lotteries?.[activity.id]?._stats.count
              if (!playerActivityCount) availableActivities.push(activity)
            }
            break
          // case ACTIVITY_TYPES.SURVEY:
          //   if (currentChallenge.surveysEnabled) {
          //     availableActivities.push(activity)
          //   }
          //   break
          case ACTIVITY_TYPES.EXTERNAL:
            if (currentChallenge.externalActivitiesEnabled) {
              availableActivities.push(activity)
            }

          default:
            break
        }
      }

      if (availableActivities?.[0]?.id !== currentActivities?.[0]?.id) {
        setCurrentActivities(availableActivities)
      }
    }

    if (currentQuestionSets) {
      const questionSets = currentQuestionSets
        .filter((qs) => qs.startDate < now && qs.endDate > now && qs.questionCount > 0)
        .sort((a, b) => !a.hasPlayed && b.startDate - a.startDate)
      const questionSet = questionSets?.[0]
      if (questionSet) {
        // if (!currentQuestionSet || questionSet.id !== currentQuestionSet.id || questionSet._stats?.lastParticipationAt !== currentQuestionSet._stats?.lastParticipationAt) {
        setCurrentQuestionSet(questionSet)
        // }
      } else {
        if (currentQuestionSet) {
          setCurrentQuestionSet(null)
        }
        loadCurrentDebriefingContest()
      }
    }
  }

  const buildQuestionSets = () => {
    const questionSetsData = initQuestionSets({
      playerQuestionSets: currentPlayer?.questionSets,
      challengeQuestionSets: currentChallenge?.questionSets,
      clubId: currentPlayer?.club.id,
    })
    setCurrentQuestionSets(questionSetsData)
  }

  useEffect(() => {
    let currentType = currentQuestionSet?.type
    if (!currentType) {
      currentType = getNeareastQuestionSet().type
    }
    setCurrentScoreType(currentType)
  })

  const loadCurrentDebriefingContest = () => {
    let contestToDebrief

    // CURRENTEQUESTIONSET
    if (
      currentQuestionSet?.type === ACTIVITY_TYPES.CONTEST &&
      (currentChallenge.debriefing?.enabledDuringContest || currentQuestionSet.endDate < new Date())
    ) {
      contestToDebrief = currentQuestionSet
    } else {
      const previousContest = getPreviousQuestionSet()
      if (previousContest?.type === ACTIVITY_TYPES.CONTEST && !previousContest.debriefingDisabled) {
        contestToDebrief = previousContest
      } else {
        setCurrentDebriefingContest(null)
        return
      }
    }

    const nextQuestionSet = getNextQuestionSet()
    const debriefingLimit = moment(currentChallenge.endDate).add(7, "days")
    const endDate = nextQuestionSet?.startDate || debriefingLimit
    if (endDate < new Date()) {
      setCurrentDebriefingContest(null)
      return
    }
    contestToDebrief.debriefingEndDate = endDate
    setCurrentDebriefingContest(contestToDebrief)
  }

  const getNextQuestionSet = (type) => {
    return getNextQuestionSet_({ questionSets: currentQuestionSets, type })
  }
  const getPreviousQuestionSet = () => {
    return getPreviousQuestionSet_({ questionSets: currentQuestionSets })
  }
  const getNeareastQuestionSet = () => {
    return getNeareastQuestionSet_({ questionSets: currentQuestionSets })
  }

  const addChallengeToHistory = (challenge) => {
    // localStorage.removeItem('challengesHistory')
    let challengesHistory = JSON.parse(localStorage.getItem("challengesHistory")) || []

    if (challengesHistory.length) {
      // REMOVE IF EXISTS
      const challengeIndex = challengesHistory.findIndex((c) => c.id === challenge.id)
      if (challengeIndex >= 0) {
        challengesHistory.splice(challengeIndex, 1)
      }
      // LIMIT HISTORY TO 5 ITEMS
      if (challengesHistory.length > 1) {
        challengesHistory = challengesHistory.slice(0, 5)
      }
    }
    challengesHistory.unshift(objectSubset(challenge, ["id", "name", "image", "code"]))
    localStorage.setItem("challengesHistory", JSON.stringify(challengesHistory))
  }

  const getChallengesHistory = (displayCurrentChallenge) => {
    const challenges = JSON.parse(localStorage.getItem("challengesHistory")) || []
    // !displayCurrentChallenge && challenges.length && challenges.splice(0, 1)
    return challenges
  }

  return (
    <ChallengeContext.Provider
      value={{
        currentActivities,
        currentChallenge,
        currentChallengeLoading,
        currentDebriefingContest,
        currentPhase,
        currentPlayer,
        currentQuestionSet,
        currentQuestionSets,
        currentRanking,
        currentScoreType,
        currentTeam,
        getChallengesHistory,
        getNextQuestionSet,
        getPreviousQuestionSet,
        refreshCurrentChallenge,
        setCurrentChallengeById,
      }}
    >
      {props.children}
    </ChallengeContext.Provider>
  )
}
const ChallengeContext = createContext<any>(null)

interface ChallengeContextInterface {
  currentActivities: any
  currentChallenge: any //Challenge
  currentChallengeLoading: boolean
  currentDebriefingContest: any
  currentPhase: any //Phase
  currentPlayer: any //Player
  currentQuestionSet: any //QuestionSet
  currentQuestionSets: any //Array<QuestionSet>
  currentRanking: any
  currentScoreType: string
  currentTeam: any //Team
  getChallengesHistory: any
  getNextQuestionSet: any
  getPreviousQuestionSet: any
  refreshCurrentChallenge: any
  setCurrentChallengeById: any
}

const useCurrentChallenge = (): ChallengeContextInterface => useContext(ChallengeContext)

export { ChallengeContext, useCurrentChallenge, ChallengeContextProvider }
