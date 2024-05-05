import { uploadImage } from "@maracuja/shared/api/helpers"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Field } from "formik"
import React, { useState } from "react"
import { Modal } from "react-materialize"
import ImageCropper from "./ImageCropper"
import FieldContainer from "./FormikFieldContainer"
import { useDashboard } from "../contexts"

export default (props) => {
  const {
    name,
    label,
    imageName,
    folderName,
    placeholderImageName = "placeholder-club-avatar.png",
    sizePreview = { width: 50, height: 50 },
    size = undefined, //{ width: 500, height: 300 },
    onUploadImageLoaded,
    inline,
    displayUrl,
    showUrl,
  } = props
  const { setLoading } = useDashboard()
  const { currentChallenge } = useCurrentChallenge()
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false)
  const [upImg, setUpImg] = useState<any>(null)
  const [imageType, setImageType] = useState<any>(null)

  const handleImageCropped = async (imageBlob, setFieldValue) => {
    setLoading(true)
    const url = await uploadImage({
      imageBlob: imageBlob,
      challengeId: currentChallenge?.id || "library",
      fileName: imageName,
      folderPath: folderName,
    })
    if (onUploadImageLoaded) {
      onUploadImageLoaded(url)
    }
    setFieldValue(name, url)
    setIsEditModalOpen(false)
    setLoading(false)
  }

  const onResetFile = (e) => {
    e.target.value = null
  }

  const onSelectFile = (e) => {
    if (e.target.files?.length === 1) {
      const image = e.target.files[0]
      setImageType(image.type)
      setUpImg(URL.createObjectURL(image))
      setIsEditModalOpen(true)
    } else {
      alert("Seulement une image à la fois")
    }
  }

  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <>
            <div style={{ alignItems: "center", width: "100%", height: "100%" }}>
              {label && <p className="">{label} </p>}
              {sizePreview && (
                <div
                  style={{
                    zIndex: "0",
                    display: "inline-block",
                    width: `${sizePreview.width}px`,
                    height: `${sizePreview.height}px`,
                    backgroundColor: "white",
                  }}
                >
                  <img
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    src={field?.value || require("@maracuja/shared/images/placeholders/" + placeholderImageName)}
                    alt="_Aperçu_Image"
                  />
                </div>
              )}
              <div
                style={{
                  zIndex: "1",
                  display: "inline-block",
                  maxWidth: inline ? "50px" : "inherit",
                  position: inline ? "relative" : "relative",
                }}
              >
                <input
                  type="file"
                  onClick={(e) => onResetFile(e)}
                  onChange={(e) => onSelectFile(e)}
                  accept=".png,.jpg,.gif,.webp"
                />
                <input type={showUrl ? "text" : "hidden"} {...field} id={name} />
              </div>
            </div>

            {displayUrl && (
              <FieldContainer
                errors={props.errors}
                touched={props.touched}
                name={name}
                type="text"
                label="URL de l'image"
              />
            )}
            <Modal
              options={{
                onCloseEnd: () => setIsEditModalOpen(false),
              }}
              open={isEditModalOpen}
              header="Recadrez votre image"
            >
              <p>🔎 Zoomez avec la molette de votre souris</p>
              {/* <p>↔️ Deplacez la selection en saisissant l'image et la deplaçant avec votre souris </p> */}
              <ImageCropper
                size={size}
                type={imageType}
                imageUrl={upImg}
                onImageCropped={(imageBlob) => handleImageCropped(imageBlob, form.setFieldValue)}
              />
            </Modal>
          </>
        )
      }}
    </Field>
  )
}
