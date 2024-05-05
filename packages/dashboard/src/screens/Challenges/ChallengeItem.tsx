import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React, { useEffect, useState } from "react"
import moment from "moment"

import { useHistory } from "react-router-dom"
import { Button, Col, List, Row, Tag } from "antd"
import { ChallengeSettings } from "@maracuja/shared/models"

const ChallengeItem = ({ item }) => {
  const { setCurrentChallengeById } = useCurrentChallenge()
  const [stats, setStats] = useState(undefined)
  const history = useHistory()

  useEffect(() => {
    const unsub = loadChallengeStats()
    return () => {
      unsub()
    }
  }, [])

  const loadChallengeStats = () => {
    return ChallengeSettings.fetch(
      { id: "stats", challengeId: item.id },
      {
        listener: (statsData) => {
          setStats(statsData)
        },
      }
    )
  }

  const handleSelectChallenge = () => {
    setCurrentChallengeById(item.id)
    history.push(`/challenges/${item.id}/`)
  }

  return (
    <List.Item>
      <Row gutter={16} style={{ width: "100%" }}>
        <Col sm={24} md={12} lg={4} style={{ textAlign: "center" }}>
          {item.image && <img src={item.image} style={{ width: 100 }} />}
          {item.startDate > new Date() ? (
            <Tag color="cyan">Ouverture le {moment(item.startDate).format("ddd D MMM")} </Tag>
          ) : (
            item.endDate > new Date() && <Tag color="green">En cours</Tag>
          )}
        </Col>
        <Col sm={24} md={12} lg={10}>
          <p>
            <strong>{item.name}</strong>
          </p>
          <p>
            {moment(item.startDate).format("ddd D MMM")} - {moment(item.endDate).format("ddd D MMM")}
          </p>
          {item.scenarioType === "trainingAction" && (
            // <h5>{item.trainingActions.label || 'Formation'} du {moment(item.trainingActions.dates?.[0]).format('ddd D MMM')} - {moment(item.trainingActions.dates?.slice(-1)[0]).format('ddd D MMM')}</h5>}
            <p>
              {item.trainingActions.label || "Formation"} du{" "}
              {moment(item.trainingActions.dates?.[0]).format("ddd D MMM")}
            </p>
          )}
          <p>
            {item.editionName || ""} Code : {item.code}
          </p>
        </Col>
        <Col sm={24} md={12} lg={6}>
          <Tag>
            <p>{stats?.playerCount || 0} joueurs</p>
            <p>📊 {stats?.playersEngagement ? Math.round(stats?.playersEngagement * 100) : 0}% engagement</p>
            <p>💪 {stats?.trainingCount || 0} entrainements </p>
            <p>⭐️ {stats?.contestCount || 0} épreuves </p>
          </Tag>
        </Col>
        <Col sm={24} md={12} lg={4}>
          <Button onClick={handleSelectChallenge}>Gérer le challenge</Button>
        </Col>
      </Row>
    </List.Item>
  )
}

export default ChallengeItem
