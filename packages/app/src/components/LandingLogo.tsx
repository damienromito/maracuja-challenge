import { Text3, Text4, Title1 } from '@maracuja/shared/components'
import { useCurrentOrganisation } from '@maracuja/shared/contexts'
import React from 'react'
import { useApp, useDevice } from '../contexts'
import { styled, color, helpers } from '../styles'
import LogoChallenge from './LogoChallenge'
import LogoMaracuja from './LogoMaracuja'
import Text2 from './Text2'

// import { IoIosArrowForward } from "react-icons/io";

const Container = styled.div`
  text-align : center;
  justify-content: space-around;
  #logo{
    display:block;
    width: 43vw;
    max-width: 190px;
    margin: 10px auto 10px auto;
    .logo-maracuja{
      position: relative;
      z-index:1;
    }
    .logo-challenge{
      position: relative;
      z-index:0;
      margin-top:-10px;
    }

    &.orga{
      margin-bottom: 0;
      /* margin-top: 40px; */
      max-width: 156px;
      .logo-challenge{
        margin-top:0px;
      }
    }
  }
`

export default (props) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { appOrganisationId } = useDevice()
  return (
    <Container className='landing-logo' {...props}>

      {appOrganisationId
        ? currentOrganisation && (
          <>
            <div id='logo' className='orga'>
              <Title1>{currentOrganisation.logoName}</Title1>
              <LogoChallenge />
            </div>
            <Text4>{currentOrganisation.logoTagline}</Text4>
          </>
          )
        : (
          <>
            <div id='logo'>
              <LogoMaracuja />
              <LogoChallenge />
            </div>
            <Text2>Cultivons l'esprit d'équipe !</Text2>

          </>)}
    </Container>
  )
}
