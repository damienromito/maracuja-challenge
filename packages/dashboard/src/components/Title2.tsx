import styled from 'styled-components'

const Title2 = styled.h2`
  font-weight : 600;
  overflow: hidden;
  font-size : 22px;
  text-align : center;
  font-family : Montserrat;
  &.ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
`

export default Title2
