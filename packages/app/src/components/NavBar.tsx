import { IonHeader, IonToolbar } from "@ionic/react"
import React from "react"
import styled from "styled-components"
import { LogoMaracuja, Title3 } from "./"
import NavBarButton from "./NavBarButton"

const NavToolbar = styled(IonToolbar)`
  --background: ${(props) => props.theme.bg.secondary};
  --border-color: ${(props) => props.theme.primary};
  background-color: ${(props) => props.theme.bg.secondary};
`
const NavBarContainer = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  width: 100%;

  .logo-maracuja {
    width: 125px;
    margin-top: 10px;
  }
  .challenge-name {
    display: inline-block;
    padding: 0 10px;
    background: ${(props) => props.theme.secondary};
    font-family: "Chelsea Market", Courier;
    font-weight: normal;
  }
`

const TitleContainer = styled.div`
  overflow: hidden;
  text-align: center;
  flex: 1;
  /* text-transform: capitalize; */
  align-self: center;
`

type NavBarProps = {
  leftAction?: any
  leftText?: any
  leftIcon?: any
  rightText?: any
  rightAction?: any
  rightIcon?: any
  title?: any
  challengeName?: any
  children?: any
}
const NavBar = ({
  leftAction,
  leftIcon,
  rightAction,
  rightIcon,
  title,
  challengeName,
  children,
  rightText,
  leftText,
}: NavBarProps) => {
  return (
    <IonHeader no-shadow className="navbar">
      <NavToolbar>
        <NavBarContainer>
          {leftAction ? (
            <NavBarButton action={leftAction} icon={leftIcon}>
              {leftText}
            </NavBarButton>
          ) : (
            <NavBarButton />
          )}
          <TitleContainer>
            {
              title ? (
                <Title3 className={`${challengeName && "challenge-name"} ellipsis`}>{title}</Title3>
              ) : (
                <LogoMaracuja />
              )
              // <Title3><LogoChallenge small/></Title3>
            }
          </TitleContainer>
          {rightAction ? (
            <NavBarButton action={rightAction} icon={rightIcon}>
              {rightText}
            </NavBarButton>
          ) : (
            <NavBarButton />
          )}
          {children}
        </NavBarContainer>
      </NavToolbar>
    </IonHeader>
  )
}
export default NavBar
