import { Text1, Title3 } from "@maracuja/shared/components"
import React from "react"
import { useApp, useCurrentChallenge, useDevice } from "../../contexts"
import { openShareSheet } from "../../utils/sharing"
import SharingContent from "./SharingContent"

interface MemberContentProps {
  title?: string
  message?: string
}

export default ({ title, message }: MemberContentProps) => {
  const { logEvent, setLoading } = useApp()
  const { platform } = useDevice()
  const { currentChallenge } = useCurrentChallenge()

  const handleShareToMember = async () => {
    logEvent("share_start")
    try {
      setLoading(true)

      await openShareSheet({
        dialogTitle: currentChallenge.sharing?.title,
        title: currentChallenge.dynamicLink?.title || `Rejoins-moi sur le challenge "${currentChallenge.name}" !`,
        text:
          currentChallenge.dynamicLink?.message ||
          "Salut ! Rejoins-moi pour participer au nouveau challenge Maracuja ! 🔥 ",
        url: currentChallenge.dynamicLink?.link,
        platform,
      })
      logEvent("share_opened")
    } catch (error) {
      logEvent("share_fail")
    }
    setLoading(false)
  }

  return (
    <SharingContent onClickShare={handleShareToMember}>
      <Title3>{title || currentChallenge.sharing.title}</Title3>
      <Text1>{message || currentChallenge.sharing.description}</Text1>
    </SharingContent>
  )
}
