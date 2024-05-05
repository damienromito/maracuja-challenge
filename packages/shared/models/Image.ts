class Image {
  constructor(props) {
    if (props) {
      Object.assign(this, props)
    }
  }

  getUrl(imageSize) {
    if (this[imageSize]) {
      return this[imageSize]
    } else if (this.original) {
      return this.original
    } else {
      return null
    }
  }
}
export default Image
