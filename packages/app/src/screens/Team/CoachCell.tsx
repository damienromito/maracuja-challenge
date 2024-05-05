import { IonModal } from "@ionic/react"
import { Button, Title1, Text1, Icon } from "@maracuja/shared/components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React, { useState } from "react"
import styled from "styled-components"
import { Modal, PlayerListItem, UserIcon } from "../../components"
import { useApp } from "../../contexts"
import { getMailToLink } from "../../utils/helpers"

export default () => {
  const { currentChallenge, currentPlayer, currentTeam } = useCurrentChallenge()
  const [openPopup, setOpenPopup] = useState(null)
  const [coach, setCoach] = useState(null)
  const { setLoading, logEvent } = useApp()

  const handleGetContactCoach = async () => {
    // recupere lemail
    logEvent("contact coach - open")
    setLoading(true)
    const object = await currentChallenge.getCoachContact()
    setCoach(object)
    setLoading(false)
    setOpenPopup(true)
  }

  const handleMailtoCoach = () => {
    const playername = currentPlayer.firstName || currentPlayer.username
    const lbreak = "%0d%0a"
    const introMessage = "J'ai une question..."
    const mailto = getMailToLink({
      email: coach.email,
      cc: "bonjour@maracuja.ac",
      subject: `[${currentChallenge.name}] - Message du joueur ${playername} de l'équipe ${currentTeam.name}`,
      body: `Hello coach ${coach.firstName},${lbreak}` + `${introMessage} ${lbreak}`,
    })
    logEvent("contact coach - send")

    window.open(mailto, "_blank")
  }

  return (
    <>
      <PlayerListItem
        key="coach"
        playerIcon={<CoachIcon name="coach" />}
        title={currentChallenge.coach.firstName}
        titleDetail="Coach"
        subTitle={<p>Une question ? un conseil ?</p>}
        rightContent={
          <Button onClick={handleGetContactCoach}>
            <Icon name="contact" color="white" />
          </Button>
        }
      />
      {!!coach && (
        <Modal
          isOpen={!!coach}
          onClose={() => {
            setCoach(null)
          }}
          title={`Pose ta question au coach ${coach.firstName} !`}
          validTextButton="Message"
          closeButton
          validActionButton={handleMailtoCoach}
        >
          <Text1>{currentChallenge.coach.bio}</Text1>
        </Modal>
      )}
    </>
  )
}

const CoachIcon = styled(UserIcon)`
  svg {
    fill: ${(props) => props.theme.icon.primary};
  }
`
