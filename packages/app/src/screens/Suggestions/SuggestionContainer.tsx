import React from "react"
import styled from "styled-components"

export default ({
  title = undefined,
  infoContent = undefined,
  iconContent = undefined,
  buttonContent = undefined,
  children = null,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      {infoContent && (
        <InfoContainer>
          <div className="info">{infoContent}</div>
          <div className="icon">{iconContent}</div>
        </InfoContainer>
      )}
      {children}
      {buttonContent}
    </Container>
  )
}

const Container = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  text-transform: uppercase;
  margin-top: 3px;
  font-family: Chelsea Market;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
`

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: start;
  color: ${(props) => props.theme.text.secondary};
  text-align: left;
  .text-white {
    color: white;
  }
  .info {
    flex: 2;
  }
  .icon {
    flex: 1;
    margin-right: auto;
    margin-left: auto;
    text-align: right;
    .activity-icon: {
      width: 100px;
      background: red;
    }
    img {
      max-width: 70px;
    }
  }
`
