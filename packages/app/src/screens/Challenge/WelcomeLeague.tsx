import React from 'react'
import styled from 'styled-components'
import {
  Button, Container, PartnersFooter, RadialContainer, Title1, Title2, Title3
} from '../../components'
import ROUTES from '../../constants/routes'
import { } from '../../contexts'

const WelcomeContainer = styled(RadialContainer)`

  .title h1{
    line-height: 40px;
  }

  button.back{
    color: black;
    float: right;
    cursor: pointer;
    text-align: center;
    position: relative;
    color: white;
    top: 0;
    margin: 0px 15px 0 0;
    font-size: 31px;
    padding: 0px 0 0 0;
    height: 50px;
    width: 45px;
  }
  
  .info{
    text-align:center;

    .image {
      max-width:300px;
      width:40vw;
      background:white;
      align-self: center;
      margin-bottom: 25px;
      padding : 5px;
      img{width:100%;}
    }
    h3{
      font-weight: normal;
      text-transform: uppercase;
      background: ${props => props.theme.bg.tertiary};
      width: min-content;
      margin: 6px auto 0px auto;
      padding: 0 12px;
      color:black;
    }
    h4{color : ${props => props.theme.bg.tertiary}}
  }
`

const WelcomeLeague = ({ history, location, currentChallenge }) => {
  const onClickSignUp = () => {
    history.push(ROUTES.SIGN_UP_CLUBPICKER, location.state)
  }

  return (
    <WelcomeContainer>
      <Container className='title'>
        <button className='back icon icon-back' onClick={() => history.goBack()} />
        <Title1>Que le challenge commence !</Title1>
      </Container>

      <Container className='info'>
        {location.state.league.image &&
          <div className='image'><img src={location.state.league.image} /></div>}
        <Title2 className='challenge-title'>{currentChallenge.name}</Title2>
        <Title3>{location.state.league.name}</Title3>
        {/* <Title4>{currentChallenge.periodString}</Title4> */}
        {/* {currentChallenge.state === 'end' &&
          <p style={{ textAlign: 'center' }}>Le challenge est terminé !</p>
        } */}
      </Container>

      <Container>
        <Button onClick={() => onClickSignUp()}>Rejoins ton {currentChallenge.wording.tribe || 'club'}</Button>
      </Container>
      {currentChallenge.partners &&
        <PartnersFooter partners={currentChallenge.partners} />}
    </WelcomeContainer>
  )
}

export default WelcomeLeague
