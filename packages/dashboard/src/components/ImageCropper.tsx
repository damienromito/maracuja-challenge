import "cropperjs/dist/cropper.css"
import React, { useRef } from "react"
import Cropper from "react-cropper"
import styled from "styled-components"

const CropContainer = styled.div`
  position: relative;
  background: white;
`

export default ({ imageUrl, type, size, onImageCropped }) => {
  const cropperRef = useRef(null)

  const onCrop = () => {
    const imageElement = cropperRef?.current
    const cropper = imageElement?.cropper
    cropper.getCroppedCanvas({ fillColor: "transparent" }).toBlob((file) => {
      onImageCropped(file)
    }, type)
  }

  return (
    <div>
      <CropContainer>
        <button onClick={onCrop}>Enregistrer</button>
        <Cropper
          src={imageUrl}
          style={{ height: 400, width: "100%" }}
          // Cropper.js options
          initialAspectRatio={size ? size.width / size.height : undefined}
          aspectRatio={size ? size.width / size.height : undefined}
          guides
          ref={cropperRef}
        />
      </CropContainer>
    </div>
  )
}
