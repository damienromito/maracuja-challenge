import { Text1, Title3 } from "@maracuja/shared/components"
import React, { useState } from "react"
import { useApp, useCurrentChallenge, useDevice } from "../../contexts"
import { openShareSheet } from "../../utils/sharing"
import SharingContent from "./SharingContent"

interface CaptainContentProps {
  title?: string
  message?: string
}

export default ({ title, message }: CaptainContentProps) => {
  const { logEvent, setLoading } = useApp()
  const { platform } = useDevice()

  const { currentChallenge } = useCurrentChallenge()

  const handleShareToCaptain = async () => {
    logEvent("share_need_captain_start")
    try {
      setLoading(true)
      await openShareSheet({
        dialogTitle: currentChallenge.sharing?.title,
        title: `Bonjour ${currentChallenge.wording.captain}, on a besoin de toi !`,
        text: `Bonjour ${currentChallenge.wording.captain}, on a besoin de toi ! Rejoins-nous pour representer ${currentChallenge.wording.theTribe} pour le challenge "${currentChallenge.name}" ! 🔥 `,
        url: currentChallenge.dynamicLink?.link,
        platform,
      })
      logEvent("share_need_captain_opened")
    } catch (error) {
      logEvent("share_need_captain_fail")
    }
    setLoading(false)
  }

  return (
    <SharingContent onClickShare={handleShareToCaptain}>
      <Title3>{title || currentChallenge.sharing?.captain?.title}</Title3>
      <Text1>{message || currentChallenge.sharing?.captain?.description}</Text1>
    </SharingContent>
  )
}
