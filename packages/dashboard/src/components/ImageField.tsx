import firebase from "firebase/app"
import { Field } from "formik"
import React, { useState } from "react"

export default ({ name, value, imageName, folderName, placeholderImageName = "placeholder-club-avatar.png" }) => {
  const [imageLoading, setImageLoading] = useState<any>(false)
  const [imageUrl, setImageUrl] = useState<any>(value || null)

  const onSelectFile = (e, setFieldValue) => {
    setImageLoading(true)
    uploadFile(e).then((url) => {
      setImageLoading(false)
      setImageUrl(url)
      setFieldValue(name, url)
    })
  }

  const uploadFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileInfos = file.name.split(".")
      const name = (imageName || fileInfos[0]) + "." + fileInfos.pop()
      const metadata = { contentType: file.type }
      const task = firebase
        .storage()
        .ref()
        .child(folderName + "/" + name)
        .put(file, metadata)
      return task.then((snapshot) => snapshot.ref.getDownloadURL())
    }
  }

  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <>
            <img
              style={{ width: 50, height: 50, borderRadius: 25, border: "1px solid black" }}
              src={imageUrl || require("@maracuja/shared/images/placeholders/" + placeholderImageName)}
            />
            <input type="file" onChange={(e) => onSelectFile(e, form.setFieldValue)} />
            <input type="hidden" {...field} id={name} />
            <span>{imageLoading && "Chargement en cours..."}</span>
          </>
        )
      }}
    </Field>
  )
}
