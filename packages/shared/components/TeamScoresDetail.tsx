import { Text1, Text2, Title1, Title4 } from "@maracuja/shared/components"
import { Activity } from "@maracuja/shared/models"
import React from "react"
import { useCurrentChallenge } from "../contexts"

export default ({ team, phase, isRankingScore = false }) => {
  const { currentChallenge } = useCurrentChallenge()
  const scores = team.scoresForPhase({ phaseId: phase?.id, isRankingScore })

  return (
    <>
      <Title4>{phase.name}</Title4>
      <Title1>{scores?._stats?.score || 0} POINTS</Title1>
      <Text2>---</Text2>
      {scores &&
        Object.keys(scores).map((collectionName) => {
          if (["_stats"].includes(collectionName)) return ""
          const activityTypeScores = scores[collectionName]

          const atScore = activityTypeScores._stats?.score
          if (!atScore) return ""
          return (
            <div key={collectionName} style={{ marginBottom: 15 }}>
              <Text1 style={{ fontWeight: "bold" }}>
                {Activity.getCollectionLabel(collectionName)} : {activityTypeScores._stats?.score || 0} POINTS
              </Text1>
              {Object.keys(activityTypeScores).map((id) => {
                if (id === "_stats") return ""
                const quiz = currentChallenge.getActivity({ collectionName, id })
                return quiz ? (
                  <Text1 key={id}>
                    {quiz.name} : +{activityTypeScores[id]._stats?.score || 0}
                  </Text1>
                ) : (
                  ""
                )
              })}
            </div>
          )
        })}
    </>
  )
}
