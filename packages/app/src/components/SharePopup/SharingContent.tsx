import { Button, Text2 } from "@maracuja/shared/components"
import React from "react"
import { useCurrentChallenge } from "../../contexts"
import TextFieldToCopy from "./TextFieldToCopy"

interface SharingContentProps {
  children?: any
  onClickShare?: any
}

export default ({ children, onClickShare }: SharingContentProps) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <>
      {children}
      <Text2>Le lien d’invitation :</Text2>
      <TextFieldToCopy text={currentChallenge.dynamicLink?.link} /> <br />
      <br />
      <Button onClick={onClickShare}>Envoyer l'invitation</Button>
    </>
  )
}
