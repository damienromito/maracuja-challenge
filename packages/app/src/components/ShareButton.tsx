import React, { useState } from "react"
import { Button } from "."
import SharePopup from "./SharePopup"
import { useCurrentChallenge } from "../contexts"

export default ({
  style = undefined,
  onClose = undefined,
  children = undefined,
  contentType = undefined,
  openOnMenu = undefined,
}) => {
  const [popupIsOpen, setPopupIsOpen] = useState<any>(false)
  const { currentChallenge } = useCurrentChallenge()

  return (
    <>
      <Button onClick={() => setPopupIsOpen(true)} style={style}>
        {children || currentChallenge.wording.inviteAPlayer}
      </Button>
      <SharePopup
        isOpen={popupIsOpen}
        setIsOpen={setPopupIsOpen}
        popupOnClose={onClose}
        contentType={contentType}
        openOnMenu={openOnMenu}
      />
    </>
  )
}
