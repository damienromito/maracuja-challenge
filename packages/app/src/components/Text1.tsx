import styled from 'styled-components'

const Text1 = styled.p`
  font-size : 17px;
  line-height : 25px;
  &.ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
    width: 99%;
  }
`

export default Text1
