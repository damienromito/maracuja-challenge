import React from 'react'
import { styled, color } from '../styles'

import logoSVG from '../images/logo-white.svg'

// &:before{
//   content: "\\79";
//   width: 20px;
//   height: 20px;
//   color: black;
//   position :relative;
//   font-family: "maracuja-icons";
//   font-size: 300%;
//   position: relative;
//   margin-top: -46px;
//   margin-right: 10px;
//   float: right;
// }
const LogoContainer = styled.div`
  display: inline-block;
  width:100%;
  /* height: 50px; */
  img{
    width: 100%;
  }
`

const LogoMaracuja = () => {
  return (
    <LogoContainer className='logo-maracuja'>
      <img src={logoSVG} />
    </LogoContainer>
  )
}

export default LogoMaracuja
