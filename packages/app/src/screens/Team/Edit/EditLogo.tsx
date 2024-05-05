import { Field, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import { Button, Container, Text2, Title1 } from "../../../components"
import { useCurrentChallenge } from "../../../contexts"
import PlaceholderClubAvatar from "@maracuja/shared/images/placeholders/placeholder-club-avatar.png"
import { ClubAvatar } from "@maracuja/shared/components"

const EditLogo = ({ imageData, logo, setImageData }: any) => {
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  const formik = useFormikContext<any>()

  const [image, setImage] = useState<any>(null)

  useEffect(() => {
    if (logo) {
      setImage(logo.getUrl("300"))
      setImageData(null)
    } else {
      setImage(PlaceholderClubAvatar)
    }
  }, [logo])

  useEffect(() => {
    if (imageData) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImage(reader.result)
        formik.setFieldValue("image", reader.result)
      })
      reader.readAsDataURL(imageData[0])
    }
  }, [imageData])

  const handleChangeImage = ({ e }) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageData(e.target.files)
    }
  }

  return currentPhase.captainEditTeam.logo ? (
    <>
      <Title1>Un blason à afficher</Title1>
      <Text2 style={{ marginTop: "15px" }}>
        C’est le logo sous lequel tu réunira ton {currentChallenge.wording.tribe}. Celui qui restera gravé dans les
        têtes
      </Text2>
      {image && (
        <Container centering>
          <ClubAvatar logo={image} size={150} />
        </Container>
      )}
      <input
        accept="image/png, image/jpeg, .gif, .svg"
        id="fileInput"
        onChange={(e) => {
          handleChangeImage({ e })
        }}
        style={{ display: "none" }}
        type="file"
      />
      <Field hidden id="image" name="image" type="text" />
      <Button
        button
        onClick={() => document.getElementById("fileInput")?.click()}
        secondary
        style={{ marginTop: "15px" }}
      >
        Modifier le logo
      </Button>
    </>
  ) : (
    <i>Modification du logo désactivé</i>
  ) // Normaly not show it's a protection message print against bypass to block user when edit logo feature is forbidden
}

export default EditLogo
