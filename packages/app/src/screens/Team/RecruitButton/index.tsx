import { Share } from "@capacitor/share"
import { Button } from "@maracuja/shared/components"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { useApp } from "../../../contexts"

const RecruitButton = ({ onClickCloseRecruitMember, member }) => {
  const { setLoading, logEvent } = useApp()
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()

  const recruitNative = (params) => {
    return Share.share(params)
      .then(() => {})
      .catch((err) => {
        logEvent("hire_failed")
        setLoading(false)
        return Promise.reject(err)
      })
  }

  const openRecruitTeam = () => {
    setLoading(true)

    const title = currentChallenge.dynamicLink?.title || `Rejoins-moi sur le challenge "${currentChallenge.name}" !`
    const message =
      currentChallenge.dynamicLink?.message ||
      `Salut ! Rejoins-moi pour participer au nouveau challenge ${currentChallenge.name} ! 🔥 `
    const appUrl = currentChallenge.dynamicLink?.link || `https://${currentOrganisation?.dynamicLinkHost}/join`
    const mailtoString = `mailto:?subject=${title}&body=${message}%0d%0a Rejoins le challenge ici : ${appUrl}`

    logEvent("hire_start")
    if (currentPlayer.platform === "web") {
      //@ts-ignore
      window.location = mailtoString
    } else {
      return recruitNative({
        title: title,
        dialogTitle: "Invite un joueur",
        text: message,
        url: appUrl,
      })
        .then(() => {
          setLoading(false)

          logEvent("hire_end")
        })
        .catch((err) => {
          setLoading(false)

          //@ts-ignore
          window.location = mailtoString
        })
    }
  }

  const handleClickRecruitMember = () => {
    openRecruitTeam()
    onClickCloseRecruitMember()
  }
  return (
    <>
      <Button onClick={() => handleClickRecruitMember()}>Contacter {member.firstName}</Button>
    </>
  )
}

export default RecruitButton
