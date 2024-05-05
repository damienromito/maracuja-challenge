import React from 'react'
import { Preloader as _Preloader } from 'react-materialize'
import styled from 'styled-components'

const Preloader = styled(_Preloader)`
  position: fixed;
  top :0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 10000;
`

const Spinner = () => {
  return <Preloader active color='blue' flashing={false} size='big' />
}

export default Spinner
