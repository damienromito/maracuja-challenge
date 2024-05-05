import { IonModal, useIonToast } from "@ionic/react"
import { Button, Text2, Title1, Title3 } from "@maracuja/shared/components"
import { Member } from "@maracuja/shared/models"
import React, { useState } from "react"
import styled from "styled-components"
import { Container, Text1 } from "../../components"
import { useApp, useCurrentChallenge, useCurrentOrganisation } from "../../contexts"
import { getMailToLink } from "../../utils/helpers"
import MemberCell from "./MemberCell"
import RecruitButton from "./RecruitButton"

/// ////////////////// HEADER

export default ({ team }) => {
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const { setLoading, logEvent } = useApp()

  const [memberToRecruit, setMemberToRecruit] = useState(null)
  const [present] = useIonToast()

  const handleClickOpenRecruitMember = async ({ member }) => {
    // recupere lemail
    if (currentChallenge.recruitment.email) {
      setLoading(true)
      logEvent("recruit member - open")
      const memberContact = await Member.getContact({
        challengeId: currentChallenge.id,
        memberId: member.id,
      })
      const memberEmail = memberContact.email
      if (memberEmail) {
        member.email = memberEmail
      }
      setLoading(false)
    }
    setMemberToRecruit(member)
  }

  const handleClickCloseRecruitMember = () => {
    setMemberToRecruit(null)
  }
  const handleClickContactMemberByEmail = (member) => {
    const lbreak = "%0d%0a"

    const introMessage = `C'est ${currentPlayer.firstName || currentPlayer.username}, ton ${
      currentChallenge.recruitment.onlyForCaptain ? currentChallenge.wording.captain : "coéquipier"
    } ${currentChallenge.recruitment.emailBody}`
    const mailto = getMailToLink({
      email: member.email,
      subject: currentChallenge.recruitment.emailSubject,
      body:
        `Hello ${member.firstName},${lbreak}` +
        `${introMessage} ${lbreak}` +
        `Télécharge l'app : ${currentChallenge.dynamicLink?.link}`,
    })
    logEvent("recruit member - send")
    window.open(mailto, "_blank")
    setMemberToRecruit(null)
  }

  return (
    <>
      <Container>
        <Title3 style={{ textAlign: "left" }}>Joueurs à recruter :</Title3>
      </Container>

      {team.members.map((member, index) => {
        return (
          <MemberCell
            key={index}
            member={member}
            onClickOpenRecruitMember={handleClickOpenRecruitMember}
            // style={{ height: "100%", width: "100%" }}
          />
        )
      })}

      {memberToRecruit && (
        <IonModal isOpen={memberToRecruit}>
          <PopupInvitMember>
            <div className="message">
              <Container>
                <div
                  onClick={handleClickCloseRecruitMember}
                  className="icon icon-close"
                  style={{
                    textAlign: "right",
                    color: "black",
                    fontSize: "20px",
                  }}
                />
                <Title1>Recruter {memberToRecruit.firstName}</Title1>
                {memberToRecruit.email ? (
                  <>
                    {currentChallenge.recruitment.onlyForCaptain ? (
                      <Text1>
                        En tant que {currentChallenge.wording.captain}, tu peux recruter directement les joueurs qui ne
                        sont pas encore inscrits ! 🔥
                      </Text1>
                    ) : (
                      <Text1>Tu peux recruter directement les joueurs qui ne sont pas encore inscrits ! 🔥</Text1>
                    )}
                    <br />
                    <Button onClick={() => handleClickContactMemberByEmail(memberToRecruit)}>Envoyer un message</Button>
                  </>
                ) : (
                  <>
                    <Text1>Envoie un message à ce joueur pour faire grossir ton équipe 🔥</Text1>
                    <Text2> Voici ton lien d'invitation :</Text2>
                    <input
                      className="lightBg"
                      onClick={(e) => {
                        const target = e.target as HTMLTextAreaElement

                        target.select()
                        document.execCommand("copy")
                        present("Lien copié !", 3000)
                      }}
                      defaultValue={
                        currentChallenge.dynamicLink?.link || `https://${currentOrganisation?.dynamicLinkHost}/join`
                      }
                    />{" "}
                    <br />
                    <RecruitButton onClickCloseRecruitMember={handleClickCloseRecruitMember} member={memberToRecruit} />
                  </>
                )}
              </Container>
            </div>
          </PopupInvitMember>
        </IonModal>
      )}
    </>
  )
}

const PopupInvitMember = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
  z-index: 1;

  .message {
    position: relative;
    width: 358px;
    background: #ffffff;
    border-radius: 13px;
    font-family: "Open Sans";
    color: #000000;
    margin-top: 15px;
    padding: 8px;
    h1 {
      font-weight: bold;
      font-size: 18px;
      line-height: 20px;
    }
    p {
      font-family: "Open Sans";
      font-size: 19px;
      line-height: 26px;
    }
  }
`
