import React from "react"
import PlaceholderPlayerAvatar from "@maracuja/shared/images/placeholders/placeholder-player-avatar.png"
import { styled } from "../../styles"

interface AvatarContainerProps {
  size: number
}

const AvatarContainer = styled.div<AvatarContainerProps>`
  display: flex;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  background-size: cover;
  background-position: center;
  align-items: center;
  background-color: white;
  border-radius: ${(props) => props.size}px;
  display: flex;
  height: ${(props) => props.size}px;
  justify-content: center;
  overflow: hidden;
  width: ${(props) => props.size}px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`

interface AvatarProps {
  image?: string
  size?: number
  placeholder?: string
}
const Avatar = ({ image, size = 56, placeholder = PlaceholderPlayerAvatar }: AvatarProps) => {
  // backgroundRemoved TODO
  return (
    <AvatarContainer size={size} style={{ backgroundImage: `url(${image || placeholder})` }}>
      {/* <img src={image || placeholder} /> */}
    </AvatarContainer>
  )
}

export default Avatar
