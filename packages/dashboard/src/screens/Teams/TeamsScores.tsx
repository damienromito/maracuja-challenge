import { MARACUJA_TEAM_ID } from "@maracuja/shared/constants"
import { Team } from "@maracuja/shared/models"
import { Avatar, Button, Col, Row, Space } from "antd"
import React, { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import TeamPlayersScoresTable from "./TeamPlayersScoresTable"
import { useCurrentChallenge } from "@maracuja/shared/contexts"

export default () => {
  const match = useRouteMatch<any>()
  const { currentChallenge } = useCurrentChallenge()
  const [teams, setTeams] = useState<any>()

  useEffect(() => {
    const unsubscribe = loadTeams()
    return () => {
      unsubscribe()
    }
  }, [])

  const loadTeams = () => {
    return Team.fetchAll(
      { challengeId: match.params.challengeId },
      {
        refHook: (ref) => ref.limit(14),
        listener: (objects) => {
          setTeams(objects)
        },
      }
    )
  }

  return !teams ? null : (
    <Row gutter={8}>
      {teams.map((team, index) => {
        if (!currentChallenge.ranking?.displayMaracujaTeam && team.id === MARACUJA_TEAM_ID) return null

        return (
          <Col key={"team" + index} lg={12} sm={24}>
            <Space>
              <Avatar size={40} src={team.logo?.getUrl(100)} />
              <Button type="link" href={`/challenges/${match.params.challengeId}/teams/${team.id}`}>
                <strong>{team.name}</strong>
              </Button>
            </Space>
            <br />
            <br />
            <TeamPlayersScoresTable team={team} />
          </Col>
        )
      })}
    </Row>
  )
}
