import React from "react"
import styled from "styled-components"
import { Button, FullScreenContainer, NavBar, Title3 } from "../../components"
import ROUTES from "../../constants/routes"
import { useAuthUser } from "../../contexts"
import PlaceholderClubAvatar from "@maracuja/shared/images/placeholders/placeholder-club-avatar.png"

const RestrictedContainer = styled(FullScreenContainer)`
  img {
    align-self: center;
    border-radius: 100px;
    height: 25vh;
    width: 25vh;
  }
`
const Notice = styled.div`
  background: ${(props) => props.theme.secondary};
  color: white;
  margin: 10px 0;
  padding: 10px;
`

const Restricted = ({ history, location, currentChallenge }) => {
  const { onSignOut } = useAuthUser()
  const club = location.state.club

  const onClickOk = () => {
    onSignOut().then(() => {
      history.push(ROUTES.HOME)
    })
  }

  return (
    <>
      <NavBar leftIcon="back" leftAction={() => history.goBack()} />
      <RestrictedContainer>
        <img src={club.image ? club.image : PlaceholderClubAvatar} />
        <br />
        <br />
        <Title3>{club.name}</Title3>
        <br />
        <br />
        <Notice>
          ℹ {currentChallenge.restricted.label} Ton {currentChallenge.wording.tribe} n’est malheureusement pas concerné.
        </Notice>
        <br />
        <br />
        <Button onClick={onClickOk}>Ok</Button>
      </RestrictedContainer>
    </>
  )
}

export default Restricted
