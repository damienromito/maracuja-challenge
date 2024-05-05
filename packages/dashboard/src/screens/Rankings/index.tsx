import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Ranking } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { Rankings } from "../../components"

const RankingsPage = () => {
  const { currentPhase, currentChallenge } = useCurrentChallenge()

  const [rankings, setRankings] = useState<any>([])
  const [selectedPhase, setSelectedPhase] = useState<any>(null)

  useEffect(() => {
    if (currentPhase) {
      setSelectedPhase(currentPhase)
    }
  }, [currentPhase])

  useEffect(() => {
    if (selectedPhase) {
      loadRanking()
    }
  }, [selectedPhase])

  const loadRanking = async () => {
    const rankingsArray = await Ranking.fetchAll({
      challengeId: currentChallenge.id,
      phaseId: selectedPhase.id,
      // displayMaracujaTeam: currentChallenge.ranking.displayMaracujaTeam,
    })
    setRankings(rankingsArray)
  }

  return (
    currentChallenge && (
      <div>
        <h3> Classements</h3>

        <ul className="tabs">
          {currentChallenge.phases &&
            currentChallenge.phases.map((phase) => {
              return (
                <li
                  key={phase.id}
                  className="tab "
                  onClick={() => {
                    setRankings(null)
                    setSelectedPhase(phase)
                  }}
                >
                  <a className={phase === selectedPhase ? "active red lighten-5" : ""}>{phase.name} </a>
                </li>
              )
            })}
        </ul>

        {rankings && selectedPhase && (
          <Rankings
            rankings={rankings}
            rankingFilters={selectedPhase.rankingFilters}
            audienceFilters={currentChallenge.audience.filters}
          />
        )}
      </div>
    )
  )
}

export default RankingsPage
