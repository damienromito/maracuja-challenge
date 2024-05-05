import styled from "styled-components"

const Title1 = styled.h1`
  font-weight: 600;
  font-size: 38px;
  line-height: 45px;
  text-align: center;
  &.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
  &:first-letter {
    text-transform: uppercase;
  }
`

export default Title1
