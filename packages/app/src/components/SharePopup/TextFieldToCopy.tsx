import { useIonToast } from "@ionic/react"
import React from "react"

interface TextFieldToCopyProps {
  text?: string
}
export default ({ text }: TextFieldToCopyProps) => {
  const [present] = useIonToast()

  const handleCopiedLink = (e) => {
    e.target.select()
    document.execCommand("copy")
    present("Lien copié !", 3000)
  }

  return <input className="lightBg" onClick={handleCopiedLink} defaultValue={text} />
}
