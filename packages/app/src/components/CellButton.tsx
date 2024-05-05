import React, { Fragment } from "react"
import { styled, color, size } from "../styles"
import Cell from "./Cell"

const Container = styled(Cell)`
  padding: 0;
  cursor: pointer;
  a,
  button,
  p {
    font-size: inherit !important;
    padding: 15px;
    height: 100%;
    width: 100%;
    text-align: left;
    min-height: 50px;
    display: flex;
    align-items: center;
  }
`

interface CellButtonProps {
  children: any
  href?: string
  onClick?: () => void
}

const CellButton = ({ children, href, onClick }: CellButtonProps) => {
  return (
    <Container>
      {onClick ? (
        <button onClick={onClick}>{children}</button>
      ) : href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      ) : (
        <>{children}</>
      )}
    </Container>
  )
}

export default CellButton
