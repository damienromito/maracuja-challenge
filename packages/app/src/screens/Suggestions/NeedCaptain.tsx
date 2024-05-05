import styled from "styled-components"
import { RegularLink, ShareButton, Text3 } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import captainImage from "../../images/captain.svg"
import Suggestion from "./Suggestion"

export default ({ onSuggestionHidden }) => {
  const { currentChallenge, refreshCurrentChallenge } = useCurrentChallenge()

  const handleHide = () => {
    onSuggestionHidden({ id: "needCaptain", showDefaultPopup: true })
    refreshCurrentChallenge() // pour cacher la suggestion
  }

  return (
    <Suggestion>
      <Title>Finalise l’inscription de ton club !</Title>
      <InfoContainer>
        <Text3 style={{ textAlign: "left", marginTop: 12 }}>
          Il manque un captain dans ton équipe. Invite-le et il pourra aider le club à gagner grâce à ses supers
          pouvoirs dans l’application !
        </Text3>
        <img style={{ flex: 1, marginRight: "auto", marginLeft: "auto" }} src={captainImage} />
      </InfoContainer>
      <ShareButton contentType="captain">INVITER TON {currentChallenge.wording.captain}</ShareButton>

      <RegularLink onClick={handleHide}>Ignorer</RegularLink>
    </Suggestion>
  )
}

const Title = styled.div`
  text-transform: uppercase;
  margin-top: 3px;
  font-family: Chelsea Market;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
`

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: start;
  color: ${(props) => props.theme.text.secondary};
  margin-right: 8px;
  text-align: left;
  img {
    max-width: 70px;
    margin: 20px;
  }
`
