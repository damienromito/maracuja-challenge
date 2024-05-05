import React from "react"
import styled from "styled-components"

interface ContainerProps {
  size: string
}

const Container = styled.div<ContainerProps>`
  img {
    width: ${(props) => props.size};
  }
`

interface ChallengeAvatarProps {
  challenge: any
  size?: string
}
const ChallengeAvatar = ({ challenge, size = "25vh" }: ChallengeAvatarProps) => {
  return (
    <Container className="challenge-avatar" size={size}>
      <img src={challenge.image} />
    </Container>
  )
}

export default ChallengeAvatar
