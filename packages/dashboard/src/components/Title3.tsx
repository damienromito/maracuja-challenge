import styled from 'styled-components'

const Title3 = styled.h3`
  font-weight : 600;
  overflow: hidden;
  font-size : 18px;
  line-height: 26px;
  text-align : center;
  &.ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
`

export default Title3
