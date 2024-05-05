import { Button, Text1 } from "@maracuja/shared/components"
import { useState } from "react"
import { useCurrentChallenge } from "../../contexts"
import Modal from "../Modal"
import Popup from "../Popup"
import CaptainContent from "./CaptainContent"
import MemberContent from "./MemberContent"
import ReferralContent from "./ReferralContent"

interface SharePopupProps {
  contentType?: string // 'member' / 'referee' / 'captain',
  openOnMenu?: any
  popupOnClose?: any
  isOpen?: boolean
  setIsOpen?: any
  title?: string
  message?: string
}
export default ({
  contentType,
  openOnMenu,
  popupOnClose,
  isOpen,
  setIsOpen,
  title = "",
  message = "",
}: SharePopupProps) => {
  const { currentChallenge } = useCurrentChallenge()
  const [popupContentType, setPopupContentType] = useState<any>(contentType)

  // shareEmailFallback = () => {
  //   const mailtoString = `mailto:?subject=${title}&body=${message}%0d%0a Rejoins le challenge ici : ${appUrl}`

  //   if (currentPlayer.platform === 'web') {
  //     window.location = mailtoString
  //   }
  // }

  const handlePopupClose = () => {
    setIsOpen(false)
    openOnMenu && setPopupContentType(null)
    popupOnClose && popupOnClose()
  }

  const handleClickReferalButton = async () => {
    setPopupContentType("referee")
  }

  return (
    <Modal isOpen={isOpen} onClose={handlePopupClose} closeButton>
      {currentChallenge.referralEnabled && openOnMenu && !popupContentType && (
        <>
          <Text1 style={{ textAlign: "center" }}>{currentChallenge.sharing.intro}</Text1>
          <Button secondary onClick={() => setPopupContentType("member")}>
            {currentChallenge.sharing.title}
          </Button>
          <p style={{ textAlign: "center" }}>ou</p>
          <Text1 style={{ textAlign: "center" }}>{currentChallenge.referral.sharing.choiceIntro}</Text1>
          <Button secondary onClick={handleClickReferalButton}>
            {currentChallenge.referral.sharing.choiceButton}
          </Button>
        </>
      )}

      {((!currentChallenge.referralEnabled && popupContentType !== "captain") || popupContentType === "member") && (
        <MemberContent title={title} message={message} />
      )}

      {popupContentType === "referee" && <ReferralContent />}

      {popupContentType === "captain" && <CaptainContent title={title} message={message} />}
    </Modal>
  )
}
