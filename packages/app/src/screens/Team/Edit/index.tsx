import { uploadImage } from "@maracuja/shared/api/helpers"
import firebase from "firebase/app"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { EditPage } from "../../../components"
import { ROUTES } from "../../../constants"
import { useApp, useCurrentChallenge } from "../../../contexts"
import EditColor from "./EditColor"
import EditLogo from "./EditLogo"
import EditName from "./EditName"

export default () => {
  const { currentChallenge, currentTeam, currentPhase } = useCurrentChallenge()
  const { setLoading, logEvent } = useApp()
  const history = useHistory()

  const [imageData, setImageData] = useState<any>(false)
  const [pagesRoutes, setPagesRoutes] = useState<any>([])

  useEffect(() => {
    dynamicPagesRoutes()
  }, [currentTeam, imageData])

  const dynamicPagesRoutes = () => {
    const pages = []
    if (currentPhase?.captainEditTeam.name) {
      pages.push({
        component: <EditName />,
        params: "name",
        title: "Nom",
        icon: "license",
        saveButton: "true",
      })
    }

    if (currentPhase?.captainEditTeam.logo) {
      pages.push({
        component: <EditLogo logo={currentTeam.logo} imageData={imageData} setImageData={setImageData} />,
        params: "logo",
        title: "Logo",
        icon: "club-logo",
        saveButton: "true",
      })
    }

    if (currentPhase?.captainEditTeam.colors) {
      pages.push({
        component: <EditColor />,
        params: "color",
        title: "Couleur",
        icon: "color",
        saveButton: "true",
      })
    }

    setPagesRoutes(pages)
  }

  const handleSubmitForm = async (values, e) => {
    const data = { ...values }
    setLoading(true)
    if (imageData) {
      logEvent("team_logo_sending_start")
      const url = await uploadImage({
        imageData,
        challengeId: currentChallenge.id,
        fileName: "logo",
        folderPath: `/clubs/${currentTeam.id}/`,
      })
      logEvent("team_logo_sending_end")
      data.logo = {
        original: url,
      }
    }
    delete data.image
    delete data.redirectHome
    data.lastActionAt = firebase.firestore.FieldValue.serverTimestamp()
    data.lastActionPhaseId = currentPhase.id
    await currentTeam.update(data)

    e.setSubmitting(false)
    e.resetForm()
    setLoading(false)
    if (values.redirectHome) {
      history.push(ROUTES.ACTIVE_CLUB)
    }
  }

  const handleFinish = async (formik) => {
    if (formik.dirty) {
      await formik.submitForm()
    }
    history.push(ROUTES.ACTIVE_CLUB)
  }

  return (
    <>
      <EditPage
        formValues={{
          image: currentTeam.logo?.original || "",
          name: currentTeam.name || "",
          colors: currentTeam.colors || "",
          redirectHome: false,
        }}
        onFinish={handleFinish}
        onSubmitForm={handleSubmitForm}
        pagesRoute={pagesRoutes}
        titleForm="Édition du club"
      />
    </>
  )
}
