import { IonModal } from "@ionic/react"
import PlaceholderPlayerAvatar from "@maracuja/shared/images/placeholders/placeholder-player-avatar.png"
import { Field, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Button, RadialContainer, Text1, Text2, Title1 } from "../../../components"
import PlayerCardViewer from "../../../components/PlayerCardViewer"
import { useApp, useCurrentChallenge } from "../../../contexts"

export default ({ avatar, localImageData, setLocalImageData, isDone, setIsDone }) => {
  const { currentPlayer, currentTeam } = useCurrentChallenge()
  const { loading, openPopup, logEvent } = useApp()
  const formik = useFormikContext<any>()

  const [currentlyModify, setCurrentlyModify] = useState(false)
  const [imageData, setImageData] = useState(null)
  const [isPlaceholder, setIsPlaceholder] = useState(false)
  const [showCardPreview, setShowCardPreview] = useState(null)

  useEffect(() => {
    if (avatar && isDone) {
      setImageData(null)
      setLocalImageData(null)
      setCurrentlyModify(false)
      setIsPlaceholder(false)
      setIsDone(false)
      setShowCardPreview(true)
    } else if (localImageData) {
      setCurrentlyModify(true)
      setIsPlaceholder(false)
      if (localImageData && localImageData.length > 0) {
        const file = localImageData[0]
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          setImageData(reader.result)
        })
        reader.readAsDataURL(file)
      }
    } else if (avatar) {
      setCurrentlyModify(false)
      setIsPlaceholder(false)
      setImageData(null)
    } else {
      setCurrentlyModify(false)
      setIsPlaceholder(true)
      setImageData(null)
    }
  }, [avatar, isDone, localImageData])

  const handleChangeImageField = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLocalImageData(e.target.files)
      const reader = new FileReader()
      reader.addEventListener("load", () => setImageData(reader.result))
      reader.readAsDataURL(e.target.files[0])
      logEvent("avatar_pick_end")
    }
  }

  const handleValideCardPreview = () => {
    setCurrentlyModify(false)
    formik.setFieldValue("redirectHome", false)
    formik.submitForm()
    logEvent("avatar_sending_start")
  }

  const handleClickPopupButton = () => {
    setShowCardPreview(false)
    setLocalImageData(null)
  }

  const handleChangePicture = () => {
    openPopup({
      title: "Les conseils du photographe de l’équipe 📸 ! ",
      message: `- Tu dois être seul.e sur la photo (1) <br/> - Choisis une photo sur laquelle tu apparais en entier dans le cadre, en haut, à droite ET à gauche 😎 (2)<br/>
      <img src=${require("../../../images/tutoPhoto.jpg")} />`,
      buttonText: "Choisir une photo",
      callback: () => {
        handleClickChangePicture()
        logEvent("avatar_pick_start")
      },
    })
  }

  const handleClickChangePicture = () => {
    document.getElementById("fileInput").click()
  }

  return (
    <>
      <Title1>Ta photo</Title1>
      <Text2 style={{ marginTop: "15px" }}>
        Ajoute ta photo pour que ta carte apparaisse dans la liste des joueurs de l’équipe
      </Text2>
      <input
        accept="image/png, image/jpeg, .gif, .svg"
        id="fileInput"
        onChange={handleChangeImageField}
        style={{ display: "none" }}
        type="file"
      />
      <Field hidden id="image" name="image" type="text" />
      {loading && (
        <QuoteLoader>
          <br />
          <br />
          <br />
          <br />
          <br />
          <Text2 className="author">Création de ta carte joueur en cours, cela peut prendre 1 minute ...</Text2>
          <Text1 className="quote">
            « Si tu abandonnes une fois, cela peut devenir une habitude. N’abandonne jamais. »{" "}
          </Text1>
          <Text2 className="author">Michael Jordan</Text2>
        </QuoteLoader>
      )}

      {!currentlyModify && !loading && (
        <>
          <div
            onClick={() => {
              !isPlaceholder && setShowCardPreview(true)
            }}
          >
            <PlayerCardViewer
              preview
              isPlaceholder={isPlaceholder}
              team={currentTeam}
              player={currentPlayer}
              imageData={imageData}
            />
          </div>
          <Button button onClick={handleChangePicture} secondary style={{ marginTop: "15px", width: "240px" }}>
            {avatar ? "Changer la photo" : "Ajouter une photo"}
          </Button>
        </>
      )}

      {currentlyModify && !loading && (
        <>
          <PlayerCardViewer photoPreview team={currentTeam} player={currentPlayer} imageData={imageData} />
          <Button button onClick={handleClickChangePicture} secondary style={{ marginTop: "15px", width: "240px" }}>
            Changer la photo
          </Button>
          <Button onClick={handleValideCardPreview} primary style={{ marginTop: "15px" }}>
            Découvrir ma carte
          </Button>
        </>
      )}

      {!currentlyModify && !loading && (
        <IonModal isOpen={showCardPreview}>
          <RadialContainer />
          <PlayerCardViewer
            popup
            discover
            onClickPopupButton={handleClickPopupButton}
            team={currentTeam}
            player={currentPlayer}
            imageData={imageData}
          />
        </IonModal>
      )}
    </>
  )
}

const QuoteLoader = styled.div`
  color: white;
  .author {
    color: ${(props) => props.theme.text.tertiary};
  }
  .quote {
    font-size: 22px;
    font-style: italic;
    line-height: 30px;
    margin: 5px 0;
  }
`
