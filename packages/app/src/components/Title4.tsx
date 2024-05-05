import styled from 'styled-components'

const Title4 = styled.h4`
  padding-top : 5px;
  font-size : 14px;
  font-weight : 600;
  &.ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
`

export default Title4
