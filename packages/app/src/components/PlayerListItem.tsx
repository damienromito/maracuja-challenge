import { Title3 } from "@maracuja/shared/components"
import React from "react"
import styled from "styled-components"

export default ({
  onClickItem = null,
  playerIcon = undefined,
  title = "",
  titleDetail = "",
  subTitle = null,
  rightContent = null,
  children = undefined,
  className = "",
}) => {
  return (
    <CellContainer className={className}>
      <div onClick={onClickItem && onClickItem}>{playerIcon}</div>
      <TitleContainer onClick={onClickItem && onClickItem}>
        <IdentityContainer>
          <Title3 className="ellipsis">{title}</Title3>
          {!!titleDetail && <span>{titleDetail}</span>}

          {/* {currentPlayerCanWakeUp && user.username && user.username !== user.firstName &&
      <Text3>{user.firstName} </Text3>
    } */}
        </IdentityContainer>
        {subTitle}
      </TitleContainer>

      <ButtonContainer>{rightContent}</ButtonContainer>
      {children}
    </CellContainer>
  )
}
const CellContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: center;
  color: white;
  background: transparent;
  padding: 15px;

  &.activeUser {
    background: ${(props) => props.theme.bg.active};
  }
  .user-avatar {
    margin-right: 4px;
  }
`
const TitleContainer = styled.div`
  text-overflow: ellipsis;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: baseline;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 4px;
`

const IdentityContainer = styled.div`
  h3 {
    padding-bottom: 3px;
    text-align: left;
    display: inline;
    margin-right: 2px;
  }
  p.text-3 {
    color: ${(props) => props.theme.text.tertiary};
    display: inline;
  }
  span {
    font-size: 13px;
    font-family: "Open Sans", arial;
    font-style: normal;
    color: ${(props) => props.theme.text.tertiary};
    line-height: 20px;
    font-weight: normal;
    margin-left: 5px;
    display: inline-block;
  }
`
const ButtonContainer = styled.div``
