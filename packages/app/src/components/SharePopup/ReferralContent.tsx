import { useIonToast } from "@ionic/react"
import { Button, Text1, Text2, Title3 } from "@maracuja/shared/components"
import { objectSubset } from "@maracuja/shared/helpers"
import React, { useEffect, useState } from "react"
import Popup from "../Popup"
import { useApp, useCurrentChallenge, useCurrentOrganisation, useDevice } from "../../contexts"
import { openShareSheet } from "../../utils/sharing"
import MemberContent from "./MemberContent"
import TextFieldToCopy from "./TextFieldToCopy"

export default () => {
  const { logEvent, setLoading } = useApp()
  const { platform } = useDevice()

  const { currentChallenge, currentPlayer, currentTeam } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const [referralCode, setReferralCode] = useState<any>(null)

  useEffect(() => {
    if (!referralCode) {
      if (currentPlayer.referralCode) {
        setReferralCode(currentPlayer.referralCode)
      } else {
        fetchReferralCode()
      }
    }
  }, [])
  const handleShareToReferee = async () => {
    logEvent("share_referee_start")
    try {
      setLoading(true)

      await openShareSheet({
        dialogTitle: currentChallenge.referral?.sharing?.title,
        title: currentChallenge.dynamicLinkReferral?.title,
        text: `${currentChallenge.dynamicLinkReferral?.message} Entre le code ➡️ ${referralCode} ⬅️ lors de l'inscription à l'application « Maracuja Challenge » !🔥`,
        url: currentChallenge.dynamicLinkReferral?.link + "?code=" + referralCode,
        platform,
      })
      logEvent("share_referee_opened")
    } catch (error) {
      logEvent("share_referee_fail")
    }
    setLoading(false)
  }

  const fetchReferralCode = async () => {
    setLoading(true)
    const response = await currentChallenge.fetchReferralCode()
    setLoading(false)
    setReferralCode(response.referralCode)
  }

  return (
    <>
      <Title3>{currentChallenge.referral.sharing.title}</Title3>
      <Text1>{currentChallenge.referral.sharing.intro}</Text1>
      <Text2>Ton code de parrainage :</Text2>
      <TextFieldToCopy text={referralCode} />
      <br />
      <br />
      <Button onClick={() => handleShareToReferee()}>Envoyer l'invitation</Button>
    </>
  )
}
