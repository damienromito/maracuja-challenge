import styled from "styled-components"
import { size } from "../styles"

interface CellProps {
  active?: boolean
}

const Cell = styled.div<CellProps>`
  border-radius: ${size.borderRadius};
  background: ${(props) => (props.active ? "rgba(255,255,255,0.1)" : props.theme.bg.secondary)};
  display: flex;
  flex-direction: row;
  padding: 15px;
  text-align: left;
  align-items: center;
  min-height: 75px;
  margin: 5px 0;
  /* &:hover, &:active, &.active{
    background-color : ${(props) => props.theme.cellActive}
  } */
`

export default Cell
