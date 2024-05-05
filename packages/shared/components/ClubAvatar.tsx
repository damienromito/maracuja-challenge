import styled from "styled-components"
import PlaceholderClubAvatar from "../images/placeholders/placeholder-club-avatar.png"

interface ClubAvatarProps {
  logo: string
  size?: number
  classified?: boolean
  color?: string
}

export default ({ logo, size = 56, classified = false, color = "" }: ClubAvatarProps) => {
  return (
    <Container size={size} color={color}>
      <div
        className="avatar-container card-to-print"
        style={{ backgroundImage: `url(${logo || PlaceholderClubAvatar})` }}
      />
      {classified && <i className="icon icon-point" />}
    </Container>
  )
}

interface ContainerProps {
  size: number
  color?: string
}

const Container = styled.div<ContainerProps>`
  display: flex;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  .avatar-container {
    background-size: cover;
    background-position: center;
    align-items: center;
    background-color: white;
    border-radius: ${(props) => props.size}px;
    display: flex;
    height: ${(props) => props.size}px;
    justify-content: center;
    overflow: hidden;
    position: absolute;
    width: ${(props) => props.size}px;
    border: ${(props) => (props.color ? `${props.size * 0.06}px solid ` + props.color : "none")};

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  i {
    align-items: flex-end;
    color: yellow;
    display: flex;
    font-size: ${(props) => props.size * 0.35}px;
    height: 100%;
    justify-content: flex-end;
    width: 100%;
    z-index: 1;
  }
`
