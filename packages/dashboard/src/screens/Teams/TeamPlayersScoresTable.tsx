import { QuestionSetIcon } from "@maracuja/shared/components"
import ROUTES from "../../constants/routes"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { Link, generatePath } from "react-router-dom"
import { Space, Table, Tooltip } from "antd"
import React, { useMemo } from "react"
import styled from "styled-components"
import { PLAYER_ROLES, USER_ROLES } from "@maracuja/shared/constants"
import Avatar from "antd/lib/avatar/avatar"
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons"

export default ({ team }) => {
  const { currentQuestionSets, currentPhase, currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  const questionSets =
    currentQuestionSets?.filter(
      (qs) => !qs.audienceRestricted && qs.phase.id === (currentPhase || currentChallenge.getPreviousPhase())?.id
    ) || []
  const dataSource = useMemo(() => {
    const playersData = team
      ?.sortedPlayers({
        currentPhaseId: currentPhase?.id ?? currentChallenge.getLastPhase()?.id,
      })
      .map((player) => {
        if (!player.id) return null

        const linkPath = generatePath(ROUTES.CHALLENGE_PLAYER, {
          challengeId: team.challengeId,
          playerId: player.id,
        })
        return {
          key: player.id,
          username: (
            <Space>
              <Avatar src={player.avatar?.getUrl("100")} icon={<UserOutlined />} />
              {!authUser.hasRole(USER_ROLES.SUPER_ADMIN) ? (
                player.username
              ) : (
                <Link to={linkPath}>{player.username}</Link>
              )}
              {player.hasRole(PLAYER_ROLES.CAPTAIN) && "✊"}
            </Space>
          ),
          scores: <PlayerQuestionSets questionSets={questionSets} playerQuestionSets={player.questionSets} />,
          engagment: <span>{Math.round((player.engagment?.total || 0) * 100)} %</span>,
        }
      })

    return playersData
  }, [team])

  const teamScore = currentChallenge.getCurrentScoreForTeam(team)
  const columns = [
    {
      title: `${team.playerCount || 0} Joueurs`,
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: `${teamScore} POINTS`,
      dataIndex: "scores",
      key: "scores",
    },
    {
      title: (
        <Tooltip title="Engagement = Nbr de quiz complétés / Nbr de quiz possibles">
          Engag. <InfoCircleOutlined />
        </Tooltip>
      ),
      dataIndex: "engagment",
      key: "engagment",
      width: 100,
    },
  ]

  return <Table dataSource={dataSource} columns={columns} pagination={false} />
}

const PlayerQuestionSets = ({ questionSets, playerQuestionSets }) => {
  return (
    <Wrapper>
      {questionSets.map((qs) => {
        const userQs = playerQuestionSets?.[qs.id]
        const playerQuestionSet = {
          ...objectSubset(qs, ["startDate", "type", "id"]), // enleve les proprieté liées au currentPlayer
          ...userQs,
        }
        return (
          <div title={qs.name} key={`qs-${qs.id}`}>
            <QuestionSetIcon questionSet={playerQuestionSet} style={{ width: 25, height: 25 }} />
          </div>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  .question-set-icon {
    margin-right: 0px;
    width: 25px;
    height: 25px;
  }
`
